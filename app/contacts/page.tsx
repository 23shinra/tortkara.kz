import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { company, phoneHref, whatsappHref } from "@/lib/company";

export const metadata: Metadata = {
  title: "Контакты и реквизиты",
  description: "Адрес, телефон и банковские реквизиты ТОО «Tortkara Machinery» в Алматы.",
};

const requisites = [
  { label: "Наименование", value: company.legalName },
  { label: "БИН", value: company.bin },
  { label: "БИК", value: company.bik },
  { label: "ИИК", value: `${company.iik} (${company.currency})` },
  { label: "Банк", value: company.bank },
  { label: "Юридический адрес", value: company.address },
  { label: "Директор", value: company.director },
  { label: "Телефон", value: company.phoneDisplay, href: phoneHref },
];

export default function ContactsPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-line bg-bg-elevated">
        <div className="container-wide py-8 md:py-10">
          <p className="eyebrow">Контакты</p>
          <h1 className="display mt-3 max-w-3xl text-4xl md:text-6xl">Офис и реквизиты</h1>
        </div>
      </section>

      <section className="container-wide grid gap-6 py-8 md:grid-cols-12 md:gap-8 md:py-10">
        <Reveal className="md:col-span-5">
          <div className="border border-line bg-bg-soft p-7">
            <p className="eyebrow">Связь</p>
            <a
              href={phoneHref}
              className="display mt-4 block text-4xl text-accent hover:text-accent-hover md:text-5xl"
            >
              {company.phoneDisplay}
            </a>
            <div className="mt-8 space-y-4 text-sm text-text-muted">
              <p>
                <span className="block text-xs uppercase tracking-[0.14em] text-steel">Адрес</span>
                <span className="mt-1 block text-text">{company.address}</span>
              </p>
              <p>
                <span className="block text-xs uppercase tracking-[0.14em] text-steel">WhatsApp</span>
                <a
                  href={whatsappHref}
                  className="mt-1 inline-block text-text hover:text-accent"
                  target="_blank"
                  rel="noreferrer"
                >
                  Открыть чат
                </a>
              </p>
            </div>
            <a href={phoneHref} className="btn btn-primary mt-8 w-full">
              Позвонить
            </a>
          </div>
        </Reveal>

        <Reveal className="md:col-span-7" delayMs={80}>
          <div className="border border-line">
            <div className="border-b border-line bg-bg-elevated px-6 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Реквизиты</h2>
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
