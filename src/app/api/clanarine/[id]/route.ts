import { NextRequest, NextResponse } from "next/server";
import {
  clanarinaService,
  clanService,
} from "@/lib/domain/clan-management/service";
import { ApiResponse, Clanarina } from "@/types";
import {
  sanitizeString,
  validateClanskiBroj,
  validateId,
} from "@/lib/validation";
import { ClanarinaRequest } from "@/types/request/api_request";
import NotFoundError from "@/lib/exception/NotFoundError";
import InvalidArgumentError from "@/lib/exception/InvalidArgumentError";
import CustomError from "@/lib/exception/CustomError";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<ApiResponse<Clanarina>>> {
  try {
    const { id } = await params;

    // Validate and sanitize ID
    const sanitizedId = sanitizeString(id);
    if (!validateId(sanitizedId)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 },
      );
    }

    // const clanarina = await googleSheetsService.getClanarinaById(sanitizedId);
    const clanarina = await clanarinaService.getClanarinaById(sanitizedId);

    if (!clanarina) {
      return NextResponse.json(
        { success: false, error: "Clanarina not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: clanarina });
  } catch (error) {
    console.error(`Error in GET /api/clanarine/${(await params).id}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch clanarina" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<ApiResponse<Clanarina>>> {
  const { id } = await params;
  try {
    // Validate and sanitize ID
    const sanitizedId = sanitizeString(id);
    if (!validateId(sanitizedId)) {
      throw new InvalidArgumentError("Invalid ID format");
    }

    const body = (await request.json()) as ClanarinaRequest | null;

    request = foo(body);

    // const updatedClanarina = await googleSheetsService.updateClanarina(sanitizedId, body);
    const updatedClanarina = await clanarinaService.updateClanarina(
      sanitizedId,
      request,
    );

    if (!updatedClanarina) {
      throw new NotFoundError("Clanarina not found");
    }

    return NextResponse.json({ success: true, data: updatedClanarina });
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: error.status,
        },
      );
    }
    console.error(`Error in PUT /api/clanarine/${id}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to update clanarina" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<ApiResponse<null>>> {
  const { id } = await params;
  try {
    // Validate and sanitize ID
    const sanitizedId = sanitizeString(id);
    if (!validateId(sanitizedId)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 },
      );
    }

    // const deleted = await googleSheetsService.deleteClanarina(sanitizedId);
    await clanarinaService.deleteClanarina(sanitizedId);

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error(`Error in DELETE /api/clanarine/${id}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to delete clanarina" },
      { status: 500 },
    );
  }
}

function foo(body: ClanarinaRequest | null): Partial<Clanarina> {
  // Input sanitization
  if (typeof body !== "object" || body === null) {
    throw new InvalidArgumentError("Invalid request body");
  }

  let clanskiBroj: string = undefined;
  let datumUplate: Date = undefined;
  // Sanitize and validate Clanski Broj if provided
  if (body["Clanski Broj"]) {
    const sanitizedClanskiBroj = sanitizeString(body["Clanski Broj"]);
    if (!validateClanskiBroj(sanitizedClanskiBroj)) {
      throw new InvalidArgumentError("Invalid Clanski Broj format");
    }
    clanskiBroj = sanitizedClanskiBroj;

    // Verify that the clan exists
    // const clan = await googleSheetsService.getClanByNumber(sanitizedClanskiBroj);
    const clan = await clanService.getClanByNumber(sanitizedClanskiBroj);
    if (!clan) {
      throw new NotFoundError(
        "Clan with specified Clanski Broj does not exist",
      );
    }
  }

  // Validate and parse date if provided
  if (body["Datum Uplate"]) {
    datumUplate = new Date(body["Datum Uplate"]);
    if (isNaN(datumUplate.getTime())) {
      throw new InvalidArgumentError("Invalid date format for Datum Uplate");
    }

    // Additional date validation - not too far in past or future
    const now = new Date();
    const oneYearAgo = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDate(),
    );
    const oneYearFromNow = new Date(
      now.getFullYear() + 1,
      now.getMonth(),
      now.getDate(),
    );

    if (datumUplate < oneYearAgo || datumUplate > oneYearFromNow) {
      throw new InvalidArgumentError(
        "Date must be within one year of current date",
      );
    }
  }
  return {
    "Clanski Broj": clanskiBroj,
    "Datum Uplate": datumUplate,
  } as Partial<Clanarina>;
}
