import { GoogleAuth } from 'google-auth-library';
import { sheets_v4, google } from 'googleapis';
import { Clan, Clanarina, ClanStatus, ClanForCreation, ClanarinaForCreation } from '@/types';

class GoogleSheetsService {
  private auth: GoogleAuth;
  private sheets: sheets_v4.Sheets;
  private sheetIds: Map<string, number> = new Map();

  constructor() {
    // Validate required environment variables
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

    this.auth = new GoogleAuth({
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

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  // Get sheet ID dynamically by sheet name
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

  // Retry helper with exponential backoff
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
        
        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 100;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Max retries exceeded');
  }

  // Clanovi methods
  async getClanovi(): Promise<Clan[]> {
    return this.retryOperation(async () => {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
        range: 'Clanovi!A2:G',
      });

      const rows = response.data.values || [];
      return rows.map(this.rowToClan);
    });
  }

  async getClanByNumber(clanskiBroj: string): Promise<Clan | null> {
    const clanovi = await this.getClanovi();
    return clanovi.find(clan => clan['Clanski Broj'] === clanskiBroj) || null;
  }

  async createClan(clan: ClanForCreation): Promise<Clan> {
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        // Generate new Clanski Broj with race condition protection
        const existingClanovi = await this.getClanovi();
        const maxNumber = existingClanovi.reduce((max, c) => {
          const num = parseInt(c['Clanski Broj'], 10);
          return num > max ? num : max;
        }, 0);
        
        const newClan: Clan = {
          ...clan,
          'Clanski Broj': (maxNumber + 1).toString().padStart(6, '0'),
        };

        const values = this.clanToRow(newClan);
        
        // Append to the end of the list using append method
        await this.sheets.spreadsheets.values.append({
          spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
          range: 'Clanovi!A:G',
          valueInputOption: 'RAW',
          insertDataOption: 'INSERT_ROWS',
          requestBody: {
            values: [values],
          },
        });

        // Since we used RAW for append, we need to update date fields with USER_ENTERED
        // Get the row number where we just appended (last row with data)
        const updatedData = await this.sheets.spreadsheets.values.get({
          spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
          range: 'Clanovi!A:G',
        });
        
        const lastRowIndex = (updatedData.data.values?.length || 1);
        
        // Update only the date field (index 5 = Datum Rodjenja) with USER_ENTERED
        if (values[5]) { // If there's a birth date
          await this.sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
            range: `Clanovi!F${lastRowIndex}`, // Column F is index 5 (Datum Rodjenja)
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [[values[5]]],
            },
          });
        }

        return newClan;
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          console.error('Error creating clan after retries:', error);
          throw new Error('Failed to create clan after multiple attempts');
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
      }
    }
    
    throw new Error('Failed to create clan');
  }

  async updateClan(clanskiBroj: string, updatedClan: Partial<Clan>): Promise<Clan | null> {
    return this.retryOperation(async () => {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
        range: 'Clanovi!A2:G',
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === clanskiBroj);
      
      if (rowIndex === -1) return null;

      const existingClan = this.rowToClan(rows[rowIndex]);
      const updated: Clan = { ...existingClan, ...updatedClan };
      const values = this.clanToRow(updated);

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
        range: `Clanovi!A${rowIndex + 2}:G${rowIndex + 2}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [values],
        },
      });

      return updated;
    });
  }

  async deleteClan(clanskiBroj: string): Promise<boolean> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        range: 'Clanovi!A2:G',
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === clanskiBroj);
      
      if (rowIndex === -1) return false;

      const clanoviSheetId = await this.getSheetId('Clanovi');
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: clanoviSheetId,
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
      console.error('Error deleting clan:', error);
      throw new Error('Failed to delete clan');
    }
  }

  // Clanarine methods
  async getClanarine(): Promise<Clanarina[]> {
    return this.retryOperation(async () => {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
        range: 'Clanarine!A2:C',
      });

      const rows = response.data.values || [];
      return rows.map(this.rowToClanarina);
    });
  }

  async getClanarinaById(id: string): Promise<Clanarina | null> {
    const clanarine = await this.getClanarine();
    return clanarine.find(c => c.id === id) || null;
  }

  async createClanarina(clanarina: ClanarinaForCreation): Promise<Clanarina> {
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        // Get existing clanarine to determine next ID with race condition protection
        const existingClanarine = await this.getClanarine();
        const maxId = existingClanarine.reduce((max, c) => {
          const num = parseInt(c.id, 10);
          return num > max ? num : max;
        }, 0);
        
        const newClanarina: Clanarina = {
          ...clanarina,
          id: (maxId + 1).toString(),
        };

        const values = this.clanarinaToRow(newClanarina);
        
        // Append to the end of the list using append method
        await this.sheets.spreadsheets.values.append({
          spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
          range: 'Clanarine!A:C',
          valueInputOption: 'RAW',
          insertDataOption: 'INSERT_ROWS',
          requestBody: {
            values: [values],
          },
        });

        // Since we used RAW for append, we need to update date fields with USER_ENTERED
        // Get the row number where we just appended (last row with data)
        const updatedData = await this.sheets.spreadsheets.values.get({
          spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
          range: 'Clanarine!A:C',
        });
        
        const lastRowIndex = (updatedData.data.values?.length || 1);
        
        // Update only the date field (index 2 = Datum Uplate) with USER_ENTERED
        if (values[2]) { // If there's a payment date
          await this.sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
            range: `Clanarine!C${lastRowIndex}`, // Column C is index 2 (Datum Uplate)
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [[values[2]]],
            },
          });
        }

        return newClanarina;
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          console.error('Error creating clanarina after retries:', error);
          throw new Error('Failed to create clanarina after multiple attempts');
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
      }
    }
    
    throw new Error('Failed to create clanarina');
  }

  async updateClanarina(id: string, updatedClanarina: Partial<Clanarina>): Promise<Clanarina | null> {
    return this.retryOperation(async () => {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
        range: 'Clanarine!A2:C',
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === id);
      
      if (rowIndex === -1) return null;

      const existingClanarina = this.rowToClanarina(rows[rowIndex]);
      const updated: Clanarina = { ...existingClanarina, ...updatedClanarina };
      const values = this.clanarinaToRow(updated);

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
        range: `Clanarine!A${rowIndex + 2}:C${rowIndex + 2}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [values],
        },
      });

      return updated;
    });
  }

  async deleteClanarina(id: string): Promise<boolean> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        range: 'Clanarine!A2:C',
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === id);
      
      if (rowIndex === -1) return false;

      const clanarineSheetId = await this.getSheetId('Clanarine');
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: clanarineSheetId,
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
      console.error('Error deleting clanarina:', error);
      throw new Error('Failed to delete clanarina');
    }
  }

  // Helper methods
  private rowToClan(row: string[]): Clan {
    // Parse dd/mm/yyyy date format
    const parseDateFromString = (dateStr: string): Date => {
      if (!dateStr) return new Date();
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        // Convert dd/mm/yyyy to yyyy-mm-dd
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
      return new Date(dateStr); // Fallback to default parsing
    };

    return {
      'Clanski Broj': row[0] || '',
      'Ime i Prezime': row[1] || '',
      email: row[2] || undefined,
      telefon: row[3] || undefined,
      status: (row[4] as ClanStatus) || ClanStatus.PROBNI,
      'Datum Rodjenja': parseDateFromString(row[5] || ''),
      Napomene: row[6] || undefined,
    };
  }

  private clanToRow(clan: Clan): string[] {
    // Format date as dd/mm/yyyy
    const formatDate = (date: Date | undefined): string => {
      if (!date) return '';
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    // Format phone number to ensure it starts with 0
    const formatPhone = (phone: string): string => {
      if (!phone) return '';
      const cleanPhone = phone.trim();
      if (cleanPhone && !cleanPhone.startsWith('0')) {
        return '0' + cleanPhone;
      }
      return cleanPhone;
    };

    // Format Clanski Broj to be padded to 6 digits
    const formatClanskiBroj = (broj: string): string => {
      if (!broj) return '';
      return broj.padStart(6, '0');
    };

    return [
      formatClanskiBroj(clan['Clanski Broj']),
      clan['Ime i Prezime'],
      clan.email || '',
      formatPhone(clan.telefon || ''),
      clan.status ?? ClanStatus.PROBNI,
      formatDate(clan['Datum Rodjenja']),
      clan.Napomene || '',
    ];
  }

  private rowToClanarina(row: string[]): Clanarina {
    // Parse dd/mm/yyyy date format
    const parseDateFromString = (dateStr: string): Date => {
      if (!dateStr) return new Date();
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        // Convert dd/mm/yyyy to yyyy-mm-dd
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
      return new Date(dateStr); // Fallback to default parsing
    };

    return {
      id: row[0] || '',
      'Clanski Broj': row[1] || '',
      'Datum Uplate': parseDateFromString(row[2] || ''),
    };
  }

  private clanarinaToRow(clanarina: Clanarina): string[] {
    // Format date as dd/mm/yyyy
    const formatDate = (date: Date): string => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    return [
      clanarina.id,
      clanarina['Clanski Broj'],
      formatDate(clanarina['Datum Uplate']),
    ];
  }
}

export const googleSheetsService = new GoogleSheetsService();