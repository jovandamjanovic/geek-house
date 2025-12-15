import { SpreadsheetConfig } from "@/lib/persistence/google-spreadsheet/SpreadsheetConfig";
import { Clan } from "@/types";
import { ClanDataTransformer } from "@/lib/persistence/clan/google-spreadsheet/ClanDataTransformer";

export const ClanSpreadsheetConfig: SpreadsheetConfig<Clan> = {
  sheetConfig: {
    sheetName: "Clanovi",
    range: "Clanovi!A:G",
    dateColumn: { index: 5, letter: "F" },
  },
  dataTransformer: new ClanDataTransformer(),
  idField: "Clanski Broj",
};
