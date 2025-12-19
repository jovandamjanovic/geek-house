import { google, sheets_v4 } from "googleapis";
import { GoogleAuth } from "google-auth-library";
import { SpreadsheetConfig } from "@/lib/persistence/google-spreadsheet/SpreadsheetConfig";

export abstract class EntityRepository<TEntity, TRow = TEntity> {
  protected auth: GoogleAuth;
  protected sheets: sheets_v4.Sheets;
  protected spreadsheetId: string;
  protected config: SpreadsheetConfig<TEntity, TRow>;
  private sheetIds: Map<string, number> = new Map();

  protected constructor(
    spreadsheetId: string,
    config: SpreadsheetConfig<TEntity, TRow>,
  ) {
    this.spreadsheetId = spreadsheetId;
    this.config = config;
    this.validateEnvironment();
    this.auth = this.createAuth();
    this.sheets = google.sheets({ version: "v4", auth: this.auth });
  }

  // Retry operation with exponential backoff
  protected async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 100,
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
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new Error("Max retries exceeded");
  }

  // Get sheet ID with caching
  protected async getSheetId(sheetName: string): Promise<number> {
    if (this.sheetIds.has(sheetName)) {
      return this.sheetIds.get(sheetName)!;
    }

    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
        fields: "sheets.properties",
      });

      const sheets = response.data.sheets || [];
      for (const sheet of sheets) {
        const properties = sheet.properties;
        if (
          properties?.title &&
          properties?.sheetId !== undefined &&
          properties?.sheetId !== null
        ) {
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
  protected async getAllRows(): Promise<TRow[]> {
    return this.retryOperation(async () => {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.config.sheetConfig.sheetName}!A2:${this.config.sheetConfig.range.split(":")[1]}`,
      });

      const rows = response.data.values || [];
      return rows.map(this.config.dataTransformer.rowToEntity);
    });
  }

  protected async findRowById(
    id: string,
  ): Promise<{ entity: TRow; rowIndex: number } | null> {
    return this.retryOperation(async () => {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.config.sheetConfig.sheetName}!A2:${this.config.sheetConfig.range.split(":")[1]}`,
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex((row) => row[0] === id);

      if (rowIndex === -1) return null;

      const entity = this.config.dataTransformer.rowToEntity(
        rows[rowIndex].map(String),
      );
      return { entity, rowIndex };
    });
  }

  protected getNextId(items: TEntity[]): string {
    if (this.config.idField === "Clanski Broj") {
      // Start from count + 1 and find first available ID
      let candidateId = items.length + 1;
      const existingIds = new Set(
        items.map((item) => parseInt(item[this.config.idField] as string, 10)),
      );

      while (existingIds.has(candidateId)) {
        candidateId++;
      }

      return candidateId.toString().padStart(6, "0");
    }

    // For other ID fields, use max + 1 approach
    const maxId = items.reduce((max, item) => {
      const value = item[this.config.idField] as string;
      const num = parseInt(value, 10);
      return num > max ? num : max;
    }, 0);

    return (maxId + 1).toString();
  }

  protected async appendRow(entity: TEntity): Promise<void> {
    const values = this.config.dataTransformer.entityToRow(entity);

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: this.config.sheetConfig.range,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [values],
      },
    });

    // Update date field with USER_ENTERED if configured
    if (
      this.config.sheetConfig.dateColumn &&
      values[this.config.sheetConfig.dateColumn.index]
    ) {
      await this.updateDateField(
        values[this.config.sheetConfig.dateColumn.index],
      );
    }
  }

  protected async updateRow(rowIndex: number, entity: TEntity): Promise<void> {
    const values = this.config.dataTransformer.entityToRow(entity);
    const actualRowIndex = rowIndex + 2; // +2 because of header row and 0-based vs 1-based indexing

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${this.config.sheetConfig.sheetName}!A${actualRowIndex}:${this.config.sheetConfig.range.split(":")[1]}${actualRowIndex}`,
      valueInputOption: "RAW",
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
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetId,
                dimension: "ROWS",
                startIndex: actualRowIndex,
                endIndex: actualRowIndex + 1,
              },
            },
          },
        ],
      },
    });
  }

  // Environment validation
  private validateEnvironment(): void {
    const requiredEnvVars = [
      "GOOGLE_PROJECT_ID",
      "GOOGLE_PRIVATE_KEY_ID",
      "GOOGLE_PRIVATE_KEY",
      "GOOGLE_CLIENT_EMAIL",
      "GOOGLE_CLIENT_ID",
    ];

    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName],
    );

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(", ")}`,
      );
    }
  }

  // Authentication setup
  private createAuth(): GoogleAuth {
    return new GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: process.env.GOOGLE_PROJECT_ID!,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID!,
        private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
        client_email: process.env.GOOGLE_CLIENT_EMAIL!,
        client_id: process.env.GOOGLE_CLIENT_ID!,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  }

  private async updateDateField(dateValue: string): Promise<void> {
    if (!this.config.sheetConfig.dateColumn) return;

    const updatedData = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: this.config.sheetConfig.range,
    });

    const lastRowIndex = updatedData.data.values?.length || 1;

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${this.config.sheetConfig.sheetName}!${this.config.sheetConfig.dateColumn.letter}${lastRowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[dateValue]],
      },
    });
  }
}
