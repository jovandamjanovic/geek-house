import { CrudService, DataTransformers, ServiceConfig } from './base/CrudService';
import { Clanarina, ClanarinaForCreation } from '@/types';
import { DateUtils } from '@/lib/utils';

// Clanarine-specific data transformers
const clanarineDataTransformers: DataTransformers<Clanarina> = {
  rowToEntity: (row: string[]): Clanarina => ({
    id: row[0] || '',
    'Clanski Broj': row[1] || '',
    'Datum Uplate': DateUtils.parse(row[2] || ''),
  }),

  entityToRow: (clanarina: Clanarina): string[] => [
    clanarina.id,
    clanarina['Clanski Broj'],
    DateUtils.format(clanarina['Datum Uplate']),
  ]
};

// Clanarine service configuration
const clanarineConfig: ServiceConfig<Clanarina> = {
  sheetConfig: {
    sheetName: 'Clanarine',
    range: 'Clanarine!A:C',
    dateColumn: { index: 2, letter: 'C' }
  },
  dataTransformers: clanarineDataTransformers,
  idField: 'id'
};

export class ClanarineService extends CrudService<Clanarina> {
  constructor(spreadsheetId: string, config?: ServiceConfig<Clanarina>) {
    super(spreadsheetId, config || clanarineConfig);
  }

  async getAll(): Promise<Clanarina[]> {
    try {
      return await this.getAllRows();
    } catch (error) {
      console.error('Error fetching clanarine:', error);
      throw new Error('Failed to fetch clanarine');
    }
  }

  async getById(id: string): Promise<Clanarina | null> {
    try {
      const result = await this.findRowById(id);
      return result ? result.entity : null;
    } catch (error) {
      console.error(`Error fetching clanarina with id ${id}:`, error);
      throw new Error(`Failed to fetch clanarina with id ${id}`);
    }
  }

  async create(data: ClanarinaForCreation): Promise<Clanarina> {
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        const existingItems = await this.getAllRows();
        const id = this.getNextId(existingItems);
        const newClanarina: Clanarina = { ...data, id };
        
        await this.appendRow(newClanarina);
        return newClanarina;
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          console.error('Error creating clanarina after retries:', error);
          throw new Error('Failed to create clanarina after multiple attempts');
        }
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
      }
    }
    
    throw new Error('Failed to create clanarina');
  }

  async update(id: string, updates: Partial<Clanarina>): Promise<Clanarina | null> {
    try {
      const result = await this.findRowById(id);
      if (!result) return null;

      const updatedClanarina = { ...result.entity, ...updates } as Clanarina;
      await this.updateRow(result.rowIndex, updatedClanarina);
      
      return updatedClanarina;
    } catch (error) {
      console.error(`Error updating clanarina with id ${id}:`, error);
      throw new Error(`Failed to update clanarina with id ${id}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.findRowById(id);
      if (!result) return false;

      await this.deleteRow(result.rowIndex);
      return true;
    } catch (error) {
      console.error(`Error deleting clanarina with id ${id}:`, error);
      throw new Error(`Failed to delete clanarina with id ${id}`);
    }
  }

  // Domain-specific methods
  async getClanarine(): Promise<Clanarina[]> {
    return this.getAll();
  }

  async getClanarinaById(id: string): Promise<Clanarina | null> {
    return this.getById(id);
  }

  async createClanarina(clanarina: ClanarinaForCreation): Promise<Clanarina> {
    return this.create(clanarina);
  }

  async updateClanarina(id: string, updates: Partial<Clanarina>): Promise<Clanarina | null> {
    return this.update(id, updates);
  }

  async deleteClanarina(id: string): Promise<boolean> {
    return this.delete(id);
  }
}