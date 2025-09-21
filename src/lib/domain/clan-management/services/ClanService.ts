import {ClanRepository} from "@/lib/domain/clan-management/repository/ClanRepository";
import {Clan, ClanForCreation} from "@/types";

export class ClanService {
    constructor(
        private clanRepository: ClanRepository) {
    }

    async getClanovi(): Promise<Clan[]> {
        return this.clanRepository.findAll();
    }

    async getClanByNumber(id: string): Promise<Clan | null> {
        return this.clanRepository.find(id);
    }

    async createClan(request: ClanForCreation): Promise<Clan> {
        const entity = {'Clanski Broj': null, ...request} as Clan;
        return this.clanRepository.save(entity)
    }

    async updateClan(id: string, request: Partial<Clan>): Promise<Clan | null> {
        const entity = await this.clanRepository.find(id);
        if (entity === null) throw new Error('Clan not found');
        const updatedEntity = {...entity, ...request} as Clan;
        return this.clanRepository.save(updatedEntity);
    }

    async deleteClan(id: string): Promise<void> {
        return this.clanRepository.delete(id);
    }
}