import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { CategoryCard } from "@/components/CategoryCard";
import { LocaleLink } from "@/components/LocaleLink";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailSpecs } from "@/components/ProductDetailSpecs";
import { ProductGallery } from "@/components/ProductGallery";
import { Reveal } from "@/components/Reveal";
import { categories, getCategory } from "@/lib/categories";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { getDictionary, localizeSpecValue, t } from "@/lib/i18n/dictionary";
import {
  getEquipmentCategoryLabel,
  getProductContent,
  getProductTitle,
} from "@/lib/product-content";
import { getProduct, getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const dict = await getDictionary(locale);
  const product = getProduct(slug);
  if (product) {
    const title = getProductTitle(product, locale);
    const content = getProductContent(product, locale);
    return {
      title: t(dict.product.metaLease, { title }),
      description: [
        content?.description || title,
        product.specs.year,
        product.specs.condition
          ? localizeSpecValue(dict, product.specs.condition)
          : null,
        product.specs.depth ? t(dict.product.metaDepth, { depth: product.specs.depth }) : null,
      ]
        .filter(Boolean)
        .join(" · "),
    };
  }
  const category = getCategory(slug);
  if (category) {
    const localized = dict.categories[slug as keyof typeof dict.categories];
    return {
      title: t(dict.product.categoryMeta, { title: localized?.title ?? category.title }),
      description: localized?.description ?? category.description,
    };
  }
  return { title: dict.nav.catalog };
}

