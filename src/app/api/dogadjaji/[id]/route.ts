import { NextRequest, NextResponse } from "next/server";
import { dogadjajService } from "@/lib/domain/dogadjaj/service";
import { ApiResponse, Dogadjaj } from "@/types";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<ApiResponse<Dogadjaj>>> {
  const { id } = await params;
  try {
    const dogadjaj = await dogadjajService.getDogadjaj(id);

    if (!dogadjaj) {
      return NextResponse.json(
        { success: false, error: "Dogadjaj not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: dogadjaj });
  } catch (error) {
    console.error(`Error in GET /api/dogadjaji/${id}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dogadjaj" },
      { status: 500 },
    );
  }
}
