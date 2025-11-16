import { NextRequest, NextResponse } from "next/server";
import {
  clanarinaService,
  clanService,
} from "@/lib/domain/clan-management/service";
import { ApiResponse, Clanarina, ClanarinaType, PlacanjeType } from "@/types";
import { ClanarinaRequest } from "@/types/request/api_request";
import NotFoundError from "@/lib/exception/NotFoundError";
import InvalidArgumentError from "@/lib/exception/InvalidArgumentError";
import CustomError from "@/lib/exception/CustomError";

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
    const body = (await request.json()) as ClanarinaRequest;

    // Validate required fields
    if (!body["Clanski Broj"]) {
      throw new NotFoundError(`Missing required field: Clanski Broj`);
    }
    if (!body["Datum Uplate"]) {
      throw new NotFoundError(`Missing required field: Datum Uplate`);
    }

    // Validate and parse date
    const datumUplate = new Date(body["Datum Uplate"]);
    if (isNaN(datumUplate.getTime())) {
      throw new InvalidArgumentError("Invalid date format for Datum Uplate");
    }

    // Verify that the clan exists
    const clan = await clanService.getClanByNumber(body["Clanski Broj"]);
    if (!clan) {
      throw new NotFoundError(
        "Clan with specified Clanski Broj does not exist",
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
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status },
      );
    }
    console.error("Error in POST /api/clanarine:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create clanarina" },
      { status: 500 },
    );
  }
}
