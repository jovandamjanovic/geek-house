import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/googleSheets';
import { Clanarina, ApiResponse } from '@/types';

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
    const clanarina = await googleSheetsService.getClanarinaById(id);
    
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
  const { id } = await params;
  try {
    const body = await request.json();
    
    // Validate and parse date if provided
    if (body['Datum Uplate']) {
      const datumUplate = new Date(body['Datum Uplate']);
      if (isNaN(datumUplate.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid date format for Datum Uplate' },
          { status: 400 }
        );
      }
      body['Datum Uplate'] = datumUplate;
    }

    // Verify that the clan exists if Clanski Broj is being updated
    if (body['Clanski Broj']) {
      const clan = await googleSheetsService.getClanByNumber(body['Clanski Broj']);
      if (!clan) {
        return NextResponse.json(
          { success: false, error: 'Clan with specified Clanski Broj does not exist' },
          { status: 400 }
        );
      }
    }

    const updatedClanarina = await googleSheetsService.updateClanarina(id, body);
    
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

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<null>>> {
  const { id } = await params;
  try {
    const deleted = await googleSheetsService.deleteClanarina(id);
    
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