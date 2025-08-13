import { GoogleAuth } from 'google-auth-library';
import { sheets_v4, google } from 'googleapis';
import { Clan, Clanarina, ClanStatus } from '@/types';

class GoogleSheetsService {
  private auth: GoogleAuth;
  private sheets: sheets_v4.Sheets;

  constructor() {
    this.auth = new GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  // Clanovi methods
  async getClanovi(): Promise<Clan[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        range: 'Clanovi!A2:G',
      });

      const rows = response.data.values || [];
      return rows.map(this.rowToClan);
    } catch (error) {
      console.error('Error fetching clanovi:', error);
      throw new Error('Failed to fetch clanovi');
    }
  }

  async getClanByNumber(clanskiBroj: string): Promise<Clan | null> {
    const clanovi = await this.getClanovi();
    return clanovi.find(clan => clan['Clanski Broj'] === clanskiBroj) || null;
  }

  async createClan(clan: Omit<Clan, 'Clanski Broj'>): Promise<Clan> {
    try {
      // Generate new Clanski Broj
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
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        range: 'Clanovi!A:G',
        valueInputOption: 'RAW',
        requestBody: {
          values: [values],
        },
      });

      return newClan;
    } catch (error) {
      console.error('Error creating clan:', error);
      throw new Error('Failed to create clan');
    }
  }

  async updateClan(clanskiBroj: string, updatedClan: Partial<Clan>): Promise<Clan | null> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        range: 'Clanovi!A2:G',
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === clanskiBroj);
      
      if (rowIndex === -1) return null;

      const existingClan = this.rowToClan(rows[rowIndex]);
      const updated: Clan = { ...existingClan, ...updatedClan };
      const values = this.clanToRow(updated);

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        range: `Clanovi!A${rowIndex + 2}:G${rowIndex + 2}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [values],
        },
      });

      return updated;
    } catch (error) {
      console.error('Error updating clan:', error);
      throw new Error('Failed to update clan');
    }
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

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 0,
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
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        range: 'Clanarine!A2:C',
      });

      const rows = response.data.values || [];
      return rows.map(this.rowToClanarina);
    } catch (error) {
      console.error('Error fetching clanarine:', error);
      throw new Error('Failed to fetch clanarine');
    }
  }

  async getClanarinaById(id: string): Promise<Clanarina | null> {
    const clanarine = await this.getClanarine();
    return clanarine.find(c => c.id === id) || null;
  }

  async createClanarina(clanarina: Omit<Clanarina, 'id'>): Promise<Clanarina> {
    try {
      // Get existing clanarine to determine next ID
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
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        range: 'Clanarine!A:C',
        valueInputOption: 'RAW',
        requestBody: {
          values: [values],
        },
      });

      return newClanarina;
    } catch (error) {
      console.error('Error creating clanarina:', error);
      throw new Error('Failed to create clanarina');
    }
  }

  async updateClanarina(id: string, updatedClanarina: Partial<Clanarina>): Promise<Clanarina | null> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        range: 'Clanarine!A2:C',
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === id);
      
      if (rowIndex === -1) return null;

      const existingClanarina = this.rowToClanarina(rows[rowIndex]);
      const updated: Clanarina = { ...existingClanarina, ...updatedClanarina };
      const values = this.clanarinaToRow(updated);

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        range: `Clanarine!A${rowIndex + 2}:C${rowIndex + 2}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [values],
        },
      });

      return updated;
    } catch (error) {
      console.error('Error updating clanarina:', error);
      throw new Error('Failed to update clanarina');
    }
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

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 1,
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