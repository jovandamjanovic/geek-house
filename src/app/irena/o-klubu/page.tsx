import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/app/components/irena/shared/PageHero";
import "../styles/pages/o-klubu.css";

export const metadata: Metadata = {
  title: "O klubu | Eliksir",
  description:
    "Saznaj više o Eliksiru — neprofitnom klubu društvenih igara u Nišu.",
};

export default function OKlubuPage() {
  return (
    <>
      <PageHero
        title="O klubu"
        description="Sigurno, prijatno i inkluzivno mesto za sve koji vole društvene igre."
        meta={
          <>
            <span>Zajednica za sve generacije i nivoe iskustva</span>
            <span className="dot">•</span>
            <span>Topla atmosfera u srcu Niša</span>
          </>
        }
      />

      <section className="about-section">
        <div className="container">
          <div className="about-wrapper">
            <div className="about-text">
              <h2>Naša vizija</h2>
              <p>
                Naša vizija je da Eliksir bude sigurno, inkluzivno i prijatno
                utočište za sve koji vole društvene igre — bez obzira na
                iskustvo, godine ili stil igre.
              </p>
              <p>
                Eliksir okuplja ljude koji žele da se druže, upoznaju nove
                ljude, otkrivaju zanimljive igre i budu deo zajednice u kojoj se
                svako oseća dobrodošlo.
              </p>
              <ul className="about-highlights">
                <li>🎲 120+ društvenih igara</li>
                <li>🤝 Otvorena i prijateljska atmosfera</li>
                <li>📍 U srcu Niša</li>
              </ul>
            </div>
            <div className="about-image">
              <Image
                src="/irena/images/o-klubu.webp"
                alt="Atmosfera u Eliksiru"
                width={500}
                height={350}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="expect">
        <div className="container expect-wrap">
          <div className="expect-head">
            <h2>Šta želimo da gradimo</h2>
            <p>
              Želimo da povežemo ljude svih generacija i iskustava kroz ljubav
              prema društvenim igrama. Naš cilj je da negujemo različite
              zajednice i stvorimo prostor u kome se svako oseća prijatno – bilo
              da dolazi prvi put ili je već deo naše ekipe.
            </p>
            <p>
              Verujemo da igre mogu da okupe ljude, pokrenu razgovore i stvore
              nova prijateljstva. Zato gradimo mesto gde su druženje,
              kreativnost i dobra energija podjednako važni kao i sama igra.
            </p>
            <p>
              Kroz igre, događaje i zajednička iskustva, Eliksir želi da
              inspiriše saradnju, razvija lokalnu hobi scenu i pruži prostor u
              kome ljudi mogu da se opuste, upoznaju i provedu kvalitetno vreme
              zajedno.
            </p>
          </div>

          <div className="expect-grid">
            <article className="expect-card is-feature">
              <div className="expect-icon">👥</div>
              <h3>Povezivanje ljudi</h3>
              <p>
                Okupljamo početnike, iskusne igrače i sve koji žele da budu deo
                zajednice.
              </p>
            </article>
            <article className="expect-card">
              <div className="expect-icon">🃏</div>
              <h3>Različite zajednice</h3>
              <p>
                Od društvenih i kartaških igara do RPG grupa i drugih hobija.
              </p>
            </article>
            <article className="expect-card">
              <div className="expect-icon">✨</div>
              <h3>Atmosfera dobrodošlice</h3>
              <p>
                Gradimo prostor u kome svako može da se opusti, igra i oseća
                prijatno.
              </p>
            </article>
            <article className="expect-card drinks">
              <div className="expect-icon">🎯</div>
              <h3>Zajednički rast</h3>
              <p>
                Neprofitnim radom podržavamo razvoj hobija i bogatiju lokalnu
                scenu.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="cta-block">
        <div className="container cta-inner">
          <h2>Svaka partija je nova priča</h2>
          <p className="muted">
            Eliksir postoji da bismo zajedno gradili mesto u kojem je svaki
            susret novo prijateljstvo, a svaka poseta mali beg od svakodnevice.
          </p>
          <div className="hero-actions">
            <Link href="/irena/dogadjaji" className="btn">
              Događaji
            </Link>
            <Link href="/irena/kontakt" className="btn btn-ghost">
              Kontakt
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
