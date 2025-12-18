import { EntityRepository } from "@/lib/persistence/google-spreadsheet/EntityRepository";
import { Soba, Sto, Rezervacija } from "@/types";
import { StoRepository as DomainStoRepository } from "@/lib/domain/rezervacije/repository/StoRepository";
import { StoSpreadsheetConfig } from "@/lib/persistence/sto/google-spreadsheet/StoSpreadsheetConfig";
import { RezervacijaStoRepository } from "@/lib/persistence/rezervacija_sto/google-spreadsheet/RezervacijaStoRepository";
import { sobaRepository } from "@/lib/domain/rezervacije/repository";
import { StoWithSobaId } from "@/lib/persistence/sto/google-spreadsheet/types";

export class StoRepository
  extends EntityRepository<Sto>
  implements DomainStoRepository
{
  constructor(spreadsheetId: string) {
    super(spreadsheetId, StoSpreadsheetConfig);
  }

  async find(id: string): Promise<Sto | null> {
    try {
      const result = await this.findRowById(id);
      if (!result) {
        return null;
      }

      const soba = await sobaRepository.find(result.entity.soba_id);
      if (soba === null) {
        throw new Error(
          'Soba with id "' + result.entity.soba_id + '" not found.',
        );
      }
      return {
        ...result.entity,
        soba: soba,
      } as Sto;
    } catch (error) {
      console.error(`Error fetching sto with id ${id}:`, error);
      throw new Error(`Failed to fetch sto with id ${id}`);
    }
  }

  async findAll(): Promise<Sto[]> {
    try {
      const result = await this.getAllRows();
      return Promise.all(
        result.map(async (sto) => {
          const soba = await sobaRepository.find(sto.soba_id);
          if (soba === null) {
            throw new Error('Soba with id "' + sto.soba_id + '" not found.');
          }
          return {
            ...sto,
            soba: soba,
          } as Sto;
        }),
      );
    } catch (error) {
      console.error("Error fetching stolovi:", error);
      throw new Error("Failed to fetch stolovi");
    }
  }

  async findAllForSoba(soba: Soba): Promise<Sto[]> {
    try {
      const sviStolovi = await this.findAll();
      return sviStolovi.filter((sto) => sto.soba.id === soba.id);
    } catch (error) {
      console.error("Error fetching stolovi:", error);
      throw new Error("Failed to fetch stolovi");
    }
  }

  async findAllForRezervacija(rezervacija: Rezervacija): Promise<Sto[]> {
    const rezervacijaStoRepository = new RezervacijaStoRepository(
      this.spreadsheetId,
    );
    try {
      const rezervacijaStolovi =
        await rezervacijaStoRepository.findAllByRezervacija(rezervacija);
      return Promise.all(
        rezervacijaStolovi.map(async (rezervacijaSto) => {
          const sto = await this.find(rezervacijaSto.sto);
          if (sto === null) {
            throw new Error(
              'Sto with id "' + rezervacijaSto.sto + '" not found.',
            );
          }
          return sto;
        }),
      );
    } catch (error) {
      console.error("Error fetching stolovi:", error);
      throw new Error("Failed to fetch stolovi");
    }
  }

  protected async getAllRows(): Promise<StoWithSobaId[]> {
    return super.getAllRows();
  }

  protected async findRowById(
    id: string,
  ): Promise<{ entity: StoWithSobaId; rowIndex: number } | null> {
    return super.findRowById(id);
  }
}
