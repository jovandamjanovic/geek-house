import {EntityRepository} from "@/lib/persistence/google-spreadsheet/EntityRepository";
import {Clanarina, ClanarinaForCreation} from "@/types";
import {
    ClanarinaRepository as DomainClanarinaRepository
} from "@/lib/domain/clan-management/repository/ClanarinaRepository";
import {ClanarinaSpreadsheetConfig} from "@/lib/persistence/clanarina/google-spreadsheet/ClanarinaSpreadsheetConfig";

export class ClanarinaRepository extends EntityRepository<Clanarina> implements DomainClanarinaRepository {
    constructor(spreadsheetId: string) {
        super(spreadsheetId, ClanarinaSpreadsheetConfig);
    }

    async delete(id: string): Promise<void> {
        try {
            const result = await this.findRowById(id);
            if (!result) return;

            await this.deleteRow(result.rowIndex);
            return;
        } catch (error) {
            console.error(`Error deleting clanarina with id ${id}:`, error);
            throw new Error(`Failed to delete clanarina with id ${id}`);
        }
    }

    async find(id: string): Promise<Clanarina | null> {
        try {
            const result = await this.findRowById(id);
            return result ? result.entity : null;
        } catch (error) {
            console.error(`Error fetching clanarina with id ${id}:`, error);
            throw new Error(`Failed to fetch clanarina with id ${id}`);
        }
    }

    async findAll(): Promise<Clanarina[]> {
        try {
            return await this.getAllRows();
        } catch (error) {
            console.error('Error fetching clanarine:', error);
            throw new Error('Failed to fetch clanarine');
        }
    }

    async save(entity: Clanarina): Promise<Clanarina> {
        if (entity.id !== null) {
            return this.update(entity);
        }
        return this.create(entity);
    }

    private async create(data: ClanarinaForCreation): Promise<Clanarina> {
        const maxRetries = 3;
        let attempt = 0;

        while (attempt < maxRetries) {
            try {
                const existingItems = await this.getAllRows();
                const id = this.getNextId(existingItems);
                const newClanarina: Clanarina = {...data, id};

                await this.appendRow(newClanarina);
                return newClanarina;
            } catch (error) {
                attempt++;
                if (attempt >= maxRetries) {
                    console.error('Error creating clanarina after retries:', error);
                    throw new Error('Failed to create clanarina after multiple attempts');
                }
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
            }
        }

        throw new Error('Failed to create clanarina');
    }

    private async update(entity: Clanarina): Promise<Clanarina> {
        const id = entity.id;
        try {
            if (!id) {
                throw new Error('Cannot update clanarina without an ID');
            }
            const result = await this.findRowById(id);
            if (!result) {
                throw new Error(`Clanarina with id ${id} not found`);
            }
            await this.updateRow(result.rowIndex, entity);

            return entity;
        } catch (error) {
            console.error(`Error updating clanarina with id ${id}:`, error);
            throw new Error(`Failed to update clanarina with id ${id}`);
        }
    }

}