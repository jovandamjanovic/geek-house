export interface Room {
  id: string;
  name: string;
  image: string;
  capacity: string;
  description: string;
  tags: string[];
}

export const ROOMS: Room[] = [
  {
    id: "dungeon",
    name: "Dungeon",
    image: "/irena/images/dungeon.webp",
    capacity: "👥 8–10 osoba",
    description:
      "Gornja soba za ekipu koja voli mirniju atmosferu, duže partije i intimniji osećaj igranja. Odličan izbor za strategije, RPG i fokusirane gejming večeri.",
    tags: ["RPG", "Strategije"],
  },
  {
    id: "ravenloft",
    name: "Ravenloft",
    image: "/irena/images/ravenloft.webp",
    capacity: "👥 10–12 osoba",
    description:
      "Prostor sa izraženim fantasy karakterom, odličan za veće ekipe, tematska okupljanja, duže partije i posebne večeri uz omiljene naslove.",
    tags: ["Fantasy", "Tematski stolovi"],
  },
  {
    id: "alexandria",
    name: "Alexandria",
    image: "/irena/images/aleksandria.webp",
    capacity: "👥 4–6 osoba",
    description:
      "Mirnija i elegantnija soba, idealna za manje grupe, opuštene partije i večeri uz klasike iz naše kolekcije, uz igre na dohvat ruke.",
    tags: ["Klasici", "Opušteno"],
  },
  {
    id: "bivsa-arkada",
    name: "Bivša arkada",
    image: "/irena/images/bivsa-arkada.webp",
    capacity: "👥 12–15 osoba",
    description:
      "Najprostranija opcija za veća društva, rođendane, team building događaje, organizovana okupljanja i dinamične grupne večeri.",
    tags: ["Veće grupe", "Događaji"],
  },
];
