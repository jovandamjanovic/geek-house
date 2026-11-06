import { describe, expect, it } from "vitest";
import { DateUtils, FormatUtils } from "@/lib/utils";

describe("DateUtils", () => {
  it("parses dd/mm/yyyy as a local date", () => {
    const date = DateUtils.parse("05/03/2026");
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(2);
    expect(date.getDate()).toBe(5);
  });

  it("formats a date as zero-padded dd/mm/yyyy", () => {
    expect(DateUtils.format(new Date(2026, 0, 7))).toBe("07/01/2026");
    expect(DateUtils.format(undefined)).toBe("");
  });

  it("round-trips format -> parse", () => {
    const original = new Date(1990, 11, 31);
    expect(DateUtils.parse(DateUtils.format(original)).getTime()).toBe(
      original.getTime(),
    );
  });

  it("parseOptional returns undefined for empty or invalid cells", () => {
    expect(DateUtils.parseOptional(undefined)).toBeUndefined();
    expect(DateUtils.parseOptional("")).toBeUndefined();
    expect(DateUtils.parseOptional("   ")).toBeUndefined();
    expect(DateUtils.parseOptional("not a date")).toBeUndefined();
    expect(DateUtils.parseOptional("09/05/1990")).toEqual(new Date(1990, 4, 9));
  });

  it("formats an invalid date as empty instead of NaN/NaN/NaN", () => {
    expect(DateUtils.format(new Date("invalid"))).toBe("");
  });
});

describe("FormatUtils", () => {
  it("prefixes a leading 0 to phone numbers that lack one", () => {
    expect(FormatUtils.phone("641234567")).toBe("0641234567");
    expect(FormatUtils.phone("0641234567")).toBe("0641234567");
    expect(FormatUtils.phone("")).toBe("");
  });

  it("leaves international phone numbers unchanged", () => {
    expect(FormatUtils.phone("+381641234567")).toBe("+381641234567");
    expect(FormatUtils.phone(" +381 64 123 4567 ")).toBe("+381 64 123 4567");
    expect(FormatUtils.phone("00381641234567")).toBe("00381641234567");
  });

  it("pads clanski broj to 6 digits", () => {
    expect(FormatUtils.clanskiBroj("12")).toBe("000012");
    expect(FormatUtils.clanskiBroj("123456")).toBe("123456");
    expect(FormatUtils.clanskiBroj("")).toBe("");
  });
});
