import { GoogleAuth } from 'google-auth-library';
import { sheets_v4, google } from 'googleapis';
import { Clan, Clanarina, ClanStatus, ClanForCreation, ClanarinaForCreation } from '@/types';

// Pure utility functions for date handling
const DateUtils = {
  parse: (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date(dateStr); // Fallback to default parsing
  },

  format: (date: Date | undefined): string => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

// Pure utility functions for formatting
const FormatUtils = {
  phone: (phone: string): string => {
    if (!phone) return '';
    const cleanPhone = phone.trim();
    if (cleanPhone && !cleanPhone.startsWith('0')) {
      return '0' + cleanPhone;
    }
    return cleanPhone;
  },

  clanskiBroj: (broj: string): string => {
    if (!broj) return '';
    return broj.padStart(6, '0');
  }
};

// Pure transformation functions
const DataTransformers = {
  rowToClan: (row: string[]): Clan => ({
    'Clanski Broj': row[0] || '',
    'Ime i Prezime': row[1] || '',
    email: row[2] || undefined,
    telefon: row[3] || undefined,
    status: (row[4] as ClanStatus) || ClanStatus.PROBNI,
    'Datum Rodjenja': DateUtils.parse(row[5] || ''),
    Napomene: row[6] || undefined,
  }),

  clanToRow: (clan: Clan): string[] => [
    FormatUtils.clanskiBroj(clan['Clanski Broj']),
    clan['Ime i Prezime'],
    clan.email || '',
    FormatUtils.phone(clan.telefon || ''),
    clan.status ?? ClanStatus.PROBNI,
    DateUtils.format(clan['Datum Rodjenja']),
    clan.Napomene || '',
  ],

  rowToClanarina: (row: string[]): Clanarina => ({
    id: row[0] || '',
    'Clanski Broj': row[1] || '',
    'Datum Uplate': DateUtils.parse(row[2] || ''),
  }),

  clanarinaToRow: (clanarina: Clanarina): string[] => [
    clanarina.id,
    clanarina['Clanski Broj'],
    DateUtils.format(clanarina['Datum Uplate']),
  ]
};

// Configuration for sheets
interface SheetConfig {
  name: string;
  range: string;
  dateColumn?: { index: number; letter: string };
}

const SHEET_CONFIGS = {
  CLANOVI: {
    name: 'Clanovi',
    range: 'Clanovi!A:G',
    dateColumn: { index: 5, letter: 'F' }
  } as SheetConfig,
  CLANARINE: {
    name: 'Clanarine',
    range: 'Clanarine!A:C',
    dateColumn: { index: 2, letter: 'C' }
  } as SheetConfig
};

class GoogleSheetsService {
  private auth: GoogleAuth;
  private sheets: sheets_v4.Sheets;
  private sheetIds: Map<string, number> = new Map();

  constructor() {
    this.validateEnvironment();
    this.auth = this.createAuth();
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  // Environment validation
  private validateEnvironment(): void {
    const requiredEnvVars = [
      'GOOGLE_PROJECT_ID',
      'GOOGLE_PRIVATE_KEY_ID', 
      'GOOGLE_PRIVATE_KEY',
      'GOOGLE_CLIENT_EMAIL',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_SPREADSHEET_ID'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }

  // Authentication setup
  private createAuth(): GoogleAuth {
    return new GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID!,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID!,
        private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL!,
        client_id: process.env.GOOGLE_CLIENT_ID!,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }

  // Retry operation with exponential backoff
  private async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 100
  ): Promise<T> {
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        return await operation();
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          throw error;
        }
        
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 100;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Max retries exceeded');
  }

  // Get sheet ID with caching
  private async getSheetId(sheetName: string): Promise<number> {
    if (this.sheetIds.has(sheetName)) {
      return this.sheetIds.get(sheetName)!;
    }

    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
        fields: 'sheets.properties'
      });

      const sheets = response.data.sheets || [];
      for (const sheet of sheets) {
        const properties = sheet.properties;
        if (properties?.title && properties?.sheetId !== undefined && properties?.sheetId !== null) {
          this.sheetIds.set(properties.title, properties.sheetId);
        }
      }

      if (this.sheetIds.has(sheetName)) {
        return this.sheetIds.get(sheetName)!;
      }

      throw new Error(`Sheet '${sheetName}' not found`);
    } catch (error) {
      console.error(`Error getting sheet ID for ${sheetName}:`, error);
      throw new Error(`Failed to get sheet ID for ${sheetName}`);
    }
  }

  // Generic method to get all rows from a sheet
  private async getSheetRows<T>(
    config: SheetConfig, 
    transformer: (row: string[]) => T
  ): Promise<T[]> {
    return this.retryOperation(async () => {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
        range: `${config.name}!A2:${config.range.split('!')[1].split(':')[1]}`,
      });

      const rows = response.data.values || [];
      return rows.map(transformer);
    });
  }

  // Generic method to find next available ID
  private getNextId<T extends { id?: string; 'Clanski Broj'?: string }>(
    items: T[], 
    idField: keyof T
  ): string {
    const maxId = items.reduce((max, item) => {
      const value = item[idField] as string;
      const num = parseInt(value, 10);
      return num > max ? num : max;
    }, 0);
    
    return idField === 'Clanski Broj' 
      ? (maxId + 1).toString().padStart(6, '0')
      : (maxId + 1).toString();
  }

  // Generic create method with mixed valueInputOption support
  private async createEntity<TCreate, TEntity>(
    config: SheetConfig,
    createData: TCreate,
    transformer: (entity: TEntity) => string[],
    existingItems: TEntity[],
    idField: keyof TEntity,
    newEntityFactory: (createData: TCreate, id: string) => TEntity
  ): Promise<TEntity> {
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        const id = this.getNextId(existingItems, idField);
        const newEntity = newEntityFactory(createData, id);
        const values = transformer(newEntity);
        
        // Append with RAW valueInputOption
        await this.sheets.spreadsheets.values.append({
          spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
          range: config.range,
          valueInputOption: 'RAW',
          insertDataOption: 'INSERT_ROWS',
          requestBody: {
            values: [values],
          },
        });

        // Update date field with USER_ENTERED if configured
        if (config.dateColumn && values[config.dateColumn.index]) {
          await this.updateDateField(config, values[config.dateColumn.index]);
        }

        return newEntity;
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          console.error(`Error creating ${config.name} after retries:`, error);
          throw new Error(`Failed to create ${config.name} after multiple attempts`);
        }
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
      }
    }
    
    throw new Error(`Failed to create ${config.name}`);
  }

  // Update date field with USER_ENTERED
  private async updateDateField(config: SheetConfig, dateValue: string): Promise<void> {
    if (!config.dateColumn) return;

    const updatedData = await this.sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
      range: config.range,
    });
    
    const lastRowIndex = (updatedData.data.values?.length || 1);
    
    await this.sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
      range: `${config.name}!${config.dateColumn.letter}${lastRowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[dateValue]],
      },
    });
  }

  // Generic update method
  private async updateEntity<T>(
    config: SheetConfig,
    idField: keyof T,
    id: string,
    updates: Partial<T>,
    transformer: (row: string[]) => T,
    toRowTransformer: (entity: T) => string[]
  ): Promise<T | null> {
    return this.retryOperation(async () => {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
        range: `${config.name}!A2:${config.range.split('!')[1].split(':')[1]}`,
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === id);
      
      if (rowIndex === -1) return null;

      const existing = transformer(rows[rowIndex]);
      const updated = { ...existing, ...updates } as T;
      const values = toRowTransformer(updated);

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
        range: `${config.name}!A${rowIndex + 2}:${config.range.split('!')[1].split(':')[1]}${rowIndex + 2}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [values],
        },
      });

      return updated;
    });
  }

  // Generic delete method
  private async deleteEntity(config: SheetConfig, id: string): Promise<boolean> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
        range: `${config.name}!A2:${config.range.split('!')[1].split(':')[1]}`,
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === id);
      
      if (rowIndex === -1) return false;

      const sheetId = await this.getSheetId(config.name);
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: sheetId,
                dimension: 'ROWS',
                startIndex: rowIndex + 1,
                endIndex: rowIndex + 2,
              },
            },
          }],
        },
      });

      return true;
    } catch (error) {
      console.error(`Error deleting ${config.name}:`, error);
      throw new Error(`Failed to delete ${config.name}`);
    }
  }

  // Clanovi methods
  async getClanovi(): Promise<Clan[]> {
    return this.getSheetRows(SHEET_CONFIGS.CLANOVI, DataTransformers.rowToClan);
  }

  async getClanByNumber(clanskiBroj: string): Promise<Clan | null> {
    const clanovi = await this.getClanovi();
    return clanovi.find(clan => clan['Clanski Broj'] === clanskiBroj) || null;
  }

  async createClan(clan: ClanForCreation): Promise<Clan> {
    const existingClanovi = await this.getClanovi();
    return this.createEntity(
      SHEET_CONFIGS.CLANOVI,
      clan,
      DataTransformers.clanToRow,
      existingClanovi,
      'Clanski Broj',
      (createData, id) => ({ ...createData, 'Clanski Broj': id } as Clan)
    );
  }

  async updateClan(clanskiBroj: string, updatedClan: Partial<Clan>): Promise<Clan | null> {
    return this.updateEntity(
      SHEET_CONFIGS.CLANOVI,
      'Clanski Broj',
      clanskiBroj,
      updatedClan,
      DataTransformers.rowToClan,
      DataTransformers.clanToRow
    );
  }

  async deleteClan(clanskiBroj: string): Promise<boolean> {
    return this.deleteEntity(SHEET_CONFIGS.CLANOVI, clanskiBroj);
  }

  // Clanarine methods
  async getClanarine(): Promise<Clanarina[]> {
    return this.getSheetRows(SHEET_CONFIGS.CLANARINE, DataTransformers.rowToClanarina);
  }

  async getClanarinaById(id: string): Promise<Clanarina | null> {
    const clanarine = await this.getClanarine();
    return clanarine.find(c => c.id === id) || null;
  }

  async createClanarina(clanarina: ClanarinaForCreation): Promise<Clanarina> {
    const existingClanarine = await this.getClanarine();
    return this.createEntity(
      SHEET_CONFIGS.CLANARINE,
      clanarina,
      DataTransformers.clanarinaToRow,
      existingClanarine,
      'id',
      (createData, id) => ({ ...createData, id } as Clanarina)
    );
  }

  async updateClanarina(id: string, updatedClanarina: Partial<Clanarina>): Promise<Clanarina | null> {
    return this.updateEntity(
      SHEET_CONFIGS.CLANARINE,
      'id',
      id,
      updatedClanarina,
      DataTransformers.rowToClanarina,
      DataTransformers.clanarinaToRow
    );
  }

  async deleteClanarina(id: string): Promise<boolean> {
    return this.deleteEntity(SHEET_CONFIGS.CLANARINE, id);
  }
}

export const googleSheetsService = new GoogleSheetsService();