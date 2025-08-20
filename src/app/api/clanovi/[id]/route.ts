import { NextRequest, NextResponse } from 'next/server';
import { clanovi } from '@/lib/services';
import { Clan, ApiResponse, ClanStatus } from '@/types';
import { sanitizeString, validateEmail, validatePhone } from '@/lib/validation';

function validateAndNormalizeStatus(status: unknown): ClanStatus | undefined {
  if (!status) return undefined;
  
  const statusStr = sanitizeString(status).toUpperCase();
  
  // Map common variations to proper enum values
  const statusMapping: Record<string, ClanStatus> = {
    'AKTIVAN': ClanStatus.AKTIVAN,
    'ACTIVE': ClanStatus.AKTIVAN,
    'PASIVAN': ClanStatus.PASIVAN,
    'PASSIVE': ClanStatus.PASIVAN,
    'PROBNI': ClanStatus.PROBNI,
    'TRIAL': ClanStatus.PROBNI,
    'ISTEKAO': ClanStatus.ISTEKAO,
    'EXPIRED': ClanStatus.ISTEKAO,
    'ISKLJUCEN': ClanStatus.ISKLJUCEN,
    'EXCLUDED': ClanStatus.ISKLJUCEN
  };
  
  return statusMapping[statusStr];
}

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Retrieve a clan by its number and return it as a JSON response.
 *
 * Returns 200 with { success: true, data: Clan } when found.
 * Returns 404 with { success: false, error: 'Clan not found' } if no clan exists for the given id.
 * Returns 500 with { success: false, error: 'Failed to fetch clan' } on unexpected errors.
 *
 * @param params - Route params promise resolving to an object with `id` (the clan number to look up).
 * @returns A NextResponse containing an ApiResponse wrapping the found Clan or an error message.
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Clan>>> {
  const { id } = await params;
  try {
    const clan = await clanovi.getClanByNumber(id);
    
    if (!clan) {
      return NextResponse.json(
        { success: false, error: 'Clan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: clan });
  } catch (error) {
    console.error(`Error in GET /api/clanovi/${id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clan' },
      { status: 500 }
    );
  }
}

/**
 * Updates a clan (member) identified by its route `id`.
 *
 * Accepts a JSON body with any updatable fields; performs sanitization and validation:
 * - Protects the special member "P/01" from updates (403).
 * - Validates name length, email and phone formats, normalizes `status` via validateAndNormalizeStatus,
 *   and parses/validates `Datum Rodjenja` (must be a valid date within the last 100 years and not in the future).
 * - Returns 400 for invalid input, 404 if the clan does not exist, and 500 on unexpected errors.
 *
 * @param params - Route parameters; `params.id` is the clan number/identifier to update.
 * @returns A NextResponse containing an ApiResponse<Clan>: on success `{ success: true, data: updatedClan }`,
 *          on error `{ success: false, error: <message> }` with appropriate HTTP status code.
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Clan>>> {
  const { id } = await params;
  try {
    
    // Protect P/01 member from updates
    if (id === 'P/01') {
      return NextResponse.json(
        { success: false, error: 'Cannot update protected member P/01' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Input sanitization
    if (typeof body !== 'object' || body === null) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    // Sanitize and validate input fields
    if (body['Ime i Prezime'] !== undefined) {
      const sanitizedName = sanitizeString(body['Ime i Prezime']);
      if (sanitizedName.length > 0 && sanitizedName.length < 2) {
        return NextResponse.json(
          { success: false, error: 'Name must be at least 2 characters long' },
          { status: 400 }
        );
      }
      body['Ime i Prezime'] = sanitizedName || undefined;
    }
    
    if (body.email !== undefined) {
      const sanitizedEmail = sanitizeString(body.email);
      if (sanitizedEmail && !validateEmail(sanitizedEmail)) {
        return NextResponse.json(
          { success: false, error: 'Invalid email format' },
          { status: 400 }
        );
      }
      body.email = sanitizedEmail || undefined;
    }
    
    if (body.telefon !== undefined) {
      const sanitizedPhone = sanitizeString(body.telefon);
      if (sanitizedPhone && !validatePhone(sanitizedPhone)) {
        return NextResponse.json(
          { success: false, error: 'Invalid phone format' },
          { status: 400 }
        );
      }
      body.telefon = sanitizedPhone || undefined;
    }
    
    if (body.Napomene !== undefined) {
      body.Napomene = sanitizeString(body.Napomene) || undefined;
    }

    // Validate and normalize status if provided
    if (body.status !== undefined) {
      const normalizedStatus = validateAndNormalizeStatus(body.status);
      if (body.status && !normalizedStatus) {
        return NextResponse.json(
          { success: false, error: 'Invalid status value' },
          { status: 400 }
        );
      }
      body.status = normalizedStatus;
    }

    // Validate and parse date if provided
    if (body['Datum Rodjenja']) {
      const datumRodjenja = new Date(body['Datum Rodjenja']);
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
      
      body['Datum Rodjenja'] = datumRodjenja;
    }

    const updatedClan = await clanovi.updateClan(id, body);
    
    if (!updatedClan) {
      return NextResponse.json(
        { success: false, error: 'Clan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedClan });
  } catch (error) {
    console.error(`Error in PUT /api/clanovi/${id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update clan' },
      { status: 500 }
    );
  }
}

/**
 * Deletes a clan/member identified by the route `id` parameter.
 *
 * Attempts to remove the member via the `clanovi` service and returns an HTTP JSON response:
 * - 200 with `{ success: true, data: null }` on successful deletion.
 * - 403 if the protected member `P/01` is requested for deletion.
 * - 404 if no member with the given `id` exists.
 * - 500 on unexpected errors encountered while deleting.
 *
 * The `id` is read from route parameters; this handler never throws—errors are caught and returned as 500 responses.
 *
 * @returns A NextResponse containing an ApiResponse with `data: null` on success or an `error` message on failure.
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<null>>> {
  const { id } = await params;
  try {
    
    // Protect P/01 member from deletion
    if (id === 'P/01') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete protected member P/01' },
        { status: 403 }
      );
    }
    const deleted = await clanovi.deleteClan(id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Clan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error(`Error in DELETE /api/clanovi/${id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete clan' },
      { status: 500 }
    );
  }
}