import { NextRequest } from 'next/server';

// Import the route handlers (system under test)
import * as route from './route';

// Mock external dependencies to isolate the unit under test
jest.mock('@/lib/services', () => ({
  clanovi: {
    getClanovi: jest.fn(),
    createClan: jest.fn(),
  },
}));

jest.mock('@/lib/validation', () => ({
  sanitizeString: jest.fn((v: any) => (typeof v === 'string' ? v.trim() : '')),
  validateEmail: jest.fn(() => true),
  validatePhone: jest.fn(() => true),
  validateAndNormalizeStatus: jest.fn((v: any) => v ?? 'active'),
}));

import { clanovi } from '@/lib/services';
import { sanitizeString, validateEmail, validatePhone, validateAndNormalizeStatus } from '@/lib/validation';

describe('API /api/clanovi route handlers', () => {
  // Utility to create a minimal NextRequest-like object for POST
  function makeNextRequest(body: any): NextRequest {
    // In Next.js, NextRequest can be constructed from a Request and extends web Request.
    // We'll create a real Request and cast to NextRequest for typing.
    const payload = body === undefined ? undefined : JSON.stringify(body);
    const req = new Request('http://localhost/api/clanovi', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: payload,
    });
    return req as unknown as NextRequest;
  }

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET', () => {
    it('returns 200 with list of clanovi on success (happy path)', async () => {
      (clanovi.getClanovi as jest.Mock).mockResolvedValue([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]);

      const res = await route.GET();
      expect(clanovi.getClanovi).toHaveBeenCalledTimes(1);

      // NextResponse is compatible with web Response, so we can read status and body via .status and .json()
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({
        success: true,
        data: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ],
      });
    });

    it('returns 500 with error payload when service throws', async () => {
      (clanovi.getClanovi as jest.Mock).mockRejectedValue(new Error('DB failure'));

      const res = await route.GET();
      expect(clanovi.getClanovi).toHaveBeenCalledTimes(1);
      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json).toEqual({
        success: false,
        error: 'Failed to fetch clanovi',
      });
    });
  });

  describe('POST', () => {
    const baseBody = {
      'Ime i Prezime': ' John Doe ',
      email: 'john@example.com',
      telefon: '+123456789',
      status: 'active',
      'Datum Rodjenja': '1990-01-01',
      Napomene: ' Some note ',
    };

    it('returns 201 and created entity when input is valid (happy path)', async () => {
      (sanitizeString as jest.Mock).mockImplementation((v: any) => (typeof v === 'string' ? v.trim() : ''));
      (validateEmail as jest.Mock).mockReturnValue(true);
      (validatePhone as jest.Mock).mockReturnValue(true);
      (validateAndNormalizeStatus as jest.Mock).mockImplementation((v: any) => v ?? 'active');

      const created = {
        id: 42,
        'Ime i Prezime': 'John Doe',
        email: 'john@example.com',
        telefon: '+123456789',
        status: 'active',
        'Datum Rodjenja': '1990-01-01T00:00:00.000Z',
        Napomene: 'Some note',
      };
      (clanovi.createClan as jest.Mock).mockResolvedValue(created);

      const req = makeNextRequest(baseBody);
      const res = await route.POST(req);

      expect(clanovi.createClan).toHaveBeenCalledTimes(1);
      // Ensure the route normalized and sanitized fields as expected
      const args = (clanovi.createClan as jest.Mock).mock.calls[0][0];

      expect(args['Ime i Prezime']).toBe('John Doe');
      expect(args.email).toBe('john@example.com');
      expect(args.telefon).toBe('+123456789');
      expect(args.status).toBe('active');
      // Date should be a Date object
      expect(args['Datum Rodjenja']).toBeInstanceOf(Date);
      expect(args.Napomene).toBe('Some note');

      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json).toEqual({ success: true, data: created });
    });

    it('returns 400 when body is not an object', async () => {
      const req = makeNextRequest(null);
      const res = await route.POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toEqual({ success: false, error: 'Invalid request body' });
      expect(clanovi.createClan).not.toHaveBeenCalled();
    });

    it('returns 400 when required field "Ime i Prezime" is missing', async () => {
      const badBody = { ...baseBody };
      delete badBody['Ime i Prezime'];
      const req = makeNextRequest(badBody);
      const res = await route.POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toEqual({ success: false, error: 'Missing required field: Ime i Prezime' });
      expect(clanovi.createClan).not.toHaveBeenCalled();
    });

    it('returns 400 when sanitized name is empty', async () => {
      (sanitizeString as jest.Mock).mockImplementation((v: any) => (v === ' John Doe ' ? '' : (typeof v === 'string' ? v.trim() : '')));
      const req = makeNextRequest(baseBody);
      const res = await route.POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toEqual({ success: false, error: 'Missing required field: Ime i Prezime' });
      expect(clanovi.createClan).not.toHaveBeenCalled();
    });

    it('returns 400 when name shorter than 2 characters after sanitization', async () => {
      (sanitizeString as jest.Mock).mockImplementation((v: any) => (typeof v === 'string' ? v.trim() : ''));
      const req = makeNextRequest({ ...baseBody, 'Ime i Prezime': ' A ' });
      const res = await route.POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toEqual({ success: false, error: 'Name must be at least 2 characters long' });
      expect(clanovi.createClan).not.toHaveBeenCalled();
    });

    it('returns 400 when email is provided but invalid', async () => {
      (sanitizeString as jest.Mock).mockImplementation((v: any) => (typeof v === 'string' ? v.trim() : ''));
      (validateEmail as jest.Mock).mockReturnValue(false);
      const req = makeNextRequest({ ...baseBody, email: 'bad-email' });
      const res = await route.POST(req);
      expect(validateEmail).toHaveBeenCalledWith('bad-email');
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toEqual({ success: false, error: 'Invalid email format' });
      expect(clanovi.createClan).not.toHaveBeenCalled();
    });

    it('returns 400 when phone is provided but invalid', async () => {
      (sanitizeString as jest.Mock).mockImplementation((v: any) => (typeof v === 'string' ? v.trim() : ''));
      (validatePhone as jest.Mock).mockReturnValue(false);
      const req = makeNextRequest({ ...baseBody, telefon: 'not-a-phone' });
      const res = await route.POST(req);
      expect(validatePhone).toHaveBeenCalled();
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toEqual({ success: false, error: 'Invalid phone format' });
      expect(clanovi.createClan).not.toHaveBeenCalled();
    });

    it('accepts missing optional email and phone when empty after sanitization', async () => {
      (sanitizeString as jest.Mock).mockImplementation((v: any) => (typeof v === 'string' ? v.trim() : ''));
      (validateEmail as jest.Mock).mockReturnValue(true);
      (validatePhone as jest.Mock).mockReturnValue(true);

      const created = { id: 10 };
      (clanovi.createClan as jest.Mock).mockResolvedValue(created);

      const req = makeNextRequest({
        ...baseBody,
        email: '   ', // becomes empty -> undefined in payload
        telefon: '   ',
      });

      const res = await route.POST(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json).toEqual({ success: true, data: created });

      const args = (clanovi.createClan as jest.Mock).mock.calls[0][0];
      expect(args.email).toBeUndefined();
      expect(args.telefon).toBeUndefined();
    });

    it('returns 400 when "Datum Rodjenja" is an invalid date string', async () => {
      const req = makeNextRequest({ ...baseBody, 'Datum Rodjenja': 'not-a-date' });
      const res = await route.POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toEqual({ success: false, error: 'Invalid date format for Datum Rodjenja' });
      expect(clanovi.createClan).not.toHaveBeenCalled();
    });

    it('returns 400 when birth date is in the future', async () => {
      const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      const req = makeNextRequest({ ...baseBody, 'Datum Rodjenja': future });
      const res = await route.POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toEqual({ success: false, error: 'Birth date must be within reasonable range' });
      expect(clanovi.createClan).not.toHaveBeenCalled();
    });

    it('returns 400 when birth date is older than 100 years', async () => {
      const now = new Date();
      const tooOldYear = now.getFullYear() - 101;
      const tooOld = new Date(tooOldYear, now.getMonth(), now.getDate()).toISOString().slice(0, 10);
      const req = makeNextRequest({ ...baseBody, 'Datum Rodjenja': tooOld });
      const res = await route.POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toEqual({ success: false, error: 'Birth date must be within reasonable range' });
      expect(clanovi.createClan).not.toHaveBeenCalled();
    });

    it('handles default status via validateAndNormalizeStatus and passes through to createClan', async () => {
      (validateAndNormalizeStatus as jest.Mock).mockReturnValue('inactive');
      (sanitizeString as jest.Mock).mockImplementation((v: any) => (typeof v === 'string' ? v.trim() : ''));
      (clanovi.createClan as jest.Mock).mockResolvedValue({ id: 5 });

      const req = makeNextRequest({ ...baseBody, status: undefined });
      const res = await route.POST(req);
      expect(validateAndNormalizeStatus).toHaveBeenCalledWith(undefined);

      const callArg = (clanovi.createClan as jest.Mock).mock.calls[0][0];
      expect(callArg.status).toBe('inactive');

      expect(res.status).toBe(201);
    });

    it('returns 500 when service throws during creation', async () => {
      (sanitizeString as jest.Mock).mockImplementation((v: any) => (typeof v === 'string' ? v.trim() : ''));
      (clanovi.createClan as jest.Mock).mockRejectedValue(new Error('insert failed'));

      const req = makeNextRequest(baseBody);
      const res = await route.POST(req);
      expect(clanovi.createClan).toHaveBeenCalledTimes(1);
      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json).toEqual({ success: false, error: 'Failed to create clan' });
    });
  });
});