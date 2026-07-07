import { EntityRepository } from "@/lib/persistence/google-spreadsheet/EntityRepository";
import { Dogadjaj } from "@/types";
import { DogadjajRepository as DomainDogadjajRepository } from "@/lib/domain/dogadjaj/repository/DogadjajRepository";
import { DogadjajSpreadsheetConfig } from "@/lib/persistence/dogadjaj/google-spreadsheet/DogadjajSpreadsheetConfig";

export class DogadjajRepository
  extends EntityRepository<Dogadjaj>
  implements DomainDogadjajRepository
{
  constructor(spreadsheetId: string) {
    super(spreadsheetId, DogadjajSpreadsheetConfig);
  }

  async find(id: string): Promise<Dogadjaj | null> {
    try {
      const result = await this.findRowById(id);
      return result ? result.entity : null;
    } catch (error) {
      console.error(`Error fetching dogadjaj with id ${id}:`, error);
      throw new Error(`Failed to fetch dogadjaj with id ${id}`);
    }
  }

  async findAll(): Promise<Dogadjaj[]> {
    try {
      return await this.getAllRows();
    } catch (error) {
      console.error("Error fetching dogadjaji:", error);
      throw new Error("Failed to fetch dogadjaji");
    }
  }
}
