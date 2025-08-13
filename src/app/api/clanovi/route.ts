import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/googleSheets';
import { Clan, ApiResponse, ClanStatus } from '@/types';

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
    
    // Validate required fields
    const requiredFields = ['Ime i Prezime'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate status
    if (body.status && !Object.values(ClanStatus).includes(body.status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }

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
    }

    const newClanData: Omit<Clan, 'Clanski Broj'> = {
      'Ime i Prezime': body['Ime i Prezime'],
      email: body.email,
      telefon: body.telefon,
      status: body.status,
      'Datum Rodjenja': datumRodjenja,
      Napomene: body.Napomene,
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