import { autori } from "@/lib/services";
import { ApiResponse, Author } from "@/types";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse<ApiResponse<Author[]>>> {
  try {
    const autoriList = await autori.getAuthors();
    return NextResponse.json({ success: true, data: autoriList });
  } catch (error) {
    console.error('Error in GET /api/authors:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch authors' },
      { status: 500 }
    );
  }
}