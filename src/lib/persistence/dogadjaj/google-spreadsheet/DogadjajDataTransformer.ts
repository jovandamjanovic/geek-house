import { Dogadjaj } from "@/types";
import { DataTransformer } from "@/lib/persistence/google-spreadsheet/DataTransformer";

export class DogadjajDataTransformer implements DataTransformer<Dogadjaj> {
  entityToRow(entity: Dogadjaj): string[] {
    return [
      entity.id || "",
      entity.featured ? "TRUE" : "FALSE",
      entity.title,
      entity.description,
      entity.badge,
      entity.badgeClass,
      entity.date,
      entity.day,
      entity.num,
      entity.month,
      entity.year,
      entity.time,
      entity.players,
      entity.location,
      entity.meta,
      entity.actionLabel,
      entity.actionHref,
      entity.signupHref,
    ];
  }

  rowToEntity(row: string[]): Dogadjaj {
    return {
      id: row[0],
      featured: row[1] === "TRUE",
      title: row[2],
      description: row[3],
      badge: row[4],
      badgeClass: row[5],
      date: row[6],
      day: row[7],
      num: row[8],
      month: row[9],
      year: row[10],
      time: row[11],
      players: row[12],
      location: row[13],
      meta: row[14],
      actionLabel: row[15],
      actionHref: row[16],
      signupHref: row[17],
    };
  }
}
