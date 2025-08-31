import { NextRequest, NextResponse } from 'next/server';
import { categories } from '@/lib/services';
import { Category, ApiResponse } from '@/types';
import { sanitizeString } from '@/lib/validation';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Category>>> {
  const { id } = await params;
  try {
    const sanitizedId = sanitizeString(id);
    if (!sanitizedId) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }
    
    const category = await categories.getCategoryById(sanitizedId);
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error(`Error in GET /api/categories/${id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Category>>> {
  const { id } = await params;
  try {
    const sanitizedId = sanitizeString(id);
    if (!sanitizedId) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
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
    
    // Sanitize and validate input fields
    const updates: Partial<Category> = {};
    
    if (body.name !== undefined) {
      const sanitizedName = sanitizeString(body.name);
      if (sanitizedName.length > 0 && sanitizedName.length < 2) {
        return NextResponse.json(
          { success: false, error: 'Category name must be at least 2 characters long' },
          { status: 400 }
        );
      }
      updates.name = sanitizedName || undefined;
    }
    
    if (body.slug !== undefined) {
      const sanitizedSlug = sanitizeString(body.slug);
      if (sanitizedSlug.length > 0 && sanitizedSlug.length < 2) {
        return NextResponse.json(
          { success: false, error: 'Category slug must be at least 2 characters long' },
          { status: 400 }
        );
      }
      
      // Check if slug already exists (but not for current category)
      if (sanitizedSlug) {
        const existingCategory = await categories.getCategoryBySlug(sanitizedSlug);
        if (existingCategory && existingCategory.id !== sanitizedId) {
          return NextResponse.json(
            { success: false, error: 'A category with this slug already exists' },
            { status: 409 }
          );
        }
      }
      
      updates.slug = sanitizedSlug || undefined;
    }
    
    if (body.description !== undefined) {
      updates.description = sanitizeString(body.description) || undefined;
    }

    const updatedCategory = await categories.updateCategory(sanitizedId, updates);
    
    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error(`Error in PUT /api/categories/${id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
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
    const sanitizedId = sanitizeString(id);
    if (!sanitizedId) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }
    
    const deleted = await categories.deleteCategory(sanitizedId);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error(`Error in DELETE /api/categories/${id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}