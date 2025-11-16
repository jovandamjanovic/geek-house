// Internal service interfaces (for service layer with parsed Date objects)
export type ClanForCreation = {
  "Ime i Prezime": string;
  email?: string;
  telefon?: string;
  status: ClanStatus; // Required with default value
  "Datum Rodjenja"?: Date; // Always Date when reaching service layer
  Napomene?: string;
};

export type ClanarinaForCreation = {
  "Clanski Broj": string;
  "Datum Uplate": Date; // Always Date when reaching service layer
  tip: ClanarinaType;
  "Nacin Placanja": PlacanjeType;
  napravio: string;
};
