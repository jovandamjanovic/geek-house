import {EntityRepository} from "@/lib/domain/clan-management/repository/EntityRepository";
import {Clan} from "@/types";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ClanRepository extends EntityRepository<Clan> {
}