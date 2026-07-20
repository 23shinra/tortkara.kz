import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { Reveal } from "@/components/Reveal";
import { categories, getCategory } from "@/lib/categories";
import { getProduct, products, specLabels, type ProductSpecs } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const productSlugs = products.map((p) => ({ slug: p.slug }));
  const categorySlugs = categories.map((c) => ({ slug: c.slug }));
  return [...productSlugs, ...categorySlugs];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (product) {
    return {
      title: `${product.title} в лизинг`,
      description: [
        product.title,
        product.specs.year,
        product.specs.condition,
        product.specs.depth ? `глубина ${product.specs.depth}` : null,
      ]
        .filter(Boolean)
        .join(" · "),
    };
  }
  const category = getCategory(slug);
  if (category) {
    return { title: `${category.title} в лизинг`, description: category.description };
  }
  return { title: "Каталог" };
}

function SpecsTable({ specs }: { specs: ProductSpecs }) {
  const entries = (Object.keys(specLabels) as (keyof ProductSpecs)[])
    .map((key) => ({ key, label: specLabels[key], value: specs[key] }))
    .filter((e) => e.value);

  if (!entries.length) {
    return (
      <p className="text-sm text-text-muted">
        Подробные характеристики уточним по запросу.
      </p>
    );
  }

  return (
    <dl className="border border-line">
      {entries.map((e) => (
        <div
          key={e.key}
          className="grid gap-1 border-b border-line px-4 py-3 last:border-b-0 sm:grid-cols-12 sm:gap-4"
        >
          <dt className="text-xs uppercase tracking-[0.12em] text-text-muted sm:col-span-5">
            {e.label}
          </dt>
          <dd className="text-sm text-text sm:col-span-7">{e.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function KatalogSlugPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (product) {
    const related = products.filter((p) => p.slug !== product.slug && p.brand === product.brand).slice(0, 3);
    const fallbackRelated = related.length
      ? related
      : products.filter((p) => p.slug !== product.slug).slice(0, 3);

    return (
      <div className="pb-20">
        <section className="border-b border-line bg-bg-elevated">
          <div className="container-wide py-10 md:py-14">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted hover:text-text"
            >
              <ArrowLeft size={14} weight="bold" />
              Каталог
            </Link>
            <p className="eyebrow mt-5 sm:mt-6">{product.brand}</p>
            <h1 className="display mt-2 text-3xl sm:mt-3 sm:text-4xl md:text-6xl">{product.title}</h1>
            <p className="mt-3 text-sm text-text-muted">
              {[product.specs.year, product.specs.condition].filter(Boolean).join(" · ")}
            </p>
          </div>
        </section>

        <section className="container-wide grid gap-12 py-12 md:grid-cols-12 md:py-16">
          <div className="md:col-span-7">
            <ProductGallery images={product.images} title={product.title} />
          </div>
          <div className="md:col-span-5">
            <Reveal>
              <h2 className="display text-3xl">Характеристики</h2>
              <div className="mt-6">
                <SpecsTable specs={product.specs} />
              </div>
              <div className="mt-8 border border-line bg-bg-soft p-6">
                <p className="text-sm leading-relaxed text-text-muted">
                  Техника доступна в лизинг. Подготовим расчёт платежа под эту модель и ответим в
                  рабочий день.
                </p>
                <Link
                  href={`/apply?category=${encodeURIComponent(product.title)}`}
                  className="btn btn-primary mt-5 w-full"
                >
                  Заявка на {product.model}
                  <ArrowRight size={16} weight="bold" />
                </Link>
                <Link href="/terms" className="btn btn-ghost mt-3 w-full">
                  Условия лизинга
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="border-t border-line bg-bg-soft py-14 md:py-20">
          <div className="container-wide">
            <h2 className="display text-3xl md:text-4xl">Похожая техника</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {fallbackRelated.map((p, i) => (
                <Reveal key={p.slug} delayMs={i * 50} className="h-full">
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  const category = getCategory(slug);
  if (!category) notFound();

  const related = categories.filter((c) => c.slug !== category.slug).slice(0, 3);
  const drillingProducts =
    category.slug === "burovye-ustanovki" ? products.filter((p) => p.images.length > 0) : [];

  return (
    <div className="pb-20">
      <section className="relative min-h-[52vh] overflow-hidden md:min-h-[60vh]">
        <Image
          src={category.image}
          alt={category.imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-bg/30" />
        <div className="container-wide relative flex min-h-[52vh] flex-col justify-end pb-12 pt-24 md:min-h-[60vh] md:pb-16">
          <Link
            href="/catalog"
            className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted hover:text-text"
          >
            <ArrowLeft size={14} weight="bold" />
            Каталог
          </Link>
          <p className="eyebrow">{category.short}</p>
          <h1 className="display mt-3 max-w-3xl text-5xl md:text-7xl">{category.title}</h1>
        </div>
      </section>

      {drillingProducts.length ? (
        <section className="container-wide py-14 md:py-20">
          <h2 className="display text-3xl md:text-4xl">Модели в наличии</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {drillingProducts.map((p, i) => (
              <Reveal key={p.slug} delayMs={i * 40} className="h-full">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : (
        <section className="container-wide grid gap-12 py-14 md:grid-cols-12 md:py-20">
          <Reveal className="md:col-span-7">
            <h2 className="display text-3xl md:text-4xl">В лизинг через Tortkara</h2>
            <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-text-muted">
              {category.description}
            </p>
          </Reveal>
          <Reveal className="md:col-span-5" delayMs={80}>
            <div className="border border-line bg-bg-elevated p-7">
              <p className="eyebrow">Заявка</p>
              <h3 className="mt-3 text-xl font-semibold">Нужны {category.title.toLowerCase()}?</h3>
              <Link
                href={`/apply?category=${encodeURIComponent(category.title)}`}
                className="btn btn-primary mt-6 w-full"
              >
                Оставить заявку
                <ArrowRight size={16} weight="bold" />
              </Link>
            </div>
          </Reveal>
        </section>
      )}

      <section className="border-t border-line bg-bg-soft py-14 md:py-20">
        <div className="container-wide">
          <h2 className="display text-3xl md:text-4xl">Другие категории</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {related.map((c, i) => (
              <Reveal key={c.slug} delayMs={i * 60}>
                <CategoryCard category={c} index={i + 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
