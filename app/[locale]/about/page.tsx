import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import { ApplyCtaButton } from "@/components/ApplyCtaButton";
import { LocaleLink } from "@/components/LocaleLink";
import { Reveal } from "@/components/Reveal";
import { company, instagramHref, phoneHref, whatsappHref } from "@/lib/company";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const dict = await getDictionary(isLocale(raw) ? raw : defaultLocale);
  return { title: dict.about.metaTitle, description: dict.about.metaDescription };
}

export default async function AboutPage({ params }: Props) {
  const { locale: raw } = await params;
  const dict = await getDictionary(isLocale(raw) ? raw : defaultLocale);

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden border-b border-line bg-bg-elevated">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_20%,rgba(229,165,0,0.12),transparent_50%)]" />
        <div className="container-wide relative py-14 md:py-24">
          <p className="eyebrow">{dict.about.eyebrow}</p>
          <h1 className="font-brand mt-4 max-w-4xl text-5xl tracking-[0.04em] sm:text-6xl md:text-8xl">
            {company.brand}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg md:text-xl">
            {dict.about.lead}
          </p>
          <div className="btn-stack mt-8 flex flex-col gap-3 sm:flex-row">
            <ApplyCtaButton className="btn btn-primary">
              {dict.about.ctaApply}
              <ArrowRight size={18} weight="bold" />
            </ApplyCtaButton>
            <LocaleLink href="/catalog" className="btn btn-ghost">
              {dict.about.ctaCatalog}
            </LocaleLink>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-bg-elevated">
        <div className="container-wide grid grid-cols-2 gap-px bg-line md:grid-cols-4">
          {dict.about.facts.map((fact) => (
            <div key={fact.label} className="bg-bg-elevated px-3 py-5 sm:px-5 sm:py-8 md:px-8">
              <p className="display text-2xl text-accent sm:text-3xl md:text-4xl">{fact.value}</p>
              <p className="mt-1.5 text-[0.65rem] uppercase leading-snug tracking-[0.1em] text-text-muted sm:mt-2 sm:text-xs sm:tracking-[0.14em]">
                {fact.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-wide grid items-center gap-10 py-16 md:grid-cols-12 md:gap-14 md:py-24">
        <Reveal className="md:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden border border-line bg-surface md:aspect-[5/4]">
            <Image
              src="/products/xcmg-xr280/04.jpg"
              alt={dict.about.storyImageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </Reveal>
        <Reveal className="md:col-span-6" delayMs={80}>
          <p className="eyebrow">{dict.about.storyEyebrow}</p>
          <h2 className="display mt-3 text-3xl sm:text-4xl md:text-5xl">{dict.about.storyTitle}</h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-text-muted sm:text-base">
            <p>{dict.about.storyP1}</p>
            <p>{dict.about.storyP2}</p>
            <p>{dict.about.storyP3}</p>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-line bg-bg-soft">
        <div className="container-wide grid gap-8 py-14 md:grid-cols-12 md:items-end md:gap-12 md:py-20">
          <Reveal className="md:col-span-5">
            <p className="eyebrow">{dict.about.advantageEyebrow}</p>
            <h2 className="display mt-3 text-3xl sm:text-4xl md:text-5xl">{dict.about.advantageTitle}</h2>
          </Reveal>
          <Reveal className="md:col-span-7" delayMs={60}>
            <p className="max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
              {dict.about.advantageText}
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-8 sm:gap-10">
              <div>
                <dt className="text-[0.65rem] uppercase tracking-[0.14em] text-steel">
                  {dict.about.advantageDownLabel}
                </dt>
                <dd className="display mt-2 text-3xl text-accent sm:text-4xl">
                  {dict.about.advantageDownValue}
                </dd>
              </div>
              <div>
                <dt className="text-[0.65rem] uppercase tracking-[0.14em] text-steel">
                  {dict.about.advantageTermLabel}
                </dt>
                <dd className="display mt-2 text-3xl text-accent sm:text-4xl">
                  {dict.about.advantageTermValue}
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="container-wide py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-12 md:gap-14">
          <Reveal className="md:col-span-5">
            <p className="eyebrow">{dict.about.leaseOfferEyebrow}</p>
            <h2 className="display mt-3 text-3xl sm:text-4xl md:text-5xl">
              {dict.about.leaseOfferTitle}
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-text-muted sm:text-base">
              <p>{dict.about.leaseOfferP1}</p>
              <p>{dict.about.leaseOfferP2}</p>
              <p>{dict.about.leaseOfferP3}</p>
            </div>
          </Reveal>
          <Reveal className="md:col-span-7" delayMs={70}>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-steel">
              {dict.about.leaseOfferTermsTitle}
            </p>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {dict.about.leaseOfferTerms.map((term) => (
                <li key={term} className="py-4 text-sm leading-relaxed text-text sm:text-base">
                  {term}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-text-muted sm:text-base">
              {dict.about.leaseOfferClose}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-wide py-16 md:py-24">
        <Reveal>
          <p className="eyebrow">{dict.about.pillarsEyebrow}</p>
          <h2 className="display mt-3 max-w-2xl text-3xl sm:text-4xl md:text-5xl">
            {dict.about.pillarsTitle}
          </h2>
        </Reveal>
        <ol className="mt-10 divide-y divide-line border-y border-line sm:mt-12">
          {dict.about.pillars.map((pillar, i) => (
            <li key={pillar.title}>
              <Reveal delayMs={i * 50}>
                <div className="grid gap-3 py-6 sm:grid-cols-12 sm:items-baseline sm:gap-8 sm:py-8">
                  <p className="display text-xl text-accent sm:col-span-2">0{i + 1}</p>
                  <h3 className="text-base font-semibold sm:col-span-3 sm:text-lg">{pillar.title}</h3>
                  <p className="text-sm leading-relaxed text-text-muted sm:col-span-7 sm:text-base">
                    {pillar.text}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-line bg-bg-elevated">
        <div className="container-wide grid gap-10 py-14 md:grid-cols-12 md:gap-12 md:py-20">
          <Reveal className="md:col-span-5">
            <p className="eyebrow">{dict.about.officeEyebrow}</p>
            <h2 className="display mt-3 text-3xl sm:text-4xl md:text-5xl">{dict.about.officeTitle}</h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-text-muted sm:text-base">
              {dict.about.officeText}
            </p>
          </Reveal>
          <Reveal className="md:col-span-7" delayMs={70}>
            <div className="grid gap-px bg-line sm:grid-cols-2">
              <div className="bg-bg-elevated p-5 sm:p-6">
                <p className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.14em] text-steel">
                  <MapPin size={14} weight="bold" />
                  {dict.about.officeAddressLabel}
                </p>
                <p className="mt-3 text-sm text-text sm:text-base">{dict.company.address}</p>
              </div>
              <div className="bg-bg-elevated p-5 sm:p-6">
                <p className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.14em] text-steel">
                  <Phone size={14} weight="bold" />
                  {dict.about.officePhoneLabel}
                </p>
                <a
                  href={phoneHref}
                  className="mt-3 block text-sm text-accent hover:text-accent-hover sm:text-base"
                >
                  {company.phoneDisplay}
                </a>
              </div>
              <div className="bg-bg-elevated p-5 sm:p-6">
                <p className="text-[0.65rem] uppercase tracking-[0.14em] text-steel">
                  {dict.common.whatsapp}
                </p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm text-text hover:text-accent sm:text-base"
                >
                  {dict.common.openChat}
                </a>
              </div>
              <div className="bg-bg-elevated p-5 sm:p-6">
                <p className="text-[0.65rem] uppercase tracking-[0.14em] text-steel">
                  {dict.common.instagram}
                </p>
                <a
                  href={instagramHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm text-text hover:text-accent sm:text-base"
                >
                  @tortkaramachinery
                </a>
              </div>
            </div>
            <p className="mt-5 text-xs leading-relaxed text-text-muted">
              {dict.common.director}: {company.director}
              <span className="mx-2 text-line-strong">·</span>
              {dict.common.bin} {company.bin}
            </p>
            <LocaleLink href="/contacts" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-accent hover:text-accent-hover">
              {dict.about.ctaContacts}
              <ArrowRight size={16} weight="bold" />
            </LocaleLink>
          </Reveal>
        </div>
      </section>

      <section className="container-wide py-16 md:py-20">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 border border-line bg-surface p-8 md:flex-row md:items-center md:p-10">
            <div>
              <h2 className="display text-3xl md:text-4xl">{dict.about.ctaTitle}</h2>
              <p className="mt-3 max-w-xl text-sm text-text-muted">{dict.about.ctaText}</p>
            </div>
            <div className="btn-stack flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <ApplyCtaButton className="btn btn-primary shrink-0">
                {dict.about.ctaApply}
              </ApplyCtaButton>
              <LocaleLink href="/terms" className="btn btn-ghost shrink-0">
                {dict.about.ctaTerms}
              </LocaleLink>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
