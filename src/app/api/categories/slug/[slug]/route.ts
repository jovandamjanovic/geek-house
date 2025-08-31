import { NextRequest, NextResponse } from 'next/server';
import { categories } from '@/lib/services';
import { Category, ApiResponse } from '@/types';
import { sanitizeString } from '@/lib/validation';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Category>>> {
  const { slug } = await params;
  try {
    const sanitizedSlug = sanitizeString(slug);
    if (!sanitizedSlug) {
      return NextResponse.json(
        { success: false, error: 'Invalid category slug' },
        { status: 400 }
      );
    }
    
    const category = await categories.getCategoryBySlug(sanitizedSlug);
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error(`Error in GET /api/categories/slug/${slug}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}