import { NextRequest, NextResponse } from 'next/server';
import { clanarine, clanovi } from '@/lib/services';
import { Clanarina, ApiResponse } from '@/types';

/**
 * Handles GET requests to fetch all clanarine.
 *
 * Returns a JSON NextResponse with `{ success: true, data: Clanarina[] }` on success.
 * On failure returns a 500 response with `{ success: false, error: 'Failed to fetch clanarine' }`.
 *
 * @returns A NextResponse containing an ApiResponse with the list of clanarine or an error message.
 */
export async function GET(): Promise<NextResponse<ApiResponse<Clanarina[]>>> {
  try {
    const clanarineList = await clanarine.getClanarine();
    return NextResponse.json({ success: true, data: clanarineList });
  } catch (error) {
    console.error('Error in GET /api/clanarine:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clanarine' },
      { status: 500 }
    );
  }
}

/**
 * Create a new clanarina (membership payment) from the incoming JSON request.
 *
 * Expects a JSON body containing the fields `Clanski Broj` and `Datum Uplate`.
 * - Validates presence of both fields and that `Datum Uplate` parses to a valid date.
 * - Verifies the member exists via the `clanovi` service.
 * - Creates the clanarina via the `clanarine` service and returns the created record.
 *
 * On validation failures the route returns 400 with a descriptive error message:
 * - Missing required field: `<field>`
 * - Invalid date format for `Datum Uplate`
 * - Clan with specified `Clanski Broj` does not exist
 *
 * On success returns 201 with the created `Clanarina`. On unexpected errors returns 500.
 *
 * @returns A NextResponse wrapping an ApiResponse containing the created Clanarina on success,
 *          or an error message and appropriate HTTP status on failure.
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Clanarina>>> {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['Clanski Broj', 'Datum Uplate'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate and parse date
    const datumUplate = new Date(body['Datum Uplate']);
    if (isNaN(datumUplate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format for Datum Uplate' },
        { status: 400 }
      );
    }

    // Verify that the clan exists
    const clan = await clanovi.getClanByNumber(body['Clanski Broj']);
    if (!clan) {
      return NextResponse.json(
        { success: false, error: 'Clan with specified Clanski Broj does not exist' },
        { status: 400 }
      );
    }

    const newClanarinaData: Omit<Clanarina, 'id'> = {
      'Clanski Broj': body['Clanski Broj'],
      'Datum Uplate': datumUplate,
    };

    const newClanarina = await clanarine.createClanarina(newClanarinaData);
    return NextResponse.json({ success: true, data: newClanarina }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/clanarine:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create clanarina' },
      { status: 500 }
    );
  }
}