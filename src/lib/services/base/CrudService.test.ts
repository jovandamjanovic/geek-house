// Jest unit tests for CrudService base class.
// Testing library and framework: Jest with ts-jest (assumed).
// These tests focus on behavior covered in the diff, including:
// - Environment validation in constructor
// - Authentication initialization
// - retryOperation backoff behavior
// - getSheetId caching and error handling
// - getAllRows, findRowById logic
// - getNextId formatting (incl. "Clanski Broj" special case)
// - appendRow/updateRow/deleteRow request shapes

import { GoogleAuth } from 'google-auth-library'
import { google, sheets_v4 } from 'googleapis'

// We import the class under test; adjust the relative path if the code lives elsewhere.
// Since this file mirrors the given snippet, we assume CrudService is exported from the same directory file.
// If CrudService is implemented in a separate file (e.g., CrudService.ts), update the import accordingly.
import { CrudService, ServiceConfig, DataTransformers, SheetConfig } from './CrudService'

type Entity = {
  id: string
  name: string
  // Add a field named exactly 'Clanski Broj' to test special-case ID formatting
  'Clanski Broj'?: string
  createdAt?: string
}

type CreateEntity = Omit<Entity, 'id'>

const REQUIRED_ENV = {
  GOOGLE_PROJECT_ID: 'proj-123',
  GOOGLE_PRIVATE_KEY_ID: 'pkid-abc',
  GOOGLE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----\\n',
  GOOGLE_CLIENT_EMAIL: 'svc@example.iam.gserviceaccount.com',
  GOOGLE_CLIENT_ID: 'client-xyz',
}

// Mock timer for retry/backoff
jest.useFakeTimers({ legacyFakeTimers: false })

// Mock googleapis and google-auth-library
jest.mock('google-auth-library', () => {
  return {
    GoogleAuth: jest.fn().mockImplementation((opts: any) => ({
      getClient: jest.fn().mockResolvedValue({}),
      opts,
    })),
  }
})

const mockValuesGet = jest.fn()
const mockValuesAppend = jest.fn()
const mockValuesUpdate = jest.fn()
const mockBatchUpdate = jest.fn()
const mockSpreadsheetsGet = jest.fn()

const resetGoogleMocks = () => {
  mockValuesGet.mockReset()
  mockValuesAppend.mockReset()
  mockValuesUpdate.mockReset()
  mockBatchUpdate.mockReset()
  mockSpreadsheetsGet.mockReset()
}

jest.mock('googleapis', () => {
  const values = {
    get: (...args: any[]) => mockValuesGet(...args),
    append: (...args: any[]) => mockValuesAppend(...args),
    update: (...args: any[]) => mockValuesUpdate(...args),
  }
  const spreadsheets = {
    values,
    batchUpdate: (...args: any[]) => mockBatchUpdate(...args),
    get: (...args: any[]) => mockSpreadsheetsGet(...args),
  }
  return {
    google: {
      sheets: jest.fn().mockImplementation((_opts: any) => ({
        spreadsheets,
      })),
    },
    sheets_v4: {},
  }
})

class TestCrudService extends CrudService<Entity, CreateEntity> {
  // Implement abstract methods minimally; we won't rely on their internals for base tests.
  async getAll(): Promise<Entity[]> {
    return this.getAllRows()
  }
  async getById(id: string): Promise<Entity | null> {
    const found = await this.findRowById(id)
    return found ? found.entity : null
  }
  async create(data: CreateEntity): Promise<Entity> {
    const all = await this.getAllRows()
    const nextId = this.getNextId(all)
    const entity: Entity = { id: nextId, ...data }
    await this.appendRow(entity)
    return entity
  }
  async update(_id: string, _updates: Partial<Entity>): Promise<Entity | null> {
    return null
  }
  async delete(_id: string): Promise<boolean> {
    return true
  }

