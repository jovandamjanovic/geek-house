import { EntityRepository } from "@/lib/persistence/google-spreadsheet/EntityRepository";
import { Rezervacija } from "@/types";
import { RezervacijaRepository as DomainRezervacijaRepository } from "@/lib/domain/rezervacije/repository/RezervacijaRepository";
import { RezervacijaSpreadsheetConfig } from "@/lib/persistence/rezervacija/google-spreadsheet/RezervacijaSpreadsheetConfig";
import { RezervacijaStoRepository } from "@/lib/persistence/rezervacija_sto/google-spreadsheet/RezervacijaStoRepository";
import { RezervacijaSto } from "@/lib/persistence/rezervacija_sto/google-spreadsheet/types";
import { stoRepository } from "@/lib/domain/rezervacije/repository";

export class RezervacijaRepository
  extends EntityRepository<Rezervacija>
  implements DomainRezervacijaRepository
{
  constructor(spreadsheetId: string) {
    super(spreadsheetId, RezervacijaSpreadsheetConfig);
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await this.findRowById(id);
      if (!result) return;
      await this.deleteRow(result.rowIndex);
      return;
    } catch (error) {
      console.error(`Error deleting rezervacija with id ${id}:`, error);
      throw new Error(`Failed to delete rezervacija with id ${id}`);
    }
  }

  async find(id: string): Promise<Rezervacija | null> {
    try {
      const result = await this.findRowById(id);
      if (!result) return null;
      return {
        ...result.entity,
        stolovi: await stoRepository.findAllForRezervacija(result.entity),
      } as Rezervacija;
    } catch (error) {
      console.error(`Error fetching rezervacija with id ${id}:`, error);
      throw new Error(`Failed to fetch rezervacija with id ${id}`);
    }
  }

  async findAll(): Promise<Rezervacija[]> {
    try {
      const result = await this.getAllRows();
      return Promise.all(
        result.map(async (rezervacija) => {
          return {
            ...rezervacija,
            stolovi: await stoRepository.findAllForRezervacija(rezervacija),
          } as Rezervacija;
        }),
      );
    } catch (error) {
      console.error("Error fetching rezervacije:", error);
      throw new Error("Failed to fetch rezervacije");
    }
  }

  async save(entity: Rezervacija): Promise<Rezervacija> {
    if (entity.id !== null) {
      return this.update(entity);
    }
    return this.create(entity);
  }

  private async create(data: Omit<Rezervacija, "id">): Promise<Rezervacija> {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const existingItems = await this.getAllRows();
        const id = this.getNextId(existingItems);
        const newRezervacija: Rezervacija = { ...data, id };
        await this.appendRow(newRezervacija);
        const rezervacijaStoRepository = new RezervacijaStoRepository(
          this.spreadsheetId,
        );
        await Promise.all(
          newRezervacija.stolovi.map((sto) =>
            rezervacijaStoRepository.save({
              sto: sto.id,
              rezervacija: newRezervacija.id,
            } as RezervacijaSto),
          ),
        );
        return newRezervacija;
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          console.error("Error creating rezervacija after retries:", error);
          throw new Error(
            "Failed to create rezervacija after multiple attempts",
          );
        }
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 100),
        );
      }
    }

    throw new Error("Failed to create rezervacija");
  }

  private async update(entity: Rezervacija): Promise<Rezervacija> {
    const id = entity.id;
    try {
      if (!id) {
        throw new Error("Cannot update rezervacija without an ID");
      }
      const result = await this.findRowById(id);
      if (!result) {
        throw new Error(`rezervacija with id ${id} not found`);
      }
      await this.updateRow(result.rowIndex, entity);

      return entity;
    } catch (error) {
      console.error(`Error updating rezervacija with id ${id}:`, error);
      throw new Error(`Failed to update rezervacija with id ${id}`);
    }
  }
}
