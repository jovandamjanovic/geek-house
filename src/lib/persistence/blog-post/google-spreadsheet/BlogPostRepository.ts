import { EntityRepository } from "@/lib/persistence/google-spreadsheet/EntityRepository";
import { BlogPost } from "@/types";
import { BlogPostRepository as DomainBlogPostRepository } from "@/lib/domain/sadrzaj/repository/BlogPostRepository";
import { BlogPostSpreadsheetConfig } from "@/lib/persistence/blog-post/google-spreadsheet/BlogPostSpreadsheetConfig";

export class BlogPostRepository
  extends EntityRepository<BlogPost>
  implements DomainBlogPostRepository
{
  constructor(spreadsheetId: string) {
    super(spreadsheetId, BlogPostSpreadsheetConfig);
  }

  async find(id: string): Promise<BlogPost | null> {
    try {
      const result = await this.findRowById(id);
      return result ? result.entity : null;
    } catch (error) {
      console.error(`Error fetching blog post with id ${id}:`, error);
      throw new Error(`Failed to fetch blog post with id ${id}`);
    }
  }

  async findAll(): Promise<BlogPost[]> {
    try {
      return await this.getAllRows();
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      throw new Error("Failed to fetch blog posts");
    }
  }
}
