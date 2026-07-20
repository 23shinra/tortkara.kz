import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Условия лизинга",
  description:
    "Ориентиры по авансу, сроку и документам для лизинга спецтехники Tortkara Machinery. Итоговый расчёт индивидуально.",
};

const terms = [
  {
    title: "Аванс",
    value: "от 15%",
    text: "Ориентир рынка РК. Для части сделок возможен иной процент — зависит от техники, срока и финансового профиля.",
  },
  {
    title: "Срок",
    value: "до 5 лет",
    text: "Типичный горизонт финансирования спецтехники. Короткий и длинный график согласуем под сезонность бизнеса.",
  },
  {
    title: "Валюта",
    value: "KZT",
    text: "Расчёты в тенге. Реквизиты для оплаты — на странице контактов (ИИК в Банк ЦентрКредит).",
  },
  {
    title: "Предмет",
    value: "Спецтехника",
    text: "Экскаваторы, погрузчики, тягачи, самосвалы, буровое и дробильное оборудование и смежные категории.",
  },
];

const docs = [
  "Свидетельство / справка о регистрации ТОО или ИП",
  "Удостоверение личности руководителя / подписанта",
  "Реквизиты компании и контакт ответственного лица",
  "Информация о желаемой технике (категория, ориентир по бюджету)",
  "Финансовая отчётность — по запросу, в зависимости от суммы сделки",
];

export default function UsloviyaPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-line bg-bg-elevated">
        <div className="container-wide py-16 md:py-24">
          <p className="eyebrow">Финансовые программы</p>
          <h1 className="display mt-4 max-w-3xl text-5xl md:text-7xl">Условия лизинга</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
            Ниже — рыночные ориентиры для Казахстана. Ставка, аванс и график для вашей сделки
            рассчитываются индивидуально после заявки.
          </p>
        </div>
      </section>

      <section className="container-wide py-16 md:py-20">
        <div className="grid gap-4 md:grid-cols-2">
          {terms.map((t, i) => (
            <Reveal key={t.title} delayMs={i * 60}>
              <article className="h-full border border-line bg-bg-soft p-7">
                <p className="text-xs uppercase tracking-[0.16em] text-text-muted">{t.title}</p>
                <p className="display mt-3 text-4xl text-accent md:text-5xl">{t.value}</p>
                <p className="mt-4 text-sm leading-relaxed text-text-muted">{t.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-bg-elevated py-16 md:py-20">
        <div className="container-wide grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">Документы</p>
            <h2 className="display mt-3 text-4xl md:text-5xl">Что понадобится для старта</h2>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              Полный список зависит от суммы и типа техники. Для первичной консультации достаточно
              контактов и описания потребности.
            </p>
          </Reveal>
          <Reveal className="lg:col-span-7" delayMs={80}>
            <ol className="space-y-0 border border-line">
              {docs.map((doc, i) => (
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
              <h2 className="display text-3xl md:text-4xl">Готовы посчитать вашу сделку?</h2>
              <p className="mt-3 max-w-xl text-sm text-text-muted">
                Оставьте заявку — подготовим ориентир по платежу и уточним пакет документов.
              </p>
            </div>
            <Link href="/apply" className="btn btn-primary shrink-0">
              Оставить заявку
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
