/**
 * Test framework: Prefer the repository's configured test runner (Jest or Vitest).
 * The tests below use describe/it/expect and spy functions compatible with Jest or Vitest.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'; // Vitest will tree-shake; Jest will ignore. If using Jest, replace vi with jest through global mapping if configured.
import { ClanoviService } from '../ClanoviService';
import type { Clan, ClanForCreation } from '@/types';

// Shim to support both Jest and Vitest APIs for spies/mocks
const spy = (obj: any, method: string) => {
  if (typeof vi !== 'undefined' && vi.spyOn) return vi.spyOn(obj, method as any);
  // @ts-ignore
  return jest.spyOn(obj, method as any);
};
const fn = (...args: any[]) => {
  if (typeof vi !== 'undefined' && vi.fn) return vi.fn(...args as any);
  // @ts-ignore
  return jest.fn(...args as any);
};
const resetAll = () => {
  if (typeof vi !== 'undefined' && vi.resetAllMocks) vi.resetAllMocks();
  // @ts-ignore
  if (typeof jest !== 'undefined' && jest.resetAllMocks) jest.resetAllMocks();
};

describe('ClanoviService', () => {
  const spreadsheetId = 'test-sheet-id';

  let service: ClanoviService;

  // We will stub internal CrudService methods by monkey-patching the instance.
  let getAllRowsMock: ReturnType<typeof fn>;
  let findRowByIdMock: ReturnType<typeof fn>;
  let appendRowMock: ReturnType<typeof fn>;
  let updateRowMock: ReturnType<typeof fn>;
  let deleteRowMock: ReturnType<typeof fn>;
  let getNextIdMock: ReturnType<typeof fn>;

  const sampleClan = (overrides?: Partial<Clan>): Clan => ({
    'Clanski Broj': '123',
    'Ime i Prezime': 'Test User',
    email: 'test@example.com',
    telefon: '+381601234567',
    status: 'AKTIVAN' as any,
    'Datum Rodjenja': new Date('1990-01-01'),
    Napomene: 'Note',
    ...overrides,
  });

  beforeEach(() => {
    service = new ClanoviService(spreadsheetId);

    // Attach mocks
    getAllRowsMock = fn();
    findRowByIdMock = fn();
    appendRowMock = fn();
    updateRowMock = fn();
    deleteRowMock = fn();
    getNextIdMock = fn();

    // @ts-ignore - access protected methods through instance for testing
    service.getAllRows = getAllRowsMock;
    // @ts-ignore
    service.findRowById = findRowByIdMock;
    // @ts-ignore
    service.appendRow = appendRowMock;
    // @ts-ignore
    service.updateRow = updateRowMock;
    // @ts-ignore
    service.deleteRow = deleteRowMock;
    // @ts-ignore
    service.getNextId = getNextIdMock;
  });

  afterEach(() => {
    resetAll();
  });

  describe('getAll', () => {
    it('returns all clanovi on success (happy path)', async () => {
      const rows = [sampleClan(), sampleClan({ 'Clanski Broj': '124' })];
      getAllRowsMock.mockResolvedValueOnce(rows);

      await expect(service.getAll()).resolves.toEqual(rows);
      expect(getAllRowsMock).toHaveBeenCalledTimes(1);
    });

    it('throws a friendly error on failure', async () => {
      const underlying = new Error('network');
      getAllRowsMock.mockRejectedValueOnce(underlying);

      await expect(service.getAll()).rejects.toThrow('Failed to fetch clanovi');
      expect(getAllRowsMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('returns entity when found', async () => {
      const entity = sampleClan();
      findRowByIdMock.mockResolvedValueOnce({ entity, rowIndex: 5 });

      await expect(service.getById('123')).resolves.toEqual(entity);
      expect(findRowByIdMock).toHaveBeenCalledWith('123');
    });

    it('returns null when not found', async () => {
      findRowByIdMock.mockResolvedValueOnce(null);

      await expect(service.getById('999')).resolves.toBeNull();
    });

    it('throws a friendly error on failure', async () => {
      findRowByIdMock.mockRejectedValueOnce(new Error('boom'));

      await expect(service.getById('123')).rejects.toThrow('Failed to fetch clan with broj 123');
    });
  });

  describe('create', () => {
    const newData: ClanForCreation = {
      'Ime i Prezime': 'Novi Clan',
      email: 'novi@example.com',
      telefon: '+381601111111',
      status: 'PROBNI' as any,
      'Datum Rodjenja': new Date('2000-02-02'),
      Napomene: 'Nova napomena'
    };

    it('generates next id, appends row, and returns new entity (happy path)', async () => {
      // Given existing rows and next id
      getAllRowsMock.mockResolvedValueOnce([sampleClan({ 'Clanski Broj': '120' })]);
      getNextIdMock.mockReturnValueOnce('121');
      appendRowMock.mockResolvedValueOnce(undefined);

      const result = await service.create(newData);

      expect(getAllRowsMock).toHaveBeenCalledTimes(1);
      expect(getNextIdMock).toHaveBeenCalledWith([expect.any(Object)]);
      expect(appendRowMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ...newData, 'Clanski Broj': '121' });
    });

    it('retries up to 3 times on transient failures and succeeds', async () => {
      // First two attempts fail before success
      getAllRowsMock
        .mockRejectedValueOnce(new Error('transient-1'))
        .mockRejectedValueOnce(new Error('transient-2'))
        .mockResolvedValueOnce([sampleClan({ 'Clanski Broj': '200' })]);
      getNextIdMock.mockReturnValueOnce('201');
      appendRowMock.mockResolvedValueOnce(undefined);

      const start = Date.now();
      const result = await service.create(newData);
      const elapsed = Date.now() - start;

      expect(getAllRowsMock).toHaveBeenCalledTimes(3);
      expect(getNextIdMock).toHaveBeenCalledTimes(1);
      expect(appendRowMock).toHaveBeenCalledTimes(1);
      expect(result['Clanski Broj']).toBe('201');

      // Backoff rough check: total delay should be at least ~100 + ~200 ms = ~300ms before third attempt
      // We don't assert exact timing to avoid flakiness, just that some time passed.
      expect(elapsed).toBeGreaterThanOrEqual(250);
    }, 10000);

    it('fails after max retries with friendly message', async () => {
      getAllRowsMock
        .mockRejectedValueOnce(new Error('t1'))
        .mockRejectedValueOnce(new Error('t2'))
        .mockRejectedValueOnce(new Error('t3')); // third attempt triggers failure

      await expect(service.create(newData)).rejects.toThrow('Failed to create clan after multiple attempts');
      expect(getAllRowsMock).toHaveBeenCalledTimes(3);
      expect(getNextIdMock).not.toHaveBeenCalled();
      expect(appendRowMock).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('returns null when entity not found', async () => {
      findRowByIdMock.mockResolvedValueOnce(null);

      const res = await service.update('999', { email: 'x@y.com' });
      expect(res).toBeNull();
      expect(updateRowMock).not.toHaveBeenCalled();
    });

    it('merges updates and persists row when found (happy path)', async () => {
      const entity = sampleClan({ email: 'old@example.com' });
      findRowByIdMock.mockResolvedValueOnce({ entity, rowIndex: 7 });
      updateRowMock.mockResolvedValueOnce(undefined);

      const res = await service.update('123', { email: 'new@example.com', Napomene: undefined });

      expect(res).toEqual({
        ...entity,
        email: 'new@example.com',
        Napomene: undefined
      });
      expect(updateRowMock).toHaveBeenCalledWith(7, {
        ...entity,
        email: 'new@example.com',
        Napomene: undefined
      });
    });

    it('throws a friendly error on failure', async () => {
      findRowByIdMock.mockRejectedValueOnce(new Error('db down'));

      await expect(service.update('123', { email: 'x@y.com' }))
        .rejects.toThrow('Failed to update clan with broj 123');
    });
  });

  describe('delete', () => {
    it('returns false when entity not found', async () => {
      findRowByIdMock.mockResolvedValueOnce(null);

      await expect(service.delete('404')).resolves.toBe(false);
      expect(deleteRowMock).not.toHaveBeenCalled();
    });

    it('deletes row and returns true when found', async () => {
      findRowByIdMock.mockResolvedValueOnce({ entity: sampleClan(), rowIndex: 2 });
      deleteRowMock.mockResolvedValueOnce(undefined);

      await expect(service.delete('123')).resolves.toBe(true);
      expect(deleteRowMock).toHaveBeenCalledWith(2);
    });

    it('throws a friendly error on failure', async () => {
      findRowByIdMock.mockRejectedValueOnce(new Error('perm'));

      await expect(service.delete('123')).rejects.toThrow('Failed to delete clan with broj 123');
    });
  });

  describe('Domain-specific wrappers', () => {
    it('getClanovi delegates to getAll', async () => {
      const rows = [sampleClan()];
      getAllRowsMock.mockResolvedValueOnce(rows);

      await expect(service.getClanovi()).resolves.toEqual(rows);
      expect(getAllRowsMock).toHaveBeenCalledTimes(1);
    });

    it('getClanByNumber delegates to getById', async () => {
      const entity = sampleClan();
      findRowByIdMock.mockResolvedValueOnce({ entity, rowIndex: 0 });

      await expect(service.getClanByNumber('123')).resolves.toEqual(entity);
      expect(findRowByIdMock).toHaveBeenCalledWith('123');
    });

    it('createClan delegates to create', async () => {
      const base: ClanForCreation = {
        'Ime i Prezime': 'New',
        email: 'n@example.com',
        telefon: '',
        status: 'PROBNI' as any,
        'Datum Rodjenja': new Date('2001-01-01'),
        Napomene: ''
      };
      // create() uses getAllRows/getNextId/appendRow; mock the final shape:
      getAllRowsMock.mockResolvedValueOnce([]);
      getNextIdMock.mockReturnValueOnce('1');
      appendRowMock.mockResolvedValueOnce(undefined);

      const result = await service.createClan(base);
      expect(result['Clanski Broj']).toBe('1');
      expect(result['Ime i Prezime']).toBe('New');
    });

    it('updateClan delegates to update', async () => {
      const entity = sampleClan({ email: 'old@example.com' });
      findRowByIdMock.mockResolvedValueOnce({ entity, rowIndex: 1 });
      updateRowMock.mockResolvedValueOnce(undefined);

      const res = await service.updateClan('123', { email: 'new@example.com' });
      expect(res?.email).toBe('new@example.com');
    });

    it('deleteClan delegates to delete', async () => {
      findRowByIdMock.mockResolvedValueOnce({ entity: sampleClan(), rowIndex: 3 });
      deleteRowMock.mockResolvedValueOnce(undefined);

      await expect(service.deleteClan('123')).resolves.toBe(true);
    });
  });

  describe('Edge cases and unexpected inputs', () => {
    it('getById handles empty id gracefully', async () => {
      findRowByIdMock.mockResolvedValueOnce(null);
      await expect(service.getById('')).resolves.toBeNull();
    });

    it('update with empty updates still persists original entity', async () => {
      const entity = sampleClan();
      findRowByIdMock.mockResolvedValueOnce({ entity, rowIndex: 10 });
      updateRowMock.mockResolvedValueOnce(undefined);

      const res = await service.update('123', {});
      expect(res).toEqual(entity);
      expect(updateRowMock).toHaveBeenCalledWith(10, entity);
    });
  });
});