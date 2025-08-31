import { NextRequest, NextResponse } from 'next/server';
import { autori } from '@/lib/services';
import { Author, ApiResponse } from '@/types';
import { sanitizeString } from '@/lib/validation';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Author>>> {
  const { id } = await params;
  try {
    const sanitizedId = sanitizeString(id);
    if (!sanitizedId) {
      return NextResponse.json(
        { success: false, error: 'Invalid author ID' },
        { status: 400 }
      );
    }
    
    const author = await autori.getAuthorById(sanitizedId);
    
    if (!author) {
      return NextResponse.json(
        { success: false, error: 'Author not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: author });
  } catch (error) {
    console.error(`Error in GET /api/autori/${id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch author' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Author>>> {
  const { id } = await params;
  try {
    const sanitizedId = sanitizeString(id);
    if (!sanitizedId) {
      return NextResponse.json(
        { success: false, error: 'Invalid author ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const updatedAuthor = await autori.updateAuthor(sanitizedId, body);
    
    if (!updatedAuthor) {
      return NextResponse.json(
        { success: false, error: 'Author not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedAuthor });
  } catch (error) {
    console.error(`Error in PUT /api/autori/${id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update author' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<{ success: boolean }>>> {
  const { id } = await params;
  try {
    const sanitizedId = sanitizeString(id);
    if (!sanitizedId) {
      return NextResponse.json(
        { success: false, error: 'Invalid author ID' },
        { status: 400 }
      );
    }
    
    const deleted = await autori.deleteAuthor(sanitizedId);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Author not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { success: true } });
  } catch (error) {
    console.error(`Error in DELETE /api/autori/${id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete author' },
      { status: 500 }
    );
  }
}