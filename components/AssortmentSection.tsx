"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { ImageLightbox } from "@/components/ImageLightbox";
import { LocaleLink } from "@/components/LocaleLink";
import { useLocale } from "@/components/LocaleProvider";
import { Reveal } from "@/components/Reveal";
import { assortmentPhotos } from "@/lib/assortment";

type Props = {
  limit?: number;
  showLink?: boolean;
};

export function AssortmentSection({ limit, showLink = false }: Props) {
  const { dict } = useLocale();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const photos = limit ? assortmentPhotos.slice(0, limit) : assortmentPhotos;

  const items = useMemo(
    () =>
      photos.map((photo) => ({
        src: photo.src,
        alt: photo.alt,
        caption: photo.caption,
      })),
    [photos],
  );

  return (
    <section className="py-14 md:py-28">
      <div className="container-wide">
        <Reveal>
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end md:gap-6">
            <div>
              <p className="eyebrow">{dict.assortment.eyebrow}</p>
              <h2 className="display mt-3 max-w-3xl text-3xl sm:text-4xl md:text-6xl">
                {dict.assortment.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted sm:mt-4 sm:text-base">
                {dict.assortment.text}
              </p>
            </div>
            {showLink ? (
              <LocaleLink href="/gallery" className="btn btn-ghost w-full sm:w-auto self-start">
                {dict.assortment.allPhotos}
                <ArrowRight size={16} weight="bold" />
              </LocaleLink>
            ) : (
              <LocaleLink href="/catalog" className="btn btn-ghost w-full sm:w-auto self-start">
                {dict.assortment.toCatalog}
                <ArrowRight size={16} weight="bold" />
              </LocaleLink>
            )}
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-2 sm:mt-12 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          {photos.map((photo, i) => (
            <Reveal key={photo.id} delayMs={(i % 3) * 40} className="h-full">
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
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

      {activeIndex != null ? (
        <ImageLightbox
          items={items}
          index={activeIndex}
          onIndexChange={setActiveIndex}
          onClose={() => setActiveIndex(null)}
        />
      ) : null}
    </section>
  );
}
