import type { Metadata } from "next";
import { Suspense } from "react";
import ContactForm from "@/app/components/irena/kontakt/ContactForm";
import OpenStatus from "@/app/components/irena/shared/OpenStatus";
import PageHero from "@/app/components/irena/shared/PageHero";
import "../styles/pages/kontakt.css";

export const metadata: Metadata = {
  title: "Kontakt | Eliksir",
  description:
    "Kontaktiraj Eliksir za rezervacije, prijave za događaje ili bilo kakvo pitanje.",
};

export default function KontaktPage() {
  return (
    <>
      <PageHero
        title="Kontakt"
        description="Javi nam se za rezervacije, prijave za događaje ili bilo kakvo pitanje u vezi sa klubom."
        meta={
          <>
            <span>Odgovaramo u najkraćem roku</span>
            <span className="dot">•</span>
            <span>Oblačića Rada 11, Niš</span>
          </>
        }
      />

      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Informacije</h2>
              <OpenStatus />

              <div className="quick-actions">
                <a
                  className="qa-btn"
                  href="viber://chat?number=%2B381693060969"
                >
                  💜 Viber
                </a>
                <a
                  className="qa-btn"
                  href="https://wa.me/381693060969"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  💚 WhatsApp
                </a>
              </div>

              <div className="info-item">
                <span className="info-label">📍 Adresa</span>
                <p className="muted">Oblačića Rada 11, Niš</p>
                <p className="muted map-link-wrap">
                  <a
                    className="map-btn"
                    href="https://www.google.com/maps/search/?api=1&query=Oblačića%20Rada%2011%2C%20Niš"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Otvori u Google Maps
                  </a>
                </p>
              </div>

              <div className="info-item">
                <span className="info-label">🕒 Radno vreme</span>
                <p className="muted">Uto–Ned: 17:00–23:00</p>
                <p className="muted">Pon: zatvoreno</p>
              </div>

              <div className="info-item">
                <span className="info-label">📩 Email</span>
                <p className="muted">
                  <a href="mailto:eliksir@gmail.com">eliksir@gmail.com</a>
                </p>
              </div>

              <div className="info-item">
                <span className="info-label">📸 Instagram</span>
                <p className="muted">
                  <a
                    href="https://www.instagram.com/eliksir.club/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @eliksir.club
                  </a>
                </p>
              </div>

              <div className="info-item">
                <span className="info-label">📘 Facebook</span>
                <p className="muted">
                  <a
                    href="https://www.facebook.com/Eliksirklub/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Klub Društvenih Igara &quot;Eliksir&quot; – Niš
                  </a>
                </p>
              </div>

              <div className="info-item">
                <span className="info-label">🎮 Discord</span>
                <p className="muted">
                  <a
                    href="https://discord.com/invite/9r7mpcMmYk"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pridruži nam se na Discordu
                  </a>
                </p>
              </div>

              <div className="mini-note">
                <div className="note-row">
                  ✨ Prvi put? Napiši koliko vas je i koje igre volite.
                </div>
                <div className="note-row">
                  🧾 Rezervacija: <b>broj ljudi</b> • <b>dan</b> • <b>vreme</b>
                </div>
              </div>
            </div>

            <div className="contact-form-wrap">
              <h2>Pošalji poruku</h2>
              <Suspense fallback={null}>
                <ContactForm />
              </Suspense>
              <p className="form-helper">
                Odgovaramo najčešće u roku od nekoliko sati (radnim danima).
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
