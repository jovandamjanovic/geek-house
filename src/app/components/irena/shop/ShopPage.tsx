"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MEMBER_DISCOUNT,
  SHOP_PRODUCTS,
  type ShopProduct,
} from "@/app/irena/data/shop-products";

type SortValue =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "relevance", label: "Podrazumevano" },
  { value: "price-asc", label: "Cena: rastuće" },
  { value: "price-desc", label: "Cena: opadajuće" },
  { value: "name-asc", label: "Naziv: A–Z" },
  { value: "name-desc", label: "Naziv: Z–A" },
];

function formatRSD(number: number) {
  return `${new Intl.NumberFormat("sr-RS").format(number)} din`;
}

function getMemberPrice(price: number) {
  return Math.round(price * (1 - MEMBER_DISCOUNT));
}

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function scoreRelevance(item: ShopProduct, query: string) {
  if (!query) return 0;
  const name = normalize(item.name);
  const publisher = normalize(item.publisher);
  let score = 0;
  if (name === query) score += 100;
  if (name.startsWith(query)) score += 60;
  if (name.includes(query)) score += 35;
  if (publisher.startsWith(query)) score += 18;
  if (publisher.includes(query)) score += 10;
  return score;
}

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortValue, setSortValue] = useState<SortValue>("relevance");
  const [sortOpen, setSortOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<ShopProduct | null>(null);

  const filtered = useMemo(() => {
    const query = normalize(search);
    const list = SHOP_PRODUCTS.filter((item) => {
      const matchesStock = !inStockOnly || item.qty > 0;
      const matchesQuery =
        !query ||
        normalize(item.name).includes(query) ||
        normalize(item.publisher).includes(query);
      return matchesStock && matchesQuery;
    });

    if (sortValue === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortValue === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortValue === "name-asc")
      list.sort((a, b) => a.name.localeCompare(b.name, "sr"));
    else if (sortValue === "name-desc")
      list.sort((a, b) => b.name.localeCompare(a.name, "sr"));
    else
      list.sort((a, b) => scoreRelevance(b, query) - scoreRelevance(a, query));

    return list;
  }, [search, inStockOnly, sortValue]);

  const sortLabel =
    SORT_OPTIONS.find((o) => o.value === sortValue)?.label ?? "Podrazumevano";

  const closeModal = useCallback(() => setModalProduct(null), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSortOpen(false);
        closeModal();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeModal]);

  return (
    <div className="shop-page">
      <section className="page-hero">
        <div className="page-hero-inner">
          <h1>Prodavnica</h1>
          <p>Originalne društvene igre — proveri dostupnost i cenu. ✨</p>

          <div className="shop-controls">
            <div className="control">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                type="search"
                placeholder="Pretraži igre ili izdavača..."
                autoComplete="off"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div
              className={`control select custom-select${sortOpen ? " is-open" : ""}`}
            >
              <i className="fa-solid fa-arrow-up-wide-short" />
              <button
                type="button"
                className="cs-trigger"
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
                onClick={() => setSortOpen((open) => !open)}
              >
                <span>Sortiraj: {sortLabel}</span>
                <i className="fa-solid fa-chevron-down cs-chevron" />
              </button>
              <div className="cs-panel" role="listbox" tabIndex={-1}>
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`cs-option${sortValue === option.value ? " is-active" : ""}`}
                    onClick={() => {
                      setSortValue(option.value);
                      setSortOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="control checkbox">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <span>Samo na stanju</span>
            </label>
          </div>

          <div className="shop-meta">
            <span>{filtered.length} proizvoda</span>
            <span className="dot">•</span>
            <span className="hint">Klikni karticu za detalje</span>
          </div>
        </div>
      </section>

      <section className="shop-grid-wrap">
        <div className="shop-grid">
          {filtered.map((item) => {
            const inStock = item.qty > 0;
            const memberPrice = getMemberPrice(item.price);
            return (
              <article
                key={`${item.name}-${item.publisher}`}
                className="shop-card"
                tabIndex={0}
                role="button"
                onClick={() => setModalProduct(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setModalProduct(item);
                }}
              >
                <div className={`stock-badge${inStock ? "" : " out"}`}>
                  <span className="dot" />
                  <span>{inStock ? "Na stanju" : "Nema na stanju"}</span>
                </div>
                <h3 className="shop-title">{item.name}</h3>
                <p className="shop-publisher">{item.publisher}</p>
                <div className="shop-row">
                  <div className="shop-price-wrap">
                    <div className="shop-price">{formatRSD(item.price)}</div>
                    <div className="shop-member-price">
                      {formatRSD(memberPrice)} za članove
                    </div>
                  </div>
                  <div className="shop-qty">
                    {inStock ? `Količina: ${item.qty}` : "—"}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div
        className="shop-modal"
        aria-hidden={modalProduct ? "false" : "true"}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("[data-close]")) closeModal();
        }}
        role="presentation"
      >
        <div className="shop-modal-backdrop" data-close />
        <div
          className="shop-modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
        >
          <button
            type="button"
            className="shop-modal-close"
            aria-label="Zatvori"
            data-close
            onClick={closeModal}
          >
            <i className="fa-solid fa-xmark" />
          </button>
          {modalProduct ? (
            <div className="shop-modal-body">
              <div
                className={`shop-badge stock-badge${modalProduct.qty > 0 ? "" : " out"}`}
              >
                <span className="dot" />
                <span>
                  {modalProduct.qty > 0 ? "Na stanju" : "Nema na stanju"}
                </span>
              </div>
              <h2 id="modalTitle">{modalProduct.name}</h2>
              <p className="modal-publisher">
                Izdavač: {modalProduct.publisher}
              </p>
              <div className="modal-price-row">
                <div className="modal-price">
                  <span className="modal-regular-price">
                    {formatRSD(modalProduct.price)}
                  </span>
                  <span className="modal-member-price">
                    {formatRSD(getMemberPrice(modalProduct.price))} za članove
                  </span>
                </div>
                <div className="modal-qty">
                  {modalProduct.qty > 0
                    ? `Na stanju: ${modalProduct.qty}`
                    : "Trenutno nema na stanju"}
                </div>
              </div>
              <div className="modal-actions">
                <Link
                  className="btn-gold"
                  href={`/irena/kontakt?topic=shop&product=${encodeURIComponent(modalProduct.name)}&publisher=${encodeURIComponent(modalProduct.publisher)}&price=${modalProduct.price}&memberPrice=${getMemberPrice(modalProduct.price)}`}
                >
                  Kontaktiraj
                </Link>
                <button
                  type="button"
                  className="btn-ghost"
                  data-close
                  onClick={closeModal}
                >
                  Zatvori
                </button>
              </div>
              <p className="modal-note">
                Raspitajte se preko kontakta ili društvenih mreža o dostupnosti,
                ceni i načinu isporuke.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
