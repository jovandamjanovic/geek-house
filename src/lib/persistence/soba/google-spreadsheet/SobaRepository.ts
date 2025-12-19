import { EntityRepository } from "@/lib/persistence/google-spreadsheet/EntityRepository";
import { Soba } from "@/types";
import { SobaRepository as DomainSobaRepository } from "@/lib/domain/rezervacije/repository/SobaRepository";
import { SobaSpreadsheetConfig } from "@/lib/persistence/soba/google-spreadsheet/SobaSpreadsheetConfig";
import { stoRepository } from "@/lib/domain/rezervacije/repository";

export class SobaRepository
  extends EntityRepository<Soba>
  implements DomainSobaRepository
{
  constructor(spreadsheetId: string) {
    super(spreadsheetId, SobaSpreadsheetConfig);
  }

  async find(id: string): Promise<Soba | null> {
    try {
      const result = await this.findRowById(id);
      if (!result) return null;
      return {
        ...result.entity,
        stolovi: await stoRepository.findAllForSoba(result.entity),
      } as Soba;
    } catch (error) {
      console.error(`Error fetching soba with id ${id}:`, error);
      throw new Error(`Failed to fetch soba with id ${id}`);
    }
  }

  async findAll(): Promise<Soba[]> {
    try {
      const result = await this.getAllRows();
      return Promise.all(
        result.map(async (soba) => {
          return {
            ...soba,
            stolovi: await stoRepository.findAllForSoba(soba),
          } as Soba;
        }),
      );
    } catch (error) {
      console.error("Error fetching sobe:", error);
      throw new Error("Failed to fetch sobe");
    }
  }
}
