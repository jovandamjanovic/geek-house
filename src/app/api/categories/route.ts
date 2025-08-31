import { NextRequest, NextResponse } from 'next/server';
import { categories } from '@/lib/services';
import { Category, CategoryForCreation, ApiResponse } from '@/types';
import { sanitizeString } from '@/lib/validation';

export async function GET(): Promise<NextResponse<ApiResponse<Category[]>>> {
  try {
    const categoriesList = await categories.getCategories();
    return NextResponse.json({ success: true, data: categoriesList });
  } catch (error) {
    console.error('Error in GET /api/categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Category>>> {
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
    const requiredFields = ['name', 'slug'];
    for (const field of requiredFields) {
      if (!body[field] || sanitizeString(body[field]).length === 0) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Sanitize and validate input fields
    const sanitizedName = sanitizeString(body.name);
    if (sanitizedName.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Category name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    const sanitizedSlug = sanitizeString(body.slug);
    if (sanitizedSlug.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Category slug must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCategory = await categories.getCategoryBySlug(sanitizedSlug);
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'A category with this slug already exists' },
        { status: 409 }
      );
    }

    const newCategoryData: CategoryForCreation = {
      name: sanitizedName,
      slug: sanitizedSlug,
      description: sanitizeString(body.description) || undefined,
    };

    const newCategory = await categories.createCategory(newCategoryData);
    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}