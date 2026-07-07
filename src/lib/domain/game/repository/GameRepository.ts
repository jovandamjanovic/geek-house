import { EntityRepository } from "@/lib/domain/clan-management/repository/EntityRepository";
import { Game } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GameRepository
  extends Omit<EntityRepository<Game>, "save" | "delete"> {}
