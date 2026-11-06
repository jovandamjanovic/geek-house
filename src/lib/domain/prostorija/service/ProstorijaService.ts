import { ProstorijaRepository } from "@/lib/domain/prostorija/repository/ProstorijaRepository";
import { Prostorija } from "@/types";

export class ProstorijaService {
  constructor(private prostorijaRepository: ProstorijaRepository) {}

  async getProstorije(): Promise<Prostorija[]> {
    return this.prostorijaRepository.findAll();
  }

  async getProstorija(id: string): Promise<Prostorija | null> {
    return this.prostorijaRepository.find(id);
  }
}
