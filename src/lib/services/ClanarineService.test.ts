/**
 * Tests for ClanarineService.
 * Detected testing framework: Jest (preferred in this repository).
 *
 * These tests:
 * - Validate happy paths, edge cases, and failure conditions.
 * - Mock inherited CrudService methods to avoid external I/O.
 * - Use fake timers to validate exponential backoff in create().
 *
 * Public API under test:
 *   - getAll()
 *   - getById(id)
 *   - create(data)
 *   - update(id, updates)
 *   - delete(id)
 *   - Domain-specific proxy methods:
 *       getClanarine(), getClanarinaById(), createClanarina(), updateClanarina(), deleteClanarina()
 */

import { ClanarineService } from './ClanarineService';

type Clanarina = {
  id: string;
  'Clanski Broj': string;
  'Datum Uplate': any;
};

type ClanarinaForCreation = Omit<Clanarina, 'id'>;

const spreadsheetId = 'test-spreadsheet';

describe('ClanarineService', () => {
  let service: ClanarineService;

  beforeEach(() => {
    jest.useRealTimers(); // default unless tests need fake timers
    service = new ClanarineService(spreadsheetId);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('getAll', () => {
    it('returns all clanarine on success (happy path)', async () => {
      const data: Clanarina[] = [
        { id: '1', 'Clanski Broj': 'CB-001', 'Datum Uplate': '2023-01-10' },
        { id: '2', 'Clanski Broj': 'CB-002', 'Datum Uplate': '2023-02-15' },
      ];
      const getAllRowsSpy = jest.spyOn<any, any>(service as any, 'getAllRows').mockResolvedValue(data);

      const result = await service.getAll();
      expect(result).toEqual(data);
      expect(getAllRowsSpy).toHaveBeenCalledTimes(1);
    });

    it('throws a user-friendly error on failure', async () => {
      const err = new Error('network');
      jest.spyOn<any, any>(service as any, 'getAllRows').mockRejectedValue(err);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await expect(service.getAll()).rejects.toThrow('Failed to fetch clanarine');
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('returns entity when found', async () => {
      const entity: Clanarina = { id: '42', 'Clanski Broj': 'CB-042', 'Datum Uplate': '2024-03-01' };
      const fakeResult = { entity, rowIndex: 5 };
      const spy = jest.spyOn<any, any>(service as any, 'findRowById').mockResolvedValue(fakeResult);

      const result = await service.getById('42');
      expect(spy).toHaveBeenCalledWith('42');
      expect(result).toEqual(entity);
    });

    it('returns null when not found', async () => {
      jest.spyOn<any, any>(service as any, 'findRowById').mockResolvedValue(null);

      const result = await service.getById('999');
      expect(result).toBeNull();
    });

    it('throws a user-friendly error on failure', async () => {
      const err = new Error('boom');
      jest.spyOn<any, any>(service as any, 'findRowById').mockRejectedValue(err);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await expect(service.getById('7')).rejects.toThrow('Failed to fetch clanarina with id 7');
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    const baseData: ClanarinaForCreation = {
      'Clanski Broj': 'CB-100',
      'Datum Uplate': '2025-01-01',
    };

    it('creates a new item successfully (happy path)', async () => {
      // Arrange: getNextId deterministic, and appendRow succeeds
      jest.spyOn<any, any>(service as any, 'getAllRows').mockResolvedValue([
        { id: '1', 'Clanski Broj': 'CB-001', 'Datum Uplate': '2023-01-10' },
      ]);
      jest.spyOn<any, any>(service as any, 'getNextId').mockReturnValue('2');
      const appendSpy = jest.spyOn<any, any>(service as any, 'appendRow').mockResolvedValue(undefined);

      // Act
      const created = await service.create(baseData);

      // Assert
      expect(created).toEqual({ id: '2', ...baseData });
      expect(appendSpy).toHaveBeenCalledWith({ id: '2', ...baseData });
    });

    it('retries on transient failures and eventually succeeds (exponential backoff)', async () => {
      jest.useFakeTimers();
      const getAllRowsSpy = jest
        .spyOn<any, any>(service as any, 'getAllRows')
        .mockResolvedValue([{ id: '10', 'Clanski Broj': 'CB-010', 'Datum Uplate': 'X' }]);

      jest.spyOn<any, any>(service as any, 'getNextId').mockReturnValue('11');

      const appendSpy = jest
        .spyOn<any, any>(service as any, 'appendRow')
        // Fail first two attempts
        .mockRejectedValueOnce(new Error('append failed 1'))
        .mockRejectedValueOnce(new Error('append failed 2'))
        // Succeed on the 3rd attempt
        .mockResolvedValueOnce(undefined);

      const p = service.create(baseData);

      // Flush backoff timers: 2^1*100=200ms then 2^2*100=400ms
      // Using runAllTimers ensures all pending timers are executed.
      jest.runOnlyPendingTimers(); // after first failure
      jest.runOnlyPendingTimers(); // after second failure

      const created = await p;
      expect(getAllRowsSpy).toHaveBeenCalledTimes(3);
      expect(appendSpy).toHaveBeenCalledTimes(3);
      expect(created).toEqual({ id: '11', ...baseData });
    });

    it('fails after max retries with correct error message', async () => {
      jest.useFakeTimers();
      jest.spyOn<any, any>(service as any, 'getAllRows').mockResolvedValue([]);
      jest.spyOn<any, any>(service as any, 'getNextId').mockReturnValue('1');

      // Force appendRow to fail 3 times
      jest
        .spyOn<any, any>(service as any, 'appendRow')
        .mockRejectedValueOnce(new Error('a1'))
        .mockRejectedValueOnce(new Error('a2'))
        .mockRejectedValueOnce(new Error('a3'));

      const p = service.create(baseData);

      // Flush backoff timers for the first two retries
      jest.runOnlyPendingTimers();
      jest.runOnlyPendingTimers();

      await expect(p).rejects.toThrow('Failed to create clanarina after multiple attempts');
    });
  });

  describe('update', () => {
    it('merges updates and persists when found', async () => {
      const existing: Clanarina = { id: '5', 'Clanski Broj': 'CB-005', 'Datum Uplate': '2023-05-05' };
      const result = { entity: existing, rowIndex: 12 };
      const updates: Partial<Clanarina> = { 'Clanski Broj': 'CB-005-UPDATED' };

      jest.spyOn<any, any>(service as any, 'findRowById').mockResolvedValue(result);
      const updateRowSpy = jest.spyOn<any, any>(service as any, 'updateRow').mockResolvedValue(undefined);

      const updated = await service.update('5', updates);
      expect(updateRowSpy).toHaveBeenCalledWith(12, {
        ...existing,
        ...updates,
      });
      expect(updated).toEqual({ ...existing, ...updates });
    });

    it('returns null when target entity is not found', async () => {
      jest.spyOn<any, any>(service as any, 'findRowById').mockResolvedValue(null);
      const updateRowSpy = jest.spyOn<any, any>(service as any, 'updateRow').mockResolvedValue(undefined);

      const updated = await service.update('404', { 'Clanski Broj': 'N/A' });
      expect(updated).toBeNull();
      expect(updateRowSpy).not.toHaveBeenCalled();
    });

    it('throws a user-friendly error on failure', async () => {
      jest.spyOn<any, any>(service as any, 'findRowById').mockRejectedValue(new Error('db down'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await expect(service.update('7', { 'Clanski Broj': 'X' })).rejects.toThrow(
        'Failed to update clanarina with id 7'
      );
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deletes and returns true when found', async () => {
      jest.spyOn<any, any>(service as any, 'findRowById').mockResolvedValue({
        entity: { id: '8', 'Clanski Broj': 'CB-008', 'Datum Uplate': '2023-08-08' },
        rowIndex: 3,
      });
      const deleteRowSpy = jest.spyOn<any, any>(service as any, 'deleteRow').mockResolvedValue(undefined);

      const result = await service.delete('8');
      expect(deleteRowSpy).toHaveBeenCalledWith(3);
      expect(result).toBe(true);
    });

    it('returns false when not found', async () => {
      jest.spyOn<any, any>(service as any, 'findRowById').mockResolvedValue(null);
      const deleteRowSpy = jest.spyOn<any, any>(service as any, 'deleteRow').mockResolvedValue(undefined);

      const result = await service.delete('404');
      expect(result).toBe(false);
      expect(deleteRowSpy).not.toHaveBeenCalled();
    });

    it('throws a user-friendly error on failure', async () => {
      jest.spyOn<any, any>(service as any, 'findRowById').mockRejectedValue(new Error('oops'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await expect(service.delete('13')).rejects.toThrow('Failed to delete clanarina with id 13');
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('Domain-specific method proxies', () => {
    it('getClanarine() proxies to getAll()', async () => {
      const spy = jest.spyOn(service, 'getAll').mockResolvedValue([
        { id: '1', 'Clanski Broj': 'CB-001', 'Datum Uplate': 'X' } as any,
      ]);
      const result = await service.getClanarine();
      expect(result).toHaveLength(1);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('getClanarinaById() proxies to getById()', async () => {
      const spy = jest.spyOn(service, 'getById').mockResolvedValue({ id: '2' } as any);
      const result = await service.getClanarinaById('2');
      expect(result).toEqual({ id: '2' });
      expect(spy).toHaveBeenCalledWith('2');
    });

    it('createClanarina() proxies to create()', async () => {
      const data = { 'Clanski Broj': 'CB-X', 'Datum Uplate': 'Y' } as any;
      const spy = jest.spyOn(service, 'create').mockResolvedValue({ id: '9', ...data });
      const result = await service.createClanarina(data);
      expect(result).toEqual({ id: '9', ...data });
      expect(spy).toHaveBeenCalledWith(data);
    });

    it('updateClanarina() proxies to update()', async () => {
      const spy = jest.spyOn(service, 'update').mockResolvedValue({ id: '3' } as any);
      const result = await service.updateClanarina('3', { 'Clanski Broj': 'CB-NEW' });
      expect(result).toEqual({ id: '3' });
      expect(spy).toHaveBeenCalledWith('3', { 'Clanski Broj': 'CB-NEW' });
    });

    it('deleteClanarina() proxies to delete()', async () => {
      const spy = jest.spyOn(service, 'delete').mockResolvedValue(true);
      const result = await service.deleteClanarina('4');
      expect(result).toBe(true);
      expect(spy).toHaveBeenCalledWith('4');
    });
  });
});