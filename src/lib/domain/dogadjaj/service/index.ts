import { DogadjajService } from "@/lib/domain/dogadjaj/service/DogadjajService";
import { dogadjajRepository } from "@/lib/domain/dogadjaj/repository";

export const dogadjajService = new DogadjajService(dogadjajRepository);
