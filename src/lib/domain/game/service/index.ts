import { GameService } from "@/lib/domain/game/service/GameService";
import { gameRepository } from "@/lib/domain/game/repository";

export const gameService = new GameService(gameRepository);
