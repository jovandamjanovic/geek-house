import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "@/app/components/irena/shared/Lightbox";
import PageHero from "@/app/components/irena/shared/PageHero";
import { prostorijaService } from "@/lib/domain/prostorija/service";
import "../styles/pages/rezervacija.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Rezervacije | Eliksir",
  description:
    "Rezerviši sto ili prostor u Eliksiru — klubu društvenih igara u Nišu.",
};

export default async function RezervacijaPage() {
  const rooms = await prostorijaService.getProstorije();

  return (
    <>
      <PageHero
        title="Rezervacije"
        description="Rezerviši sto, organizuj okupljanje ili isplaniraj poseban događaj u Eliksiru."
        meta={
          <>
            <span>4 tematske sobe</span>
            <span className="dot">•</span>
            <span>Prostor za ekipe, rođendane i privatna okupljanja</span>
          </>
        }
      />

      <section className="reservation-section">
        <div className="container">
          <div className="reservation-info-grid">
            <div className="res-panel res-pricing">
              <h2>Cene i članarine</h2>
              <ul className="price-list">
                <li>
                  <strong>Dnevna karta</strong> <span>300 RSD</span>
                </li>
                <li>
                  <strong>Mesečna karta</strong> <span>1500 RSD</span>
                </li>
                <li>
                  <strong>Članarina</strong> <span>500 RSD</span>
                </li>
              </ul>
              <p className="price-extra">
                Članovi imaju mesečnu kartu po ceni od <strong>1000 RSD</strong>
                , a lojalni članovi nakon 6 meseci članstva samo{" "}
                <strong>500 RSD</strong>.
              </p>
              <p className="nonprofit-note">
                Eliksir je neprofitno udruženje — sav prihod ulaže se u razvoj
                kluba, nabavku novih igara i organizaciju događaja.
              </p>
            </div>

            <div className="res-panel res-how">
              <h2>Šta možeš da rezervišeš?</h2>
              <p>
                U Eliksiru možeš rezervisati prostor za svoju ekipu, ali i
                organizovati različite vrste okupljanja u opuštenoj i
                prijateljskoj atmosferi kluba.
              </p>
              <ul className="res-list">
                <li>
                  <strong>Rezervacije stolova</strong> za redovne dolaske i
                  večeri uz igre
                </li>
                <li>
                  <strong>Rođendane</strong> i privatna okupljanja
                </li>
                <li>
                  <strong>Team building događaje</strong> za manje i veće grupe
                </li>
                <li>
                  <strong>Privatne sesije i radionice</strong> po dogovoru
                </li>
              </ul>
              <a href="#rooms" className="section-link">
                Pogledaj sobe <span>→</span>
              </a>
            </div>
          </div>

          <section id="rooms">
            <div className="rooms-heading">
              <h2>Izaberi prostor za svoju ekipu</h2>
              <p>
                Svaka soba u Eliksiru ima svoj karakter — od intimnijih prostora
                za manje grupe do većih prostora za događaje, rođendane i
                organizovana okupljanja.
              </p>
            </div>

            <div className="rooms-grid">
              {rooms.map((room) => (
                <article key={room.id} className="room-card">
                  <div className="room-image-wrap">
                    <Image
                      src={room.image}
                      alt={`${room.name} soba`}
                      className="room-image"
                      width={400}
                      height={260}
                    />
                  </div>
                  <div className="room-card-content">
                    <div className="room-card-top">
                      <h3>{room.name}</h3>
                      <span className="room-capacity">{room.capacity}</span>
                    </div>
                    <p className="room-description">{room.description}</p>
                    <div className="room-card-bottom">
                      <div className="room-tags">
                        {room.tags.map((tag) => (
                          <span key={tag} className="room-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        href={`/irena/kontakt?topic=rezervacija&room=${encodeURIComponent(room.name)}`}
                        className="btn room-btn"
                      >
                        Rezerviši
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>

      <Lightbox />
    </>
  );
}
