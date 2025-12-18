import { SpreadsheetConfig } from "@/lib/persistence/google-spreadsheet/SpreadsheetConfig";
import { Sto } from "@/types";
import { StoDataTransformer } from "@/lib/persistence/sto/google-spreadsheet/StoDataTransformer";

export const StoSpreadsheetConfig: SpreadsheetConfig<Sto> = {
  sheetConfig: {
    sheetName: "Stolovi",
    range: "Stolovi!A:D",
  },
  dataTransformer: new StoDataTransformer(),
  idField: "id",
};
