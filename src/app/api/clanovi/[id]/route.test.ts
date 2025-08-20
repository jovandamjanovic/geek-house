/**
 * Tests for API route: src/app/api/clanovi/[id]/route.ts
 *
 * Testing framework: Jest + TypeScript
 * - No existing test framework detected; these tests are written for Jest.
 * - If your project prefers Vitest, the tests are largely compatible with minimal changes
 *   (e.g., vi.fn instead of jest.fn). Keep mocks and assertions aligned with your setup.
 */
import type { NextRequest } from 'next/server';
import * as routeModule from './route';
import { clanovi } from '@/lib/services';
import * as validation from '@/lib/validation';
import { Clan, ClanStatus } from '@/types';

jest.mock('@/lib/services', () => ({
  clanovi: {
    getClanByNumber: jest.fn(),
    updateClan: jest.fn(),
    deleteClan: jest.fn(),
  },
}));

jest.mock('@/lib/validation', () => ({
  sanitizeString: jest.fn((val: any) => {
    if (typeof val !== 'string') return '';
    return val.trim();
  }),
  validateEmail: jest.fn((email: string) => /\S+@\S+\.\S+/.test(email)),
  validatePhone: jest.fn((phone: string) => /^\+?[0-9\s-]{7,}$/.test(phone)),
}));

// Minimal NextRequest-like object; only .json() is used by handlers.
const makeJsonRequest = (body: any): Partial<NextRequest> => {
  return {
    // @ts-expect-error - provide only what's needed by the handler
    json: async () => body,
  };
};

// Extract handlers
const { GET, PUT, DELETE } = routeModule;

// Types for mocked modules
const mockedClanovi = clanovi as jest.Mocked<typeof clanovi>;
const { sanitizeString, validateEmail, validatePhone } = validation as {
  sanitizeString: jest.Mock<any, any>;
  validateEmail: jest.Mock<any, any>;
  validatePhone: jest.Mock<any, any>;
};

