import { EntityRepository } from "@/lib/domain/clan-management/repository/EntityRepository";
import { BlogPost } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BlogPostRepository
  extends Omit<EntityRepository<BlogPost>, "save" | "delete"> {}
