import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/googleSheets';
import { Clan, ApiResponse, ClanStatus } from '@/types';

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
  const { id } = await params;
  
  // Protect P/01 member from updates
  if (id === 'P/01') {
    return NextResponse.json(
      { success: false, error: 'Cannot update protected member P/01' },
      { status: 403 }
    );
  }
  
  try {
    const body = await request.json();
    
    // Validate status if provided
    if (body.status && !Object.values(ClanStatus).includes(body.status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
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
  const { id } = await params;
  
  // Protect P/01 member from deletion
  if (id === 'P/01') {
    return NextResponse.json(
      { success: false, error: 'Cannot delete protected member P/01' },
      { status: 403 }
    );
  }
  
  try {
    const deleted = await googleSheetsService.deleteClan(id);
    
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