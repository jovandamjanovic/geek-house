export interface FeaturedEvent {
  badge: string;
  title: string;
  description: string;
  date: string;
  time: string;
  players: string;
  location: string;
  signupHref: string;
}

export interface EventCard {
  day: string;
  num: string;
  month: string;
  year: string;
  badge: string;
  badgeClass: string;
  time: string;
  title: string;
  description: string;
  meta: string;
  actionLabel: string;
  actionHref: string;
}

export const FEATURED_EVENT: FeaturedEvent = {
  badge: "Izdvajamo",
  title: "Dedukcija night: Blood on the Clocktower",
  description:
    "Veče blefa, zaključivanja i napete atmosfere uz veliku ekipu. Idealno za sve koji vole društvenu interakciju i nepredvidive partije.",
  date: "📅 Uto, 12. mart 2026",
  time: "🕒 19:00",
  players: "👥 6–15 igrača",
  location: "📍 Oblačića Rada 11, Niš",
  signupHref:
    "/irena/kontakt?topic=dogadjaji&action=prijava&event=Dedukcija%20night%3A%20Blood%20on%20the%20Clocktower",
};

export const EVENTS: EventCard[] = [
  {
    day: "PET",
    num: "08",
    month: "MAR",
    year: "2026",
    badge: "Kviz",
    badgeClass: "badge-quiz",
    time: "19:00",
    title: "Kviz veče: Geek & pop kultura",
    description:
      "Okupi ekipu i proveri znanje iz filmova, serija, igara i opšte kulture. Tematski kvizovi su deo redovnog programa Eliksira.",
    meta: "📍 Oblačića Rada 11, Niš",
    actionLabel: "Prijavi ekipu",
    actionHref:
      "/irena/kontakt?topic=dogadjaji&action=prijava&event=Kviz%20ve%C4%8De%3A%20Geek%20%26%20pop%20kultura",
  },
  {
    day: "SUB",
    num: "09",
    month: "MAR",
    year: "2026",
    badge: "TCG",
    badgeClass: "badge-tcg",
    time: "18:00",
    title: "Yu-Gi-Oh! turnir",
    description:
      "TCG druženja i turniri su redovan deo naše zajednice. Ponesi svoj špil ili dođi da pratiš partije i upoznaš ekipu.",
    meta: "👥 Duel format",
    actionLabel: "Prijavi se",
    actionHref:
      "/irena/kontakt?topic=dogadjaji&action=prijava&event=Yu-Gi-Oh!%20turnir",
  },
  {
    day: "NED",
    num: "10",
    month: "MAR",
    year: "2026",
    badge: "Društvene igre",
    badgeClass: "badge-board",
    time: "17:30",
    title: "Veče društvenih igara",
    description:
      "Opušteno druženje uz preporuke igara na licu mesta, objašnjenje pravila i naslove za početnike i iskusne igrače.",
    meta: "🎲 Demo večeri i učenje novih igara",
    actionLabel: "Rezerviši mesto",
    actionHref: "/irena/rezervacija",
  },
];
