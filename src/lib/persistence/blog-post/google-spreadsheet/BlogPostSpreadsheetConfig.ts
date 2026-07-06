import { SpreadsheetConfig } from "@/lib/persistence/google-spreadsheet/SpreadsheetConfig";
import { BlogPost } from "@/types";
import { BlogPostDataTransformer } from "@/lib/persistence/blog-post/google-spreadsheet/BlogPostDataTransformer";

export const BlogPostSpreadsheetConfig: SpreadsheetConfig<BlogPost> = {
  sheetConfig: {
    sheetName: "BlogPosts",
    range: "BlogPosts!A:G",
  },
  dataTransformer: new BlogPostDataTransformer(),
  idField: "id",
};
