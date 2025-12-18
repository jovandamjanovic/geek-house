import { EntityRepository } from "@/lib/domain/clan-management/repository/EntityRepository";
import { Sto, Soba } from "@/types";

export interface StoRepository
  extends Omit<EntityRepository<Sto>, "save" | "delete"> {
  findAllForSoba(soba: Soba): Promise<Sto[]>;
}
