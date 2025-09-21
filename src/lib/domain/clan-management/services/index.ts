import {ClanarinaService} from "@/lib/domain/clan-management/services/ClanarinaService";
import {ClanService} from "@/lib/domain/clan-management/services/ClanService";
import {clanarinaRepository, clanRepository} from "@/lib/domain/clan-management/repository";

export const clanarinaService = new ClanarinaService(clanarinaRepository)
export const clanService = new ClanService(clanRepository)
