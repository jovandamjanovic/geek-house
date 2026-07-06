"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface LightboxImage {
  src: string;
  alt: string;
}

export default function Lightbox() {
  const [image, setImage] = useState<LightboxImage | null>(null);

  const close = useCallback(() => setImage(null), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains("room-image")) {
        const img = target as HTMLImageElement;
        setImage({ src: img.src, alt: img.alt || "Pregled slike" });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!image) return null;

  return (
    <div
      className="lightbox"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      role="presentation"
    >
      <button
        type="button"
        className="lightbox-close"
        onClick={close}
        aria-label="Zatvori"
      >
        &times;
      </button>
      <Image
        className="lightbox-content"
        src={image.src}
        alt={image.alt}
        width={1200}
        height={800}
        unoptimized
      />
    </div>
  );
}
