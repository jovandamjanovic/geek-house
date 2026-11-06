import { NextRequest, NextResponse } from "next/server";
import { blogPostService } from "@/lib/domain/blog-post/service";
import { ApiResponse, BlogPost } from "@/types";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<ApiResponse<BlogPost>>> {
  const { id } = await params;
  try {
    const blogPost = await blogPostService.getBlogPost(id);

    if (!blogPost) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: blogPost });
  } catch (error) {
    console.error(`Error in GET /api/blog-posts/${id}:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog post" },
      { status: 500 },
    );
  }
}
