import { ProstorijaService } from "@/lib/domain/prostorija/service/ProstorijaService";
import { prostorijaRepository } from "@/lib/domain/prostorija/repository";

export const prostorijaService = new ProstorijaService(prostorijaRepository);
