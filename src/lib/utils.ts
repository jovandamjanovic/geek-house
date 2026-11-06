// Pure utility functions for date handling
const DateUtils = {
  parse: (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date(dateStr); // Fallback to default parsing
  },

  // For optional date cells: an empty or unparseable cell means "no date"
  // (unlike `parse`, which falls back to the current date).
  parseOptional: (dateStr: string | undefined): Date | undefined => {
    if (!dateStr?.trim()) return undefined;
    const date = DateUtils.parse(dateStr.trim());
    return isNaN(date.getTime()) ? undefined : date;
  },

  format: (date: Date | undefined): string => {
    if (!date || isNaN(date.getTime())) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  },
};

// Pure utility functions for formatting
const FormatUtils = {
  // Restores the leading 0 of local numbers (e.g. "641234567" -> "0641234567").
  // International numbers ("+381...", "00381...") are left as they are.
  phone: (phone: string): string => {
    if (!phone) return "";
    const cleanPhone = phone.trim();
    if (
      cleanPhone &&
      !cleanPhone.startsWith("0") &&
      !cleanPhone.startsWith("+")
    ) {
      return "0" + cleanPhone;
    }
    return cleanPhone;
  },

  clanskiBroj: (broj: string): string => {
    if (!broj) return "";
    return broj.padStart(6, "0");
  },
};

export { DateUtils, FormatUtils };
