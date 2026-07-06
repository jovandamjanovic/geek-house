import { EntityRepository } from "@/lib/domain/clan-management/repository/EntityRepository";
import { Prostorija } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ProstorijaRepository
  extends Omit<EntityRepository<Prostorija>, "save" | "delete"> {}
