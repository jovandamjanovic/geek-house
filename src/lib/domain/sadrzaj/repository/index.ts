import { BlogPostRepository } from "@/lib/persistence/blog-post/google-spreadsheet/BlogPostRepository";
import { DogadjajRepository } from "@/lib/persistence/dogadjaj/google-spreadsheet/DogadjajRepository";
import { GameRepository } from "@/lib/persistence/game/google-spreadsheet/GameRepository";
import { ProstorijaRepository } from "@/lib/persistence/prostorija/google-spreadsheet/ProstorijaRepository";

export const blogPostRepository = new BlogPostRepository(
  process.env.GOOGLE_SPREADSHEET_ID!,
);

export const dogadjajRepository = new DogadjajRepository(
  process.env.GOOGLE_SPREADSHEET_ID!,
);

export const gameRepository = new GameRepository(
  process.env.GOOGLE_SPREADSHEET_ID!,
);

export const prostorijaRepository = new ProstorijaRepository(
  process.env.GOOGLE_SPREADSHEET_ID!,
);
