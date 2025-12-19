import { EntityRepository } from "@/lib/domain/clan-management/repository/EntityRepository";
import { Soba } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SobaRepository
  extends Omit<EntityRepository<Soba>, "save" | "delete"> {}
