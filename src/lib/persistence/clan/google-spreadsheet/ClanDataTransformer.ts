import { Clan, ClanStatus } from "@/types";
import { DateUtils, FormatUtils } from "@/lib/utils";
import { DataTransformer } from "@/lib/persistence/google-spreadsheet/DataTransformer";

export class ClanDataTransformer implements DataTransformer<Clan> {
  entityToRow(entity: Clan): string[] {
    return [
      FormatUtils.clanskiBroj(entity["Clanski Broj"] ?? ""),
      entity["Ime i Prezime"],
      entity.email || "",
      FormatUtils.phone(entity.telefon || ""),
      entity.status ?? ClanStatus.PROBNI,
      DateUtils.format(entity["Datum Rodjenja"]),
      entity.Napomene || "",
    ];
  }

  rowToEntity(row: string[]): Clan {
    return {
      "Clanski Broj": row[0] || "",
      "Ime i Prezime": row[1] || "",
      email: row[2] || undefined,
      telefon: row[3] || undefined,
      status: (row[4] as ClanStatus) || ClanStatus.PROBNI,
      "Datum Rodjenja": DateUtils.parse(row[5] || ""),
      Napomene: row[6] || undefined,
    };
  }
}
