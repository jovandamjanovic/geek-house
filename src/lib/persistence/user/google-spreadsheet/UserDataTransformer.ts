import { User } from "@/types";
import { DataTransformer } from "@/lib/persistence/google-spreadsheet/DataTransformer";

export class UserDataTransformer implements DataTransformer<User> {
  entityToRow(entity: User): string[] {
    return [entity.username, entity.password, entity.name, entity.surname];
  }

  rowToEntity(row: string[]): User {
    return {
      username: row[0],
      password: row[1],
      name: row[2] || "",
      surname: row[3] || "",
    };
  }
}
