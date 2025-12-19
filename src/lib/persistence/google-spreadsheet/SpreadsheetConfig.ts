import { DataTransformer } from "@/lib/persistence/google-spreadsheet/DataTransformer";

export type SpreadsheetConfig<TEntity, TRow = TEntity> = {
  sheetConfig: {
    sheetName: string;
    range: string;
    dateColumn?: { index: number; letter: string };
  };
  dataTransformer: DataTransformer<TEntity, TRow>;
  idField: keyof TEntity;
};
