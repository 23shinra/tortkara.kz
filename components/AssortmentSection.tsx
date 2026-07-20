"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, X } from "@phosphor-icons/react";
import { Reveal } from "@/components/Reveal";
import { assortmentPhotos, type AssortmentPhoto } from "@/lib/assortment";

type Props = {
  limit?: number;
  showLink?: boolean;
};

export function AssortmentSection({ limit, showLink = false }: Props) {
  const [active, setActive] = useState<AssortmentPhoto | null>(null);
  const photos = limit ? assortmentPhotos.slice(0, limit) : assortmentPhotos;

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.body.classList.add("menu-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <section className="py-14 md:py-28">
      <div className="container-wide">
        <Reveal>
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end md:gap-6">
            <div>
              <p className="eyebrow">Ассортимент</p>
              <h2 className="display mt-3 max-w-3xl text-3xl sm:text-4xl md:text-6xl">
                Парк техники и оснастки
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted sm:mt-4 sm:text-base">
                Буровые установки XCMG и SANY, инструмент и комплектующие на площадке.
              </p>
            </div>
            {showLink ? (
              <Link href="/assortment" className="btn btn-ghost w-full sm:w-auto self-start">
                Все фото
                <ArrowRight size={16} weight="bold" />
              </Link>
            ) : (
              <Link href="/catalog" className="btn btn-ghost w-full sm:w-auto self-start">
                В каталог моделей
                <ArrowRight size={16} weight="bold" />
              </Link>
            )}
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-2 sm:mt-12 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          {photos.map((photo, i) => (
            <Reveal key={photo.id} delayMs={(i % 3) * 40} className="h-full">
              <button
                type="button"
                onClick={() => setActive(photo)}
                className="group relative block h-full w-full overflow-hidden border border-line bg-surface text-left"
              >
                <div className="relative aspect-[3/4] w-full sm:aspect-[4/5]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <p className="absolute inset-x-0 bottom-0 p-2.5 text-[0.7rem] leading-snug text-white/90 sm:p-4 sm:text-sm">
                    {photo.caption}
                  </p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/90 p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center border border-line-strong bg-bg/80 text-text sm:right-8 sm:top-8"
            aria-label="Закрыть"
            onClick={() => setActive(null)}
          >
            <X size={22} weight="bold" />
          </button>
          <div
            className="relative flex max-h-[92dvh] w-full max-w-5xl flex-col bg-bg sm:max-h-[88vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative min-h-[55dvh] flex-1 bg-black sm:aspect-[4/3] sm:min-h-0 sm:max-h-[80vh]">
              <Image
                src={active.src}
                alt={active.alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            <p className="p-4 text-center text-sm text-text-muted">{active.caption}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
