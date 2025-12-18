import { Rezervacija } from "@/types";
import { RezervacijaRepository } from "@/lib/domain/rezervacije/repository/RezervacijaRepository";

export class RezervacijaService {
  constructor(private rezervacijaRepository: RezervacijaRepository) {}

  async getRezervacije(): Promise<Rezervacija[]> {
    return this.rezervacijaRepository.findAll();
  }

  async getRezervacija(id: string): Promise<Rezervacija | null> {
    return this.rezervacijaRepository.find(id);
  }

  async createRezervacija(
    entity: Omit<Rezervacija, "id">,
  ): Promise<Rezervacija> {
    return this.rezervacijaRepository.save(entity);
  }

  async deleteRezervacija(id: string): Promise<void> {
    return this.rezervacijaRepository.delete(id);
  }
}
