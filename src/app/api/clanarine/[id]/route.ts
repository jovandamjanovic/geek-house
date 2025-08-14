import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/googleSheets';
import { Clanarina, ApiResponse } from '@/types';
import { sanitizeString, validateClanskiBroj, validateId } from '@/lib/validation';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

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
    
    const clanarina = await googleSheetsService.getClanarinaById(sanitizedId);
    
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

export async function PUT(
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
      const clan = await googleSheetsService.getClanByNumber(sanitizedClanskiBroj);
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

    const updatedClanarina = await googleSheetsService.updateClanarina(sanitizedId, body);
    
    if (!updatedClanarina) {
      return NextResponse.json(
        { success: false, error: 'Clanarina not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedClanarina });
  } catch (error) {
    console.error(`Error in PUT /api/clanarine/${sanitizedId}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update clanarina' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<null>>> {
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
    
    const deleted = await googleSheetsService.deleteClanarina(sanitizedId);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Clanarina not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error(`Error in DELETE /api/clanarine/${sanitizedId}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete clanarina' },
      { status: 500 }
    );
  }
}