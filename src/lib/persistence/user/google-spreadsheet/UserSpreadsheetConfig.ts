import { SpreadsheetConfig } from "@/lib/persistence/google-spreadsheet/SpreadsheetConfig";
import { User } from "@/types";
import { UserDataTransformer } from "@/lib/persistence/user/google-spreadsheet/UserDataTransformer";

export const UserSpreadsheetConfig: SpreadsheetConfig<User> = {
  sheetConfig: {
    sheetName: "Korisnici",
    range: "Korisnici!A:D",
  },
  dataTransformer: new UserDataTransformer(),
  idField: "username",
};
