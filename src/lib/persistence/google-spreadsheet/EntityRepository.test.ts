import { beforeEach, describe, expect, it, vi } from "vitest";
import { EntityRepository } from "@/lib/persistence/google-spreadsheet/EntityRepository";
import { SpreadsheetConfig } from "@/lib/persistence/google-spreadsheet/SpreadsheetConfig";

type Item = { id: string; "Clanski Broj": string };

// Exposes the protected helpers; never talks to Google (no API calls made).
class TestRepository extends EntityRepository<Item> {
  constructor(idField: keyof Item) {
    const config: SpreadsheetConfig<Item> = {
      sheetConfig: { sheetName: "Test", range: "Test!A:B" },
      dataTransformer: {
        rowToEntity: (row) => ({ id: row[0], "Clanski Broj": row[1] }),
        entityToRow: (e) => [e.id, e["Clanski Broj"]],
      },
      idField,
    };
    super("test-spreadsheet", config);
  }

  nextId(items: Item[]) {
    return this.getNextId(items);
  }

  retry<T>(op: () => Promise<T>, maxRetries?: number) {
    return this.retryOperation(op, maxRetries, 0);
  }
}

const ids = (field: keyof Item, values: string[]): Item[] =>
  values.map((v) => ({ id: "", "Clanski Broj": "", [field]: v }));

beforeEach(() => {
  vi.stubEnv("GOOGLE_PROJECT_ID", "test");
  vi.stubEnv("GOOGLE_PRIVATE_KEY_ID", "test");
  vi.stubEnv("GOOGLE_PRIVATE_KEY", "test");
  vi.stubEnv("GOOGLE_CLIENT_EMAIL", "test@example.com");
  vi.stubEnv("GOOGLE_CLIENT_ID", "test");
});

describe("EntityRepository constructor", () => {
  it("throws listing the missing env vars", () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "");
    expect(() => new TestRepository("id")).toThrow(
      "Missing required environment variables: GOOGLE_CLIENT_ID",
    );
  });
});

describe("EntityRepository.getNextId", () => {
  it("uses max + 1 for regular id fields", () => {
    const repo = new TestRepository("id");
    expect(repo.nextId([])).toBe("1");
    expect(repo.nextId(ids("id", ["1", "5", "3"]))).toBe("6");
  });

  it("starts Clanski Broj at count + 1, skips taken numbers, pads to 6", () => {
    const repo = new TestRepository("Clanski Broj");
    expect(repo.nextId([])).toBe("000001");
    expect(repo.nextId(ids("Clanski Broj", ["000001", "000002"]))).toBe(
      "000003",
    );
    // count + 1 = 3 is taken, so the next free number above it is used
    expect(repo.nextId(ids("Clanski Broj", ["000001", "000003"]))).toBe(
      "000004",
    );
    // non-numeric numbers (e.g. P/01) only count towards the starting point
    expect(repo.nextId(ids("Clanski Broj", ["P/01", "000001"]))).toBe("000003");
  });
});

describe("EntityRepository.retryOperation", () => {
  it("retries until the operation succeeds", async () => {
    const repo = new TestRepository("id");
    const op = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error("flaky"))
      .mockResolvedValue("ok");
    await expect(repo.retry(op)).resolves.toBe("ok");
    expect(op).toHaveBeenCalledTimes(2);
  });

  it("rethrows the last error after max retries", async () => {
    const repo = new TestRepository("id");
    const op = vi
      .fn<() => Promise<string>>()
      .mockRejectedValue(new Error("down"));
    await expect(repo.retry(op, 3)).rejects.toThrow("down");
    expect(op).toHaveBeenCalledTimes(3);
  });
});
