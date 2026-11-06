import { NextRequest, NextResponse } from "next/server";
import { prostorijaService } from "@/lib/domain/prostorija/service";
import { ApiResponse, Prostorija } from "@/types";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<ApiResponse<Prostorija>>> {
  const { id } = await params;
  try {
    const prostorija = await prostorijaService.getProstorija(id);

    if (!prostorija) {
      return NextResponse.json(
        { success: false, error: "Prostorija not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: prostorija });
  } catch (error) {
    console.error(`Error in GET /api/prostorije/${id}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch prostorija" },
      { status: 500 },
    );
  }
}
