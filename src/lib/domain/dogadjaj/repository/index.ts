import { DogadjajRepository } from "@/lib/persistence/dogadjaj/google-spreadsheet/DogadjajRepository";

export const dogadjajRepository = new DogadjajRepository(
  process.env.GOOGLE_SPREADSHEET_ID!,
);
