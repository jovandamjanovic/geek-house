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
