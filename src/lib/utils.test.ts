
// ------------------------------
// Unit Tests for DateUtils & FormatUtils
// Note: Assumes Jest-style globals (describe, test, expect).
// If using Vitest, add: import { describe, it as test, expect } from 'vitest';
// ------------------------------

describe('DateUtils.parse', () => {
  // Helper to normalize date to yyyy-mm-dd for easy assertion
  const ymd = (d: Date) => {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const da = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${da}`;
  };

  test('returns today when input is empty string', () => {
    const before = new Date();
    const result = DateUtils.parse('');
    const after = new Date();

    // Assert result is "now-ish": same day and within range
    // We primarily verify same date since time can vary between calls
    expect(ymd(result)).toBe(ymd(new Date()));

    // Additionally ensure the timestamp falls between before and after
    expect(result.getTime()).toBeGreaterThanOrEqual(before.getTime() - 5_000);
    expect(result.getTime()).toBeLessThanOrEqual(after.getTime() + 5_000);
  });

  test('parses dd/mm/yyyy format correctly (e.g., 05/01/2024)', () => {
    const d = DateUtils.parse('05/01/2024');
    expect(ymd(d)).toBe('2024-01-05'); // Jan is month 1
  });

  test('parses dd/mm/yyyy with single-digit day and month (5/1/2024)', () => {
    const d = DateUtils.parse('5/1/2024');
    expect(ymd(d)).toBe('2024-01-05');
  });

  test('uses JavaScript Date fallback for non dd/mm/yyyy inputs (ISO date)', () => {
    const d = DateUtils.parse('2024-12-31'); // ISO format
    // JS Date should parse as local time for date-only strings; assert date-only
    expect(ymd(d)).toBe('2024-12-31');
  });

  test('fallback parsing handles RFC2822 strings', () => {
    const d = DateUtils.parse('Tue, 03 Sep 2024 00:00:00 GMT');
    // 2024-09-03 in UTC; local conversion may shift date depending on TZ.
    // To make test robust, compare UTC components.
    expect(d.getUTCFullYear()).toBe(2024);
    expect(d.getUTCMonth()).toBe(8); // September (0-based)
    expect(d.getUTCDate()).toBe(3);
  });

  test('when string has wrong delimiter, falls back to Date constructor', () => {
    const d = DateUtils.parse('05-01-2024'); // hyphens, not slashes => fallback
    // JS Date may parse as 2024-05-01 or 2024-01-05 depending on engine; assert it produced a valid Date
    expect(isNaN(d.getTime())).toBe(false);
  });

  test('invalid string yields Invalid Date via Date constructor', () => {
    const d = DateUtils.parse('not a date at all');
    expect(isNaN(d.getTime())).toBe(true);
  });
});

describe('DateUtils.format', () => {
  test('formats date as dd/mm/yyyy with zero padding', () => {
    const d = new Date(2024, 0, 5); // Jan 5, 2024
    expect(DateUtils.format(d)).toBe('05/01/2024');
  });

  test('formats double-digit day and month correctly', () => {
    const d = new Date(2024, 10, 15); // Nov 15, 2024
    expect(DateUtils.format(d)).toBe('15/11/2024');
  });

  test('returns empty string for undefined input', () => {
    expect(DateUtils.format(undefined as unknown as Date)).toBe('');
  });

  test('handles leap day', () => {
    const d = new Date(2020, 1, 29); // 29 Feb 2020
    expect(DateUtils.format(d)).toBe('29/02/2020');
  });
});

describe('FormatUtils.phone', () => {
  test('returns empty string for empty input', () => {
    expect(FormatUtils.phone('')).toBe('');
  });

  test('trims whitespace and prefixes with 0 if missing', () => {
    expect(FormatUtils.phone(' 123456 ')).toBe('0123456');
  });

  test('does not double-prefix when already starts with 0', () => {
    expect(FormatUtils.phone('0123456')).toBe('0123456');
  });

  test('preserves leading 0 after trimming whitespace', () => {
    expect(FormatUtils.phone('  0123456  ')).toBe('0123456');
  });

  test('handles non-numeric characters by only applying trim/prefix logic', () => {
    // Function does not validate digits, only ensures '0' prefix if first char isn't '0'
    expect(FormatUtils.phone('ABC')).toBe('0ABC');
    expect(FormatUtils.phone('0ABC')).toBe('0ABC');
  });
});

describe('FormatUtils.clanskiBroj', () => {
  test('returns empty string for empty input', () => {
    expect(FormatUtils.clanskiBroj('')).toBe('');
  });

  test('pads to length 6 with zeros on the left', () => {
    expect(FormatUtils.clanskiBroj('1')).toBe('000001');
    expect(FormatUtils.clanskiBroj('123')).toBe('000123');
    expect(FormatUtils.clanskiBroj('123456')).toBe('123456'); // already length 6
  });

  test('does not truncate if longer than 6; padStart leaves as-is', () => {
    expect(FormatUtils.clanskiBroj('1234567')).toBe('1234567');
  });

  test('handles alphanumeric strings consistently', () => {
    expect(FormatUtils.clanskiBroj('AB3')).toBe('000AB3');
  });
});