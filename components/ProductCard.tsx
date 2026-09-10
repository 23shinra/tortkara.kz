"use client";

import { LocaleLink } from "@/components/LocaleLink";
import { NoPhotoPlaceholder } from "@/components/NoPhotoPlaceholder";
import { useLocale } from "@/components/LocaleProvider";
import { mediaUrl, productMediaVersion } from "@/lib/media";
import { t } from "@/lib/i18n/dictionary";
import {
  getEquipmentCategoryLabel,
  getProductTitle,
} from "@/lib/product-content";
import type { Product } from "@/lib/products-meta";

export function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen?: (product: Product) => void;
}) {
  const { dict, locale } = useLocale();
  const shouldUseCatalogPreview = Boolean(product.catalogPreview);
  const cover = shouldUseCatalogPreview ? product.catalogPreview : product.images[0];
  const version = productMediaVersion(product);
  const { year, depth, diameter } = product.specs;
  const title = getProductTitle(product, locale);
  const content = product.content?.[locale] ?? product.content?.ru;
  const isKelly = product.equipmentCategory === "kelly-bars";
  const isOscillator = product.equipmentCategory === "casing-oscillators";
  const typeLabel =
    product.section === "drilling-equipment"
      ? getEquipmentCategoryLabel(dict, product.equipmentCategory)
      : product.conditionGroup === "new"
        ? dict.product.newLabel
        : dict.product.usedLabel;
  const facts =
    product.section === "drilling-equipment"
      ? (content?.details || []).slice(0, 2).map((item) => [item.title, item.text])
      : [
          depth ? [dict.common.depth, depth] : null,
          diameter ? [dict.common.diameter, diameter] : null,
        ].filter((item): item is string[] => Boolean(item));
  const kellyModels = isKelly ? content?.variants || [] : [];
  const oscillatorPoints = isOscillator ? (content?.variants || []).slice(0, 3) : [];

  const inner = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-soft">
        {cover ? (
          // Local admin/cutout photos — skip optimizer so preview changes show immediately.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(cover, version)}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <NoPhotoPlaceholder label={dict.common.photoOnRequest} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-accent">
          {product.brand}
        </p>
        <h3 className="display text-xl sm:text-2xl">{title}</h3>
        <p className="mt-1.5 text-[0.65rem] uppercase tracking-[0.12em] text-text-muted sm:mt-2 sm:text-xs sm:tracking-[0.14em]">
          {[typeLabel, year].filter(Boolean).join(" · ")}
        </p>
        {kellyModels.length ? (
          <div className="mt-3 space-y-2 text-sm sm:mt-4">
            <p className="text-xs leading-relaxed text-text-muted sm:text-sm">
              {t(dict.product.kellyCompatibility, { brand: product.brand })}
            </p>
            <p className="text-xs leading-relaxed text-text sm:text-sm">
              {kellyModels.join(", ")}
            </p>
          </div>
        ) : oscillatorPoints.length ? (
          <div className="mt-3 space-y-2 text-sm sm:mt-4">
            <p className="text-xs leading-relaxed text-text-muted sm:text-sm">
              {t(dict.product.casingOscillatorIntro, { brand: product.brand })}
            </p>
            <ul className="space-y-1.5 text-xs leading-relaxed text-text sm:text-sm">
              {oscillatorPoints.map((item) => (
                <li key={item} className="border-l-2 border-accent/70 pl-2.5">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:mt-4 sm:gap-3">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[0.65rem] uppercase tracking-[0.12em] text-steel">{label}</dt>
                <dd className="mt-0.5 text-xs text-text sm:text-sm">{value}</dd>
              </div>
            ))}
          </dl>
        )}
        <span className="mt-auto pt-4 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent sm:pt-5 sm:text-xs sm:tracking-[0.16em]">
          {dict.common.more} →
        </span>
      </div>
    </>
  );

  if (onOpen) {
    return (
      <button
        type="button"
        onClick={() => onOpen(product)}
        className="group flex h-full w-full flex-col overflow-hidden border border-line bg-surface text-left"
      >
        {inner}
      </button>
    );
  }

  return (
    <LocaleLink
      href={`/catalog/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden border border-line bg-surface"
    >
      {inner}
    </LocaleLink>
  );
}
