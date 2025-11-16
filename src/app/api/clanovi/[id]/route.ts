import { NextRequest, NextResponse } from "next/server";
import { clanService } from "@/lib/domain/clan-management/service";
import { ApiResponse, Clan, ClanStatus } from "@/types";
import { sanitizeString, validateEmail, validatePhone } from "@/lib/validation";
import { ClanRequest } from "@/types/request/api_request";
import InvalidArgumentError from "@/lib/exception/InvalidArgumentError";

function validateAndNormalizeStatus(status: unknown): ClanStatus | undefined {
  if (!status) return undefined;

  const statusStr = sanitizeString(status).toUpperCase();

  // Map common variations to proper enum values
  const statusMapping: Record<string, ClanStatus> = {
    AKTIVAN: ClanStatus.AKTIVAN,
    ACTIVE: ClanStatus.AKTIVAN,
    PASIVAN: ClanStatus.PASIVAN,
    PASSIVE: ClanStatus.PASIVAN,
    PROBNI: ClanStatus.PROBNI,
    TRIAL: ClanStatus.PROBNI,
    ISTEKAO: ClanStatus.ISTEKAO,
    EXPIRED: ClanStatus.ISTEKAO,
    ISKLJUCEN: ClanStatus.ISKLJUCEN,
    EXCLUDED: ClanStatus.ISKLJUCEN,
  };

  return statusMapping[statusStr];
}

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<ApiResponse<Clan>>> {
  const { id } = await params;
  try {
    const clan = await clanService.getClanByNumber(id);

    if (!clan) {
      return NextResponse.json(
        { success: false, error: "Clan not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: clan });
  } catch (error) {
    console.error(`Error in GET /api/clanovi/${id}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch clan" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<ApiResponse<Clan>>> {
  const { id } = await params;
  try {
    // Protect P/01 member from updates
    if (id === "P/01") {
      return NextResponse.json(
        { success: false, error: "Cannot update protected member P/01" },
        { status: 403 },
      );
    }

    const body = (await request.json()) as ClanRequest | null;
    const apiRequest = foo(body);
    const updatedClan = await clanService.updateClan(id, apiRequest);

    if (!updatedClan) {
      return NextResponse.json(
        { success: false, error: "Clan not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: updatedClan });
  } catch (error) {
    console.error(`Error in PUT /api/clanovi/${id}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to update clan" },
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
    // Protect P/01 member from deletion
    if (id === "P/01") {
      return NextResponse.json(
        { success: false, error: "Cannot delete protected member P/01" },
        { status: 403 },
      );
    }
    await clanService.deleteClan(id);
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error(`Error in DELETE /api/clanovi/${id}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to delete clan" },
      { status: 500 },
    );
  }
}

function foo(body: ClanRequest | null): Partial<Clan> {
  // Input sanitization
  if (typeof body !== "object" || body === null) {
    throw new InvalidArgumentError("Invalid request body");
  }

  const result: Partial<Clan> = {};

  // Sanitize and validate input fields
  if (body["Ime i Prezime"] !== undefined) {
    const sanitizedName = sanitizeString(body["Ime i Prezime"]);
    if (sanitizedName.length > 0 && sanitizedName.length < 2) {
      throw new InvalidArgumentError("Name must be at least 2 characters long");
    }
    result["Ime i Prezime"] = sanitizedName;
  }

  if (body.email !== undefined) {
    const sanitizedEmail = sanitizeString(body.email);
    if (sanitizedEmail && !validateEmail(sanitizedEmail)) {
      throw new InvalidArgumentError("Invalid email format");
    }
    result.email = sanitizedEmail;
  }

  if (body.telefon !== undefined) {
    const sanitizedPhone = sanitizeString(body.telefon);
    if (sanitizedPhone && !validatePhone(sanitizedPhone)) {
      throw new InvalidArgumentError("Invalid phone format");
    }
    result.telefon = sanitizedPhone;
  }

  if (body.Napomene !== undefined) {
    const sanitizedNotes = sanitizeString(body.Napomene) || undefined;
    result.Napomene = sanitizedNotes;
  }

  // Validate and normalize status if provided
  if (body.status !== undefined) {
    const normalizedStatus = validateAndNormalizeStatus(body.status);
    if (body.status && !normalizedStatus) {
      throw new InvalidArgumentError("Invalid status format");
    }
    if (normalizedStatus) {
      result.status = normalizedStatus;
    }
  }

  // Validate and parse date if provided
  if (body["Datum Rodjenja"]) {
    const datumRodjenja = new Date(body["Datum Rodjenja"]);
    if (isNaN(datumRodjenja.getTime())) {
      throw new InvalidArgumentError("Invalid date format for Datum Rodjenja");
    }

    // Additional date validation - must be reasonable birth date
    const now = new Date();
    const oneHundredYearsAgo = new Date(
      now.getFullYear() - 100,
      now.getMonth(),
      now.getDate(),
    );

    if (datumRodjenja < oneHundredYearsAgo || datumRodjenja > now) {
      throw new InvalidArgumentError(
        "Birth date must be within reasonable range",
      );
    }

    // Here we assign to result (which uses Clan's type: Date), not to body
    result["Datum Rodjenja"] = datumRodjenja;
  }

  return result;
}
