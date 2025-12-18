import { EntityRepository } from "@/lib/domain/clan-management/repository/EntityRepository";
import { Rezervacija } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RezervacijaRepository extends EntityRepository<Rezervacija> {}
