import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { ZayavkaFormClient } from "@/components/ZayavkaFormClient";
import { company, phoneHref, whatsappHref } from "@/lib/company";

export const metadata: Metadata = {
  title: "Заявка на лизинг",
  description: "Оставьте заявку на лизинг спецтехники Tortkara Machinery. Ответ в рабочий день.",
};

export default function ZayavkaPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-line bg-bg-elevated">
        <div className="container-wide py-16 md:py-24">
          <p className="eyebrow">Заявка</p>
          <h1 className="display mt-4 max-w-3xl text-5xl md:text-7xl">Оставить заявку</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
            Заполните форму — отправим в email или WhatsApp. Также можно позвонить:{" "}
            <a href={phoneHref} className="text-accent hover:underline">
              {company.phoneDisplay}
            </a>
            .
          </p>
        </div>
      </section>

      <section className="container-wide grid gap-12 py-14 md:grid-cols-12 md:py-20">
        <Reveal className="md:col-span-7">
          <div className="border border-line bg-bg-soft p-6 md:p-8">
            <ZayavkaFormClient />
          </div>
        </Reveal>
        <Reveal className="md:col-span-5" delayMs={80}>
          <div className="space-y-6">
            <div className="border border-line bg-bg-elevated p-6">
              <p className="eyebrow">Быстрая связь</p>
              <ul className="mt-4 space-y-3 text-sm text-text-muted">
                <li>
                  Телефон:{" "}
                  <a href={phoneHref} className="text-text hover:text-accent">
                    {company.phoneDisplay}
                  </a>
                </li>
                <li>
                  WhatsApp:{" "}
                  <a href={whatsappHref} className="text-text hover:text-accent" target="_blank" rel="noreferrer">
                    написать сейчас
                  </a>
                </li>
                <li>Адрес: {company.address}</li>
              </ul>
            </div>
            <div className="border border-line bg-bg-elevated p-6">
              <p className="eyebrow">Что указать</p>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                Категорию техники, ориентир по бюджету, город эксплуатации и желаемый срок. Чем точнее
                данные — тем быстрее подготовим расчёт.
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
