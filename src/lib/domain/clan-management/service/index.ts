import {ClanarinaService} from "@/lib/domain/clan-management/service/ClanarinaService";
import {ClanService} from "@/lib/domain/clan-management/service/ClanService";
import {clanarinaRepository, clanRepository} from "@/lib/domain/clan-management/repository";

export const clanarinaService = new ClanarinaService(clanarinaRepository)
export const clanService = new ClanService(clanRepository)
