"use client";

import { useCallback, useEffect, type ReactNode } from "react";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import { ZoomableImage } from "@/components/ZoomableImage";

export type LightboxItem = {
  src: string;
  alt: string;
  caption?: ReactNode;
};

type Props = {
  items: LightboxItem[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  label?: string;
  footer?: ReactNode;
  sidePanel?: ReactNode;
};

export function ImageLightbox({
  items,
  index,
  onIndexChange,
  onClose,
  label,
  footer,
  sidePanel,
}: Props) {
  const total = items.length;
  const current = items[index];
  const hasMany = total > 1;

  const go = useCallback(
    (delta: number) => {
      if (!hasMany) return;
      onIndexChange((index + delta + total) % total);
    },
    [hasMany, index, total, onIndexChange],
  );

  useEffect(() => {
    document.body.classList.add("menu-open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        onClose();
        return;
      }
      if (!hasMany) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey, true);
    };
  }, [hasMany, go, onClose]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-5 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={label ?? current.alt}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[var(--overlay)] backdrop-blur-[2px]"
        aria-label="Закрыть"
        onClick={onClose}
      />

      <div
        className={`relative z-10 flex w-full max-w-4xl flex-col overflow-hidden bg-bg-elevated shadow-[0_24px_80px_var(--shadow)] ${
          sidePanel ? "max-w-5xl md:flex-row" : ""
        }`}
      >
        <button
          type="button"
          className="absolute right-3 top-3 z-30 inline-flex h-10 w-10 items-center justify-center bg-bg/90 text-text"
          aria-label="Закрыть"
          onClick={onClose}
        >
          <X size={20} weight="bold" />
        </button>

        <div
          className={`relative w-full shrink-0 bg-bg-elevated ${
            sidePanel ? "h-[min(50vh,420px)] md:h-auto md:min-h-[420px] md:flex-1" : "h-[min(55vh,480px)] sm:h-[min(60vh,560px)]"
          }`}
        >
          <ZoomableImage
            key={current.src}
            src={current.src}
            alt={current.alt}
            sizes={sidePanel ? "(max-width: 768px) 100vw, 60vw" : "100vw"}
            priority
            onSwipePrev={hasMany ? () => go(-1) : undefined}
            onSwipeNext={hasMany ? () => go(1) : undefined}
          />

          {hasMany ? (
            <>
              <button
                type="button"
                className="absolute left-2 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-bg/90 text-text sm:left-3"
                aria-label="Предыдущее фото"
                onClick={() => go(-1)}
              >
                <CaretLeft size={20} weight="bold" />
              </button>
              <button
                type="button"
                className="absolute right-2 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-bg/90 text-text sm:right-3"
                aria-label="Следующее фото"
                onClick={() => go(1)}
              >
                <CaretRight size={20} weight="bold" />
              </button>
              <p className="pointer-events-none absolute left-1/2 top-3 z-20 -translate-x-1/2 bg-bg/90 px-2.5 py-1 text-[0.7rem] font-semibold tracking-[0.08em] text-text-muted">
                {index + 1} / {total}
              </p>
            </>
          ) : null}
        </div>

        {sidePanel ? (
          <div className="flex shrink-0 flex-col justify-center bg-bg p-5 sm:p-6 md:w-[min(360px,38%)] md:p-8">
            {sidePanel}
          </div>
        ) : null}

        {footer != null ? (
          <div className="shrink-0 bg-bg">{footer}</div>
        ) : current.caption != null ? (
          <p className="shrink-0 bg-bg px-4 py-3 text-center text-sm text-text-muted">
            {current.caption}
          </p>
        ) : null}

        {hasMany && !sidePanel ? (
          <div className="lightbox-thumbs shrink-0 bg-bg px-3 py-3">
            {items.map((item, i) => (
              <button
                key={`${item.src}-${i}`}
                type="button"
                onClick={() => onIndexChange(i)}
                className={`relative h-14 w-14 shrink-0 overflow-hidden outline-none ring-offset-2 ring-offset-bg ${
                  i === index ? "ring-2 ring-accent opacity-100" : "opacity-55 hover:opacity-85"
                }`}
                aria-label={`Фото ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
              >
                {/* Local product photos with cache-bust query — skip optimizer */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
