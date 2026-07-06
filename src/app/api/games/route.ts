import { NextResponse } from "next/server";
import { gameService } from "@/lib/domain/game/service";
import { ApiResponse, Game } from "@/types";

export async function GET(): Promise<NextResponse<ApiResponse<Game[]>>> {
  try {
    const games = await gameService.getGames();
    return NextResponse.json({ success: true, data: games });
  } catch (error) {
    console.error("Error in GET /api/games:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch games" },
      { status: 500 },
    );
  }
}
