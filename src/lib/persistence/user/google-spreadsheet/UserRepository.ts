import {EntityRepository} from "@/lib/persistence/google-spreadsheet/EntityRepository";
import {User} from "@/types";
import {UserRepository as DomainUserRepository} from "@/lib/domain/user-management/repository/UserRepository";
import {UserSpreadsheetConfig} from "@/lib/persistence/user/google-spreadsheet/UserSpreadsheetConfig";


export class UserRepository extends EntityRepository<User> implements DomainUserRepository {
    constructor(spreadsheetId: string) {
        super(spreadsheetId, UserSpreadsheetConfig);
    }

    async find(id: string): Promise<User | null> {
        try {
            const result = await this.findRowById(id);
            return result ? result.entity : null;
        } catch (error) {
            console.error(`Error fetching user with username ${id}:`, error);
            throw new Error(`Failed to fetch user with username ${id}`);
        }
    }

    async findAll(): Promise<User[]> {
        try {
            return await this.getAllRows();
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Failed to fetch users');
        }
    }


}