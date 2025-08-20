/**
 * Testing library/framework note:
 * - No explicit test framework detected in package.json; tests authored in Jest style.
 * - If using Vitest, replace `jest` with `vi` and adjust spies/mocks accordingly.
 *
 * Scope: Unit tests for GET, PUT, DELETE in /api/clanarine/[id]/route.ts.
 * Focus: Validation, sanitization, happy paths, edge cases, and failure conditions.
 */
import * as services from '@/lib/services';
import * as validation from '@/lib/validation';
import { GET, PUT, DELETE } from './route';

type JsonRecord = Record<string, any>;

jest.mock('@/lib/services', () => ({
  clanarine: {
    getById: jest.fn(),
    updateClanarina: jest.fn(),
    deleteClanarina: jest.fn(),
  },
  clanovi: {
    getClanByNumber: jest.fn(),
  },
}));

jest.mock('@/lib/validation', () => ({
  sanitizeString: jest.fn((s: string) => (typeof s === 'string' ? s.trim() : s)),
  validateId: jest.fn((s: string) => !!s && /^[A-Za-z0-9_-]+$/.test(s)),
  validateClanskiBroj: jest.fn((s: string) => !!s && /^[0-9]+$/.test(s)),
}));

// Helper to craft a request-like object with a json() method
function makeRequest(body?: JsonRecord) {
  const req: any = {
    json: body !== undefined ? jest.fn().mockResolvedValue(body) : jest.fn(),
  };
  return req;
}

// Helper to provide params Promise resolving to { id }
function makeParams(id: string) {
  return { params: Promise.resolve({ id }) } as any;
}

// Helper to parse the Response/NextResponse returned by handlers
async function parseResponse(res: any) {
  const status = res.status;
  const payload = await res.json();
  return { status, payload };
}

