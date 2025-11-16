import { DataTransformer } from "@/lib/persistence/google-spreadsheet/DataTransformer";

export type SpreadsheetConfig<TEntity> = {
  sheetConfig: {
    sheetName: string;
    range: string;
    dateColumn?: { index: number; letter: string };
  };
  dataTransformer: DataTransformer<TEntity>;
  idField: keyof TEntity;
};
