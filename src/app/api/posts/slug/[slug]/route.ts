import { NextRequest, NextResponse } from 'next/server';
import { posts } from '@/lib/services';
import { Post, ApiResponse } from '@/types';
import { sanitizeString } from '@/lib/validation';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Post>>> {
  const { slug } = await params;
  try {
    const sanitizedSlug = sanitizeString(slug);
    if (!sanitizedSlug) {
      return NextResponse.json(
        { success: false, error: 'Invalid post slug' },
        { status: 400 }
      );
    }
    
    const post = await posts.getPostBySlug(sanitizedSlug);
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error(`Error in GET /api/posts/slug/${slug}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}