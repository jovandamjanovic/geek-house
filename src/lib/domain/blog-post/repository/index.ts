import { BlogPostRepository } from "@/lib/persistence/blog-post/google-spreadsheet/BlogPostRepository";

export const blogPostRepository = new BlogPostRepository(
  process.env.GOOGLE_SPREADSHEET_ID!,
);
