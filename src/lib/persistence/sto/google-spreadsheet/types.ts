import { Sto } from "@/types";

export type StoWithSobaId = Omit<Sto, "soba"> & { soba_id: string };
