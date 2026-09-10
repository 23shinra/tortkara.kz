import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { company, phoneHref, whatsappHref } from "@/lib/company";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const dict = await getDictionary(isLocale(raw) ? raw : defaultLocale);
  return { title: dict.contacts.metaTitle, description: dict.contacts.metaDescription };
}

export default async function ContactsPage({ params }: Props) {
  const { locale: raw } = await params;
  const dict = await getDictionary(isLocale(raw) ? raw : defaultLocale);

  const requisites = [
    { label: dict.contacts.labels.name, value: company.legalName },
    { label: dict.contacts.labels.bin, value: company.bin },
    { label: dict.contacts.labels.bik, value: company.bik },
    {
      label: dict.contacts.labels.iik,
      value: `${company.iik} (${company.currency})`,
    },
    { label: dict.contacts.labels.bank, value: dict.company.bank },
    { label: dict.contacts.labels.legalAddress, value: dict.company.address },
    { label: dict.contacts.labels.director, value: company.director },
    { label: dict.contacts.labels.phone, value: company.phoneDisplay, href: phoneHref },
  ];

  return (
    <div className="pb-20">
      <section className="border-b border-line bg-bg-elevated">
        <div className="container-wide py-8 md:py-10">
          <p className="eyebrow">{dict.contacts.eyebrow}</p>
          <h1 className="display mt-3 max-w-3xl text-4xl md:text-6xl">{dict.contacts.title}</h1>
        </div>
      </section>

      <section className="container-wide grid gap-6 py-8 md:grid-cols-12 md:gap-8 md:py-10">
        <Reveal className="md:col-span-5">
          <div className="border border-line bg-bg-soft p-7">
            <p className="eyebrow">{dict.contacts.linkEyebrow}</p>
            <a
              href={phoneHref}
              className="display mt-4 block text-4xl text-accent hover:text-accent-hover md:text-5xl"
            >
              {company.phoneDisplay}
            </a>
            <div className="mt-8 space-y-4 text-sm text-text-muted">
              <p>
                <span className="block text-xs uppercase tracking-[0.14em] text-steel">
                  {dict.contacts.address}
                </span>
                <span className="mt-1 block text-text">{dict.company.address}</span>
              </p>
              <p>
                <span className="block text-xs uppercase tracking-[0.14em] text-steel">WhatsApp</span>
                <a
                  href={whatsappHref}
                  className="mt-1 inline-block text-text hover:text-accent"
                  target="_blank"
                  rel="noreferrer"
                >
                  {dict.common.openChat}
                </a>
              </p>
            </div>
            <a href={phoneHref} className="btn btn-primary mt-8 w-full">
              {dict.contacts.call}
            </a>
          </div>
        </Reveal>

        <Reveal className="md:col-span-7" delayMs={80}>
          <div className="border border-line">
            <div className="border-b border-line bg-bg-elevated px-6 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
                {dict.contacts.requisites}
              </h2>
            </div>
            <dl>
              {requisites.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-1 border-b border-line px-6 py-4 last:border-b-0 sm:grid-cols-12 sm:gap-4"
                >
                  <dt className="text-xs uppercase tracking-[0.12em] text-text-muted sm:col-span-4">
                    {row.label}
                  </dt>
                  <dd className="text-sm text-text sm:col-span-8">
                    {row.href ? (
                      <a href={row.href} className="hover:text-accent">
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
