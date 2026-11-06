import { describe, expect, it } from "vitest";
import { BlogPostDataTransformer } from "@/lib/persistence/blog-post/google-spreadsheet/BlogPostDataTransformer";
import { GameDataTransformer } from "@/lib/persistence/game/google-spreadsheet/GameDataTransformer";
import { DogadjajDataTransformer } from "@/lib/persistence/dogadjaj/google-spreadsheet/DogadjajDataTransformer";
import { ProstorijaDataTransformer } from "@/lib/persistence/prostorija/google-spreadsheet/ProstorijaDataTransformer";
import { ClanDataTransformer } from "@/lib/persistence/clan/google-spreadsheet/ClanDataTransformer";
import {
  BlogPost,
  Clan,
  ClanStatus,
  Dogadjaj,
  Game,
  Prostorija,
} from "@/types";

describe("BlogPostDataTransformer", () => {
  const transformer = new BlogPostDataTransformer();

  it("splits paragraphs on ||| and parses the JSON list", () => {
    const post = transformer.rowToEntity([
      "1",
      "/irena/images/igre.webp",
      "Igre",
      "12. mart 2026",
      "Naslov",
      "Prvi pasus.|||Drugi pasus.",
      '[{"title":"Catan","description":"Klasik"}]',
    ]);
    expect(post.paragraphs).toEqual(["Prvi pasus.", "Drugi pasus."]);
    expect(post.list).toEqual([{ title: "Catan", description: "Klasik" }]);
  });

  it("handles missing optional cells", () => {
    const post = transformer.rowToEntity(["1", "img", "alt", "meta", "T"]);
    expect(post.paragraphs).toEqual([]);
    expect(post.list).toEqual([]);
  });

  it("round-trips entity -> row -> entity", () => {
    const post: BlogPost = {
      id: "3",
      image: "https://i.ibb.co/x.png",
      imageAlt: "alt",
      meta: "meta",
      title: "Naslov",
      paragraphs: ["A", "B"],
      list: [],
    };
    expect(transformer.rowToEntity(transformer.entityToRow(post))).toEqual(
      post,
    );
  });
});

describe("GameDataTransformer", () => {
  const transformer = new GameDataTransformer();

  it("splits tags on | and maps empty links to undefined", () => {
    const game = transformer.rowToEntity([
      "1",
      "Codenames",
      "Codenames",
      "Party • 4–8 igrača",
      "Opis",
      "Party igre",
      "party|lagana",
      "",
      "",
    ]);
    expect(game.tags).toEqual(["party", "lagana"]);
    expect(game.bggLink).toBeUndefined();
    expect(game.youtube).toBeUndefined();
  });

  it("round-trips entity -> row -> entity", () => {
    const game: Game = {
      id: "7",
      title: "Splendor",
      displayTitle: "Splendor",
      meta: "meta",
      description: "desc",
      category: "Porodične",
      tags: ["brza"],
      bggLink: "https://boardgamegeek.com/boardgame/148228",
      youtube: "https://youtu.be/abc",
    };
    expect(transformer.rowToEntity(transformer.entityToRow(game))).toEqual(
      game,
    );
  });
});

describe("DogadjajDataTransformer", () => {
  const transformer = new DogadjajDataTransformer();
  const event: Dogadjaj = {
    id: "1",
    featured: true,
    title: "Kviz",
    description: "Opis",
    badge: "Kviz",
    badgeClass: "badge-quiz",
    date: "📅 Uto, 12. mart 2026",
    day: "UTO",
    num: "12",
    month: "MAR",
    year: "2026",
    time: "19:00",
    players: "👥 6–15 igrača",
    location: "📍 Niš",
    meta: "meta",
    actionLabel: "Prijavi ekipu",
    actionHref: "/kontakt",
    signupHref: "/kontakt",
  };

  it("round-trips entity -> row -> entity", () => {
    expect(transformer.rowToEntity(transformer.entityToRow(event))).toEqual(
      event,
    );
  });

  it("only treats the exact string TRUE as featured", () => {
    const row = transformer.entityToRow(event);
    expect(transformer.rowToEntity(row).featured).toBe(true);
    row[1] = "true";
    expect(transformer.rowToEntity(row).featured).toBe(false);
    row[1] = "";
    expect(transformer.rowToEntity(row).featured).toBe(false);
  });
});

describe("ProstorijaDataTransformer", () => {
  const transformer = new ProstorijaDataTransformer();

  it("round-trips entity -> row -> entity", () => {
    const room: Prostorija = {
      id: "1",
      name: "Dungeon",
      image: "/irena/images/dungeon.webp",
      capacity: "👥 8–10 osoba",
      description: "Opis",
      tags: ["RPG", "Strategije"],
    };
    const row = transformer.entityToRow(room);
    expect(row[5]).toBe("RPG|Strategije");
    expect(transformer.rowToEntity(row)).toEqual(room);
  });

  it("returns no tags for an empty tags cell", () => {
    expect(
      transformer.rowToEntity(["1", "Arkada", "img", "cap", "desc"]).tags,
    ).toEqual([]);
  });
});

describe("ClanDataTransformer", () => {
  const transformer = new ClanDataTransformer();

  it("pads clanski broj, prefixes phone and formats birth date", () => {
    const clan: Clan = {
      "Clanski Broj": "12",
      "Ime i Prezime": "Pera Perić",
      telefon: "641234567",
      status: ClanStatus.AKTIVAN,
      "Datum Rodjenja": new Date(1990, 4, 9),
    };
    expect(transformer.entityToRow(clan)).toEqual([
      "000012",
      "Pera Perić",
      "",
      "0641234567",
      "Aktivan",
      "09/05/1990",
      "",
    ]);
  });

  it("defaults status to PROBNI and maps empty cells to undefined", () => {
    const clan = transformer.rowToEntity([
      "000001",
      "Mika",
      "",
      "",
      "",
      "01/01/2000",
    ]);
    expect(clan.status).toBe(ClanStatus.PROBNI);
    expect(clan.email).toBeUndefined();
    expect(clan.telefon).toBeUndefined();
    expect(clan.Napomene).toBeUndefined();
  });

  it("keeps an empty birth date empty across a read -> write cycle", () => {
    const row = ["000001", "Mika", "", "", "Aktivan", "", ""];
    const clan = transformer.rowToEntity(row);
    expect(clan["Datum Rodjenja"]).toBeUndefined();
    expect(transformer.entityToRow(clan)[5]).toBe("");
  });

  it("does not mangle international phone numbers", () => {
    const clan = transformer.rowToEntity([
      "000001",
      "Mika",
      "",
      "+381641234567",
    ]);
    expect(transformer.entityToRow(clan)[3]).toBe("+381641234567");
  });
});
