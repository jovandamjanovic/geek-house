import {EntityRepository} from "@/lib/persistence/google-spreadsheet/EntityRepository";
import {Clan, ClanForCreation} from "@/types";
import {ClanSpreadsheetConfig} from "@/lib/persistence/clan/google-spreadsheet/ClanSpreadsheetConfig";
import {ClanRepository as DomainClanRepository} from "@/lib/domain/clan-management/repository/ClanRepository";


export class ClanRepository extends EntityRepository<Clan> implements DomainClanRepository {
    constructor(spreadsheetId: string) {
        super(spreadsheetId, ClanSpreadsheetConfig);
    }

    async delete(id: string): Promise<void> {
        try {
            const result = await this.findRowById(id);
            if (!result) return;

            await this.deleteRow(result.rowIndex);
            return;
        } catch (error) {
            console.error(`Error deleting clan with broj ${id}:`, error);
            throw new Error(`Failed to delete clan with broj ${id}`);
        }
    }

    async find(id: string): Promise<Clan | null> {
        try {
            const result = await this.findRowById(id);
            return result ? result.entity : null;
        } catch (error) {
            console.error(`Error fetching clan with broj ${id}:`, error);
            throw new Error(`Failed to fetch clan with broj ${id}`);
        }
    }

    async findAll(): Promise<Clan[]> {
        try {
            return await this.getAllRows();
        } catch (error) {
            console.error('Error fetching clanovi:', error);
            throw new Error('Failed to fetch clanovi');
        }
    }

    async save(entity: Clan): Promise<Clan> {
        if (entity[`Clanski Broj`] !== null) {
            return this.update(entity);
        }
        return this.create(entity);
    }

    private async create(data: ClanForCreation): Promise<Clan> {
        const maxRetries = 3;
        let attempt = 0;

        while (attempt < maxRetries) {
            try {
                const existingItems = await this.getAllRows();
                const id = this.getNextId(existingItems);
                const newClan: Clan = {...data, 'Clanski Broj': id};

                await this.appendRow(newClan);
                return newClan;
            } catch (error) {
                attempt++;
                if (attempt >= maxRetries) {
                    console.error('Error creating clan after retries:', error);
                    throw new Error('Failed to create clan after multiple attempts');
                }
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
            }
        }

        throw new Error('Failed to create clanarina');
    }

    private async update(entity: Clan): Promise<Clan> {
        let id = entity[`Clanski Broj`];
        try {
            if (!id) {
                throw new Error('Cannot update clan without a clanski broj');
            }
            const result = await this.findRowById(id);
            if (!result) {
                throw new Error(`Clan with broj ${id} not found`);
            }
            await this.updateRow(result.rowIndex, entity);

            return entity;
        } catch (error) {
            console.error(`Error updating clan with broj ${id}:`, error);
            throw new Error(`Failed to update clan with broj ${id}`);
        }
    }

}