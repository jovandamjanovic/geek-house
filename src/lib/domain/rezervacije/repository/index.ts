import { RezervacijaRepository } from "@/lib/persistence/rezervacija/google-spreadsheet/RezervacijaRepository";
import { SobaRepository } from "@/lib/persistence/soba/google-spreadsheet/SobaRepository";
import { StoRepository } from "@/lib/persistence/sto/google-spreadsheet/StoRepository";

export const rezervacijaRepository = new RezervacijaRepository(
  process.env.GOOGLE_SPREADSHEET_ID!,
);

export const sobaRepository = new SobaRepository(
  process.env.GOOGLE_SPREADSHEET_ID!,
);

export const stoRepository = new StoRepository(
  process.env.GOOGLE_SPREADSHEET_ID!,
);
