// Pure utility functions for date handling
const DateUtils = {
  parse: (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date(dateStr); // Fallback to default parsing
  },

  format: (date: Date | undefined): string => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  },
};

// Pure utility functions for formatting
const FormatUtils = {
  phone: (phone: string): string => {
    if (!phone) return '';
    const cleanPhone = phone.trim();
    if (cleanPhone && !cleanPhone.startsWith('0')) {
      return '0' + cleanPhone;
    }
    return cleanPhone;
  },

  clanskiBroj: (broj: string): string => {
    if (!broj) return '';
    return broj.padStart(6, '0');
  },
};

export { DateUtils, FormatUtils };
