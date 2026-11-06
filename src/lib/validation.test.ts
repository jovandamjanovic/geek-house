import { describe, expect, it } from "vitest";
import {
  isFieldPresent,
  sanitizeString,
  validateAndNormalizeStatus,
  validateClanskiBroj,
  validateEmail,
  validateId,
  validatePhone,
} from "@/lib/validation";
import { ClanStatus } from "@/types";

describe("sanitizeString", () => {
  it("trims and strips HTML/script-relevant characters", () => {
    expect(sanitizeString("  <b>Pera</b> ")).toBe("bPerab");
    expect(sanitizeString(`a"b'c&d\`e\\f`)).toBe("abcdef");
  });

  it("returns empty string for non-strings", () => {
    expect(sanitizeString(undefined)).toBe("");
    expect(sanitizeString(42)).toBe("");
    expect(sanitizeString(null)).toBe("");
  });
});

describe("validateEmail", () => {
  it("accepts empty (optional) and well-formed emails", () => {
    expect(validateEmail("")).toBe(true);
    expect(validateEmail("pera@example.com")).toBe(true);
  });

  it("rejects malformed emails", () => {
    expect(validateEmail("pera@")).toBe(false);
    expect(validateEmail("pera example.com")).toBe(false);
  });
});

describe("validatePhone", () => {
  it("accepts empty and common formats", () => {
    expect(validatePhone("")).toBe(true);
    expect(validatePhone("064 123 4567")).toBe(true);
    expect(validatePhone("+381 (64) 123-4567")).toBe(true);
  });

  it("rejects too short or non-numeric input", () => {
    expect(validatePhone("123")).toBe(false);
    expect(validatePhone("call me")).toBe(false);
  });
});

describe("validateClanskiBroj", () => {
  it("accepts 1-6 digit numbers and P/NN numbers", () => {
    expect(validateClanskiBroj("1")).toBe(true);
    expect(validateClanskiBroj("000123")).toBe(true);
    expect(validateClanskiBroj("P/01")).toBe(true);
  });

  it("rejects other formats", () => {
    expect(validateClanskiBroj("1234567")).toBe(false);
    expect(validateClanskiBroj("P/1")).toBe(false);
    expect(validateClanskiBroj("abc")).toBe(false);
  });
});

describe("validateId", () => {
  it("accepts positive integers only", () => {
    expect(validateId("12")).toBe(true);
    expect(validateId("0")).toBe(false);
    expect(validateId("1a")).toBe(false);
    expect(validateId("-1")).toBe(false);
  });
});

describe("isFieldPresent", () => {
  it("treats 0 and false as present, but not null/undefined/empty string", () => {
    expect(isFieldPresent({ a: 0 }, "a")).toBe(true);
    expect(isFieldPresent({ a: false }, "a")).toBe(true);
    expect(isFieldPresent({ a: "" }, "a")).toBe(false);
    expect(isFieldPresent({ a: null }, "a")).toBe(false);
    expect(isFieldPresent({}, "a")).toBe(false);
    expect(isFieldPresent(null, "a")).toBe(false);
  });
});

describe("validateAndNormalizeStatus", () => {
  it("maps Serbian and English variants case-insensitively", () => {
    expect(validateAndNormalizeStatus("aktivan")).toBe(ClanStatus.AKTIVAN);
    expect(validateAndNormalizeStatus("Active")).toBe(ClanStatus.AKTIVAN);
    expect(validateAndNormalizeStatus("EXPIRED")).toBe(ClanStatus.ISTEKAO);
  });

  it("defaults to PROBNI for missing or unknown values", () => {
    expect(validateAndNormalizeStatus(undefined)).toBe(ClanStatus.PROBNI);
    expect(validateAndNormalizeStatus("nonsense")).toBe(ClanStatus.PROBNI);
  });
});
