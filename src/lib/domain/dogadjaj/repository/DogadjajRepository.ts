import { EntityRepository } from "@/lib/domain/clan-management/repository/EntityRepository";
import { Dogadjaj } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DogadjajRepository
  extends Omit<EntityRepository<Dogadjaj>, "save" | "delete"> {}
