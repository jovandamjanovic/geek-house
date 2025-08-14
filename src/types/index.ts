export enum ClanStatus {
  AKTIVAN = 'Aktivan',
  PASIVAN = 'Pasivan',
  PROBNI = 'Probni',
  ISTEKAO = 'Istekao',
  ISKLJUCEN = 'Iskljucen'
}

// Base interfaces for existing entities (with required IDs)
export interface Clan {
  'Clanski Broj': string;
  'Ime i Prezime': string;
  email?: string;
  telefon?: string;
  status: ClanStatus;
  'Datum Rodjenja'?: Date;
  Napomene?: string;
}

export interface Clanarina {
  id: string;
  'Clanski Broj': string;
  'Datum Uplate': Date;
}

// Creation interfaces (without auto-generated IDs)
export interface CreateClanRequest {
  'Ime i Prezime': string;
  email?: string;
  telefon?: string;
  status?: ClanStatus;
  'Datum Rodjenja'?: Date | string;
  Napomene?: string;
}

export interface CreateClanarinaRequest {
  'Clanski Broj': string;
  'Datum Uplate': Date | string;
}

// Update interfaces (all fields optional except constraints)
export interface UpdateClanRequest {
  'Ime i Prezime'?: string;
  email?: string;
  telefon?: string;
  status?: ClanStatus;
  'Datum Rodjenja'?: Date | string;
  Napomene?: string;
}

export interface UpdateClanarinaRequest {
  'Clanski Broj'?: string;
  'Datum Uplate'?: Date | string;
}

// Internal service interfaces (for service layer with parsed Date objects)
export interface ClanForCreation {
  'Ime i Prezime': string;
  email?: string;
  telefon?: string;
  status: ClanStatus; // Required with default value
  'Datum Rodjenja'?: Date; // Always Date when reaching service layer
  Napomene?: string;
}

export interface ClanarinaForCreation {
  'Clanski Broj': string;
  'Datum Uplate': Date; // Always Date when reaching service layer
}

// DTO interfaces for API responses (with serialized dates)
export interface ClanDTO {
  'Clanski Broj': string;
  'Ime i Prezime': string;
  email?: string;
  telefon?: string;
  status: ClanStatus;
  'Datum Rodjenja'?: string; // ISO string in API responses
  Napomene?: string;
}

export interface ClanarinaDTO {
  id: string;
  'Clanski Broj': string;
  'Datum Uplate': string; // ISO string in API responses
}

// Discriminated union for API responses
export type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };