import { CrudService, ServiceConfig } from './base/CrudService';
import { Clan, ClanForCreation, ClanStatus } from '@/types';
import { DateUtils, FormatUtils } from '@/lib/utils';

// Clanovi-specific data transformers
const clanoviDataTransformers = {
  rowToEntity: (row: string[]): Clan => ({
    'Clanski Broj': row[0] || '',
    'Ime i Prezime': row[1] || '',
    email: row[2] || undefined,
    telefon: row[3] || undefined,
    status: (row[4] as ClanStatus) || ClanStatus.PROBNI,
    'Datum Rodjenja': DateUtils.parse(row[5] || ''),
    Napomene: row[6] || undefined,
  }),

  entityToRow: (clan: Clan): string[] => [
    FormatUtils.clanskiBroj(clan['Clanski Broj']),
    clan['Ime i Prezime'],
    clan.email || '',
    FormatUtils.phone(clan.telefon || ''),
    clan.status ?? ClanStatus.PROBNI,
    DateUtils.format(clan['Datum Rodjenja']),
    clan.Napomene || '',
  ]
};

// Clanovi service configuration
const clanoviConfig: ServiceConfig<Clan, ClanForCreation> = {
  sheetConfig: {
    sheetName: 'Clanovi',
    range: 'Clanovi!A:G',
    dateColumn: { index: 5, letter: 'F' }
  },
  dataTransformers: clanoviDataTransformers,
  idField: 'Clanski Broj'
};

export class ClanoviService extends CrudService<Clan, ClanForCreation> {
  constructor(spreadsheetId: string, config?: ServiceConfig<Clan, ClanForCreation>) {
    super(spreadsheetId, config || clanoviConfig);
  }

  async getAll(): Promise<Clan[]> {
    try {
      return await this.getAllRows();
    } catch (error) {
      console.error('Error fetching clanovi:', error);
      throw new Error('Failed to fetch clanovi');
    }
  }

  async getById(clanskiBroj: string): Promise<Clan | null> {
    try {
      const result = await this.findRowById(clanskiBroj);
      return result ? result.entity : null;
    } catch (error) {
      console.error(`Error fetching clan with broj ${clanskiBroj}:`, error);
      throw new Error(`Failed to fetch clan with broj ${clanskiBroj}`);
    }
  }

  async create(data: ClanForCreation): Promise<Clan> {
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        const existingItems = await this.getAllRows();
        const clanskiBroj = this.getNextId(existingItems);
        const newClan: Clan = { ...data, 'Clanski Broj': clanskiBroj };
        
        await this.appendRow(newClan);
        return newClan;
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          console.error('Error creating clan after retries:', error);
          throw new Error('Failed to create clan after multiple attempts');
        }
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
      }
    }
    
    throw new Error('Failed to create clan');
  }

  async update(clanskiBroj: string, updates: Partial<Clan>): Promise<Clan | null> {
    try {
      const result = await this.findRowById(clanskiBroj);
      if (!result) return null;

      const updatedClan = { ...result.entity, ...updates } as Clan;
      await this.updateRow(result.rowIndex, updatedClan);
      
      return updatedClan;
    } catch (error) {
      console.error(`Error updating clan with broj ${clanskiBroj}:`, error);
      throw new Error(`Failed to update clan with broj ${clanskiBroj}`);
    }
  }

  async delete(clanskiBroj: string): Promise<boolean> {
    try {
      const result = await this.findRowById(clanskiBroj);
      if (!result) return false;

      await this.deleteRow(result.rowIndex);
      return true;
    } catch (error) {
      console.error(`Error deleting clan with broj ${clanskiBroj}:`, error);
      throw new Error(`Failed to delete clan with broj ${clanskiBroj}`);
    }
  }

  // Domain-specific methods
  async getClanovi(): Promise<Clan[]> {
    return this.getAll();
  }

  async getClanByNumber(clanskiBroj: string): Promise<Clan | null> {
    return this.getById(clanskiBroj);
  }

  async createClan(clan: ClanForCreation): Promise<Clan> {
    return this.create(clan);
  }

  async updateClan(clanskiBroj: string, updates: Partial<Clan>): Promise<Clan | null> {
    return this.update(clanskiBroj, updates);
  }

  async deleteClan(clanskiBroj: string): Promise<boolean> {
    return this.delete(clanskiBroj);
  }
}