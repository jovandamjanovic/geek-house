import { GameRepository } from "@/lib/persistence/game/google-spreadsheet/GameRepository";

export const gameRepository = new GameRepository(
  process.env.GOOGLE_SPREADSHEET_ID!,
);