  // Test helpers to expose protected methods where needed
  public test_retryOperation = this.retryOperation.bind(this)
  public test_getSheetId = this.getSheetId.bind(this)
  public test_getAllRows = this.getAllRows.bind(this)
  public test_findRowById = this.findRowById.bind(this)
  public test_getNextId = this.getNextId.bind(this)
  public test_appendRow = this.appendRow.bind(this)
  public test_updateRow = this.updateRow.bind(this)
  public test_deleteRow = this.deleteRow.bind(this)
}

const defaultSheetConfig: SheetConfig = {
  sheetName: 'Entities',
  range: 'Entities!A1:D',
  dateColumn: { index: 3, letter: 'D' },
}

const transformers: DataTransformers<Entity> = {
  rowToEntity: (row: string[]) => ({
    id: row[0],
    name: row[1],
    'Clanski Broj': row[2],
    createdAt: row[3],
  }),
  entityToRow: (e: Entity) => [e.id, e.name, e['Clanski Broj'] ?? '', e.createdAt ?? ''],
}

const makeService = (overrides?: Partial<ServiceConfig<Entity>>) => {
  const config: ServiceConfig<Entity> = {
    sheetConfig: defaultSheetConfig,
    dataTransformers: transformers,
    idField: 'id',
    ...overrides,
  }
  return new TestCrudService('spreadsheet-123', config)
}

const withEnv = (vars: Record<string, string>) => {
  const old = { ...process.env }
  Object.entries(vars).forEach(([k, v]) => (process.env[k] = v))
  return () => {
    Object.keys(vars).forEach((k) => {
      if (old[k] === undefined) delete process.env[k]
      else process.env[k] = old[k] as string
    })
  }
}

