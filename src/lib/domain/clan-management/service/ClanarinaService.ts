import {ClanarinaRepository} from "@/lib/domain/clan-management/repository/ClanarinaRepository";
import {Clanarina, ClanarinaForCreation} from "@/types";

export class ClanarinaService {
    constructor(
        private clanarinaRepository: ClanarinaRepository) {

    }

    async getClanarine(): Promise<Clanarina[]> {
        return this.clanarinaRepository.findAll();
    }

    async getClanarinaById(id: string): Promise<Clanarina | null> {
        return this.clanarinaRepository.find(id);
    }

    async createClanarina(request: ClanarinaForCreation): Promise<Clanarina> {
        const entity = {id: null, ...request, napravio} as Clanarina;
        return this.clanarinaRepository.save(entity)
    }

    async updateClanarina(id: string, request: Partial<Clanarina>): Promise<Clanarina | null> {
        const entity = await this.clanarinaRepository.find(id);
        if (entity === null) throw new Error('Clanarina not found');
        const updatedEntity = {...entity, ...request} as Clanarina;
        return this.clanarinaRepository.save(updatedEntity);
    }

    async deleteClanarina(id: string): Promise<void> {
        return this.clanarinaRepository.delete(id);
    }
}