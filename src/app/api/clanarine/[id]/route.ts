import { NextRequest, NextResponse } from 'next/server';
import { clanarine, clanovi } from '@/lib/services';
import { Clanarina, ApiResponse } from '@/types';
import { sanitizeString, validateClanskiBroj, validateId } from '@/lib/validation';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Retrieve a clanarina (membership fee) by its route `id`.
 *
 * Validates and sanitizes the `id` route parameter, returns 400 if the id is invalid,
 * fetches the clanarina from the service, returns 404 if not found, and 200 with the
 * clanarina on success. On unexpected errors returns a 500 response.
 *
 * @param params - Route params object; must contain `id` (the clanarina identifier)
 * @returns A NextResponse wrapping ApiResponse<Clanarina>. Possible responses:
 * - 200: { success: true, data: Clanarina }
 * - 400: { success: false, error: string } for invalid id
 * - 404: { success: false, error: string } when not found
 * - 500: { success: false, error: string } on server error
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Clanarina>>> {
  try {
    const { id } = await params;
    
    // Validate and sanitize ID
    const sanitizedId = sanitizeString(id);
    if (!validateId(sanitizedId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    // const clanarina = await googleSheetsService.getClanarinaById(sanitizedId);
    const clanarina = await clanarine.getById(sanitizedId);
    
    if (!clanarina) {
      return NextResponse.json(
        { success: false, error: 'Clanarina not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: clanarina });
  } catch (error) {
    console.error(`Error in GET /api/clanarine/${(await params).id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clanarina' },
      { status: 500 }
    );
  }
}

/**
 * Updates an existing clanarina (membership fee) by ID.
 *
 * Validates and sanitizes the route `id`, optional "Clanski Broj" (sanitized and checked that the member exists),
 * and optional "Datum Uplate" (must parse to a valid Date and be within one year of the current date).
 * Responds with 400 for validation errors, 404 if the clanarina was not found, and 500 for unexpected server errors.
 *
 * @returns A NextResponse containing an ApiResponse<Clanarina>:
 * - On success: { success: true, data: updated Clanarina }
 * - On failure: { success: false, error: string } with an appropriate HTTP status
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Clanarina>>> {
    const { id } = await params;
  try {
    // Validate and sanitize ID
    const sanitizedId = sanitizeString(id);
    if (!validateId(sanitizedId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
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
    
    // Sanitize and validate Clanski Broj if provided
    if (body['Clanski Broj']) {
      const sanitizedClanskiBroj = sanitizeString(body['Clanski Broj']);
      if (!validateClanskiBroj(sanitizedClanskiBroj)) {
        return NextResponse.json(
          { success: false, error: 'Invalid Clanski Broj format' },
          { status: 400 }
        );
      }
      body['Clanski Broj'] = sanitizedClanskiBroj;
      
      // Verify that the clan exists
      // const clan = await googleSheetsService.getClanByNumber(sanitizedClanskiBroj);
      const clan = await clanovi.getClanByNumber(sanitizedClanskiBroj);
      if (!clan) {
        return NextResponse.json(
          { success: false, error: 'Clan with specified Clanski Broj does not exist' },
          { status: 400 }
        );
      }
    }
    
    // Validate and parse date if provided
    if (body['Datum Uplate']) {
      const datumUplate = new Date(body['Datum Uplate']);
      if (isNaN(datumUplate.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid date format for Datum Uplate' },
          { status: 400 }
        );
      }
      
      // Additional date validation - not too far in past or future
      const now = new Date();
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
      
      if (datumUplate < oneYearAgo || datumUplate > oneYearFromNow) {
        return NextResponse.json(
          { success: false, error: 'Date must be within one year of current date' },
          { status: 400 }
        );
      }
      
      body['Datum Uplate'] = datumUplate;
    }

    // const updatedClanarina = await googleSheetsService.updateClanarina(sanitizedId, body);
    const updatedClanarina = await clanarine.updateClanarina(sanitizedId, body);
    
    if (!updatedClanarina) {
      return NextResponse.json(
        { success: false, error: 'Clanarina not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedClanarina });
  } catch (error) {
    console.error(`Error in PUT /api/clanarine/${id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update clanarina' },
      { status: 500 }
    );
  }
}

/**
 * Delete a clanarina (membership fee) by its ID.
 *
 * Deletes the clanarina resource identified by the `id` route parameter.
 * Validates and sanitizes the `id` before attempting deletion.
 *
 * Possible responses:
 * - 200: { success: true, data: null } — deletion succeeded.
 * - 400: { success: false, error } — invalid ID format.
 * - 404: { success: false, error } — clanarina not found.
 * - 500: { success: false, error } — server error while attempting deletion.
 *
 * @returns A NextResponse wrapping an ApiResponse with `data` set to `null` on success.
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<null>>> {
  const { id } = await params;
  try {
    // Validate and sanitize ID
    const sanitizedId = sanitizeString(id);
    if (!validateId(sanitizedId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    // const deleted = await googleSheetsService.deleteClanarina(sanitizedId);
    const deleted = await clanarine.deleteClanarina(sanitizedId);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Clanarina not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error(`Error in DELETE /api/clanarine/${id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete clanarina' },
      { status: 500 }
    );
  }
}