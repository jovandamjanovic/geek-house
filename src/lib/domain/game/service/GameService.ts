import { GameRepository } from "@/lib/domain/game/repository/GameRepository";
import { Game } from "@/types";

export class GameService {
  constructor(private gameRepository: GameRepository) {}

  async getGames(): Promise<Game[]> {
    return this.gameRepository.findAll();
  }

  async getGame(id: string): Promise<Game | null> {
    return this.gameRepository.find(id);
  }
}
