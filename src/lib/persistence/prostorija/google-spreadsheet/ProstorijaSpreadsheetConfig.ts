import { SpreadsheetConfig } from "@/lib/persistence/google-spreadsheet/SpreadsheetConfig";
import { Prostorija } from "@/types";
import { ProstorijaDataTransformer } from "@/lib/persistence/prostorija/google-spreadsheet/ProstorijaDataTransformer";

export const ProstorijaSpreadsheetConfig: SpreadsheetConfig<Prostorija> = {
  sheetConfig: {
    sheetName: "Prostorije",
    range: "Prostorije!A:F",
  },
  dataTransformer: new ProstorijaDataTransformer(),
  idField: "id",
};
