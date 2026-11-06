"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Game } from "@/types";

const FILTERS = [
  { id: "brza", label: "Brzo (≤20 min)" },
  { id: "lagana", label: "Za početnike" },
  { id: "2-igraca", label: "2 igrača" },
  { id: "6-plus", label: "6+ igrača" },
  { id: "party", label: "Party" },
  { id: "strategija", label: "Strategija" },
  { id: "kooperativna", label: "Kooperativne" },
];

// Featured recommendations reference games by their `title` column in the
// "Igre" sheet. Entries whose title is not in the sheet are skipped, so
// renaming/removing a game never breaks the page.
const FEATURED_HERO = {
  title: "Codenames",
  kicker: "Najbolje za ekipu",
  chip: "Party",
  description: "Timovi, smeh i “aha!” momenti. Idealno za 4–8 ljudi.",
};

const FEATURED_MINI: { title: string; pill: string; displayName?: string }[] = [
  { title: "Splendor", pill: "Brzo" },
  {
    title: "Ticket to Ride: Europe",
    pill: "Klasik",
    displayName: "Ticket to Ride",
  },
  { title: "Cascadia", pill: "Lagano" },
  { title: "Catan + Expansion for 5-6 players", pill: "Klasik" },
];

function matchesGame(
  game: Game,
  query: string,
  activeFilters: Set<string>,
): boolean {
  const text =
    `${game.displayTitle} ${game.meta} ${game.description}`.toLowerCase();
  const matchesSearch = !query || text.includes(query);
  const tags = game.tags.map((t) => t.toLowerCase());
  const matchesFilters = Array.from(activeFilters).every((filter) =>
    tags.includes(filter),
  );
  return matchesSearch && matchesFilters;
}

function toYoutubeEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }
    const videoId = parsed.searchParams.get("v");
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (parsed.pathname.startsWith("/embed/")) {
      return url;
    }
    return url;
  } catch {
    return url;
  }
}

