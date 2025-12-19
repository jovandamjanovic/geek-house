import { SpreadsheetConfig } from "@/lib/persistence/google-spreadsheet/SpreadsheetConfig";
import { Rezervacija } from "@/types";
import { RezervacijaDataTransformer } from "@/lib/persistence/rezervacija/google-spreadsheet/RezervacijaDataTransformer";

export const RezervacijaSpreadsheetConfig: SpreadsheetConfig<Rezervacija> = {
  sheetConfig: {
    sheetName: "Rezervacije",
    range: "Rezervacije!A:D",
    dateColumn: { index: 1, letter: "B" },
  },
  dataTransformer: new RezervacijaDataTransformer(),
  idField: "id",
};
