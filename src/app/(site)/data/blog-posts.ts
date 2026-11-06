export interface BlogPost {
  id: string;
  image: string;
  imageAlt: string;
  meta: string;
  title: string;
  paragraphs: string[];
  list?: { title: string; description: string }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    image: "/irena/images/igre.webp",
    imageAlt: "Društvene igre na stolu",
    meta: "12. mart 2026 · Eliksir tim",
    title: "Zašto su društvene igre ponovo popularne",
    paragraphs: [
      "U vremenu kada je većina zabave na ekranu, društvene igre nude nešto potpuno drugačije — razgovor uživo, zajedničko razmišljanje i trenutke koji se pamte mnogo duže od jedne partije.",
      "Ljudi danas sve više traže iskustva koja mogu da podele sa drugima, a moderne društvene igre upravo to omogućavaju. Scena je danas mnogo bogatija nego ranije — postoje igre za početnike, porodice, stratege i velike ekipe.",
      "U Eliksiru posebno volimo trenutak kada se za istim stolom nađu ljudi koji se možda prvi put vide, a već posle jedne partije pričaju, smeju se i planiraju sledeći susret. To je prava magija društvenih igara.",
    ],
  },
  {
    id: "post-2",
    image: "/irena/images/igre-1.webp",
    imageAlt: "Igre za početnike",
    meta: "8. mart 2026 · Preporuke",
    title: "Top 5 igara za početnike",
    paragraphs: [
      "Ako tek ulaziš u svet društvenih igara, najbolje je da počneš sa naslovima koji se brzo uče i odmah pokazuju koliko ovaj hobi može da bude zabavan.",
      "Najlepši deo je što nijedna od ovih igara ne zahteva veliko predznanje. Dovoljno je da sedneš, opustiš se i odigraš jednu partiju — vrlo brzo ćeš želeti još.",
    ],
    list: [
      {
        title: "Azul",
        description: "prelepa i zarazna igra slaganja pločica.",
      },
      {
        title: "Ticket to Ride",
        description:
          "idealna za početnike koji vole planiranje i jednostavna pravila.",
      },
      {
        title: "Dixit",
        description: "kreativna igra asocijacija i mašte.",
      },
      {
        title: "Codenames",
        description: "savršena za ekipe i mnogo smeha.",
      },
      {
        title: "Splendor",
        description: "lagana za učenje, ali taktički zanimljiva.",
      },
    ],
  },
  {
    id: "post-3",
    image: "/irena/images/igre-2.webp",
    imageAlt: "Atmosfera u klubu Eliksir",
    meta: "3. mart 2026 · Klub",
    title: "Kako izgleda jedno veče u Eliksiru",
    paragraphs: [
      "Ako nikada nisi bio/la u board game klubu, potpuno je normalno da se pitaš kako izgleda jedno veče u takvom prostoru. Dobra vest je — mnogo opuštenije nego što misliš.",
      "Ljudi dolaze u različito vreme, okupljaju se za stolovima, biraju igre u zavisnosti od raspoloženja i broja igrača, a atmosfera je mešavina smeha, takmičarskog duha i dobre energije.",
      "Nekad se igra nešto brzo i lagano, a nekad se izvlače ozbiljne strategije koje traju satima. Bez obzira da li dolaziš prvi put ili si već deo ekipe, poenta je ista — da se opustiš i uživaš u igri.",
    ],
  },
];
