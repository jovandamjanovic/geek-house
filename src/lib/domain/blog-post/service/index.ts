import { BlogPostService } from "@/lib/domain/blog-post/service/BlogPostService";
import { blogPostRepository } from "@/lib/domain/blog-post/repository";

export const blogPostService = new BlogPostService(blogPostRepository);
