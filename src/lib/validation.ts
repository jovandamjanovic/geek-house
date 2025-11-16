import { ClanStatus } from "@/types";

// Input sanitization helper
export function sanitizeString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/[<>"'&`\/\\]/g, "");
}

export function validateEmail(email: string): boolean {
  if (!email) return true; // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  if (!phone) return true; // Optional field
  const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
  return phoneRegex.test(phone);
}

export function validateClanskiBroj(clanskiBroj: string): boolean {
  // Must be either numeric (1-6 digits) or P/NN format (P/ followed by 2+ digits)
  return /^\d{1,6}$/.test(clanskiBroj) || /^P\/\d{2,}$/.test(clanskiBroj);
}

export function validateId(id: string): boolean {
  return /^\d+$/.test(id) && parseInt(id, 10) > 0;
}

// Better field presence validation that allows falsy values like 0 and false
export function isFieldPresent(body: unknown, field: string): boolean {
  if (typeof body !== "object" || body === null) return false;
  const obj = body as Record<string, unknown>;
  return (
    Object.prototype.hasOwnProperty.call(obj, field) &&
    obj[field] !== null &&
    obj[field] !== undefined &&
    obj[field] !== ""
  );
}

export function validateAndNormalizeStatus(status: unknown): ClanStatus {
  if (!status) return getDefaultStatus();

  const statusStr = sanitizeString(status).toUpperCase();

  // Map common variations to proper enum values
  const statusMapping: Record<string, ClanStatus> = {
    AKTIVAN: ClanStatus.AKTIVAN,
    ACTIVE: ClanStatus.AKTIVAN,
    PASIVAN: ClanStatus.PASIVAN,
    PASSIVE: ClanStatus.PASIVAN,
    PROBNI: ClanStatus.PROBNI,
    TRIAL: ClanStatus.PROBNI,
    ISTEKAO: ClanStatus.ISTEKAO,
    EXPIRED: ClanStatus.ISTEKAO,
    ISKLJUCEN: ClanStatus.ISKLJUCEN,
    EXCLUDED: ClanStatus.ISKLJUCEN,
  };

  return statusMapping[statusStr] || getDefaultStatus();
}

export function getDefaultStatus(): ClanStatus {
  return ClanStatus.PROBNI;
}
