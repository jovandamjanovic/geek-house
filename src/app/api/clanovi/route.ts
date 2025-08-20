import { NextRequest, NextResponse } from 'next/server';
import { clanovi } from '@/lib/services';
import { Clan, ApiResponse, ClanForCreation } from '@/types';
import { sanitizeString, validateEmail, validatePhone, validateAndNormalizeStatus } from '@/lib/validation';

/**
 * Retrieve all clanovi and return them as a JSON API response.
 *
 * @returns A NextResponse wrapping an ApiResponse:
 * - On success: `{ success: true, data: Clan[] }`.
 * - On failure: `{ success: false, error: string }` with HTTP status 500.
 */
export async function GET(): Promise<NextResponse<ApiResponse<Clan[]>>> {
  try {
    const clanoviList = await clanovi.getClanovi();
    return NextResponse.json({ success: true, data: clanoviList });
  } catch (error) {
    console.error('Error in GET /api/clanovi:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clanovi' },
      { status: 500 }
    );
  }
}

/**
 * Create a new clan from a JSON request body.
 *
 * Expects a JSON body containing at least the required field "Ime i Prezime".
 * Performs sanitization and validation for name, email, phone, status and optional
 * "Datum Rodjenja" (birth date). If validation passes, delegates creation to the
 * clanovi service and returns the created Clan.
 *
 * Validation and responses:
 * - 201: success, returns { success: true, data: Clan } with the created clan.
 * - 400: bad request for invalid/missing fields, invalid email/phone, invalid date,
 *        or birth date outside a reasonable range (older than 100 years or in the future).
 * - 500: server error when creation fails.
 *
 * @param request - NextRequest whose JSON body should include:
 *   - "Ime i Prezime" (required string)
 *   - email (optional string, validated)
 *   - telefon (optional string, validated)
 *   - status (optional, normalized via validateAndNormalizeStatus)
 *   - "Datum Rodjenja" (optional date string, parsed and range-checked)
 *   - Napomene (optional string)
 * @returns NextResponse containing an ApiResponse with the created Clan on success or an error message.
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Clan>>> {
  try {
    const body = await request.json();
    
    // Input sanitization
    if (typeof body !== 'object' || body === null) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    const requiredFields = ['Ime i Prezime'];
    for (const field of requiredFields) {
      if (!body[field] || sanitizeString(body[field]).length === 0) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Sanitize and validate input fields
    const sanitizedName = sanitizeString(body['Ime i Prezime']);
    if (sanitizedName.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name must be at least 2 characters long' },
        { status: 400 }
      );
    }
    
    const sanitizedEmail = sanitizeString(body.email);
    if (sanitizedEmail && !validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    const sanitizedPhone = sanitizeString(body.telefon);
    if (sanitizedPhone && !validatePhone(sanitizedPhone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone format' },
        { status: 400 }
      );
    }

    // Validate and normalize status with default handling
    const normalizedStatus = validateAndNormalizeStatus(body.status);

    let datumRodjenja: Date | undefined;

    // Validate and parse date
    if(body['Datum Rodjenja']) {
      datumRodjenja = new Date(body['Datum Rodjenja']);
      if (isNaN(datumRodjenja.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid date format for Datum Rodjenja' },
          { status: 400 }
        );
      }
      
      // Additional date validation - must be reasonable birth date
      const now = new Date();
      const oneHundredYearsAgo = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
      
      if (datumRodjenja < oneHundredYearsAgo || datumRodjenja > now) {
        return NextResponse.json(
          { success: false, error: 'Birth date must be within reasonable range' },
          { status: 400 }
        );
      }
    }

    const newClanData: ClanForCreation = {
      'Ime i Prezime': sanitizedName,
      email: sanitizedEmail || undefined,
      telefon: sanitizedPhone || undefined,
      status: normalizedStatus,
      'Datum Rodjenja': datumRodjenja,
      Napomene: sanitizeString(body.Napomene) || undefined,
    };

    const newClan = await clanovi.createClan(newClanData);
    return NextResponse.json({ success: true, data: newClan }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/clanovi:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create clan' },
      { status: 500 }
    );
  }
}