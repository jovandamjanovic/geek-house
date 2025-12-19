import { Rezervacija } from "@/types";
import { DataTransformer } from "@/lib/persistence/google-spreadsheet/DataTransformer";
import { DateUtils } from "@/lib/utils";

export class RezervacijaDataTransformer
  implements DataTransformer<Rezervacija>
{
  entityToRow(entity: Rezervacija): string[] {
    return [
      entity.id || "",
      DateUtils.format(entity.datum),
      entity.rezervisao.ime,
      entity.rezervisao.kontakt,
    ];
  }

  rowToEntity(row: string[]): Rezervacija {
    return {
      id: row[0],
      datum: DateUtils.parse(row[1] || ""),
      rezervisao: {
        ime: row[2] || "",
        kontakt: row[3] || "",
      },
      stolovi: [],
    } as Rezervacija;
  }
}
