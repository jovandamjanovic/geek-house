import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextResponse } from 'next/server';

// Import the handlers under test.
// Adjust the import path below if your route file is located differently.
import { GET, POST } from './route';

// Mock the services module used by the route handlers
vi.mock('@/lib/services', () => {
  return {
    clanarine: {
      getClanarine: vi.fn(),
      createClanarina: vi.fn(),
    },
    clanovi: {
      getClanByNumber: vi.fn(),
    },
  };
});

type ServicesModule = typeof import('@/lib/services');
const getServices = () => vi.mocked(require('@/lib/services') as ServicesModule);

// Utility to extract JSON from NextResponse
const readJson = async <T>(res: NextResponse): Promise<{ status: number; json: T }> => {
  const status = (res as any).status ?? (res as any)?._init?.status ?? 200;
  const data = await (res as any).json();
  return { status, json: data as T };
};

describe('API /api/clanarine route handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('GET', () => {
    it('returns success with clanarine list (happy path)', async () => {
      const { clanarine } = getServices();
      const mockList = [
        { id: '1', 'Clanski Broj': 123, 'Datum Uplate': new Date('2024-01-01T00:00:00.000Z') },
        { id: '2', 'Clanski Broj': 456, 'Datum Uplate': new Date('2024-02-02T00:00:00.000Z') },
      ];
      (clanarine.getClanarine as any).mockResolvedValue(mockList);

      const res = await GET();
      const { status, json } = await readJson<any>(res);

      expect(status).toBe(200);
      expect(json).toEqual({ success: true, data: mockList });
      expect(clanarine.getClanarine).toHaveBeenCalledTimes(1);
    });

    it('handles internal errors by returning 500', async () => {
      const { clanarine } = getServices();
      (clanarine.getClanarine as any).mockRejectedValue(new Error('db down'));

      const res = await GET();
      const { status, json } = await readJson<any>(res);

      expect(status).toBe(500);
      expect(json).toEqual({ success: false, error: 'Failed to fetch clanarine' });
      expect(clanarine.getClanarine).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST', () => {
    // Helper to create a minimal request-like object that satisfies the route's usage
    const makeRequest = (body: any) => {
      return {
        json: async () => body,
      } as unknown as any; // NextRequest-like shim
    };

    it('returns 400 when "Clanski Broj" is missing', async () => {
      const req = makeRequest({ 'Datum Uplate': '2024-05-10' });

      const res = await POST(req);
      const { status, json } = await readJson<any>(res);

      expect(status).toBe(400);
      expect(json).toEqual({ success: false, error: 'Missing required field: Clanski Broj' });
    });

    it('returns 400 when "Datum Uplate" is missing', async () => {
      const req = makeRequest({ 'Clanski Broj': 321 });

      const res = await POST(req);
      const { status, json } = await readJson<any>(res);

      expect(status).toBe(400);
      expect(json).toEqual({ success: false, error: 'Missing required field: Datum Uplate' });
    });

    it('returns 400 when "Datum Uplate" is invalid date', async () => {
      const req = makeRequest({ 'Clanski Broj': 321, 'Datum Uplate': 'not-a-date' });

      const res = await POST(req);
      const { status, json } = await readJson<any>(res);

      expect(status).toBe(400);
      expect(json).toEqual({ success: false, error: 'Invalid date format for Datum Uplate' });
    });

    it('returns 400 when clan with provided "Clanski Broj" does not exist', async () => {
      const { clanovi } = getServices();
      (clanovi.getClanByNumber as any).mockResolvedValue(null);

      const req = makeRequest({ 'Clanski Broj': 999, 'Datum Uplate': '2024-05-10' });

      const res = await POST(req);
      const { status, json } = await readJson<any>(res);

      expect(status).toBe(400);
      expect(json).toEqual({ success: false, error: 'Clan with specified Clanski Broj does not exist' });
      expect(clanovi.getClanByNumber).toHaveBeenCalledWith(999);
      expect(clanovi.getClanByNumber).toHaveBeenCalledTimes(1);
    });

    it('creates a new clanarina and returns 201 on success (happy path)', async () => {
      const { clanovi, clanarine } = getServices();
      (clanovi.getClanByNumber as any).mockResolvedValue({ id: 'c1', name: 'Testni Clan' });

      const created = { id: 'cl-1', 'Clanski Broj': 111, 'Datum Uplate': new Date('2024-03-03T00:00:00.000Z') };
      (clanarine.createClanarina as any).mockResolvedValue(created);

      const body = { 'Clanski Broj': 111, 'Datum Uplate': '2024-03-03' };
      const req = makeRequest(body);

      const res = await POST(req);
      const { status, json } = await readJson<any>(res);

      expect(status).toBe(201);
      expect(json).toEqual({ success: true, data: created });

      // Ensure we validated clan existence
      expect(clanovi.getClanByNumber).toHaveBeenCalledWith(111);

      // Ensure we created clanarina with parsed Date object
      expect(clanarine.createClanarina).toHaveBeenCalledTimes(1);
      const payload = (clanarine.createClanarina as any).mock.calls[0][0];
      expect(payload['Clanski Broj']).toBe(111);
      expect(payload['Datum Uplate']).toBeInstanceOf(Date);
      expect((payload['Datum Uplate'] as Date).toISOString()).toBe(new Date('2024-03-03').toISOString());
    });

    it('returns 500 when an unexpected error occurs during creation', async () => {
      const { clanovi, clanarine } = getServices();
      (clanovi.getClanByNumber as any).mockResolvedValue({ id: 'c1', name: 'Testni Clan' });
      (clanarine.createClanarina as any).mockRejectedValue(new Error('db write failed'));

      const req = makeRequest({ 'Clanski Broj': 222, 'Datum Uplate': '2024-06-01' });

      const res = await POST(req);
      const { status, json } = await readJson<any>(res);

      expect(status).toBe(500);
      expect(json).toEqual({ success: false, error: 'Failed to create clanarina' });

      expect(clanovi.getClanByNumber).toHaveBeenCalledWith(222);
      expect(clanarine.createClanarina).toHaveBeenCalledTimes(1);
    });
  });
});