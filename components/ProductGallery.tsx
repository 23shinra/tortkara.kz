"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlassPlus } from "@phosphor-icons/react";
import { ImageLightbox } from "@/components/ImageLightbox";
import { NoPhotoPlaceholder } from "@/components/NoPhotoPlaceholder";
import { useLocale } from "@/components/LocaleProvider";
import { mediaUrl } from "@/lib/media";

export function ProductGallery({
  images,
  title,
  version,
}: {
  images: string[];
  title: string;
  version?: string;
}) {
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

  if (!images.length) {
    return (
      <div className="aspect-[4/3] overflow-hidden border border-line">
        <NoPhotoPlaceholder label={dict.common.photosOnRequest} />
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-3">
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="group relative aspect-[4/3] overflow-hidden border border-line bg-bg-elevated text-left sm:aspect-[4/3]"
          aria-label="Открыть фото"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolved[active]}
            alt={`${title} — фото ${active + 1}`}
            className="absolute inset-0 h-full w-full object-contain"
          />
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 bg-bg/80 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-text-muted">
            <MagnifyingGlassPlus size={14} weight="bold" />
            Увеличить
          </span>
          {images.length > 1 ? (
            <p className="absolute bottom-2 right-2 bg-bg/80 px-2 py-1 text-[0.65rem] text-text-muted">
              {active + 1} / {images.length}
            </p>
          ) : null}
        </button>
        {images.length > 1 ? (
          <div className="thumb-scroll">
            {resolved.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                className={`relative aspect-square overflow-hidden border ${
                  i === active ? "border-accent" : "border-line opacity-70"
                }`}
                aria-label={`Фото ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {lightbox ? (
        <ImageLightbox
          items={items}
          index={active}
          onIndexChange={setActive}
          onClose={() => setLightbox(false)}
        />
      ) : null}
    </>
  );
}
