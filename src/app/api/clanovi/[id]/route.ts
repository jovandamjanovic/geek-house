import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/googleSheets';
import { Clan, ApiResponse, ClanStatus } from '@/types';

// Input sanitization helpers
function sanitizeString(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/[<>"'&]/g, '');
}

function validateEmail(email: string): boolean {
  if (!email) return true; // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone: string): boolean {
  if (!phone) return true; // Optional field
  const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
  return phoneRegex.test(phone);
}

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

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Clan>>> {
  try {
    const { id } = await params;
    const clan = await googleSheetsService.getClanByNumber(id);
    
    if (!clan) {
      return NextResponse.json(
        { success: false, error: 'Clan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: clan });
  } catch (error) {
    console.error(`Error in GET /api/clanovi/${(await params).id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clan' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Clan>>> {
  try {
    const { id } = await params;
    
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

    const updatedClan = await googleSheetsService.updateClan(id, body);
    
    if (!updatedClan) {
      return NextResponse.json(
        { success: false, error: 'Clan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedClan });
  } catch (error) {
    const { id } = await params;
    console.error(`Error in PUT /api/clanovi/${id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update clan' },
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
    
    // Protect P/01 member from deletion
    if (id === 'P/01') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete protected member P/01' },
        { status: 403 }
      );
    }
    const deleted = await googleSheetsService.deleteClan(id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Clan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    const { id } = await params;
    console.error(`Error in DELETE /api/clanovi/${id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete clan' },
      { status: 500 }
    );
  }
}