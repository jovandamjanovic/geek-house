import { DataTransformer } from "@/lib/persistence/google-spreadsheet/DataTransformer";
import { RezervacijaSto } from "@/lib/persistence/rezervacija_sto/google-spreadsheet/types";

export class RezervacijaStoDataTransformer
  implements DataTransformer<RezervacijaSto>
{
  entityToRow(entity: RezervacijaSto): string[] {
    return [entity.sto || "", entity.rezervacija || ""];
  }

  rowToEntity(row: string[]): RezervacijaSto {
    return {
      sto: row[0],
      rezervacija: row[1],
    };
  }
}
