import { BlogPostRepository } from "@/lib/domain/blog-post/repository/BlogPostRepository";
import { BlogPost } from "@/types";

export class BlogPostService {
  constructor(private blogPostRepository: BlogPostRepository) {}

  async getBlogPosts(): Promise<BlogPost[]> {
    return this.blogPostRepository.findAll();
  }

  async getBlogPost(id: string): Promise<BlogPost | null> {
    return this.blogPostRepository.find(id);
  }
}
