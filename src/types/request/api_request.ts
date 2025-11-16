// DTO interfaces for API responses (with serialized dates)
export interface ClanRequest {
  "Clanski Broj": string|null;
  "Ime i Prezime": string;
  email?: string;
  telefon?: string;
  status: ClanStatus;
  "Datum Rodjenja"?: string; // ISO string in API responses
  Napomene?: string;
}

export interface ClanarinaRequest {
  id: string;
  "Clanski Broj": string|null;
  "Datum Uplate": string|null; // ISO string in API responses
}
