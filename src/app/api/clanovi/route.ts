import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/googleSheets';
import { Clan, ApiResponse, ClanStatus, ClanForCreation } from '@/types';

// Input sanitization helper
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

function getDefaultStatus(): ClanStatus {
  return ClanStatus.PROBNI;
}

function validateAndNormalizeStatus(status: unknown): ClanStatus {
  if (!status) return getDefaultStatus();
  
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
  
  return statusMapping[statusStr] || getDefaultStatus();
}

export async function GET(): Promise<NextResponse<ApiResponse<Clan[]>>> {
  try {
    const clanovi = await googleSheetsService.getClanovi();
    return NextResponse.json({ success: true, data: clanovi });
  } catch (error) {
    console.error('Error in GET /api/clanovi:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clanovi' },
      { status: 500 }
    );
  }
}

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

    const newClan = await googleSheetsService.createClan(newClanData);
    return NextResponse.json({ success: true, data: newClan }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/clanovi:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create clan' },
      { status: 500 }
    );
  }
}