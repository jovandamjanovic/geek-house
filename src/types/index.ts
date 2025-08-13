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

// Internal service interfaces (for service layer)
export type ClanForCreation = Omit<Clan, 'Clanski Broj'>;
export type ClanarinaForCreation = Omit<Clanarina, 'id'>;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}