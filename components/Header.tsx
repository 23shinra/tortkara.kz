"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { List, Phone, X } from "@phosphor-icons/react";
import { ApplyButton } from "@/components/ApplyModal";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LocaleLink } from "@/components/LocaleLink";
import { useLocale } from "@/components/LocaleProvider";
import { company, instagramHref, phoneHref, whatsappHref } from "@/lib/company";
import {
  catalogEquipmentHref,
  isEquipmentCatalogPath,
} from "@/lib/catalog-nav";
import { locales, type Locale } from "@/lib/i18n/config";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="#25D366"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const gradId = `ig-grad-${uid}`;
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={gradId} cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <path
        fill={`url(#${gradId})`}
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
      />
    </svg>
  );
}

function stripLocale(pathname: string) {
  const segments = pathname.split("/");
  if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
    const rest = segments.slice(2).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname;
}

type NavDropdownItem = { href: string; label: string; active?: boolean };

function NavDropdown({
  href,
  label,
  active,
  items,
}: {
  href: string;
  label: string;
  active: boolean;
  items: NavDropdownItem[];
}) {
  return (
    <div className="group relative">
      <LocaleLink
        href={href}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-200 ${
          active ? "text-accent hover:text-accent-hover" : "text-text-muted hover:text-accent"
        }`}
        aria-haspopup="true"
      >
        {label}
      </LocaleLink>
      <div className="pointer-events-none invisible absolute left-1/2 top-full z-[80] min-w-[15.5rem] -translate-x-1/2 pt-3 opacity-0 transition duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100">
        <div className="border border-line bg-bg-elevated py-2 shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
          {items.map((item) => (
            <LocaleLink
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                item.active
                  ? "bg-bg-soft text-accent"
                  : "text-text-muted hover:bg-bg-soft hover:text-accent"
              }`}
            >
              {item.label}
            </LocaleLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const { dict } = useLocale();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const path = stripLocale(pathname);

  const nav = useMemo(
    () => [
      { href: "/gallery", label: dict.nav.assortment },
      { href: "/about", label: dict.nav.about },
      { href: "/terms", label: dict.nav.terms },
      { href: "/reviews", label: dict.nav.reviews },
      { href: "/contacts", label: dict.nav.contacts },
    ],
    [dict],
  );

  const equipmentNavItems = useMemo(
    () => [
      { href: catalogEquipmentHref("kelly-bars"), label: dict.catalog.eqKellyBars },
      { href: catalogEquipmentHref("casing-oscillators"), label: dict.catalog.eqCasingOscillators },
      { href: catalogEquipmentHref("drilling-tools"), label: dict.nav.drillingToolsShort },
    ],
    [dict],
  );

  const rigsActive = path === "/catalog" || (path.startsWith("/catalog/") && !isEquipmentCatalogPath(path));
  const equipmentActive = isEquipmentCatalogPath(path);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  const menu =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-x-0 bottom-0 top-14 z-[65] overflow-y-auto border-t border-line bg-bg lg:hidden"
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label={dict.nav.menu}
          >
            <nav className="container-wide flex min-h-full flex-col py-4 pb-28">
              <div className="mb-4">
                <LanguageSwitcher />
              </div>
              {nav.map((item) => {
                const active = path === item.href || path.startsWith(`${item.href}/`);
                return (
                  <LocaleLink
                    key={item.href}
                    href={item.href}
                    className={`border-b border-line py-4 text-base font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ${
                      active ? "text-accent" : "text-text hover:text-accent"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </LocaleLink>
                );
              })}
              <LocaleLink
                href="/catalog"
                className={`border-b border-line py-4 text-base font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ${
                  rigsActive ? "text-accent" : "text-text hover:text-accent"
                }`}
                onClick={() => setOpen(false)}
              >
                {dict.nav.rigs}
              </LocaleLink>
              <div className="border-b border-line py-4">
                <p className="text-base font-semibold uppercase tracking-[0.12em] text-text">
                  {dict.nav.equipment}
                </p>
                <div className="mt-2 flex flex-col gap-1 pl-3">
                  {equipmentNavItems.map((item) => (
                    <LocaleLink
                      key={item.href}
                      href={item.href}
                      className="py-2 text-sm font-semibold uppercase tracking-[0.1em] text-text-muted hover:text-accent"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </LocaleLink>
                  ))}
                </div>
              </div>
              <ApplyButton
                className="border-b border-line py-4 text-left text-base font-semibold uppercase tracking-[0.12em] text-text"
                onClick={() => setOpen(false)}
              >
                {dict.nav.apply}
              </ApplyButton>
              <a
                href={phoneHref}
                className="mt-6 inline-flex items-center gap-3 py-3 text-base text-accent"
                onClick={() => setOpen(false)}
              >
                <Phone size={20} weight="bold" />
                {company.phoneDisplay}
              </a>
              <ApplyButton
                className="btn btn-primary mt-4 w-full"
                onClick={() => setOpen(false)}
              >
                {dict.nav.leaveApply}
              </ApplyButton>
            </nav>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <header className="sticky top-0 z-[70] border-b border-line bg-[color-mix(in_srgb,var(--bg-elevated)_92%,transparent)] backdrop-blur-md">
        <div className="container-wide flex h-16 items-center gap-2 sm:h-14 sm:gap-3 md:h-[4.5rem]">
          <div className="flex min-w-0 flex-1 items-center overflow-hidden sm:flex-none">
            <LocaleLink
              href="/"
              className="relative flex min-w-0 max-w-full shrink items-center"
              onClick={() => setOpen(false)}
            >
              <Image
                src="/brand/logo-wide.png"
                alt={dict.nav.logoAlt}
                width={280}
                height={72}
                className="hidden h-9 w-auto sm:block md:h-11"
                priority
              />
              <Image
                src="/brand/logo-wide.png"
                alt={company.brand}
                width={360}
                height={92}
                className="h-12 w-auto max-w-[min(15.5rem,58vw)] object-contain object-left sm:hidden"
                priority
              />
            </LocaleLink>
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-6 xl:gap-8 lg:flex">
            <LocaleLink
              href="/catalog"
              className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-200 ${
                rigsActive ? "text-accent hover:text-accent-hover" : "text-text-muted hover:text-accent"
              }`}
            >
              {dict.nav.rigs}
            </LocaleLink>
            <NavDropdown
              href={catalogEquipmentHref()}
              label={dict.nav.equipment}
              active={equipmentActive}
              items={equipmentNavItems}
            />
            {nav.map((item) => {
              const active = path === item.href || path.startsWith(`${item.href}/`);
              return (
                <LocaleLink
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-200 ${
                    active
                      ? "text-accent hover:text-accent-hover"
                      : "text-text-muted hover:text-accent"
                  }`}
                >
                  {item.label}
                </LocaleLink>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher className="shrink-0" />
            <a
              href={phoneHref}
              className="hidden items-center gap-2 text-sm font-medium text-text transition-colors duration-200 hover:text-accent xl:inline-flex"
            >
              <Phone size={18} weight="bold" />
              {company.phoneDisplay}
            </a>
            <div className="hidden items-center gap-2 lg:flex">
              <a
                href={instagramHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center border border-line-strong transition-colors hover:border-[#E1306C]/40 hover:bg-[#E1306C]/8"
                aria-label={dict.nav.instagramAria}
              >
                <InstagramIcon className="h-[22px] w-[22px]" />
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center border border-line-strong transition-colors hover:border-[#25D366]/40 hover:bg-[#25D366]/8"
                aria-label={dict.nav.whatsappAria}
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            </div>
            <a
              href={instagramHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center border border-line-strong lg:hidden"
              aria-label={dict.nav.instagramAria}
            >
              <InstagramIcon className="h-[22px] w-[22px]" />
            </a>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center border border-line-strong text-text lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
            </button>
          </div>
        </div>
      </header>
      {menu}
    </>
  );
}
