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

const FEATURED = [
  {
    game: "Codenames",
    type: "hero" as const,
    kicker: "Najbolje za ekipu",
    chip: "Party",
    description: "Timovi, smeh i “aha!” momenti. Idealno za 4–8 ljudi.",
  },
  {
    game: "Splendor",
    type: "mini" as const,
    pill: "Brzo",
  },
  {
    game: "Ticket to Ride: Europe",
    type: "mini" as const,
    pill: "Klasik",
    displayName: "Ticket to Ride",
  },
  {
    game: "Cascadia",
    type: "mini" as const,
    pill: "Lagano",
  },
  {
    game: "Catan + Expansion for 5-6 players",
    type: "mini" as const,
    pill: "Klasik",
  },
];

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
  const [pulseTitle, setPulseTitle] = useState<string | null>(null);
  const [modalGame, setModalGame] = useState<Game | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
    return GAMES.filter((game) => {
      const text =
        `${game.displayTitle} ${game.meta} ${game.description}`.toLowerCase();
      const matchesSearch = !query || text.includes(query);
      const matchesFilters =
        activeFilters.size === 0 ||
        Array.from(activeFilters).every((filter) =>
          game.tags.map((t) => t.toLowerCase()).includes(filter),
        );
      return matchesSearch && matchesFilters;
    });
  }, [search, activeFilters, GAMES]);

  const visibleTitles = useMemo(
    () => new Set(visibleGames.map((g) => g.title)),
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

  const scrollToGame = useCallback((name: string) => {
    const card = cardRefs.current[name];
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    setPulseTitle(name);
    setTimeout(() => setPulseTitle(null), 1100);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (value.trim() || activeFilters.size > 0) {
      const query = value.trim().toLowerCase();
      const visible = GAMES.filter((game) => {
        const text =
          `${game.displayTitle} ${game.meta} ${game.description}`.toLowerCase();
        const matchesSearch = !query || text.includes(query);
        const matchesFilters =
          activeFilters.size === 0 ||
          Array.from(activeFilters).every((filter) =>
            game.tags.map((t) => t.toLowerCase()).includes(filter),
          );
        return matchesSearch && matchesFilters;
      });
      if (visible.length === 0) {
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
            <span id="gamesCount">120+ igara</span>
            <span className="dot">•</span>
            <span>Klikni karticu za detalje</span>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="featured-head">
          <h2 className="section-title fancy-title">✨ Tople preporuke</h2>
        </div>
        <div className="featured-layout">
          <div
            className="featured-hero featured-card"
            role="button"
            tabIndex={0}
            onClick={() => scrollToGame("Codenames")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") scrollToGame("Codenames");
            }}
          >
            <div className="fh-top">
              <span className="fh-kicker">Najbolje za ekipu</span>
              <span className="fh-chip">Party</span>
            </div>
            <h3>Codenames</h3>
            <p>Timovi, smeh i “aha!” momenti. Idealno za 4–8 ljudi.</p>
            <button className="fh-btn" type="button">
              Saznaj više
            </button>
          </div>
          <div className="featured-mini">
            {FEATURED.filter((f) => f.type === "mini").map((item) => (
              <div
                key={item.game}
                className="featured-card mini"
                role="button"
                tabIndex={0}
                onClick={() => scrollToGame(item.game)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    scrollToGame(item.game);
                }}
              >
                <span>
                  {"displayName" in item ? item.displayName : item.game}
                </span>
                <span className="pill">{item.pill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

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
            const categoryVisible = games.some((g) =>
              visibleTitles.has(g.title),
            );
            if (!categoryVisible) return null;

            return (
              <div
                key={category}
                className={`category${categoryVisible ? "" : " is-hidden"}`}
              >
                <h3 className="category-title">{category}</h3>
                <div className="games-grid">
                  {games.map((game) => {
                    if (!visibleTitles.has(game.title)) return null;
                    return (
                      <div
                        key={game.title}
                        ref={(el) => {
                          cardRefs.current[game.title] = el;
                        }}
                        className={`game-card${pulseTitle === game.title ? " pulse" : ""}`}
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
