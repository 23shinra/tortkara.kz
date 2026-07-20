import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, FileText, Handshake, Truck } from "@phosphor-icons/react/dist/ssr";
import { AssortmentSection } from "@/components/AssortmentSection";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { ReviewsSection } from "@/components/ReviewsSection";
import { productsWithPhotos } from "@/lib/products";
import { company, phoneHref } from "@/lib/company";

const steps = [
  {
    icon: FileText,
    title: "Заявка",
    text: "Опишите технику и задачу. Ответим в рабочий день и уточним параметры сделки.",
  },
  {
    icon: CheckCircle,
    title: "Расчёт",
    text: "Подготовим ориентир по авансу, сроку и графику. Финальные условия — индивидуально.",
  },
  {
    icon: Handshake,
    title: "Договор",
    text: "Соберём пакет документов и согласуем договор лизинга с понятным графиком платежей.",
  },
  {
    icon: Truck,
    title: "Техника на объект",
    text: "После оформления техника передаётся вашей компании — можно выходить на работы.",
  },
];

const benefits = [
  {
    title: "5 лет на рынке",
    text: "Работаем с подрядчиками и компаниями Казахстана: знаем, как быстро вывести технику на объект и закрыть сделку без лишней бюрократии.",
  },
  {
    title: "Услуги для вашего бизнеса",
    text: "Предоставляем наши услуги для вашего бизнеса — лизинг буровых установок и спецтехники под вашу задачу, бюджет и график работ.",
  },
  {
    title: "Сопровождение в Алматы",
    text: "Офис в Алматы. Связь по телефону и WhatsApp — от первой консультации до передачи машины.",
  },
];

const stats = [
  { value: "5 лет", label: "на рынке Казахстана" },
  { value: "от 15%", label: "ориентир по авансу*" },
  { value: "до 5 лет", label: "срок финансирования*" },
  { value: "Алматы", label: "офис и сопровождение" },
];

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[100dvh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=2400&q=80"
          alt="Спецтехника на строительной площадке"
          fill
          priority
          className="object-cover object-[65%_center] md:object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,15,16,0.55)_0%,rgba(14,15,16,0.82)_55%,rgba(14,15,16,0.96)_100%)] md:bg-[linear-gradient(105deg,rgba(14,15,16,0.92)_0%,rgba(14,15,16,0.72)_42%,rgba(14,15,16,0.35)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(248,184,0,0.12),transparent_55%)]" />

        <div className="container-wide relative flex min-h-[100dvh] flex-col justify-end pb-24 pt-24 md:justify-center md:pb-24 md:pt-28">
          <p className="eyebrow">{company.legalName}</p>
          <h1 className="display mt-3 max-w-4xl text-4xl sm:text-5xl md:mt-4 md:text-7xl">
            {company.brand}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-text/85 sm:text-lg md:mt-5 md:text-xl">
            {company.tagline}. 5 лет на рынке — лизинг спецтехники и буровых установок
            с индивидуальным расчётом условий.
          </p>
          <div className="btn-stack mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <Link href="/apply" className="btn btn-primary">
              Оставить заявку
              <ArrowRight size={18} weight="bold" />
            </Link>
            <Link href="/terms" className="btn btn-ghost">
              Условия лизинга
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-bg-elevated">
        <div className="container-wide grid grid-cols-2 gap-px bg-line md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-bg-elevated px-3 py-5 sm:px-5 sm:py-8 md:px-8">
              <p className="display text-2xl text-accent sm:text-3xl md:text-4xl">{s.value}</p>
              <p className="mt-1.5 text-[0.65rem] uppercase leading-snug tracking-[0.1em] text-text-muted sm:mt-2 sm:text-xs sm:tracking-[0.14em]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
        <p className="container-wide py-3 text-[0.7rem] text-text-muted">
          * Ориентиры рынка РК. Итоговые ставка, аванс и срок утверждаются индивидуально.
        </p>
      </section>

      <section className="py-14 md:py-28">
        <div className="container-wide">
          <Reveal>
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end md:gap-6">
              <div>
                <p className="eyebrow">В наличии</p>
                <h2 className="display mt-3 max-w-2xl text-3xl sm:text-4xl md:text-6xl">
                  Буровые установки в каталоге
                </h2>
              </div>
              <Link href="/catalog" className="btn btn-ghost w-full sm:w-auto self-start md:self-auto">
                Весь каталог
                <ArrowRight size={16} weight="bold" />
              </Link>
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
            <p className="eyebrow">Процесс</p>
            <h2 className="display mt-3 max-w-2xl text-3xl sm:text-4xl md:text-5xl">Как работает лизинг</h2>
          </Reveal>
          <div className="mt-8 grid gap-3 sm:mt-12 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
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
            <p className="eyebrow">О компании</p>
            <h2 className="display mt-3 text-3xl sm:text-4xl md:text-5xl">
              {company.tagline}
            </h2>
            <p className="mt-4 max-w-[48ch] text-sm leading-relaxed text-text-muted sm:mt-5 sm:text-base">
              {company.about}
            </p>
            <a href={phoneHref} className="btn btn-primary mt-6 w-full sm:mt-8 sm:w-auto">
              Позвонить {company.phoneDisplay}
            </a>
          </Reveal>
          <div className="grid gap-3 lg:col-span-7 sm:gap-4">
            {benefits.map((b, i) => (
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
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-bg/80" />
        <div className="container-wide relative py-14 md:py-24">
          <Reveal>
            <p className="eyebrow">Следующий шаг</p>
            <h2 className="display mt-3 max-w-3xl text-3xl sm:text-4xl md:text-6xl">
              Нужна техника на объект — оставьте заявку
            </h2>
            <p className="mt-4 max-w-xl text-sm text-text-muted sm:mt-5 sm:text-base">
              Укажите категорию и контакты. Подготовим ориентировочный расчёт и свяжемся для уточнения.
            </p>
            <div className="btn-stack mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <Link href="/apply" className="btn btn-primary">
                Заявка на лизинг
              </Link>
              <Link href="/contacts" className="btn btn-ghost">
                Реквизиты и адрес
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
