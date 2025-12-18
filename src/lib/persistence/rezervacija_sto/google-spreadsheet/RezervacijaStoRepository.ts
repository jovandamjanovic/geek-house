import { EntityRepository } from "@/lib/persistence/google-spreadsheet/EntityRepository";
import { Rezervacija } from "@/types";
import { RezervacijaSto } from "@/lib/persistence/rezervacija_sto/google-spreadsheet/types";
import { RezervacijaStoSpreadsheetConfig } from "@/lib/persistence/rezervacija_sto/google-spreadsheet/RezervacijaStoSpreadsheetConfig";

export class RezervacijaStoRepository extends EntityRepository<RezervacijaSto> {
  constructor(spreadsheetId: string) {
    super(spreadsheetId, RezervacijaStoSpreadsheetConfig);
  }

  async save(entity: RezervacijaSto): Promise<RezervacijaSto> {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        await this.appendRow(entity);
        return entity;
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          console.error("Error creating rezervacija sto after retries:", error);
          throw new Error(
            "Failed to create rezervacija sto after multiple attempts",
          );
        }
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 100),
        );
      }
    }
  }

  async findAllByRezervacija(
    rezervacija: Rezervacija,
  ): Promise<RezervacijaSto[]> {
    try {
      const result = await this.getAllRows();
      return result.filter(
        (rezervacijaSto) => rezervacijaSto.rezervacija === rezervacija.id,
      );
    } catch (error) {
      console.error(
        `Error fetching rezervacijaSto for rezervacija ${rezervacija.id}`,
        error,
      );
      throw new Error(
        `Failed to fetch rezervacijaSto with id ${rezervacija.id}`,
      );
    }
  }
}
