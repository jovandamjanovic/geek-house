import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/app/components/irena/shared/PageHero";
import { dogadjajService } from "@/lib/domain/dogadjaj/service";
import "../styles/pages/dogadjaji.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Događaji | Eliksir",
  description:
    "Predstojeći događaji u Eliksiru — kvizovi, turniri, RPG sesije i večeri društvenih igara.",
};

export default async function DogadjajiPage() {
  const dogadjaji = await dogadjajService.getDogadjaji();
  const featuredEvent = dogadjaji.find((event) => event.featured);
  const events = dogadjaji.filter((event) => !event.featured);

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

          {featuredEvent ? (
            <div className="featured-event">
              <span className="badge badge-special">{featuredEvent.badge}</span>
              <h3>{featuredEvent.title}</h3>
              <p className="muted">{featuredEvent.description}</p>
              <div className="featured-meta">
                <span>{featuredEvent.date}</span>
                <span>{featuredEvent.time}</span>
                <span>{featuredEvent.players}</span>
                <span>{featuredEvent.location}</span>
              </div>
              <div className="hero-actions">
                <Link className="btn" href={featuredEvent.signupHref}>
                  Prijavi se
                </Link>
                <Link className="btn btn-ghost" href="/irena/igre">
                  Vidi igre
                </Link>
              </div>
            </div>
          ) : null}

          <div className="events-grid">
            {events.map((event) => (
              <article key={event.id} className="event-card">
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
