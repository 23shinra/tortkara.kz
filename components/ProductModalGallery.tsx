"use client";

import { useMemo, useState } from "react";
import { CaretLeft, CaretRight, MagnifyingGlassPlus } from "@phosphor-icons/react";
import { ImageLightbox } from "@/components/ImageLightbox";
import { NoPhotoPlaceholder } from "@/components/NoPhotoPlaceholder";
import { useLocale } from "@/components/LocaleProvider";
import { mediaUrl } from "@/lib/media";

type Props = {
  images: string[];
  title: string;
  version?: string;
  compact?: boolean;
};

export function ProductModalGallery({ images, title, version, compact = false }: Props) {
  const { dict } = useLocale();
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const resolved = useMemo(
    () => images.map((src) => mediaUrl(src, version)),
    [images, version],
  );

  const items = useMemo(
    () => resolved.map((src, i) => ({ src, alt: `${title} — фото ${i + 1}` })),
    [resolved, title],
  );

  const hasMany = resolved.length > 1;

  function go(delta: number) {
    if (!hasMany) return;
    setActive((i) => (i + delta + resolved.length) % resolved.length);
  }

  if (!resolved.length) {
    return (
      <div
        className={`flex items-center justify-center bg-bg-elevated ${
          compact ? "aspect-[4/3] min-h-[200px]" : "min-h-[280px] sm:min-h-[340px]"
        }`}
      >
        <NoPhotoPlaceholder label={dict.common.photosOnRequest} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`relative flex items-center justify-center bg-bg-elevated ${
          compact ? "min-h-[200px] sm:min-h-[240px]" : "min-h-[280px] sm:min-h-[360px]"
        }`}
      >
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="group relative flex h-full w-full items-center justify-center text-left"
          aria-label="Увеличить фото"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolved[active]}
            alt={`${title} — ${active + 1}`}
            className="max-h-[min(52vh,420px)] w-full object-contain p-2 sm:max-h-[min(58vh,480px)] sm:p-4"
          />
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 bg-bg/90 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-text-muted opacity-90 transition-opacity group-hover:opacity-100">
            <MagnifyingGlassPlus size={14} weight="bold" />
            Увеличить
          </span>
        </button>
        {hasMany ? (
          <>
            <button
              type="button"
              className="absolute left-2 top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-accent text-brand-blue sm:left-3"
              aria-label="Предыдущее фото"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
            >
              <CaretLeft size={18} weight="bold" />
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-accent text-brand-blue sm:right-3"
              aria-label="Следующее фото"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
            >
              <CaretRight size={18} weight="bold" />
            </button>
            <p className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 bg-bg/90 px-2 py-0.5 text-[0.65rem] font-semibold text-text-muted">
              {active + 1} / {resolved.length}
            </p>
          </>
        ) : null}
      </div>
      {hasMany ? (
        <div className="lightbox-thumbs px-1 pb-1">
          {resolved.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-14 w-14 shrink-0 overflow-hidden outline-none ring-offset-2 ring-offset-bg ${
                i === active ? "ring-2 ring-accent opacity-100" : "opacity-55 hover:opacity-85"
              }`}
              aria-label={`Фото ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-contain bg-bg-elevated" />
            </button>
          ))}
        </div>
      ) : null}

      {lightbox ? (
        <ImageLightbox
          items={items}
          index={active}
          onIndexChange={setActive}
          onClose={() => setLightbox(false)}
        />
      ) : null}
    </div>
  );
}
