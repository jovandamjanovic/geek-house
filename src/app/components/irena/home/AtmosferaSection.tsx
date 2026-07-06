"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const IMAGES = [
  "/irena/images/atmosfera.webp",
  "/irena/images/atmosfera-1.webp",
  "/irena/images/atmosfera-2.webp",
];

export default function AtmosferaSection() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % IMAGES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const backgroundImage = `linear-gradient(to bottom, rgba(8, 20, 35, 0.35), rgba(8, 20, 35, 0.75)), url("${IMAGES[currentImage]}")`;

  return (
    <section className="atmosfera" style={{ backgroundImage }}>
      <div className="atmosfera-bg" aria-hidden="true" />
      <div className="container atmosfera-content">
        <h2>Dogadjaji u Eliksiru</h2>
        <p>
          U Eliksiru se stalno nešto dešava — od opuštenih večeri uz društvene
          igre do organizovanih događaja i turnira.
          <br />
          <br />
          Redovno organizujemo:
          <br />
          • nedeljne kvizove
          <br />
          • TCG druženja i turnire
          <br />
          • RPG sesije
          <br />
          • demo večeri i učenje novih igara
          <br />• tematska okupljanja i mini-turnire
        </p>
        <Link href="/irena/dogadjaji" className="btn">
          Pogledaj događaje
        </Link>
      </div>
    </section>
  );
}
