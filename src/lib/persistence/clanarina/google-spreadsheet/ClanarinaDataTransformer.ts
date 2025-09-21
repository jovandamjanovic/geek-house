import {Clanarina} from "@/types";
import {DateUtils} from "@/lib/utils";
import {DataTransformer} from "@/lib/persistence/google-spreadsheet/DataTransformer";

export class ClanarinaDataTransformer implements DataTransformer<Clanarina> {
    entityToRow(entity: Clanarina): string[] {
        return [
            entity.id || '',
            entity['Clanski Broj'],
            DateUtils.format(entity['Datum Uplate']),
        ];
    }

    rowToEntity(row: string[]): Clanarina {
        return {
            id: row[0] || '',
            'Clanski Broj': row[1] || '',
            'Datum Uplate': DateUtils.parse(row[2] || ''),
        }
    }
}