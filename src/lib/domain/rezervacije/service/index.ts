import { RezervacijaService } from "@/lib/domain/rezervacije/service/RezervacijaService";
import { rezervacijaRepository } from "@/lib/domain/rezervacije/repository";

export const rezervacijaService = new RezervacijaService(rezervacijaRepository);