describe('API route /api/clanarine/[id]', () => {
  const { clanarine, clanovi } = services as any;
  const { sanitizeString, validateId, validateClanskiBroj } = validation as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    test('returns 400 when ID is invalid', async () => {
      (sanitizeString as jest.Mock).mockImplementation((s: string) => s);
      (validateId as jest.Mock).mockReturnValue(false);

      const res = await GET(makeRequest(), makeParams('bad id with spaces'));
      const { status, payload } = await parseResponse(res);

      expect(status).toBe(400);
      expect(payload).toEqual({ success: false, error: 'Invalid ID format' });
      expect(clanarine.getById).not.toHaveBeenCalled();
    });

    test('returns 404 when clanarina not found', async () => {
      (validateId as jest.Mock).mockReturnValue(true);
      (clanarine.getById as jest.Mock).mockResolvedValue(null);

      const res = await GET(makeRequest(), makeParams('abc123'));
      const { status, payload } = await parseResponse(res);

      expect(status).toBe(404);
      expect(payload).toEqual({ success: false, error: 'Clanarina not found' });
      expect(clanarine.getById).toHaveBeenCalledWith('abc123');
    });

    test('sanitizes and validates ID before lookup and returns 200', async () => {
      (sanitizeString as jest.Mock).mockImplementation((s: string) => s.trim());
      (validateId as jest.Mock).mockReturnValue(true);

      const result = { id: 'abc123', amount: 100 };
      (clanarine.getById as jest.Mock).mockResolvedValue(result);

      const res = await GET(makeRequest(), makeParams(' abc123 '));
      const { status, payload } = await parseResponse(res);

      expect(status).toBe(200);
      expect(payload).toEqual({ success: true, data: result });
      expect(sanitizeString).toHaveBeenCalledWith(' abc123 ');
      expect(validateId).toHaveBeenCalledWith('abc123');
      expect(clanarine.getById).toHaveBeenCalledWith('abc123');
    });

    test('returns 500 on unexpected error', async () => {
      (validateId as jest.Mock).mockReturnValue(true);
      (clanarine.getById as jest.Mock).mockRejectedValue(new Error('DB down'));

      const res = await GET(makeRequest(), makeParams('abc123'));
      const { status, payload } = await parseResponse(res);

      expect(status).toBe(500);
      expect(payload).toEqual({ success: false, error: 'Failed to fetch clanarina' });
    });
  });

  describe('PUT', () => {
    test('returns 400 when ID is invalid', async () => {
      (validateId as jest.Mock).mockReturnValue(false);

      const res = await PUT(makeRequest({ any: 'thing' }), makeParams('bad id'));
      const { status, payload } = await parseResponse(res);

      expect(status).toBe(400);
      expect(payload).toEqual({ success: false, error: 'Invalid ID format' });
      expect(clanarine.updateClanarina).not.toHaveBeenCalled();
    });

    test('returns 400 when body is not an object (null)', async () => {
      (validateId as jest.Mock).mockReturnValue(true);
      const req: any = { json: jest.fn().mockResolvedValue(null) };

      const res = await PUT(req, makeParams('abc123'));
      const { status, payload } = await parseResponse(res);

      expect(status).toBe(400);
      expect(payload).toEqual({ success: false, error: 'Invalid request body' });
    });

    test('returns 400 when Clanski Broj provided but invalid', async () => {
      (validateId as jest.Mock).mockReturnValue(true);
      (validateClanskiBroj as jest.Mock).mockReturnValue(false);

      const body = { 'Clanski Broj': 'ABC' };
      const res = await PUT(makeRequest(body), makeParams('abc123'));
      const { status, payload } = await parseResponse(res);

      expect(status).toBe(400);
      expect(payload).toEqual({ success: false, error: 'Invalid Clanski Broj format' });
      expect(clanovi.getClanByNumber).not.toHaveBeenCalled();
      expect(clanarine.updateClanarina).not.toHaveBeenCalled();
    });

    test('returns 400 when Clanski Broj valid but clan does not exist', async () => {
      (validateId as jest.Mock).mockReturnValue(true);
      (validateClanskiBroj as jest.Mock).mockReturnValue(true);
      (clanovi.getClanByNumber as jest.Mock).mockResolvedValue(null);

      const body = { 'Clanski Broj': '12345' };
      const res = await PUT(makeRequest(body), makeParams('abc123'));
      const { status, payload } = await parseResponse(res);

      expect(status).toBe(400);
      expect(payload).toEqual({
        success: false,
        error: 'Clan with specified Clanski Broj does not exist',
      });
      expect(clanovi.getClanByNumber).toHaveBeenCalledWith('12345');
      expect(clanarine.updateClanarina).not.toHaveBeenCalled();
    });

    test('returns 400 when Datum Uplate is invalid date string', async () => {
      (validateId as jest.Mock).mockReturnValue(true);
      (validateClanskiBroj as jest.Mock).mockReturnValue(true);
      (clanovi.getClanByNumber as jest.Mock).mockResolvedValue({ id: 'c1' });

      const body = { 'Clanski Broj': '12345', 'Datum Uplate': 'not-a-date' };
      const res = await PUT(makeRequest(body), makeParams('abc123'));
      const { status, payload } = await parseResponse(res);

      expect(status).toBe(400);
      expect(payload).toEqual({
        success: false,
        error: 'Invalid date format for Datum Uplate',
      });
      expect(clanarine.updateClanarina).not.toHaveBeenCalled();
    });

    test('returns 400 when Datum Uplate is too far in the past (>1 year)', async () => {
      (validateId as jest.Mock).mockReturnValue(true);
      const now = new Date();
      const tooOld = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate()).toISOString();

      const res = await PUT(makeRequest({ 'Datum Uplate': tooOld }), makeParams('abc123'));
      const { status, payload } = await parseResponse(res);

      expect(status).toBe(400);
      expect(payload).toEqual({
        success: false,
        error: 'Date must be within one year of current date',
      });
      expect(clanarine.updateClanarina).not.toHaveBeenCalled();
    });

    test('returns 400 when Datum Uplate is too far in the future (>1 year)', async () => {
      (validateId as jest.Mock).mockReturnValue(true);
      const now = new Date();
      const tooFuture = new Date(now.getFullYear() + 2, now.getMonth(), now.getDate()).toISOString();

      const res = await PUT(makeRequest({ 'Datum Uplate': tooFuture }), makeParams('abc123'));
      const { status, payload } = await parseResponse(res);

      expect(status).toBe(400);
      expect(payload).toEqual({
        success: false,
        error: 'Date must be within one year of current date',
      });
      expect(clanarine.updateClanarina).not.toHaveBeenCalled();
    });

    test('accepts boundary dates exactly one year ago and one year from now', async () => {
      (validateId as jest.Mock).mockReturnValue(true);

      const now = new Date();
      const oneYearAgoISO = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString();
      const oneYearFromNowISO = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString();

      (clanarine.updateClanarina as jest.Mock).mockResolvedValue({ id: 'abc123' });

      const resAgo = await PUT(makeRequest({ 'Datum Uplate': oneYearAgoISO }), makeParams('abc123'));
      const parsedAgo = await parseResponse(resAgo);
      expect(parsedAgo.status).toBe(200);
      expect(parsedAgo.payload).toEqual({ success: true, data: { id: 'abc123' } });

      const resFuture = await PUT(makeRequest({ 'Datum Uplate': oneYearFromNowISO }), makeParams('abc123'));
      const parsedFuture = await parseResponse(resFuture);
      expect(parsedFuture.status).toBe(200);
      expect(parsedFuture.payload).toEqual({ success: true, data: { id: 'abc123' } });
    });

    test('sanitizes Clanski Broj and passes Date object to update on happy path', async () => {
      (validateId as jest.Mock).mockReturnValue(true);
      (validateClanskiBroj as jest.Mock).mockReturnValue(true);
      (clanovi.getClanByNumber as jest.Mock).mockResolvedValue({ id: 'clan1' });

      const now = new Date();
      const validDateISO = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const body = { 'Clanski Broj': '  12345  ', 'Datum Uplate': validDateISO, amount: 200 };

      const updated = { id: 'abc123', ...body };
      (clanarine.updateClanarina as jest.Mock).mockResolvedValue(updated);

      const res = await PUT(makeRequest(body), makeParams('  abc123  '));
      const { status, payload } = await parseResponse(res);

      expect(status).toBe(200);
      expect(payload).toEqual({ success: true, data: updated });
      expect(clanovi.getClanByNumber).toHaveBeenCalledWith('12345');
      expect(clanarine.updateClanarina).toHaveBeenCalledWith(
        'abc123',
        expect.objectContaining({
          'Clanski Broj': '12345',
          'Datum Uplate': expect.any(Date),
          amount: 200,
        })
      );
    });

    test('returns 404 when updateClanarina returns null (not found)', async () => {
      (validateId as jest.Mock).mockReturnValue(true);
      (clanarine.updateClanarina as jest.Mock).mockResolvedValue(null);

      const res = await PUT(makeRequest({ foo: 'bar' }), makeParams('abc123'));
      const { status, payload } = await parseResponse(res);

      expect(status).toBe(404);
      expect(payload).toEqual({ success: false, error: 'Clanarina not found' });
      expect(clanarine.updateClanarina).toHaveBeenCalledWith('abc123', { foo: 'bar' });
    });

    test('allows array body (object-like) and succeeds; does not lookup clan when absent', async () => {
      (validateId as jest.Mock).mockReturnValue(true);
      const body: any = [];
      const updated = { id: 'abc123', ok: true };
      (clanarine.updateClanarina as jest.Mock).mockResolvedValue(updated);

      const res = await PUT(makeRequest(body), makeParams('abc123'));
      const { status, payload } = await parseResponse(res);

      expect(status).toBe(200);
      expect(payload).toEqual({ success: true, data: updated });
      expect(clanovi.getClanByNumber).not.toHaveBeenCalled();
      expect(clanarine.updateClanarina).toHaveBeenCalledWith('abc123', body);
    });

    test('succeeds with empty object body and no optional fields', async () => {
      (validateId as jest.Mock).mockReturnValue(true);
      const updated = { id: 'abc123', ok: true };
      (clanarine.updateClanarina as jest.Mock).mockResolvedValue(updated);

      const res = await PUT(makeRequest({}), makeParams('abc123'));
      const { status, payload } = await parseResponse(res);

      expect(status).toBe(200);
      expect(payload).toEqual({ success: true, data: updated });
      expect(clanovi.getClanByNumber).not.toHaveBeenCalled();
      expect(clanarine.updateClanarina).toHaveBeenCalledWith('abc123', {});
    });

    test('returns 500 when request.json() throws', async () => {
      (validateId as jest.Mock).mockReturnValue(true);
      const req: any = { json: jest.fn().mockRejectedValue(new Error('bad body')) };

      const res = await PUT(req, makeParams('abc123'));
      const { status, payload } = await parseResponse(res);

      expect(status).toBe(500);
      expect(payload).toEqual({ success: false, error: 'Failed to update clanarina' });
    });
  });

  describe('DELETE', () => {
    test('returns 400 when ID is invalid', async () => {
      (validateId as jest.Mock).mockReturnValue(false);

      const res = await DELETE(makeRequest(), makeParams('bad id'));
      const { status, payload } = await parseResponse(res);

      expect(status).toBe(400);
      expect(payload).toEqual({ success: false, error: 'Invalid ID format' });
      expect(clanarine.deleteClanarina).not.toHaveBeenCalled();
    });

    test('sanitizes and validates ID before delete; deletes successfully', async () => {
      (sanitizeString as jest.Mock).mockImplementation((s: string) => s.trim());
      (validateId as jest.Mock).mockReturnValue(true);
      (clanarine.deleteClanarina as jest.Mock).mockResolvedValue(true);

      const res = await DELETE(makeRequest(), makeParams('  abc123  '));
      const { status, payload } = await parseResponse(res);

      expect(status).toBe(200);
      expect(payload).toEqual({ success: true, data: null });
      expect(sanitizeString).toHaveBeenCalledWith('  abc123  ');
      expect(validateId).toHaveBeenCalledWith('abc123');
      expect(clanarine.deleteClanarina).toHaveBeenCalledWith('abc123');
    });

    test('returns 404 when deleteClanarina returns false (not found)', async () => {
      (validateId as jest.Mock).mockReturnValue(true);
      (clanarine.deleteClanarina as jest.Mock).mockResolvedValue(false);

      const res = await DELETE(makeRequest(), makeParams('abc123'));
      const { status, payload } = await parseResponse(res);

      expect(status).toBe(404);
      expect(payload).toEqual({ success: false, error: 'Clanarina not found' });
    });

    test('returns 500 on unexpected error', async () => {
      (validateId as jest.Mock).mockReturnValue(true);
      (clanarine.deleteClanarina as jest.Mock).mockRejectedValue(new Error('DB down'));

      const res = await DELETE(makeRequest(), makeParams('abc123'));
      const { status, payload } = await parseResponse(res);

      expect(status).toBe(500);
      expect(payload).toEqual({ success: false, error: 'Failed to delete clanarina' });
    });
  });
});