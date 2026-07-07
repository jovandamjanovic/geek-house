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

export type BlogPost = {
  id: string;
  image: string;
  imageAlt: string;
  meta: string;
  title: string;
  paragraphs: string[];
  list: { title: string; description: string }[];
};

export type Dogadjaj = {
  id: string;
  featured: boolean;
  title: string;
  description: string;
  badge: string;
  badgeClass: string;
  date: string;
  day: string;
  num: string;
  month: string;
  year: string;
  time: string;
  players: string;
  location: string;
  meta: string;
  actionLabel: string;
  actionHref: string;
  signupHref: string;
};

export type Game = {
  id: string;
  title: string;
  displayTitle: string;
  meta: string;
  description: string;
  category: string;
  tags: string[];
  bggLink?: string;
  youtube?: string;
};

export type Prostorija = {
  id: string;
  name: string;
  image: string;
  capacity: string;
  description: string;
  tags: string[];
};