describe('CrudService base class', () => {
  let restoreEnv: () => void

  beforeEach(() => {
    restoreEnv = withEnv({ ...REQUIRED_ENV })
    resetGoogleMocks()
    jest.clearAllTimers()
    jest.clearAllMocks()
  })

  afterEach(() => {
    restoreEnv()
  })

  describe('Environment validation and auth initialization', () => {
    test('throws if required env vars are missing', () => {
      restoreEnv()
      const cleanup = withEnv({
        GOOGLE_PROJECT_ID: '',
        GOOGLE_PRIVATE_KEY_ID: '',
        GOOGLE_PRIVATE_KEY: '',
        GOOGLE_CLIENT_EMAIL: '',
        GOOGLE_CLIENT_ID: '',
      })
      expect(() => makeService()).toThrow(/Missing required environment variables/)
      cleanup()
    })

    test('initializes GoogleAuth with transformed private key', () => {
      const svc = makeService()
      // Access the mocked GoogleAuth constructor
      const GA = GoogleAuth as unknown as jest.Mock
      expect(GA).toHaveBeenCalledTimes(1)
      const args = GA.mock.calls[0][0]
      expect(args.credentials.private_key).toContain('\n')
      expect(args.scopes).toContain('https://www.googleapis.com/auth/spreadsheets')
      // google.sheets should be created with auth
      const g = (google.sheets as unknown as jest.Mock)
      expect(g).toHaveBeenCalledTimes(1)
      expect(g.mock.calls[0][0]).toMatchObject({ version: 'v4', auth: expect.any(Object) })
      expect(svc).toBeTruthy()
    })
  })

  describe('retryOperation', () => {
    test('returns on first success without retries', async () => {
      const svc = makeService()
      const op = jest.fn().mockResolvedValue('ok')
      await expect(svc.test_retryOperation(op)).resolves.toBe('ok')
      expect(op).toHaveBeenCalledTimes(1)
    })

    test('retries on failure and eventually succeeds', async () => {
      const svc = makeService()
      const op = jest.fn()
        .mockRejectedValueOnce(new Error('fail-1'))
        .mockResolvedValueOnce('ok-2')
      const promise = svc.test_retryOperation(op, 3, 10)
      // advance timers to allow backoff waits
      await jest.runAllTimersAsync()
      await expect(promise).resolves.toBe('ok-2')
      expect(op).toHaveBeenCalledTimes(2)
    })

    test('throws after max retries exceeded', async () => {
      const svc = makeService()
      const err = new Error('always-fail')
      const op = jest.fn().mockRejectedValue(err)
      const promise = svc.test_retryOperation(op, 2, 5)
      await jest.runAllTimersAsync()
      await expect(promise).rejects.toBe(err)
      expect(op).toHaveBeenCalledTimes(2)
    })
  })

  describe('getSheetId with caching and error handling', () => {
    test('caches and returns sheetId when found', async () => {
      makeService() // instance creation triggers google.sheets mock setup
      mockSpreadsheetsGet.mockResolvedValue({
        data: {
          sheets: [
            { properties: { title: 'Entities', sheetId: 99 } },
            { properties: { title: 'Other', sheetId: 3 } },
          ],
        },
      })
      const svc = makeService()
      const first = await svc.test_getSheetId('Entities')
      expect(first).toBe(99)
      // Second call should not call API again
      const second = await svc.test_getSheetId('Entities')
      expect(second).toBe(99)
      expect(mockSpreadsheetsGet).toHaveBeenCalledTimes(1)
    })

    test('throws friendly error when requested sheet not found', async () => {
      mockSpreadsheetsGet.mockResolvedValue({
        data: {
          sheets: [{ properties: { title: 'Other', sheetId: 3 } }],
        },
      })
      const svc = makeService()
      await expect(svc.test_getSheetId('Entities')).rejects.toThrow(/Failed to get sheet ID/)
    })

    test('wraps API errors into generic failure', async () => {
      mockSpreadsheetsGet.mockRejectedValue(new Error('api-down'))
      const svc = makeService()
      await expect(svc.test_getSheetId('Entities')).rejects.toThrow(/Failed to get sheet ID/)
    })
  })

  describe('getAllRows', () => {
    test('reads rows and maps with rowToEntity', async () => {
      mockValuesGet.mockResolvedValue({
        data: {
          values: [
            ['1', 'Alpha', '', '2024-01-01'],
            ['2', 'Beta', '000002', '2024-02-02'],
          ],
        },
      })
      const svc = makeService()
      const rows = await svc.test_getAllRows()
      expect(mockValuesGet).toHaveBeenCalledWith({
        spreadsheetId: 'spreadsheet-123',
        range: 'Entities!A2:D',
      })
      expect(rows).toEqual([
        { id: '1', name: 'Alpha', 'Clanski Broj': '', createdAt: '2024-01-01' },
        { id: '2', name: 'Beta', 'Clanski Broj': '000002', createdAt: '2024-02-02' },
      ])
    })

    test('handles empty results', async () => {
      mockValuesGet.mockResolvedValue({ data: { values: [] } })
      const svc = makeService()
      const rows = await svc.test_getAllRows()
      expect(rows).toEqual([])
    })
  })

  describe('findRowById', () => {
    test('returns entity and rowIndex when found', async () => {
      mockValuesGet.mockResolvedValue({
        data: { values: [['3', 'Gamma', '', ''], ['5', 'Delta', '', '']] },
      })
      const svc = makeService()
      const found = await svc.test_findRowById('5')
      expect(found).toEqual({
        rowIndex: 1,
        entity: { id: '5', name: 'Delta', 'Clanski Broj': '', createdAt: '' },
      })
    })

    test('returns null when not found', async () => {
      mockValuesGet.mockResolvedValue({
        data: { values: [['1', 'A'], ['2', 'B']] },
      })
      const svc = makeService()
      const found = await svc.test_findRowById('9')
      expect(found).toBeNull()
    })
  })

  describe('getNextId', () => {
    test('increments numeric id and returns string', () => {
      const svc = makeService({ idField: 'id' })
      const next = svc.test_getNextId([{ id: '1', name: 'A' }, { id: '9', name: 'B' }])
      expect(next).toBe('10')
    })

    test('pads to 6 digits when idField is "Clanski Broj"', () => {
      const svc = makeService({ idField: 'Clanski Broj' as keyof Entity })
      const next = svc.test_getNextId([
        { id: 'n/a', name: 'A', 'Clanski Broj': '000120' },
        { id: 'n/a', name: 'B', 'Clanski Broj': '000009' },
      ])
      expect(next).toBe('000121')
    })

    test('handles empty list -> returns "1" or "000001" depending on idField', () => {
      const svc1 = makeService({ idField: 'id' })
      expect(svc1.test_getNextId([])).toBe('1')
      const svc2 = makeService({ idField: 'Clanski Broj' as keyof Entity })
      expect(svc2.test_getNextId([])).toBe('000001')
    })
  })

  describe('appendRow', () => {
    test('appends values and then updates date column with USER_ENTERED when dateColumn present', async () => {
      // First append; then updateDateField will:
      // - get current sheet range length
      // - update cell at date column letter and last row
      mockValuesAppend.mockResolvedValue({})
      mockValuesGet.mockResolvedValueOnce({
        data: { values: [['id', 'name', 'cb', 'date'], ['10', 'X', '', '2024-01-01']] },
      })
      mockValuesUpdate.mockResolvedValue({})

      const svc = makeService()
      const entity: Entity = { id: '11', name: 'New', 'Clanski Broj': '', createdAt: '2024-03-03' }
      await svc.test_appendRow(entity)

      expect(mockValuesAppend).toHaveBeenCalledWith({
        spreadsheetId: 'spreadsheet-123',
        range: 'Entities!A1:D',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [['11', 'New', '', '2024-03-03']] },
      })

      // After append, updateDateField calls values.get
      expect(mockValuesGet).toHaveBeenCalledWith({
        spreadsheetId: 'spreadsheet-123',
        range: 'Entities!A1:D',
      })

      // Last row index is length (2) => D2
      expect(mockValuesUpdate).toHaveBeenCalledWith({
        spreadsheetId: 'spreadsheet-123',
        range: 'Entities!D2',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [['2024-03-03']] },
      })
    })

    test('skips date update when dateColumn not configured or value missing', async () => {
      mockValuesAppend.mockResolvedValue({})
      const svc = makeService({
        sheetConfig: { ...defaultSheetConfig, dateColumn: undefined },
      })
      const entity: Entity = { id: '12', name: 'NoDate' }
      await svc.test_appendRow(entity)
      expect(mockValuesAppend).toHaveBeenCalled()
      // No follow-up values.get or update
      expect(mockValuesGet).not.toHaveBeenCalled()
      expect(mockValuesUpdate).not.toHaveBeenCalled()
    })
  })

  describe('updateRow', () => {
    test('updates correct row range with RAW values', async () => {
      mockValuesUpdate.mockResolvedValue({})
      const svc = makeService()
      // rowIndex is 0-based, actualRowIndex = rowIndex + 2
      await svc.test_updateRow(0, { id: '1', name: 'Alpha', 'Clanski Broj': '', createdAt: '' })
      expect(mockValuesUpdate).toHaveBeenCalledWith({
        spreadsheetId: 'spreadsheet-123',
        range: 'Entities!A2:D2',
        valueInputOption: 'RAW',
        requestBody: { values: [['1', 'Alpha', '', '']] },
      })
    })
  })

  describe('deleteRow', () => {
    test('issues batchUpdate deleteDimension with correct bounds', async () => {
      mockBatchUpdate.mockResolvedValue({})
      mockSpreadsheetsGet.mockResolvedValue({
        data: { sheets: [{ properties: { title: 'Entities', sheetId: 42 } }] },
      })
      const svc = makeService()
      // rowIndex is 0-based; actualRowIndex = rowIndex + 1. delete range is [start, end)
      await svc.test_deleteRow(5)
      expect(mockBatchUpdate).toHaveBeenCalledWith({
        spreadsheetId: 'spreadsheet-123',
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: 42,
                  dimension: 'ROWS',
                  startIndex: 6,
                  endIndex: 7,
                },
              },
            },
          ],
        },
      })
    })
  })
})