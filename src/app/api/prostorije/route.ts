import { NextResponse } from "next/server";
import { prostorijaService } from "@/lib/domain/prostorija/service";
import { ApiResponse, Prostorija } from "@/types";

export async function GET(): Promise<NextResponse<ApiResponse<Prostorija[]>>> {
  try {
    const prostorije = await prostorijaService.getProstorije();
    return NextResponse.json({ success: true, data: prostorije });
  } catch (error) {
    console.error("Error in GET /api/prostorije:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch prostorije" },
      { status: 500 },
    );
  }
}
