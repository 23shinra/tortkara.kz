import type { Metadata } from "next";
import { LocaleLink } from "@/components/LocaleLink";
import { Reveal } from "@/components/Reveal";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const dict = await getDictionary(isLocale(raw) ? raw : defaultLocale);
  return { title: dict.terms.metaTitle, description: dict.terms.metaDescription };
}

export default async function UsloviyaPage({ params }: Props) {
  const { locale: raw } = await params;
  const dict = await getDictionary(isLocale(raw) ? raw : defaultLocale);

  return (
    <div className="pb-20">
      <section className="border-b border-line bg-bg-elevated">
        <div className="container-wide py-16 md:py-24">
          <p className="eyebrow">{dict.terms.eyebrow}</p>
          <h1 className="display mt-4 max-w-3xl text-5xl md:text-7xl">{dict.terms.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
            {dict.terms.intro}
          </p>
        </div>
      </section>

      <section className="container-wide py-16 md:py-20">
        <div className="grid gap-4 md:grid-cols-2">
          {dict.terms.items.map((term, i) => (
            <Reveal key={term.title} delayMs={i * 60}>
              <article className="h-full border border-line bg-bg-soft p-7">
                <p className="text-xs uppercase tracking-[0.16em] text-text-muted">{term.title}</p>
                <p className="display mt-3 text-4xl text-accent md:text-5xl">{term.value}</p>
                <p className="mt-4 text-sm leading-relaxed text-text-muted">{term.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-bg-elevated py-16 md:py-20">
        <div className="container-wide grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">{dict.terms.docsEyebrow}</p>
            <h2 className="display mt-3 text-4xl md:text-5xl">{dict.terms.docsTitle}</h2>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">{dict.terms.docsIntro}</p>
          </Reveal>
          <Reveal className="lg:col-span-7" delayMs={80}>
            <ol className="space-y-0 border border-line">
              {dict.terms.docs.map((doc, i) => (
                <li
                  key={doc}
                  className="flex gap-4 border-b border-line px-5 py-4 last:border-b-0"
                >
                  <span className="display text-xl text-accent">0{i + 1}</span>
                  <span className="text-sm leading-relaxed text-text md:text-base">{doc}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="container-wide py-16 md:py-20">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 border border-line bg-surface p-8 md:flex-row md:items-center md:p-10">
            <div>
              <h2 className="display text-3xl md:text-4xl">{dict.terms.ctaTitle}</h2>
              <p className="mt-3 max-w-xl text-sm text-text-muted">{dict.terms.ctaText}</p>
            </div>
            <LocaleLink href="/apply" className="btn btn-primary shrink-0">
              {dict.terms.ctaButton}
            </LocaleLink>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