export default async function KatalogSlugPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const dict = await getDictionary(locale);
  const products = getProducts();
  const product = getProduct(slug);

  if (product) {
    const content = getProductContent(product, locale);
    const title = getProductTitle(product, locale);
    const related = products
      .filter(
        (p) =>
          p.slug !== product.slug &&
          p.section === product.section &&
          (product.section === "drilling-equipment"
            ? p.equipmentCategory === product.equipmentCategory
            : p.conditionGroup === product.conditionGroup),
      )
      .slice(0, 3);
    const fallbackRelated = related.length
      ? related
      : products
          .filter((p) => p.slug !== product.slug && p.section === product.section)
          .slice(0, 3);
    const condition = product.specs.condition
      ? localizeSpecValue(dict, product.specs.condition)
      : product.section === "drilling-rigs"
        ? product.conditionGroup === "new"
          ? dict.product.newLabel
          : dict.product.usedLabel
        : getEquipmentCategoryLabel(dict, product.equipmentCategory);

    return (
      <div className="pb-20">
        <section className="border-b border-line bg-bg-elevated">
          <div className="container-wide py-10 md:py-14">
            <LocaleLink
              href={product.section === "drilling-equipment" ? "/catalog/equipment" : "/catalog"}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted hover:text-text"
            >
              <ArrowLeft size={14} weight="bold" />
              {dict.product.back}
            </LocaleLink>
            <p className="eyebrow mt-5 sm:mt-6">
              {product.brand} ·{" "}
              {product.section === "drilling-equipment"
                ? getEquipmentCategoryLabel(dict, product.equipmentCategory)
                : product.conditionGroup === "new"
                  ? dict.product.newLabel
                  : dict.product.usedLabel}
            </p>
            <h1 className="display mt-2 text-3xl sm:mt-3 sm:text-4xl md:text-6xl">{title}</h1>
            <p className="mt-3 text-sm text-text-muted">
              {[product.specs.year, condition].filter(Boolean).join(" · ")}
            </p>
          </div>
        </section>

        <section className="container-wide grid gap-12 py-12 md:grid-cols-12 md:py-16">
          <div className="md:col-span-7">
            <ProductGallery
              images={product.images}
              title={title}
              version={product.updatedAt || product.createdAt}
            />
          </div>
          <div className="md:col-span-5">
            <Reveal>
              <h2 className="display text-3xl">{dict.product.descriptionTitle}</h2>
              <p className="mt-5 text-base leading-relaxed text-text-muted">
                {content?.description || dict.product.leaseBlurb}
              </p>
              {content?.benefits?.length ? (
                <div className="mt-8">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                    {dict.product.benefitsTitle}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {content.benefits.map((item) => (
                      <li key={item} className="border-l-2 border-accent pl-4 text-sm leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="mt-8 border border-line bg-bg-soft p-6">
                <p className="text-sm leading-relaxed text-text-muted">{dict.product.leaseBlurb}</p>
                <LocaleLink
                  href={`/apply?category=${encodeURIComponent(title)}`}
                  className="btn btn-primary mt-5 w-full"
                >
                  {dict.product.requestCalculation}
                  <ArrowRight size={16} weight="bold" />
                </LocaleLink>
                <LocaleLink href="/terms" className="btn btn-ghost mt-3 w-full">
                  {dict.product.terms}
                </LocaleLink>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="border-t border-line bg-bg-elevated">
          <div className="container-wide grid gap-10 py-14 md:grid-cols-2 md:py-20">
            <div>
              <h2 className="display text-3xl">{dict.product.attributesTitle}</h2>
              <div className="mt-6">
                <ProductDetailSpecs product={product} content={content} dict={dict} />
              </div>
            </div>
            {content?.variants?.length ? (
              <div>
                <h2 className="display text-3xl">
                  {product.equipmentCategory === "kelly-bars"
                    ? dict.product.compatibleModelsTitle
                    : product.equipmentCategory === "casing-oscillators"
                      ? dict.product.selectionCriteriaTitle
                      : dict.product.variantsTitle}
                </h2>
                {product.equipmentCategory === "kelly-bars" ? (
                  <p className="mt-4 text-sm leading-relaxed text-text-muted">
                    {t(dict.product.kellyCompatibility, { brand: product.brand })}
                  </p>
                ) : null}
                {product.equipmentCategory === "casing-oscillators" ? (
                  <p className="mt-4 text-sm leading-relaxed text-text-muted">
                    {t(dict.product.casingOscillatorIntro, { brand: product.brand })}
                  </p>
                ) : null}
                <ul className="mt-6 border border-line">
                  {content.variants.map((item) => (
                    <li key={item} className="border-b border-line px-5 py-4 text-sm last:border-b-0">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>

        <section className="border-t border-line bg-bg-soft py-14 md:py-20">
          <div className="container-wide">
            <h2 className="display text-3xl md:text-4xl">{dict.product.related}</h2>
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

  const localized = dict.categories[slug as keyof typeof dict.categories];
  const title = localized?.title ?? category.title;
  const short = localized?.short ?? category.short;
  const description = localized?.description ?? category.description;
  const imageAlt = localized?.imageAlt ?? category.imageAlt;

  const related = categories.filter((c) => c.slug !== category.slug).slice(0, 3);
  const drillingProducts =
    category.slug === "burovye-ustanovki"
      ? products.filter((p) => p.section === "drilling-rigs" && p.images.length > 0)
      : [];

  return (
    <div className="pb-20">
      <section className="relative min-h-[52vh] overflow-hidden md:min-h-[60vh]">
        <Image
          src={category.image}
          alt={imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-bg/30" />
        <div className="container-wide relative flex min-h-[52vh] flex-col justify-end pb-12 pt-24 md:min-h-[60vh] md:pb-16">
          <LocaleLink
            href="/catalog"
            className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted hover:text-text"
          >
            <ArrowLeft size={14} weight="bold" />
            {dict.product.back}
          </LocaleLink>
          <p className="eyebrow">{short}</p>
          <h1 className="display mt-3 max-w-3xl text-5xl md:text-7xl">{title}</h1>
        </div>
      </section>

      {drillingProducts.length ? (
        <section className="container-wide py-14 md:py-20">
          <h2 className="display text-3xl md:text-4xl">{dict.product.modelsInStock}</h2>
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
            <h2 className="display text-3xl md:text-4xl">{dict.product.leaseVia}</h2>
            <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-text-muted">
              {description}
            </p>
          </Reveal>
          <Reveal className="md:col-span-5" delayMs={80}>
            <div className="border border-line bg-bg-elevated p-7">
              <p className="eyebrow">{dict.product.applyEyebrow}</p>
              <h3 className="mt-3 text-xl font-semibold">
                {t(dict.product.needCategory, { title: title.toLowerCase() })}
              </h3>
              <LocaleLink
                href={`/apply?category=${encodeURIComponent(title)}`}
                className="btn btn-primary mt-6 w-full"
              >
                {dict.common.apply}
                <ArrowRight size={16} weight="bold" />
              </LocaleLink>
            </div>
          </Reveal>
        </section>
      )}

      <section className="border-t border-line bg-bg-soft py-14 md:py-20">
        <div className="container-wide">
          <h2 className="display text-3xl md:text-4xl">{dict.product.otherCategories}</h2>
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
