"use client";

import Image from "next/image";
import { ApplyCtaButton } from "@/components/ApplyCtaButton";
import { LocaleLink } from "@/components/LocaleLink";
import { useLocale } from "@/components/LocaleProvider";
import { company, instagramHref, phoneHref, whatsappHref } from "@/lib/company";

export function Footer() {
  const { dict } = useLocale();

  return (
    <footer className="mt-auto border-t border-line bg-bg-elevated">
      <div className="container-wide grid gap-8 py-10 md:grid-cols-12 md:gap-10 md:py-14">
        <div className="md:col-span-5">
          <Image
            src="/brand/logo-wide.png"
            alt={company.shortName}
            width={260}
            height={67}
            className="h-10 w-auto sm:h-12"
          />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-muted sm:mt-5">
            {dict.company.about}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-2 md:gap-10">
          <div>
            <p className="eyebrow">{dict.common.navigation}</p>
            <ul className="mt-4 space-y-2 text-sm text-text-muted">
              <li>
                <LocaleLink href="/catalog" className="hover:text-text">
                  {dict.footer.catalog}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink href="/gallery" className="hover:text-text">
                  {dict.footer.assortment}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink href="/terms" className="hover:text-text">
                  {dict.footer.terms}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink href="/reviews" className="hover:text-text">
                  {dict.footer.reviews}
                </LocaleLink>
              </li>
              <li>
                <ApplyCtaButton className="hover:text-text">{dict.footer.apply}</ApplyCtaButton>
              </li>
              <li>
                <LocaleLink href="/contacts" className="hover:text-text">
                  {dict.footer.contacts}
                </LocaleLink>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">{dict.nav.contacts}</p>
            <ul className="mt-4 space-y-2 text-sm text-text-muted">
              <li>{company.legalName}</li>
              <li>{company.address}</li>
              <li>
                <a href={phoneHref} className="text-text hover:text-accent">
                  {company.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={whatsappHref} className="hover:text-text" target="_blank" rel="noreferrer">
                  {dict.common.whatsapp}
                </a>
              </li>
              <li>
                <a href={instagramHref} className="hover:text-text" target="_blank" rel="noreferrer">
                  {dict.common.instagram}
                </a>
              </li>
              <li className="pt-2 text-xs leading-relaxed break-all">
                БИН {company.bin}
                <br />
                ИИК {company.iik}
                <br />
                {company.bank}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-wide flex flex-col gap-2 py-5 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {company.legalName}
          </span>
          <span>
            {dict.common.director}: {company.director}
          </span>
        </div>
      </div>
    </footer>
  );
}
