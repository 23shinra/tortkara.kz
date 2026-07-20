"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { List, Phone, X } from "@phosphor-icons/react";
import { company, phoneHref } from "@/lib/company";

const nav = [
  { href: "/catalog", label: "Каталог" },
  { href: "/assortment", label: "Ассортимент" },
  { href: "/terms", label: "Условия" },
  { href: "/reviews", label: "Отзывы" },
  { href: "/apply", label: "Заявка" },
  { href: "/contacts", label: "Контакты" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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
            aria-label="Меню"
          >
            <nav className="container-wide flex min-h-full flex-col py-4 pb-28">
              {nav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`border-b border-line py-4 text-base font-semibold uppercase tracking-[0.12em] ${
                      active ? "text-accent" : "text-text"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <a
                href={phoneHref}
                className="mt-6 inline-flex items-center gap-3 py-3 text-base text-accent"
                onClick={() => setOpen(false)}
              >
                <Phone size={20} weight="bold" />
                {company.phoneDisplay}
              </a>
              <Link
                href="/apply"
                className="btn btn-primary mt-4 w-full"
                onClick={() => setOpen(false)}
              >
                Оставить заявку
              </Link>
            </nav>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <header className="sticky top-0 z-[70] border-b border-line bg-[color-mix(in_srgb,var(--bg)_94%,transparent)] backdrop-blur-md">
        <div className="container-wide flex h-14 items-center justify-between gap-3 md:h-[4.5rem]">
          <Link
            href="/"
            className="relative flex shrink-0 items-center"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/brand/logo-wide.png"
              alt={`${company.shortName} — логотип`}
              width={280}
              height={72}
              className="hidden h-9 w-auto sm:block md:h-11"
              priority
            />
            <Image
              src="/brand/logo.png"
              alt={company.brand}
              width={56}
              height={56}
              className="h-12 w-12 sm:hidden"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-6 xl:gap-8 lg:flex">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                    active ? "text-accent" : "text-text-muted hover:text-text"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={phoneHref}
              className="hidden items-center gap-2 text-sm font-medium text-text md:inline-flex"
            >
              <Phone size={18} weight="bold" />
              {company.phoneDisplay}
            </a>
            <div className="hidden lg:block">
              <Link href="/apply" className="btn btn-primary !min-h-10 !px-4">
                Заявка
              </Link>
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center border border-line-strong text-text lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
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
