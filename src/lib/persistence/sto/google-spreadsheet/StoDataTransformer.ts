import { Sto } from "@/types";
import { DataTransformer } from "@/lib/persistence/google-spreadsheet/DataTransformer";
import { StoWithSobaId } from "@/lib/persistence/sto/google-spreadsheet/types";

export class StoDataTransformer implements DataTransformer<Sto> {
  entityToRow(entity: Sto): string[] {
    return [
      entity.id || "",
      entity.opis || "",
      entity.broj_stolica || "",
      entity.soba.id,
    ];
  }

  rowToEntity(row: string[]): StoWithSobaId {
    return {
      id: row[0],
      opis: row[1],
      broj_stolica: Number.parseInt(row[2]),
      soba_id: row[3],
    } as StoWithSobaId;
  }
}
