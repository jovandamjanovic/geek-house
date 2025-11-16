import { NextRequest, NextResponse } from "next/server";
import {
  clanarinaService,
  clanService,
} from "@/lib/domain/clan-management/service";
import { ApiResponse, Clanarina, ClanarinaType, PlacanjeType } from "@/types";

export async function GET(): Promise<NextResponse<ApiResponse<Clanarina[]>>> {
  try {
    const clanarineList = await clanarinaService.getClanarine();
    return NextResponse.json({ success: true, data: clanarineList });
  } catch (error) {
    console.error("Error in GET /api/clanarine:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch clanarine" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<Clanarina>>> {
  try {
    const body = (await request.json()) as {
      "Clanski Broj"?: string | null;
      "Datum Uplate"?: string | null;
    } | null;

    // Validate required fields
    const requiredFields = ["Clanski Broj", "Datum Uplate"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Validate and parse date
    const datumUplate = new Date(body["Datum Uplate"]);
    if (isNaN(datumUplate.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid date format for Datum Uplate" },
        { status: 400 },
      );
    }

    // Verify that the clan exists
    const clan = await clanService.getClanByNumber(body["Clanski Broj"]);
    if (!clan) {
      return NextResponse.json(
        {
          success: false,
          error: "Clan with specified Clanski Broj does not exist",
        },
        { status: 400 },
      );
    }
    const loggedInUser = request.cookies.get("logged_in_user");
    const napravio = loggedInUser ? loggedInUser.value : "admin";
    const newClanarinaData: Omit<Clanarina, "id"> = {
      "Clanski Broj": body["Clanski Broj"],
      "Datum Uplate": datumUplate,
      tip: ClanarinaType.MESECNA, //ToDo @Nikola @Jovan Update this to be dynamic
      "Nacin Placanja":
        napravio === "admin" ? PlacanjeType.RACUN : PlacanjeType.GOTOVINSKI,
      napravio: napravio,
    };

    const newClanarina =
      await clanarinaService.createClanarina(newClanarinaData);
    return NextResponse.json(
      { success: true, data: newClanarina },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in POST /api/clanarine:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create clanarina" },
      { status: 500 },
    );
  }
}
