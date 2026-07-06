import { DogadjajRepository } from "@/lib/domain/dogadjaj/repository/DogadjajRepository";
import { Dogadjaj } from "@/types";

export class DogadjajService {
  constructor(private dogadjajRepository: DogadjajRepository) {}

  async getDogadjaji(): Promise<Dogadjaj[]> {
    return this.dogadjajRepository.findAll();
  }

  async getDogadjaj(id: string): Promise<Dogadjaj | null> {
    return this.dogadjajRepository.find(id);
  }
}
