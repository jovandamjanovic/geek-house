import { NextResponse } from "next/server";
import { blogPostService } from "@/lib/domain/blog-post/service";
import { ApiResponse, BlogPost } from "@/types";

export async function GET(): Promise<NextResponse<ApiResponse<BlogPost[]>>> {
  try {
    const blogPosts = await blogPostService.getBlogPosts();
    return NextResponse.json({ success: true, data: blogPosts });
  } catch (error) {
    console.error("Error in GET /api/blog-posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog posts" },
      { status: 500 },
    );
  }
}
