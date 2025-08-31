import { NextRequest, NextResponse } from 'next/server';
import { posts, categories, autori } from '@/lib/services';
import { Post, PostForCreation, ApiResponse } from '@/types';
import { sanitizeString } from '@/lib/validation';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Post[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const authorId = searchParams.get('author_id');
    const categoryId = searchParams.get('category_id');
    const tag = searchParams.get('tag');
    const featured = searchParams.get('featured');

    let postsList: Post[];

    // Handle different filtering combinations
    if (status === 'published') {
      if (authorId) {
        postsList = await posts.getPublishedPostsByAuthor(sanitizeString(authorId));
      } else if (categoryId) {
        postsList = await posts.getPublishedPostsByCategory(sanitizeString(categoryId));
      } else {
        postsList = await posts.getPublishedPosts();
      }
    } else if (status === 'draft') {
      postsList = await posts.getDraftPosts();
    } else if (featured === 'true') {
      postsList = await posts.getFeaturedPosts();
    } else if (authorId) {
      postsList = await posts.getPostsByAuthor(sanitizeString(authorId));
    } else if (categoryId) {
      postsList = await posts.getPostsByCategory(sanitizeString(categoryId));
    } else if (tag) {
      postsList = await posts.getPostsByTag(sanitizeString(tag));
    } else {
      postsList = await posts.getPosts();
    }

    return NextResponse.json({ success: true, data: postsList });
  } catch (error) {
    console.error('Error in GET /api/posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Post>>> {
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
    const requiredFields = ['title', 'slug', 'content', 'author_id', 'category_id'];
    for (const field of requiredFields) {
      if (!body[field] || sanitizeString(body[field]).length === 0) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Sanitize and validate input fields
    const sanitizedTitle = sanitizeString(body.title);
    if (sanitizedTitle.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Post title must be at least 3 characters long' },
        { status: 400 }
      );
    }

    const sanitizedSlug = sanitizeString(body.slug);
    if (sanitizedSlug.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Post slug must be at least 3 characters long' },
        { status: 400 }
      );
    }

    const sanitizedContent = sanitizeString(body.content);
    if (sanitizedContent.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Post content must be at least 10 characters long' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await posts.getPostBySlug(sanitizedSlug);
    if (existingPost) {
      return NextResponse.json(
        { success: false, error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }

    // Verify that the author exists
    const author = await autori.getAuthorById(body.author_id);
    if (!author) {
      return NextResponse.json(
        { success: false, error: 'Author with specified ID does not exist' },
        { status: 400 }
      );
    }

    // Verify that the category exists
    const category = await categories.getCategoryById(body.category_id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category with specified ID does not exist' },
        { status: 400 }
      );
    }

    // Process tags
    let processedTags: string[] | undefined;
    if (body.tags) {
      if (Array.isArray(body.tags)) {
        processedTags = body.tags.map((tag: string) => sanitizeString(tag)).filter((tag: string) => tag.length > 0);
      } else if (typeof body.tags === 'string') {
        processedTags = body.tags.split(',').map((tag: string) => sanitizeString(tag.trim())).filter((tag: string) => tag.length > 0);
      }
    }

    const newPostData: PostForCreation = {
      title: sanitizedTitle,
      slug: sanitizedSlug,
      content: sanitizedContent,
      excerpt: sanitizeString(body.excerpt) || undefined,
      author_id: body.author_id,
      category_id: body.category_id,
      tags: processedTags,
      featured_image: sanitizeString(body.featured_image) || undefined,
      featured: Boolean(body.featured),
      seo_title: sanitizeString(body.seo_title) || undefined,
      seo_description: sanitizeString(body.seo_description) || undefined,
    };

    const newPost = await posts.createPost(newPostData);
    return NextResponse.json({ success: true, data: newPost }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}