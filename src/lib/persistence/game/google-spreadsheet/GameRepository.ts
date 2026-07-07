import { EntityRepository } from "@/lib/persistence/google-spreadsheet/EntityRepository";
import { Game } from "@/types";
import { GameRepository as DomainGameRepository } from "@/lib/domain/game/repository/GameRepository";
import { GameSpreadsheetConfig } from "@/lib/persistence/game/google-spreadsheet/GameSpreadsheetConfig";

export class GameRepository
  extends EntityRepository<Game>
  implements DomainGameRepository
{
  constructor(spreadsheetId: string) {
    super(spreadsheetId, GameSpreadsheetConfig);
  }

  async find(id: string): Promise<Game | null> {
    try {
      const result = await this.findRowById(id);
      return result ? result.entity : null;
    } catch (error) {
      console.error(`Error fetching game with id ${id}:`, error);
      throw new Error(`Failed to fetch game with id ${id}`);
    }
  }

  async findAll(): Promise<Game[]> {
    try {
      return await this.getAllRows();
    } catch (error) {
      console.error("Error fetching games:", error);
      throw new Error("Failed to fetch games");
    }
  }
}
