import { SpreadsheetConfig } from "@/lib/persistence/google-spreadsheet/SpreadsheetConfig";
import { RezervacijaSto } from "@/lib/persistence/rezervacija_sto/google-spreadsheet/types";
import { RezervacijaStoDataTransformer } from "@/lib/persistence/rezervacija_sto/google-spreadsheet/RezervacijaStoDataTransformer";

export const RezervacijaStoSpreadsheetConfig: SpreadsheetConfig<RezervacijaSto> =
  {
    sheetConfig: {
      sheetName: "RezervacijeStolovi",
      range: "RezervacijeStolovi!A:B",
    },
    dataTransformer: new RezervacijaStoDataTransformer(),
    idField: "rezervacija",
  };
