import { BlogPost } from "@/types";
import { DataTransformer } from "@/lib/persistence/google-spreadsheet/DataTransformer";

const PARAGRAPH_SEPARATOR = "|||";

export class BlogPostDataTransformer implements DataTransformer<BlogPost> {
  entityToRow(entity: BlogPost): string[] {
    return [
      entity.id || "",
      entity.image,
      entity.imageAlt,
      entity.meta,
      entity.title,
      entity.paragraphs.join(PARAGRAPH_SEPARATOR),
      entity.list.length > 0 ? JSON.stringify(entity.list) : "",
    ];
  }

  rowToEntity(row: string[]): BlogPost {
    return {
      id: row[0],
      image: row[1],
      imageAlt: row[2],
      meta: row[3],
      title: row[4],
      paragraphs: row[5] ? row[5].split(PARAGRAPH_SEPARATOR) : [],
      list: row[6] ? (JSON.parse(row[6]) as BlogPost["list"]) : [],
    };
  }
}
