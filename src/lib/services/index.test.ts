import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// We will mock the service classes before importing the module under test.
// This allows verifying constructor calls and ensuring no real side effects.
const ClanarineServiceCtor = vi.fn()
const ClanoviServiceCtor = vi.fn()

vi.mock('./ClanarineService', () => {
  return {
    ClanarineService: class MockClanarineService {
      id: string | undefined
      constructor(id?: string) {
        ClanarineServiceCtor(id)
        this.id = id
      }
    }
  }
})

vi.mock('./ClanoviService', () => {
  return {
    ClanoviService: class MockClanoviService {
      id: string | undefined
      constructor(id?: string) {
        ClanoviServiceCtor(id)
        this.id = id
      }
    }
  }
})

// Helper to purge the module cache for the module under test
async function importFresh() {
  // In Vitest, the simplest approach is to dynamically import after resetting mocks.
  // We avoid direct require cache fiddling, relying on per-test isolation with dynamic import.
  return await import('./index')
}

const ORIGINAL_ENV = { ...process.env }

beforeEach(() => {
  vi.clearAllMocks()
  process.env = { ...ORIGINAL_ENV }
})

afterEach(() => {
  vi.resetModules() // ensures the next dynamic import re-evaluates the module
  process.env = { ...ORIGINAL_ENV }
})

describe('src/lib/services/index singleton exports', () => {
  it('constructs both services using GOOGLE_SPREADSHEET_ID (happy path)', async () => {
    process.env.GOOGLE_SPREADSHEET_ID = 'sheet-123'

    const mod = await importFresh()
    expect(ClanarineServiceCtor).toHaveBeenCalledTimes(1)
    expect(ClanoviServiceCtor).toHaveBeenCalledTimes(1)
    expect(ClanarineServiceCtor).toHaveBeenCalledWith('sheet-123')
    expect(ClanoviServiceCtor).toHaveBeenCalledWith('sheet-123')

    // Validate public exports are instances (shape check)
    expect(mod.clanarine).toBeDefined()
    expect(mod.clanovi).toBeDefined()
    // @ts-expect-no-error runtime validation
    expect((mod.clanarine as any).id).toBe('sheet-123')
    expect((mod.clanovi as any).id).toBe('sheet-123')
  })

  it('evaluates at import-time and passes undefined when env var is missing (edge case)', async () => {
    delete process.env.GOOGLE_SPREADSHEET_ID

    const mod = await importFresh()
    expect(ClanarineServiceCtor).toHaveBeenCalledTimes(1)
    expect(ClanoviServiceCtor).toHaveBeenCalledTimes(1)
    expect(ClanarineServiceCtor).toHaveBeenCalledWith(undefined)
    expect(ClanoviServiceCtor).toHaveBeenCalledWith(undefined)

    expect(mod.clanarine).toBeDefined()
    expect(mod.clanovi).toBeDefined()
    expect((mod.clanarine as any).id).toBeUndefined()
    expect((mod.clanovi as any).id).toBeUndefined()
  })

  it('exports are singletons (module caching) across imports within same test', async () => {
    process.env.GOOGLE_SPREADSHEET_ID = 'sheet-xyz'

    const first = await importFresh()
    const clanarine1 = first.clanarine
    const clanovi1 = first.clanovi

    // Without resetModules between these two imports, the module cache should return the same instances
    const second = await import('./index')
    const clanarine2 = second.clanarine
    const clanovi2 = second.clanovi

    expect(clanarine2).toBe(clanarine1)
    expect(clanovi2).toBe(clanovi1)

    // Constructors should only have been called once per service (on first load)
    expect(ClanarineServiceCtor).toHaveBeenCalledTimes(1)
    expect(ClanoviServiceCtor).toHaveBeenCalledTimes(1)
    expect(ClanarineServiceCtor).toHaveBeenCalledWith('sheet-xyz')
    expect(ClanoviServiceCtor).toHaveBeenCalledWith('sheet-xyz')
  })

  it('respects environment changes between test cases by re-evaluating module (isolation)', async () => {
    process.env.GOOGLE_SPREADSHEET_ID = 'first'
    const modA = await importFresh()
    expect((modA.clanarine as any).id).toBe('first')
    expect((modA.clanovi as any).id).toBe('first')

    vi.resetModules()
    vi.clearAllMocks()

    process.env.GOOGLE_SPREADSHEET_ID = 'second'
    const modB = await importFresh()
    expect((modB.clanarine as any).id).toBe('second')
    expect((modB.clanovi as any).id).toBe('second')

    expect(ClanarineServiceCtor).toHaveBeenCalledTimes(1)
    expect(ClanoviServiceCtor).toHaveBeenCalledTimes(1)
    expect(ClanarineServiceCtor).toHaveBeenCalledWith('second')
    expect(ClanoviServiceCtor).toHaveBeenCalledWith('second')
  })
})