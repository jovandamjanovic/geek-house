import {ClanarinaRepository} from "@/lib/persistence/clanarina/google-spreadsheet/ClanarinaRepository";
import {ClanRepository} from "@/lib/persistence/clan/google-spreadsheet/ClanRepository";

export const clanarinaRepository = new ClanarinaRepository(process.env.GOOGLE_SPREADSHEET_ID!)
export const clanRepository = new ClanRepository(process.env.GOOGLE_SPREADSHEET_ID!)
