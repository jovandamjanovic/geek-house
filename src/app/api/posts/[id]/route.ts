import { NextRequest, NextResponse } from 'next/server';
import { posts, categories, autori } from '@/lib/services';
import { Post, ApiResponse } from '@/types';
import { sanitizeString } from '@/lib/validation';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
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
    
    const post = await posts.getPostById(sanitizedId);
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error(`Error in GET /api/posts/${id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    
    const body = await request.json();
    
    // Input sanitization
    if (typeof body !== 'object' || body === null) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    // Sanitize and validate input fields
    const updates: Partial<Post> = {};
    
    if (body.title !== undefined) {
      const sanitizedTitle = sanitizeString(body.title);
      if (sanitizedTitle.length > 0 && sanitizedTitle.length < 3) {
        return NextResponse.json(
          { success: false, error: 'Post title must be at least 3 characters long' },
          { status: 400 }
        );
      }
      updates.title = sanitizedTitle || undefined;
    }
    
    if (body.slug !== undefined) {
      const sanitizedSlug = sanitizeString(body.slug);
      if (sanitizedSlug.length > 0 && sanitizedSlug.length < 3) {
        return NextResponse.json(
          { success: false, error: 'Post slug must be at least 3 characters long' },
          { status: 400 }
        );
      }
      
      // Check if slug already exists (but not for current post)
      if (sanitizedSlug) {
        const existingPost = await posts.getPostBySlug(sanitizedSlug);
        if (existingPost && existingPost.id !== sanitizedId) {
          return NextResponse.json(
            { success: false, error: 'A post with this slug already exists' },
            { status: 409 }
          );
        }
      }
      
      updates.slug = sanitizedSlug || undefined;
    }
    
    if (body.content !== undefined) {
      const sanitizedContent = sanitizeString(body.content);
      if (sanitizedContent.length > 0 && sanitizedContent.length < 10) {
        return NextResponse.json(
          { success: false, error: 'Post content must be at least 10 characters long' },
          { status: 400 }
        );
      }
      updates.content = sanitizedContent || undefined;
    }
    
    if (body.excerpt !== undefined) {
      updates.excerpt = sanitizeString(body.excerpt) || undefined;
    }
    
    if (body.author_id !== undefined) {
      // Verify that the author exists
      const author = await autori.getAuthorById(body.author_id);
      if (!author) {
        return NextResponse.json(
          { success: false, error: 'Author with specified ID does not exist' },
          { status: 400 }
        );
      }
      updates.author_id = body.author_id;
    }
    
    if (body.category_id !== undefined) {
      // Verify that the category exists
      const category = await categories.getCategoryById(body.category_id);
      if (!category) {
        return NextResponse.json(
          { success: false, error: 'Category with specified ID does not exist' },
          { status: 400 }
        );
      }
      updates.category_id = body.category_id;
    }
    
    if (body.tags !== undefined) {
      let processedTags: string[] | undefined;
      if (Array.isArray(body.tags)) {
        processedTags = body.tags.map((tag: string) => sanitizeString(tag)).filter(tag => tag.length > 0);
      } else if (typeof body.tags === 'string') {
        processedTags = body.tags.split(',').map(tag => sanitizeString(tag.trim())).filter(tag => tag.length > 0);
      }
      updates.tags = processedTags;
    }
    
    if (body.featured_image !== undefined) {
      updates.featured_image = sanitizeString(body.featured_image) || undefined;
    }
    
    if (body.featured !== undefined) {
      updates.featured = Boolean(body.featured);
    }
    
    if (body.status !== undefined) {
      updates.status = body.status;
    }
    
    if (body.seo_title !== undefined) {
      updates.seo_title = sanitizeString(body.seo_title) || undefined;
    }
    
    if (body.seo_description !== undefined) {
      updates.seo_description = sanitizeString(body.seo_description) || undefined;
    }

    const updatedPost = await posts.updatePost(sanitizedId, updates);
    
    if (!updatedPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error(`Error in PUT /api/posts/${id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
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
        { success: false, error: 'Invalid post ID' },
        { status: 400 }
      );
    }
    
    const deleted = await posts.deletePost(sanitizedId);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error(`Error in DELETE /api/posts/${id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}