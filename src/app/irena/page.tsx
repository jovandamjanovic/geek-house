import type { Metadata } from "next";
import Link from "next/link";
import AtmosferaSection from "@/app/components/irena/home/AtmosferaSection";
import "./styles/pages/home.css";

export const metadata: Metadata = {
  title: "Eliksir | Klub društvenih igara",
  description:
    "Eliksir je klub društvenih igara u Nišu. Turniri, kvizovi i večeri uz najbolje board igre.",
};

export default function IrenaHomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="container hero-content">
          <h1>Eliksir</h1>
          <p>Igra. Društvo. Smeh.</p>
          <Link href="/irena/igre" className="btn">
            Pogledaj igre
          </Link>
        </div>
        <div className="scroll-hint">
          <span />
        </div>
      </section>

      <section className="intro">
        <div className="container intro-inner">
          <h2>Dobrodošli u Eliksir</h2>
          <p className="intro-lead">
            Eliksir je neprofitni klub društvenih igara u Nišu koji okuplja
            ljude svih generacija i iskustava — od potpunih početnika do
            dugogodišnjih ljubitelja hobija.
          </p>
          <p>
            Kod nas možeš da upoznaš nove ljude, otkriješ sjajne igre i provedeš
            veče u opuštenoj, prijateljskoj atmosferi.
          </p>
          <p>
            Preko <strong>120 društvenih igara</strong> čeka te u našoj
            kolekciji — od brzih party igara do ozbiljnih strategija i RPG
            avantura.
          </p>

          <div className="intro-highlights">
            <div className="highlight">
              <i className="fa-solid fa-dice" />
              <h4>120+ igara</h4>
              <p>Od brzih party igara do strateških i RPG avantura.</p>
            </div>
            <div className="highlight">
              <i className="fa-solid fa-users" />
              <h4>Otvoreno za sve</h4>
              <p>Mesto za početnike, iskusne igrače i sve između.</p>
            </div>
            <div className="highlight">
              <i className="fa-solid fa-calendar" />
              <h4>Događaji svake nedelje</h4>
              <p>Kvizovi, turniri, RPG sesije i tematske večeri.</p>
            </div>
          </div>

          <Link href="/irena/o-klubu" className="btn">
            Saznaj više o klubu
          </Link>
        </div>
      </section>

      <AtmosferaSection />

      <section className="highlight-strip pricing-strip">
        <div className="container">
          <div className="strip-heading">
            <h2>Cene i članarine</h2>
            <p>
              Eliksir je neprofitno udruženje — sav prihod ide direktno u razvoj
              kluba i zajednice.
            </p>
          </div>

          <div className="strip-inner pricing-inner">
            <div className="price-pill">
              <span className="price-label">🎟 Dnevna karta</span>
              <strong>300 RSD</strong>
              <small>Celodnevni pristup + 100+ igara + kafa i čaj</small>
            </div>
            <div className="price-pill featured">
              <span className="price-label">⭐ Mesečna karta</span>
              <strong>1500 RSD</strong>
              <small>Najbolja opcija za redovne dolaske</small>
            </div>
            <div className="price-pill">
              <span className="price-label">🧪 Članarina</span>
              <strong>500 RSD</strong>
              <small>Popusti, pogodnosti i povoljnija mesečna karta</small>
            </div>
          </div>

          <p className="pricing-note">
            Sve igre iz naše biblioteke uključene su u cenu ulaza.
          </p>
          <Link href="/irena/rezervacija" className="pricing-link">
            Detalji o članstvu →
          </Link>
        </div>
      </section>
    </>
  );
}
