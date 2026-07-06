import { EntityRepository } from "@/lib/persistence/google-spreadsheet/EntityRepository";
import { Prostorija } from "@/types";
import { ProstorijaRepository as DomainProstorijaRepository } from "@/lib/domain/sadrzaj/repository/ProstorijaRepository";
import { ProstorijaSpreadsheetConfig } from "@/lib/persistence/prostorija/google-spreadsheet/ProstorijaSpreadsheetConfig";

export class ProstorijaRepository
  extends EntityRepository<Prostorija>
  implements DomainProstorijaRepository
{
  constructor(spreadsheetId: string) {
    super(spreadsheetId, ProstorijaSpreadsheetConfig);
  }

  async find(id: string): Promise<Prostorija | null> {
    try {
      const result = await this.findRowById(id);
      return result ? result.entity : null;
    } catch (error) {
      console.error(`Error fetching prostorija with id ${id}:`, error);
      throw new Error(`Failed to fetch prostorija with id ${id}`);
    }
  }

  async findAll(): Promise<Prostorija[]> {
    try {
      return await this.getAllRows();
    } catch (error) {
      console.error("Error fetching prostorije:", error);
      throw new Error("Failed to fetch prostorije");
    }
  }
}
