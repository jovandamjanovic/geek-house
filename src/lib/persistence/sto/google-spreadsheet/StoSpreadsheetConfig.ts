import { SpreadsheetConfig } from "@/lib/persistence/google-spreadsheet/SpreadsheetConfig";
import { Sto } from "@/types";
import { StoDataTransformer } from "@/lib/persistence/sto/google-spreadsheet/StoDataTransformer";
import { StoWithSobaId } from "@/lib/persistence/sto/google-spreadsheet/types";

export const StoSpreadsheetConfig: SpreadsheetConfig<Sto, StoWithSobaId> = {
  sheetConfig: {
    sheetName: "Stolovi",
    range: "Stolovi!A:D",
  },
  dataTransformer: new StoDataTransformer(),
  idField: "id",
};
