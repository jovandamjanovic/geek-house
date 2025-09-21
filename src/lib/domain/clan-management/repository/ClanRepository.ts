import {EntityRepository} from "@/lib/domain/clan-management/repository/EntityRepository";
import {Clan} from "@/types";

//@ts-ignore
export interface ClanRepository extends EntityRepository<Clan> {
}