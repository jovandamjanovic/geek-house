import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/googleSheets';
import { Clanarina, ApiResponse, ClanarinaForCreation } from '@/types';

export async function GET(): Promise<NextResponse<ApiResponse<Clanarina[]>>> {
  try {
    const clanarine = await googleSheetsService.getClanarine();
    return NextResponse.json({ success: true, data: clanarine });
  } catch (error) {
    console.error('Error in GET /api/clanarine:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clanarine' },
      { status: 500 }
    );
  }
}

// Input sanitization helper
function sanitizeString(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/[<>"'&]/g, '');
}

function validateClanskiBroj(clanskiBroj: string): boolean {
  // Must be either numeric or P/01 format
  return /^\d{1,6}$/.test(clanskiBroj) || clanskiBroj === 'P/01';
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Clanarina>>> {
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
    const requiredFields = ['Clanski Broj', 'Datum Uplate'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Sanitize and validate Clanski Broj
    const sanitizedClanskiBroj = sanitizeString(body['Clanski Broj']);
    if (!validateClanskiBroj(sanitizedClanskiBroj)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Clanski Broj format' },
        { status: 400 }
      );
    }

    // Validate and parse date
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

    // Verify that the clan exists
    const clan = await googleSheetsService.getClanByNumber(sanitizedClanskiBroj);
    if (!clan) {
      return NextResponse.json(
        { success: false, error: 'Clan with specified Clanski Broj does not exist' },
        { status: 400 }
      );
    }

    const newClanarinaData: ClanarinaForCreation = {
      'Clanski Broj': sanitizedClanskiBroj,
      'Datum Uplate': datumUplate,
    };

    const newClanarina = await googleSheetsService.createClanarina(newClanarinaData);
    return NextResponse.json({ success: true, data: newClanarina }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/clanarine:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create clanarina' },
      { status: 500 }
    );
  }
}