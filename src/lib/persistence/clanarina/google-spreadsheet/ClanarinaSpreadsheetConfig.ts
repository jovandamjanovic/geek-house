import {SpreadsheetConfig} from "@/lib/persistence/google-spreadsheet/SpreadsheetConfig";
import {Clanarina} from "@/types";
import {ClanarinaDataTransformer} from "@/lib/persistence/clanarina/google-spreadsheet/ClanarinaDataTransformer";

export const ClanarinaSpreadsheetConfig: SpreadsheetConfig<Clanarina> = {
    sheetConfig: {
        sheetName: 'Clanarine',
        range: 'Clanarine!A:F',
        dateColumn: {index: 2, letter: 'C'}
    },
    dataTransformer: new ClanarinaDataTransformer(),
    idField: 'id'
}