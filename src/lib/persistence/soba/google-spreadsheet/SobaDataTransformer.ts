import { Soba, SobaName } from "@/types";
import { DataTransformer } from "@/lib/persistence/google-spreadsheet/DataTransformer";

export class SobaDataTransformer implements DataTransformer<Soba> {
  entityToRow(entity: Soba): string[] {
    return [entity.id || "", String(entity.naziv) || "", entity.sprat];
  }

  rowToEntity(row: string[]): Soba {
    return {
      id: row[0],
      naziv: row[1] as SobaName,
      sprat: Number.parseInt(row[2]),
      stolovi: [],
    } as Soba;
  }
}
