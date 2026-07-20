"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  if (!images.length) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center border border-line bg-bg-soft text-sm text-text-muted">
        Фотографии по запросу
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <div className="relative aspect-[4/3] overflow-hidden border border-line bg-black sm:aspect-[4/3]">
        <Image
          src={images[active]}
          alt={`${title} — фото ${active + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-contain"
        />
        {images.length > 1 ? (
          <p className="absolute bottom-2 right-2 bg-bg/80 px-2 py-1 text-[0.65rem] text-text-muted sm:hidden">
            {active + 1} / {images.length}
          </p>
        ) : null}
      </div>
      {images.length > 1 ? (
        <div className="thumb-scroll">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden border ${
                i === active ? "border-accent" : "border-line opacity-70"
              }`}
              aria-label={`Фото ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
