import { Prostorija } from "@/types";
import { DataTransformer } from "@/lib/persistence/google-spreadsheet/DataTransformer";

const TAGS_SEPARATOR = "|";

export class ProstorijaDataTransformer implements DataTransformer<Prostorija> {
  entityToRow(entity: Prostorija): string[] {
    return [
      entity.id || "",
      entity.name,
      entity.image,
      entity.capacity,
      entity.description,
      entity.tags.join(TAGS_SEPARATOR),
    ];
  }

  rowToEntity(row: string[]): Prostorija {
    return {
      id: row[0],
      name: row[1],
      image: row[2],
      capacity: row[3],
      description: row[4],
      tags: row[5] ? row[5].split(TAGS_SEPARATOR) : [],
    };
  }
}
