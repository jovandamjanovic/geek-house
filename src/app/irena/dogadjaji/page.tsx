import type { Metadata } from "next";
import Link from "next/link";
import { EVENTS, FEATURED_EVENT } from "@/app/irena/data/events";
import PageHero from "@/app/components/irena/shared/PageHero";
import "../styles/pages/dogadjaji.css";

export const metadata: Metadata = {
  title: "Događaji | Eliksir",
  description:
    "Predstojeći događaji u Eliksiru — kvizovi, turniri, RPG sesije i večeri društvenih igara.",
};

export default function DogadjajiPage() {
  return (
    <>
      <PageHero
        title="Događaji"
        description="U Eliksiru se stalno nešto dešava — od kvizova i turnira do RPG sesija i tematskih večeri."
        meta={
          <>
            <span>Redovni događaji za sve nivoe iskustva</span>
            <span className="dot">•</span>
            <span className="hint">Prijave i rezervacije preko kontakta</span>
          </>
        }
      />

      <section className="events-section">
        <div className="container">
          <h2 className="section-title">Predstojeći događaji</h2>
          <p className="muted center">
            Prati šta je sledeće u Eliksiru i prijavi se na vreme — broj mesta
            za neke događaje je ograničen.
          </p>

          <div className="featured-event">
            <span className="badge badge-special">{FEATURED_EVENT.badge}</span>
            <h3>{FEATURED_EVENT.title}</h3>
            <p className="muted">{FEATURED_EVENT.description}</p>
            <div className="featured-meta">
              <span>{FEATURED_EVENT.date}</span>
              <span>{FEATURED_EVENT.time}</span>
              <span>{FEATURED_EVENT.players}</span>
              <span>{FEATURED_EVENT.location}</span>
            </div>
            <div className="hero-actions">
              <Link className="btn" href={FEATURED_EVENT.signupHref}>
                Prijavi se
              </Link>
              <Link className="btn btn-ghost" href="/irena/igre">
                Vidi igre
              </Link>
            </div>
          </div>

          <div className="events-grid">
            {EVENTS.map((event) => (
              <article key={event.title} className="event-card">
                <div className="event-date">
                  <div className="event-day">{event.day}</div>
                  <div className="event-num">{event.num}</div>
                  <div className="event-mon">{event.month}</div>
                  <div className="event-year">{event.year}</div>
                </div>
                <div className="event-body">
                  <div className="event-top">
                    <span className={`badge ${event.badgeClass}`}>
                      {event.badge}
                    </span>
                    <span className="event-time muted">{event.time}</span>
                  </div>
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-desc">{event.description}</p>
                  <div className="event-meta">
                    <span className="muted">{event.meta}</span>
                    <Link className="event-btn" href={event.actionHref}>
                      {event.actionLabel}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="note-box">
            <p className="muted center">
              Ako dolaziš prvi put, slobodno nam piši — pomoći ćemo ti da
              odabereš događaj, preporučiti igre i uklopiti te u ekipu.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
