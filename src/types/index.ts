export enum ClanStatus {
  AKTIVAN = 'Aktivan',
  PASIVAN = 'Pasivan',
  PROBNI = 'Probni',
  ISTEKAO = 'Istekao',
  ISKLJUCEN = 'Iskljucen'
}

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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}