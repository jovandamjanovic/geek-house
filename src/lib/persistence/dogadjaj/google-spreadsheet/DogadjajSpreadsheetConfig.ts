import { SpreadsheetConfig } from "@/lib/persistence/google-spreadsheet/SpreadsheetConfig";
import { Dogadjaj } from "@/types";
import { DogadjajDataTransformer } from "@/lib/persistence/dogadjaj/google-spreadsheet/DogadjajDataTransformer";

export const DogadjajSpreadsheetConfig: SpreadsheetConfig<Dogadjaj> = {
  sheetConfig: {
    sheetName: "Dogadjaji",
    range: "Dogadjaji!A:R",
  },
  dataTransformer: new DogadjajDataTransformer(),
  idField: "id",
};
