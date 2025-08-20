import { GoogleAuth } from 'google-auth-library';
import { sheets_v4, google } from 'googleapis';

// Configuration interfaces
export interface SheetConfig {
  sheetName: string;
  range: string;
  dateColumn?: { index: number; letter: string };
}

export interface DataTransformers<TEntity> {
  rowToEntity: (row: string[]) => TEntity;
  entityToRow: (entity: TEntity) => string[];
}

export interface ServiceConfig<TEntity> {
  sheetConfig: SheetConfig;
  dataTransformers: DataTransformers<TEntity>;
  idField: keyof TEntity;
}

// Abstract base CRUD service
export abstract class CrudService<TEntity, TCreate = Omit<TEntity, 'id'>> {
  protected auth: GoogleAuth;
  protected sheets: sheets_v4.Sheets;
  protected spreadsheetId: string;
  protected config: ServiceConfig<TEntity>;
  private sheetIds: Map<string, number> = new Map();

  constructor(spreadsheetId: string, config: ServiceConfig<TEntity>) {
    this.spreadsheetId = spreadsheetId;
    this.config = config;
    this.validateEnvironment();
    this.auth = this.createAuth();
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  // Abstract methods that must be implemented by subclasses
  abstract getAll(): Promise<TEntity[]>;
  abstract getById(id: string): Promise<TEntity | null>;
  abstract create(data: TCreate): Promise<TEntity>;
  abstract update(id: string, updates: Partial<TEntity>): Promise<TEntity | null>;
  abstract delete(id: string): Promise<boolean>;

  // Environment validation
  private validateEnvironment(): void {
    const requiredEnvVars = [
      'GOOGLE_PROJECT_ID',
      'GOOGLE_PRIVATE_KEY_ID', 
      'GOOGLE_PRIVATE_KEY',
      'GOOGLE_CLIENT_EMAIL',
      'GOOGLE_CLIENT_ID'
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
  protected async retryOperation<T>(
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
  protected async getSheetId(sheetName: string): Promise<number> {
    if (this.sheetIds.has(sheetName)) {
      return this.sheetIds.get(sheetName)!;
    }

    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
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

  // Protected helper methods for subclasses
  protected async getAllRows(): Promise<TEntity[]> {
    return this.retryOperation(async () => {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.config.sheetConfig.sheetName}!A2:${this.config.sheetConfig.range.split(':')[1]}`,
      });

      const rows = response.data.values || [];
      return rows.map(this.config.dataTransformers.rowToEntity);
    });
  }

  protected async findRowById(id: string): Promise<{ entity: TEntity; rowIndex: number } | null> {
    return this.retryOperation(async () => {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.config.sheetConfig.sheetName}!A2:${this.config.sheetConfig.range.split(':')[1]}`,
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === id);
      
      if (rowIndex === -1) return null;

      const entity = this.config.dataTransformers.rowToEntity(rows[rowIndex]);
      return { entity, rowIndex };
    });
  }

  protected getNextId(items: TEntity[]): string {
    const maxId = items.reduce((max, item) => {
      const value = item[this.config.idField] as string;
      const num = parseInt(value, 10);
      return num > max ? num : max;
    }, 0);
    
    return this.config.idField === 'Clanski Broj' 
      ? (maxId + 1).toString().padStart(6, '0')
      : (maxId + 1).toString();
  }

  protected async appendRow(entity: TEntity): Promise<void> {
    const values = this.config.dataTransformers.entityToRow(entity);
    
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: this.config.sheetConfig.range,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [values],
      },
    });

    // Update date field with USER_ENTERED if configured
    if (this.config.sheetConfig.dateColumn && values[this.config.sheetConfig.dateColumn.index]) {
      await this.updateDateField(values[this.config.sheetConfig.dateColumn.index]);
    }
  }

  protected async updateRow(rowIndex: number, entity: TEntity): Promise<void> {
    const values = this.config.dataTransformers.entityToRow(entity);
    const actualRowIndex = rowIndex + 2; // +2 because of header row and 0-based vs 1-based indexing

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${this.config.sheetConfig.sheetName}!A${actualRowIndex}:${this.config.sheetConfig.range.split(':')[1]}${actualRowIndex}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [values],
      },
    });
  }

  protected async deleteRow(rowIndex: number): Promise<void> {
    const actualRowIndex = rowIndex + 1; // +1 because of header row
    const sheetId = await this.getSheetId(this.config.sheetConfig.sheetName);

    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.spreadsheetId,
      requestBody: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: sheetId,
              dimension: 'ROWS',
              startIndex: actualRowIndex,
              endIndex: actualRowIndex + 1,
            },
          },
        }],
      },
    });
  }

  private async updateDateField(dateValue: string): Promise<void> {
    if (!this.config.sheetConfig.dateColumn) return;

    const updatedData = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: this.config.sheetConfig.range,
    });
    
    const lastRowIndex = (updatedData.data.values?.length || 1);
    
    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${this.config.sheetConfig.sheetName}!${this.config.sheetConfig.dateColumn.letter}${lastRowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[dateValue]],
      },
    });
  }
}