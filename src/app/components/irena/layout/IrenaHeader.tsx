"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const NAV_LINKS = [
  {
    href: "/irena",
    label: "Početna",
    match: (path: string) => path === "/irena",
  },
  {
    href: "/irena/o-klubu",
    label: "O klubu",
    match: (path: string) => path.startsWith("/irena/o-klubu"),
  },
  {
    href: "/irena/rezervacija",
    label: "Rezervacije",
    match: (path: string) => path.startsWith("/irena/rezervacija"),
  },
  {
    href: "/irena/dogadjaji",
    label: "Događaji",
    match: (path: string) => path.startsWith("/irena/dogadjaji"),
  },
  {
    href: "/irena/igre",
    label: "Igre",
    match: (path: string) => path.startsWith("/irena/igre"),
  },
  {
    href: "/irena/shop",
    label: "Prodavnica",
    match: (path: string) => path.startsWith("/irena/shop"),
  },
  {
    href: "/irena/blog",
    label: "Blog",
    match: (path: string) => path.startsWith("/irena/blog"),
  },
  {
    href: "/irena/kontakt",
    label: "Kontakt",
    match: (path: string) => path.startsWith("/irena/kontakt"),
    isCta: true,
  },
];

export default function IrenaHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const site = document.querySelector(".irena-site");
    if (!site) return;
    site.classList.toggle("nav-open", navOpen);
    return () => site.classList.remove("nav-open");
  }, [navOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const closeNav = useCallback(() => setNavOpen(false), []);

  return (
    <header className={`header${scrolled ? " scrolled" : ""}`}>
      <div className="nav">
        <div className="brand">
          <Link href="/irena" className="brand-link" onClick={closeNav}>
            <Image
              src="/irena/images/logo.png"
              alt="Eliksir logo"
              className="logo"
              width={44}
              height={44}
            />
            <span className="brand-text">Eliksir</span>
          </Link>
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Otvori meni"
          aria-expanded={navOpen}
          aria-controls="main-menu"
          onClick={() => setNavOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className="menu" id="main-menu">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${link.isCta ? "menu-btn" : ""}${link.match(pathname) ? " active" : ""}`}
              onClick={closeNav}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {!navOpen ? null : (
        <div className="nav-backdrop" onClick={closeNav} role="presentation" />
      )}
    </header>
  );
}
