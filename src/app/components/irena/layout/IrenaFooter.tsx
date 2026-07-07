import Link from "next/link";
import { FEATURE_FLAGS } from "@/lib/featureFlags";

const FOOTER_LINKS = [
  { href: "/irena", label: "Početna" },
  { href: "/irena/o-klubu", label: "O klubu" },
  { href: "/irena/rezervacija", label: "Rezervacije" },
  { href: "/irena/dogadjaji", label: "Događaji" },
  { href: "/irena/igre", label: "Igre" },
  { href: "/irena/shop", label: "Prodavnica", feature: "shop" as const },
  { href: "/irena/blog", label: "Blog" },
  { href: "/irena/kontakt", label: "Kontakt" },
];

export default function IrenaFooter() {
  const year = new Date().getFullYear();
  const footerLinks = FOOTER_LINKS.filter(
    (link) => !link.feature || FEATURE_FLAGS[link.feature],
  );

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="brand">Eliksir</div>
          <p className="muted">
            Klub društvenih igara u Nišu posvećen okupljanju zajednice i
            promociji modernih društvenih igara.
          </p>
          <p className="footer-info muted">
            Neprofitno udruženje građana <br />
            APR: 28215096 <br />
            PIB: 109787406
          </p>
          <p className="footer-info muted">
            <i className="fa-solid fa-location-dot" />
            Oblačića Rada 11, Niš
          </p>
        </div>

        <div className="footer-links" aria-label="Linkovi">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="footer-social" aria-label="Društvene mreže">
          <h4 className="footer-title">Prati nas</h4>
          <div className="social-links">
            <a
              href="https://www.instagram.com/eliksir.club/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram profil Eliksir kluba"
            >
              <i className="fa-brands fa-instagram" />
              <span>eliksir.club</span>
            </a>
            <a
              href="https://www.facebook.com/Eliksirklub/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook stranica Eliksir kluba"
            >
              <i className="fa-brands fa-facebook-f" />
              <span>Klub Društvenih Igara &quot;Eliksir&quot; – Niš</span>
            </a>
            <a
              href="https://discord.com/invite/9r7mpcMmYk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord server Eliksir kluba"
            >
              <i className="fa-brands fa-discord" />
              <span>Discord zajednica</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="muted">© {year} Eliksir. Sva prava zadržana.</span>
      </div>
    </footer>
  );
}
