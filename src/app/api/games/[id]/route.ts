import { NextRequest, NextResponse } from "next/server";
import { gameService } from "@/lib/domain/game/service";
import { ApiResponse, Game } from "@/types";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<ApiResponse<Game>>> {
  const { id } = await params;
  try {
    const game = await gameService.getGame(id);

    if (!game) {
      return NextResponse.json(
        { success: false, error: "Game not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: game });
  } catch (error) {
    console.error(`Error in GET /api/games/${id}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch game" },
      { status: 500 },
    );
  }
}
