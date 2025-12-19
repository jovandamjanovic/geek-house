import { ClanStatus, ClanarinaType, PlacanjeType, SobaName } from "@/types";

export type User = {
  username: string;
  name: string;
  surname: string;
  password: string;
};

export type Clan = {
  "Clanski Broj": string | null;
  "Ime i Prezime": string;
  email?: string;
  telefon?: string;
  status: ClanStatus;
  "Datum Rodjenja"?: Date;
  Napomene?: string;
};

export type Clanarina = {
  id: string | null;
  "Clanski Broj": string;
  "Datum Uplate": Date;
  tip: ClanarinaType;
  "Nacin Placanja": PlacanjeType;
  napravio: string;
};

type RezervacijaUser = {
  ime: string;
};

type DiscordRezervacijaUser = RezervacijaUser & {
  kontakt: string;
};
type TelefonRezervacijaUser = RezervacijaUser & {
  kontakt: string;
};

export type Rezervacija = {
  id: string | null;
  datum: Date;
  rezervisao: DiscordRezervacijaUser | TelefonRezervacijaUser;
  stolovi: Sto[];
};

export type Soba = {
  id: string;
  naziv: SobaName;
  sprat: -1 | 0 | 1;
  stolovi: Sto[];
};

export type Sto = {
  id: string;
  opis: string;
  broj_stolica: number;
  soba: Soba;
};