export default function GamesPage({ initialGames }: { initialGames: Game[] }) {
  const GAMES = initialGames;
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [shake, setShake] = useState(false);
  const [pulseId, setPulseId] = useState<string | null>(null);
  const [modalGame, setModalGame] = useState<Game | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { featuredHero, featuredMini } = useMemo(() => {
    const byTitle = new Map(GAMES.map((game) => [game.title, game]));
    const heroGame = byTitle.get(FEATURED_HERO.title);
    return {
      featuredHero: heroGame ? { ...FEATURED_HERO, game: heroGame } : null,
      featuredMini: FEATURED_MINI.flatMap((item) => {
        const game = byTitle.get(item.title);
        return game ? [{ ...item, game }] : [];
      }),
    };
  }, [GAMES]);

  const categories = useMemo(() => {
    const map = new Map<string, Game[]>();
    for (const game of GAMES) {
      const list = map.get(game.category) ?? [];
      list.push(game);
      map.set(game.category, list);
    }
    return Array.from(map.entries());
  }, [GAMES]);

  const visibleGames = useMemo(() => {
    const query = search.trim().toLowerCase();
    return GAMES.filter((game) => matchesGame(game, query, activeFilters));
  }, [search, activeFilters, GAMES]);

  const visibleIds = useMemo(
    () => new Set(visibleGames.map((g) => g.id)),
    [visibleGames],
  );

  const resultText = useMemo(() => {
    if (!search && activeFilters.size === 0) {
      return `Ukupno: ${GAMES.length}`;
    }
    if (visibleGames.length > 0) {
      return `Pronađeno: ${visibleGames.length}`;
    }
    return "Nema pronađenih igara.";
  }, [search, activeFilters.size, visibleGames.length, GAMES.length]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filter)) next.delete(filter);
      else next.add(filter);
      return next;
    });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalGame(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const scrollToGame = useCallback((id: string) => {
    const card = cardRefs.current[id];
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    setPulseId(id);
    setTimeout(() => setPulseId(null), 1100);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    const query = value.trim().toLowerCase();
    if (query || activeFilters.size > 0) {
      const anyVisible = GAMES.some((game) =>
        matchesGame(game, query, activeFilters),
      );
      if (!anyVisible) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    }
  };

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <h1>Igre</h1>
          <p>
            Preko 120 društvenih igara različitih žanrova čeka te u Eliksiru —
            od laganih porodičnih i party igara do strateških naslova, dedukcije
            i TCG duela.
          </p>
          <div className="page-hero-meta">
            <span id="gamesCount">{GAMES.length} igara</span>
            <span className="dot">•</span>
            <span>Klikni karticu za detalje</span>
          </div>
        </div>
      </section>

      {featuredHero || featuredMini.length > 0 ? (
        <section className="featured-section">
          <div className="featured-head">
            <h2 className="section-title fancy-title">✨ Tople preporuke</h2>
          </div>
          <div className="featured-layout">
            {featuredHero ? (
              <div
                className="featured-hero featured-card"
                role="button"
                tabIndex={0}
                onClick={() => scrollToGame(featuredHero.game.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    scrollToGame(featuredHero.game.id);
                }}
              >
                <div className="fh-top">
                  <span className="fh-kicker">{featuredHero.kicker}</span>
                  <span className="fh-chip">{featuredHero.chip}</span>
                </div>
                <h3>{featuredHero.game.displayTitle}</h3>
                <p>{featuredHero.description}</p>
                <button className="fh-btn" type="button">
                  Saznaj više
                </button>
              </div>
            ) : null}
            {featuredMini.length > 0 ? (
              <div className="featured-mini">
                {featuredMini.map((item) => (
                  <div
                    key={item.game.id}
                    className="featured-card mini"
                    role="button"
                    tabIndex={0}
                    onClick={() => scrollToGame(item.game.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        scrollToGame(item.game.id);
                    }}
                  >
                    <span>{item.displayName ?? item.game.displayTitle}</span>
                    <span className="pill">{item.pill}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="games-section">
        <div className="container">
          <h2 className="section-title">Kategorije igara</h2>
          <div className="games-intro">
            <p>
              U Eliksiru možeš da biraš između više od{" "}
              <strong>120 društvenih igara</strong> različitih žanrova. Na
              raspolaganju su ti lagane i porodične igre, kooperativne avanture,
              party igre, teške strategije, euro naslovi, dedukcija i TCG duel
              igre.
            </p>
          </div>

          <div className="games-controls">
            <div className="filter-bar">
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={`filter-pill${activeFilters.has(filter.id) ? " active" : ""}`}
                  onClick={() => toggleFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="games-toolbar">
              <input
                className="search"
                type="text"
                placeholder="Pretraži igre (npr. Catan, 2–5 igrača)..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              <span
                id="resultCount"
                className={`muted${visibleGames.length === 0 && (search || activeFilters.size > 0) ? " no-results" : ""}${shake ? " shake" : ""}`}
              >
                {resultText}
              </span>
            </div>
          </div>

          <div className="section-divider" />

          {categories.map(([category, games]) => {
            if (!games.some((g) => visibleIds.has(g.id))) return null;

            return (
              <div key={category} className="category">
                <h3 className="category-title">{category}</h3>
                <div className="games-grid">
                  {games.map((game) => {
                    if (!visibleIds.has(game.id)) return null;
                    return (
                      <div
                        key={game.id}
                        ref={(el) => {
                          cardRefs.current[game.id] = el;
                        }}
                        className={`game-card${pulseId === game.id ? " pulse" : ""}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => setModalGame(game)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ")
                            setModalGame(game);
                        }}
                      >
                        <h4>{game.displayTitle}</h4>
                        <p>
                          {game.meta.split("•").slice(1).join("•").trim() ||
                            game.meta}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div
        id="gameModal"
        className={`modal${modalGame ? " show" : " hidden"}`}
        aria-hidden={!modalGame}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("[data-close='true']")) {
            setModalGame(null);
          }
        }}
        role="presentation"
      >
        <div className="modal-backdrop" data-close="true" />
        <div className="modal-card" role="dialog" aria-modal="true">
          <button
            type="button"
            className="modal-close"
            data-close="true"
            aria-label="Zatvori"
            onClick={() => setModalGame(null)}
          >
            ✕
          </button>
          {modalGame ? (
            <>
              <h3 id="modalTitle">{modalGame.title}</h3>
              <p id="modalMeta" className="muted">
                {modalGame.meta}
              </p>
              <p id="modalDesc">{modalGame.description}</p>
              <div className="modal-tags" id="modalTags">
                {modalGame.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              {modalGame.bggLink && (
                <p className="modal-bgg-link">
                  <a
                    href={modalGame.bggLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {modalGame.title} on BoardGameGeek
                  </a>
                </p>
              )}
              {modalGame.youtube && (
                <div className="modal-video">
                  <iframe
                    src={toYoutubeEmbedUrl(modalGame.youtube)}
                    title={`${modalGame.title} - YouTube`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
