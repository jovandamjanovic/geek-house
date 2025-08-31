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
    
    const publishedPost = await posts.publishPost(sanitizedId);
    
    if (!publishedPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: publishedPost });
  } catch (error) {
    console.error(`Error in POST /api/posts/${id}/publish:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to publish post' },
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
    
    const unpublishedPost = await posts.unpublishPost(sanitizedId);
    
    if (!unpublishedPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: unpublishedPost });
  } catch (error) {
    console.error(`Error in DELETE /api/posts/${id}/publish:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to unpublish post' },
      { status: 500 }
    );
  }
}