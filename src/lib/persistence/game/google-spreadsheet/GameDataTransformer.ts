import { Game } from "@/types";
import { DataTransformer } from "@/lib/persistence/google-spreadsheet/DataTransformer";

const TAGS_SEPARATOR = "|";

export class GameDataTransformer implements DataTransformer<Game> {
  entityToRow(entity: Game): string[] {
    return [
      entity.id || "",
      entity.title,
      entity.displayTitle,
      entity.meta,
      entity.description,
      entity.category,
      entity.tags.join(TAGS_SEPARATOR),
      entity.bggLink || "",
      entity.youtube || "",
    ];
  }

  rowToEntity(row: string[]): Game {
    return {
      id: row[0],
      title: row[1],
      displayTitle: row[2],
      meta: row[3],
      description: row[4],
      category: row[5],
      tags: row[6] ? row[6].split(TAGS_SEPARATOR) : [],
      bggLink: row[7] || undefined,
      youtube: row[8] || undefined,
    };
  }
}
