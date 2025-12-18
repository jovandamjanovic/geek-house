import { SpreadsheetConfig } from "@/lib/persistence/google-spreadsheet/SpreadsheetConfig";
import { Soba } from "@/types";
import { SobaDataTransformer } from "@/lib/persistence/soba/google-spreadsheet/SobaDataTransformer";

export const SobaSpreadsheetConfig: SpreadsheetConfig<Soba> = {
  sheetConfig: {
    sheetName: "Sobe",
    range: "Sobe!A:C",
  },
  dataTransformer: new SobaDataTransformer(),
  idField: "id",
};
