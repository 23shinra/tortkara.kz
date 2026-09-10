"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import { Reveal } from "@/components/Reveal";
import { reviews, type Review } from "@/lib/reviews";

export function ReviewsSection() {
  const [active, setActive] = useState<Review | null>(null);

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
    <section className="border-y border-line bg-bg-elevated py-14 md:py-28">
      <div className="container-wide">
        <Reveal>
          <p className="eyebrow">Отзывы</p>
          <h2 className="display mt-3 max-w-3xl text-3xl sm:text-4xl md:text-6xl">
            Техника на объекте — фото от клиентов
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted sm:mt-4 sm:text-base">
            Передачи буровых и сваебойных установок. Реальные сделки Tortkara Machinery.
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal key={review.id} delayMs={(i % 3) * 50} className="h-full">
              <button
                type="button"
                onClick={() => setActive(review)}
                className="group relative block h-full w-full overflow-hidden border border-line bg-surface text-left"
              >
                <div className="relative w-full aspect-[4/5]">
                  <Image
                    src={review.image}
                    alt={review.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                    <p className="text-[0.65rem] uppercase tracking-[0.16em] text-accent">
                      {review.equipment}
                    </p>
                    <p className="mt-2 line-clamp-3 text-sm leading-snug text-white/90">
                      «{review.quote}»
                    </p>
                    <p className="mt-2 text-xs text-white/55">{review.role}</p>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-[var(--overlay)] backdrop-blur-[2px] sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Отзыв"
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
            className="grid max-h-[92dvh] w-full max-w-5xl overflow-y-auto border border-line bg-bg sm:max-h-[90vh] md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative min-h-[42dvh] bg-bg-elevated md:min-h-[480px]">
              <Image
                src={active.image}
                alt={active.alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col justify-center p-5 sm:p-6 md:p-10">
              <p className="eyebrow">{active.equipment}</p>
              <blockquote className="mt-3 text-base leading-relaxed text-text sm:mt-4 sm:text-lg md:text-xl">
                «{active.quote}»
              </blockquote>
              <p className="mt-5 text-sm text-text-muted sm:mt-6">{active.role}</p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
