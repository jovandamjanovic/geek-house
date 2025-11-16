import { Clanarina, ClanarinaType, PlacanjeType } from "@/types";
import { DateUtils } from "@/lib/utils";
import { DataTransformer } from "@/lib/persistence/google-spreadsheet/DataTransformer";

export class ClanarinaDataTransformer implements DataTransformer<Clanarina> {
  entityToRow(entity: Clanarina): string[] {
    return [
      entity.id || "",
      entity["Clanski Broj"],
      DateUtils.format(entity["Datum Uplate"]),
      entity.tip,
      entity["Nacin Placanja"],
      entity.napravio,
    ];
  }

  rowToEntity(row: string[]): Clanarina {
    const tip = (ClanarinaType = Object.values(ClanarinaType).includes(
      row[3] as ClanarinaType,
    )
      ? (row[3] as ClanarinaType)
      : ClanarinaType.MESECNA);

    const nacinPlacanja = (PlacanjeType = Object.values(PlacanjeType).includes(
      row[4] as PlacanjeType,
    )
      ? (row[4] as PlacanjeType)
      : PlacanjeType.GOTOVINSKI);

    return {
      id: row[0] || "",
      "Clanski Broj": row[1] || "",
      "Datum Uplate": DateUtils.parse(row[2] || ""),
      tip: tip,
      "Nacin Placanja": nacinPlacanja,
      napravio: row[5] || "",
    };
  }
}
