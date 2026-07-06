import { ProstorijaRepository } from "@/lib/persistence/prostorija/google-spreadsheet/ProstorijaRepository";

export const prostorijaRepository = new ProstorijaRepository(
  process.env.GOOGLE_SPREADSHEET_ID!,
);
