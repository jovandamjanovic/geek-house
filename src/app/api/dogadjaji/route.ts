import { NextResponse } from "next/server";
import { dogadjajService } from "@/lib/domain/dogadjaj/service";
import { ApiResponse, Dogadjaj } from "@/types";

export async function GET(): Promise<NextResponse<ApiResponse<Dogadjaj[]>>> {
  try {
    const dogadjaji = await dogadjajService.getDogadjaji();
    return NextResponse.json({ success: true, data: dogadjaji });
  } catch (error) {
    console.error("Error in GET /api/dogadjaji:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dogadjaji" },
      { status: 500 },
    );
  }
}
