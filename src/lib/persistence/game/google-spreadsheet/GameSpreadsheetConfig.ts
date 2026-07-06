import { SpreadsheetConfig } from "@/lib/persistence/google-spreadsheet/SpreadsheetConfig";
import { Game } from "@/types";
import { GameDataTransformer } from "@/lib/persistence/game/google-spreadsheet/GameDataTransformer";

export const GameSpreadsheetConfig: SpreadsheetConfig<Game> = {
  sheetConfig: {
    sheetName: "Igre",
    range: "Igre!A:G",
  },
  dataTransformer: new GameDataTransformer(),
  idField: "id",
};