describe('API /api/clanovi/[id] route handlers', () => {
  const okClan: Clan = {
    broj: 'A/01',
    'Ime i Prezime': 'John Doe',
    email: 'john@example.com',
    telefon: '+1 555 5555',
    status: ClanStatus.AKTIVAN,
    Napomene: '',
    'Datum Rodjenja': new Date('1990-01-01') as any,
  } as any;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('GET', () => {
    it('returns 200 with clan data when found', async () => {
      mockedClanovi.getClanByNumber.mockResolvedValueOnce(okClan);

      const res = await GET({} as any, { params: Promise.resolve({ id: 'A/01' }) } as any);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ success: true, data: okClan });
      expect(mockedClanovi.getClanByNumber).toHaveBeenCalledWith('A/01');
    });

    it('returns 404 when clan not found', async () => {
      mockedClanovi.getClanByNumber.mockResolvedValueOnce(null as any);

      const res = await GET({} as any, { params: Promise.resolve({ id: 'X/99' }) } as any);
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toEqual({ success: false, error: 'Clan not found' });
    });

    it('returns 500 on service error', async () => {
      mockedClanovi.getClanByNumber.mockRejectedValueOnce(new Error('boom'));

      const res = await GET({} as any, { params: Promise.resolve({ id: 'ERR/01' }) } as any);
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data).toEqual({ success: false, error: 'Failed to fetch clan' });
    });
  });

  describe('PUT', () => {
    it('blocks updates for protected member P/01 with 403', async () => {
      const req = makeJsonRequest({});
      const res = await PUT(req as any, { params: Promise.resolve({ id: 'P/01' }) } as any);
      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body).toEqual({ success: false, error: 'Cannot update protected member P/01' });
      expect(mockedClanovi.updateClan).not.toHaveBeenCalled();
    });

    it('returns 400 for non-object body', async () => {
      const req = makeJsonRequest('not an object');
      const res = await PUT(req as any, { params: Promise.resolve({ id: 'A/01' }) } as any);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ success: false, error: 'Invalid request body' });
      expect(mockedClanovi.updateClan).not.toHaveBeenCalled();
    });

    it('returns 500 when request.json throws', async () => {
      const req = {
        // @ts-expect-error minimal mock
        json: async () => {
          throw new Error('bad json');
        },
      };
      const res = await PUT(req as any, { params: Promise.resolve({ id: 'A/01' }) } as any);
      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ success: false, error: 'Failed to update clan' });
      expect(mockedClanovi.updateClan).not.toHaveBeenCalled();
    });

    it('validates name length (too short)', async () => {
      (sanitizeString as jest.Mock).mockImplementation((v: any) => (typeof v === 'string' ? v.trim() : ''));
      const req = makeJsonRequest({ 'Ime i Prezime': 'J' });
      const res = await PUT(req as any, { params: Promise.resolve({ id: 'A/01' }) } as any);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ success: false, error: 'Name must be at least 2 characters long' });
      expect(mockedClanovi.updateClan).not.toHaveBeenCalled();
    });

    it('sanitizes name to undefined when empty after trimming', async () => {
      mockedClanovi.updateClan.mockResolvedValueOnce(okClan);
      (sanitizeString as jest.Mock).mockImplementation((v: any) => (typeof v === 'string' ? v.trim() : ''));

      const req = makeJsonRequest({ 'Ime i Prezime': '   ' });
      const res = await PUT(req as any, { params: Promise.resolve({ id: 'C/03' }) } as any);
      expect(res.status).toBe(200);
      await res.json();
      expect(mockedClanovi.updateClan).toHaveBeenCalledWith(
        'C/03',
        expect.objectContaining({ 'Ime i Prezime': undefined })
      );
    });

    it('validates email format (invalid -> 400)', async () => {
      (validateEmail as jest.Mock).mockReturnValue(false);
      const req = makeJsonRequest({ email: 'bad-email' });
      const res = await PUT(req as any, { params: Promise.resolve({ id: 'A/01' }) } as any);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ success: false, error: 'Invalid email format' });
      expect(validateEmail).toHaveBeenCalled();
      expect(mockedClanovi.updateClan).not.toHaveBeenCalled();
    });

    it('sanitizes email to undefined when empty (validator not called) and updates', async () => {
      mockedClanovi.updateClan.mockResolvedValueOnce(okClan);
      (sanitizeString as jest.Mock).mockImplementation((v: any) => (typeof v === 'string' ? v.trim() : ''));
      (validateEmail as jest.Mock).mockClear();

      const req = makeJsonRequest({ email: '   ' });
      const res = await PUT(req as any, { params: Promise.resolve({ id: 'A/01' }) } as any);

      expect(res.status).toBe(200);
      await res.json();
      expect(validateEmail).not.toHaveBeenCalled();
      expect(mockedClanovi.updateClan).toHaveBeenCalledWith(
        'A/01',
        expect.objectContaining({ email: undefined })
      );
    });

    it('validates phone format (invalid -> 400)', async () => {
      (validatePhone as jest.Mock).mockReturnValue(false);
      const req = makeJsonRequest({ telefon: 'abc' });
      const res = await PUT(req as any, { params: Promise.resolve({ id: 'A/01' }) } as any);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ success: false, error: 'Invalid phone format' });
      expect(validatePhone).toHaveBeenCalled();
      expect(mockedClanovi.updateClan).not.toHaveBeenCalled();
    });

    it('sanitizes phone to undefined when empty and updates', async () => {
      mockedClanovi.updateClan.mockResolvedValueOnce(okClan);
      (sanitizeString as jest.Mock).mockImplementation((v: any) => (typeof v === 'string' ? v.trim() : ''));

      const req = makeJsonRequest({ telefon: '   ' });
      const res = await PUT(req as any, { params: Promise.resolve({ id: 'B/02' }) } as any);
      expect(res.status).toBe(200);
      await res.json();
      expect(mockedClanovi.updateClan).toHaveBeenCalledWith(
        'B/02',
        expect.objectContaining({ telefon: undefined })
      );
    });

    it('sanitizes Napomene to undefined when empty whitespace', async () => {
      mockedClanovi.updateClan.mockResolvedValueOnce(okClan);
      (sanitizeString as jest.Mock).mockImplementation((v: any) => (typeof v === 'string' ? v.trim() : ''));

      const req = makeJsonRequest({ Napomene: '    ' });
      const res = await PUT(req as any, { params: Promise.resolve({ id: 'B/02' }) } as any);
      expect(res.status).toBe(200);
      const payload = await res.json();
      expect(payload.success).toBe(true);
      expect(mockedClanovi.updateClan).toHaveBeenCalledWith(
        'B/02',
        expect.objectContaining({ Napomene: undefined })
      );
    });

    it('normalizes valid status (e.g., "active" -> AKTIVAN) and succeeds', async () => {
      const body = { status: 'active', email: 'john@example.com' };
      mockedClanovi.updateClan.mockResolvedValueOnce({ ...okClan, status: ClanStatus.AKTIVAN });

      const req = makeJsonRequest(body);
      const res = await PUT(req as any, { params: Promise.resolve({ id: 'A/01' }) } as any);
      expect(res.status).toBe(200);
      const payload = await res.json();
      expect(payload.success).toBe(true);
      expect(mockedClanovi.updateClan).toHaveBeenCalledWith(
        'A/01',
        expect.objectContaining({ status: ClanStatus.AKTIVAN })
      );
    });

    it('returns 400 for invalid non-empty string status', async () => {
      const req = makeJsonRequest({ status: 'UNKNOWN' });
      const res = await PUT(req as any, { params: Promise.resolve({ id: 'A/01' }) } as any);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ success: false, error: 'Invalid status value' });
      expect(mockedClanovi.updateClan).not.toHaveBeenCalled();
    });

    it('returns 400 for invalid truthy non-string status (e.g., number)', async () => {
      const req = makeJsonRequest({ status: 42 });
      const res = await PUT(req as any, { params: Promise.resolve({ id: 'A/01' }) } as any);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ success: false, error: 'Invalid status value' });
      expect(mockedClanovi.updateClan).not.toHaveBeenCalled();
    });

    it('treats empty string status as undefined (no error) and updates successfully', async () => {
      mockedClanovi.updateClan.mockResolvedValueOnce(okClan);

      const req = makeJsonRequest({ status: '' });
      const res = await PUT(req as any, { params: Promise.resolve({ id: 'A/01' }) } as any);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ success: true, data: okClan });
      expect(mockedClanovi.updateClan).toHaveBeenCalledWith(
        'A/01',
        expect.objectContaining({ status: undefined })
      );
    });

    it('returns 400 for invalid birth date format', async () => {
      const req = makeJsonRequest({ 'Datum Rodjenja': 'not-a-date' });
      const res = await PUT(req as any, { params: Promise.resolve({ id: 'A/01' }) } as any);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({
        success: false,
        error: 'Invalid date format for Datum Rodjenja',
      });
      expect(mockedClanovi.updateClan).not.toHaveBeenCalled();
    });

    it('returns 400 for birth date older than 100 years', async () => {
      const old = new Date();
      old.setFullYear(old.getFullYear() - 101);
      const req = makeJsonRequest({ 'Datum Rodjenja': old.toISOString() });
      const res = await PUT(req as any, { params: Promise.resolve({ id: 'A/01' }) } as any);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({
        success: false,
        error: 'Birth date must be within reasonable range',
      });
      expect(mockedClanovi.updateClan).not.toHaveBeenCalled();
    });

    it('returns 400 for future birth date', async () => {
      const future = new Date(Date.now() + 24 * 3600 * 1000);
      const req = makeJsonRequest({ 'Datum Rodjenja': future.toISOString() });
      const res = await PUT(req as any, { params: Promise.resolve({ id: 'A/01' }) } as any);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({
        success: false,
        error: 'Birth date must be within reasonable range',
      });
      expect(mockedClanovi.updateClan).not.toHaveBeenCalled();
    });

    it('parses valid birth date and passes Date instance to updateClan', async () => {
      const dateIso = '1991-05-19T00:00:00.000Z';
      mockedClanovi.updateClan.mockResolvedValueOnce(okClan);

      const req = makeJsonRequest({ 'Datum Rodjenja': dateIso });
      const res = await PUT(req as any, { params: Promise.resolve({ id: 'A/01' }) } as any);

      expect(res.status).toBe(200);
      await res.json();
      expect(mockedClanovi.updateClan).toHaveBeenCalledWith(
        'A/01',
        expect.objectContaining({ 'Datum Rodjenja': expect.any(Date) })
      );
    });

    it('returns 404 when updateClan yields no entity', async () => {
      mockedClanovi.updateClan.mockResolvedValueOnce(null as any);

      const req = makeJsonRequest({ email: 'john@example.com' });
      const res = await PUT(req as any, { params: Promise.resolve({ id: 'Z/09' }) } as any);
      expect(res.status).toBe(404);
      expect(await res.json()).toEqual({ success: false, error: 'Clan not found' });
    });

    it('returns 200 with updated clan on success', async () => {
      const updated = { ...okClan, email: 'new@example.com' };
      mockedClanovi.updateClan.mockResolvedValueOnce(updated);

      const req = makeJsonRequest({ email: 'new@example.com' });
      const res = await PUT(req as any, { params: Promise.resolve({ id: 'A/01' }) } as any);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ success: true, data: updated });
    });

    it('returns 500 on service error during update', async () => {
      mockedClanovi.updateClan.mockRejectedValueOnce(new Error('boom'));
      const req = makeJsonRequest({ email: 'john@example.com' });
      const res = await PUT(req as any, { params: Promise.resolve({ id: 'A/01' }) } as any);
      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ success: false, error: 'Failed to update clan' });
    });
  });

  describe('DELETE', () => {
    it('blocks deletion for protected member P/01 with 403', async () => {
      const res = await DELETE({} as any, { params: Promise.resolve({ id: 'P/01' }) } as any);
      expect(res.status).toBe(403);
      expect(await res.json()).toEqual({ success: false, error: 'Cannot delete protected member P/01' });
      expect(mockedClanovi.deleteClan).not.toHaveBeenCalled();
    });

    it('returns 404 when deletion target not found', async () => {
      mockedClanovi.deleteClan.mockResolvedValueOnce(false);
      const res = await DELETE({} as any, { params: Promise.resolve({ id: 'NO/PE' }) } as any);
      expect(res.status).toBe(404);
      expect(await res.json()).toEqual({ success: false, error: 'Clan not found' });
    });

    it('returns 200 on successful deletion', async () => {
      mockedClanovi.deleteClan.mockResolvedValueOnce(true);
      const res = await DELETE({} as any, { params: Promise.resolve({ id: 'A/01' }) } as any);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ success: true, data: null });
    });

    it('returns 500 on service error during delete', async () => {
      mockedClanovi.deleteClan.mockRejectedValueOnce(new Error('boom'));
      const res = await DELETE({} as any, { params: Promise.resolve({ id: 'ERR/DEL' }) } as any);
      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ success: false, error: 'Failed to delete clan' });
    });
  });
});