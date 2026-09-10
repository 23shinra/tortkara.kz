"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Globe } from "@phosphor-icons/react";
import { locales, localeLabels, type Locale } from "@/lib/i18n/config";
import { useLocale } from "@/components/LocaleProvider";

function stripLocale(pathname: string) {
  const segments = pathname.split("/");
  if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
    const rest = segments.slice(2).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname;
}

function Flag({ locale }: { locale: Locale }) {
  const frame =
    "h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(255,255,255,0.12)]";

  switch (locale) {
    case "kk":
      return (
        <svg className={frame} viewBox="0 0 20 14" aria-hidden="true">
          <rect width="20" height="14" fill="#00AFCA" />
          <circle cx="10" cy="7" r="2.35" fill="#FEC50C" />
          <g fill="#FEC50C">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <rect
                key={deg}
                x="9.55"
                y="2.15"
                width="0.9"
                height="2.1"
                rx="0.2"
                transform={`rotate(${deg} 10 7)`}
              />
            ))}
          </g>
          <path
            fill="#FEC50C"
            d="M1.4 2.8c.2 3.4 1.7 5.8 3.4 6.4-1.1-1.3-1.7-3.2-1.6-5.2.05-.7.2-1.35.4-1.95-.75.15-1.45.45-2.2.75z"
          />
        </svg>
      );
    case "ru":
      return (
        <svg className={frame} viewBox="0 0 20 14" aria-hidden="true">
          <rect width="20" height="4.67" fill="#fff" />
          <rect y="4.67" width="20" height="4.66" fill="#0039A6" />
          <rect y="9.33" width="20" height="4.67" fill="#D52B1E" />
        </svg>
      );
    case "en":
      return (
        <svg className={frame} viewBox="0 0 20 14" aria-hidden="true">
          <rect width="20" height="14" fill="#012169" />
          <path d="M0 0l20 14M20 0L0 14" stroke="#fff" strokeWidth="2.6" />
          <path d="M0 0l20 14M20 0L0 14" stroke="#C8102E" strokeWidth="1.3" />
          <path d="M10 0v14M0 7h20" stroke="#fff" strokeWidth="4.2" />
          <path d="M10 0v14M0 7h20" stroke="#C8102E" strokeWidth="2.3" />
        </svg>
      );
    case "cn":
      return (
        <svg className={frame} viewBox="0 0 20 14" aria-hidden="true">
          <rect width="20" height="14" fill="#DE2910" />
          <path
            fill="#FFDE00"
            d="M3.5 3.2 4.15 5.2H6.2L4.55 6.4l.65 2-1.7-1.25L1.8 8.4l.65-2L.8 5.2h2.05z"
          />
          <g fill="#FFDE00">
            <circle cx="8.6" cy="2.6" r="0.55" />
            <circle cx="10.1" cy="3.8" r="0.55" />
            <circle cx="10.1" cy="5.7" r="0.55" />
            <circle cx="8.6" cy="6.9" r="0.55" />
          </g>
        </svg>
      );
  }
}

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const { locale } = useLocale();
  const path = stripLocale(pathname);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center border border-line-strong text-text transition-colors hover:border-text"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={menuId}
        aria-label="Language"
        onClick={() => setOpen((v) => !v)}
      >
        <Globe size={20} weight="bold" />
      </button>

      {open ? (
        <div
          id={menuId}
          role="listbox"
          aria-label="Language"
          className="absolute right-0 top-[calc(100%+0.35rem)] z-[80] min-w-[11rem] border border-line-strong bg-bg-elevated py-1 shadow-[0_12px_40px_var(--shadow)]"
        >
          {locales.map((code) => {
            const href = path === "/" ? `/${code}` : `/${code}${path}`;
            const active = code === locale;
            return (
              <Link
                key={code}
                href={href}
                hrefLang={code === "cn" ? "zh-CN" : code}
                role="option"
                aria-selected={active}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-accent font-semibold text-brand-blue"
                    : "text-text-muted hover:bg-bg-elevated hover:text-text"
                }`}
                onClick={() => setOpen(false)}
              >
                <Flag locale={code} />
                <span>{localeLabels[code]}</span>
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
