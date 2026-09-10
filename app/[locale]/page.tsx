import Image from "next/image";
import { ArrowRight, CheckCircle, FileText, Handshake, Truck } from "@phosphor-icons/react/dist/ssr";
import { ApplyCtaButton } from "@/components/ApplyCtaButton";
import { AssortmentSection } from "@/components/AssortmentSection";
import { HeroBackground } from "@/components/HeroBackground";
import { LocaleLink } from "@/components/LocaleLink";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { ReviewsSection } from "@/components/ReviewsSection";
import { company, phoneHref } from "@/lib/company";
import { isLocale, type Locale, defaultLocale } from "@/lib/i18n/config";
import { getDictionary, t } from "@/lib/i18n/dictionary";
import { productsWithPhotos } from "@/lib/products";

const stepIcons = [FileText, CheckCircle, Handshake, Truck];

type Props = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: Props) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);

  return (
    <>
      <section className="relative min-h-[100dvh] overflow-hidden">
        <HeroBackground />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(244,242,236,0.55)_0%,rgba(244,242,236,0.78)_55%,rgba(244,242,236,0.96)_100%)] md:bg-[linear-gradient(105deg,rgba(244,242,236,0.92)_0%,rgba(244,242,236,0.72)_38%,rgba(244,242,236,0.18)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(229,165,0,0.08),transparent_55%)]" />

        <div className="container-wide relative flex min-h-[100dvh] flex-col justify-end pb-24 pt-24 md:justify-center md:pb-24 md:pt-28">
          <h1 className="font-brand mt-3 max-w-4xl text-5xl tracking-[0.04em] sm:text-6xl md:mt-4 md:text-8xl">
            {company.brand}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg md:mt-5 md:text-xl">
            {dict.home.heroLead}
          </p>
          <div className="btn-stack mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <ApplyCtaButton className="btn btn-primary">
              {dict.home.ctaApply}
              <ArrowRight size={18} weight="bold" />
            </ApplyCtaButton>
            <LocaleLink href="/terms" className="btn btn-ghost">
              {dict.home.ctaTerms}
            </LocaleLink>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-bg-elevated">
        <div className="container-wide grid grid-cols-2 gap-px bg-line md:grid-cols-4">
          {dict.home.stats.map((s) => (
            <div key={s.label} className="bg-bg-elevated px-3 py-5 sm:px-5 sm:py-8 md:px-8">
              <p className="display text-2xl text-accent sm:text-3xl md:text-4xl">{s.value}</p>
              <p className="mt-1.5 text-[0.65rem] uppercase leading-snug tracking-[0.1em] text-text-muted sm:mt-2 sm:text-xs sm:tracking-[0.14em]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
        <p className="container-wide py-3 text-[0.7rem] text-text-muted">{dict.home.statsFootnote}</p>
      </section>

      <section className="py-14 md:py-28">
        <div className="container-wide">
          <Reveal>
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end md:gap-6">
              <div>
                <p className="eyebrow">{dict.home.catalogEyebrow}</p>
                <h2 className="display mt-3 max-w-2xl text-3xl sm:text-4xl md:text-6xl">
                  {dict.home.catalogTitle}
                </h2>
              </div>
              <LocaleLink
                href="/catalog"
                className="btn btn-ghost w-full sm:w-auto self-start md:self-auto"
              >
                {dict.home.catalogAll}
                <ArrowRight size={16} weight="bold" />
              </LocaleLink>
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {productsWithPhotos()
              .slice(0, 6)
              .map((product, index) => (
                <Reveal key={product.slug} delayMs={index * 60} className="h-full">
                  <ProductCard product={product} />
                </Reveal>
              ))}
          </div>
        </div>
      </section>

      <AssortmentSection limit={6} showLink />

      <section className="border-y border-line bg-bg-soft py-14 md:py-28">
        <div className="container-wide">
          <Reveal>
            <p className="eyebrow">{dict.home.processEyebrow}</p>
            <h2 className="display mt-3 max-w-2xl text-3xl sm:text-4xl md:text-5xl">
              {dict.home.processTitle}
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-3 sm:mt-12 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
            {dict.home.steps.map((step, i) => {
              const Icon = stepIcons[i] ?? FileText;
              return (
                <Reveal key={step.title} delayMs={i * 80}>
                  <article className="h-full border border-line bg-bg-elevated p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <Icon size={28} weight="duotone" className="text-accent" />
                      <span className="display text-2xl text-steel">0{i + 1}</span>
                    </div>
                    <h3 className="mt-5 text-base font-semibold sm:mt-6 sm:text-lg">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted sm:mt-3">{step.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-28">
        <div className="container-wide grid gap-8 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">{dict.home.aboutEyebrow}</p>
            <h2 className="display mt-3 text-3xl sm:text-4xl md:text-5xl">{dict.company.tagline}</h2>
            <p className="mt-4 max-w-[48ch] text-sm leading-relaxed text-text-muted sm:mt-5 sm:text-base">
              {dict.company.about}
            </p>
            <a href={phoneHref} className="btn btn-primary mt-6 w-full sm:mt-8 sm:w-auto">
              {t(dict.home.callCta, { phone: company.phoneDisplay })}
            </a>
          </Reveal>
          <div className="grid gap-3 lg:col-span-7 sm:gap-4">
            {dict.home.benefits.map((b, i) => (
              <Reveal key={b.title} delayMs={i * 70}>
                <article className="border-l-2 border-accent bg-bg-elevated px-4 py-4 sm:px-6 sm:py-5">
                  <h3 className="text-base font-semibold sm:text-lg">{b.title}</h3>
                  <p className="mt-2 max-w-[55ch] text-sm leading-relaxed text-text-muted">{b.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ReviewsSection />

      <section className="relative overflow-hidden border-t border-line">
        <Image
          src="https://images.unsplash.com/photo-1581094794329-cbeca4f9bf0d?auto=format&fit=crop&w=2000&q=80"
          alt=""
          fill
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-bg/88" />
        <div className="container-wide relative py-14 md:py-24">
          <Reveal>
            <p className="eyebrow">{dict.home.nextEyebrow}</p>
            <h2 className="display mt-3 max-w-3xl text-3xl sm:text-4xl md:text-6xl">
              {dict.home.nextTitle}
            </h2>
            <p className="mt-4 max-w-xl text-sm text-text-muted sm:mt-5 sm:text-base">
              {dict.home.nextText}
            </p>
            <div className="btn-stack mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <ApplyCtaButton className="btn btn-primary">
                {dict.home.nextApply}
              </ApplyCtaButton>
              <LocaleLink href="/contacts" className="btn btn-ghost">
                {dict.home.nextContacts}
              </LocaleLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
