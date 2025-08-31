import { NextRequest, NextResponse } from 'next/server';
import { posts } from '@/lib/services';
import { Post, ApiResponse } from '@/types';
import { sanitizeString } from '@/lib/validation';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Post>>> {
  const { id } = await params;
  try {
    const sanitizedId = sanitizeString(id);
    if (!sanitizedId) {
      return NextResponse.json(
        { success: false, error: 'Invalid post ID' },
        { status: 400 }
      );
    }
    
    const featuredPost = await posts.featurePost(sanitizedId);
    
    if (!featuredPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: featuredPost });
  } catch (error) {
    console.error(`Error in POST /api/posts/${id}/feature:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to feature post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Post>>> {
  const { id } = await params;
  try {
    const sanitizedId = sanitizeString(id);
    if (!sanitizedId) {
      return NextResponse.json(
        { success: false, error: 'Invalid post ID' },
        { status: 400 }
      );
    }
    
    const unfeaturedPost = await posts.unfeaturePost(sanitizedId);
    
    if (!unfeaturedPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: unfeaturedPost });
  } catch (error) {
    console.error(`Error in DELETE /api/posts/${id}/feature:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to unfeature post' },
      { status: 500 }
    );
  }
}