import { EntityRepository } from "@/lib/domain/clan-management/repository/EntityRepository";
import { Sto } from "@/types";

export interface StoRepository
  extends Omit<EntityRepository<Sto>, "save" | "delete"> {
  findAllForSoba(Soba: Soba): Promise<Sto[]>;
}
