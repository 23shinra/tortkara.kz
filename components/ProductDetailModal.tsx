"use client";

import { useEffect, useId, useSyncExternalStore, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "@phosphor-icons/react";
import { ApplyButton } from "@/components/ApplyModal";
import { ProductDetailSpecs } from "@/components/ProductDetailSpecs";
import { ProductModalGallery } from "@/components/ProductModalGallery";
import { useLocale } from "@/components/LocaleProvider";
import { t } from "@/lib/i18n/dictionary";
import {
  getEquipmentCategoryLabel,
  getProductContent,
  getProductTitle,
} from "@/lib/product-content";
import { productMediaVersion } from "@/lib/media";
import type { Product } from "@/lib/products-meta";

type TabId = "model" | "description" | "media";

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

type Props = {
  product: Product;
  onClose: () => void;
};

export function ProductDetailModal({ product, onClose }: Props) {
  const { dict, locale } = useLocale();
  const mounted = useIsClient();
  const [tab, setTab] = useState<TabId>("model");
  const titleId = useId();

  const content = getProductContent(product, locale);
  const title = getProductTitle(product, locale);
  const version = productMediaVersion(product);

  const categoryLabel =
    product.section === "drilling-equipment"
      ? getEquipmentCategoryLabel(dict, product.equipmentCategory)
      : product.conditionGroup === "new"
        ? dict.product.newLabel
        : dict.product.usedLabel;

  useEffect(() => {
    document.body.classList.add("menu-open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!mounted) return null;

  const tabs: { id: TabId; label: string }[] = [
    { id: "model", label: dict.product.tabModel },
    { id: "description", label: dict.product.tabDescription },
    { id: "media", label: dict.product.tabMedia },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[var(--overlay)] backdrop-blur-[2px]"
        aria-label={dict.common.close}
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[94dvh] w-full max-w-6xl flex-col overflow-hidden bg-bg-elevated shadow-[0_24px_80px_var(--shadow)] sm:max-h-[92vh]">
        <button
          type="button"
          className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center bg-bg/90 text-text"
          aria-label={dict.common.close}
          onClick={onClose}
        >
          <X size={20} weight="bold" />
        </button>

        <div className="grid min-h-0 flex-1 gap-0 overflow-y-auto lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:overflow-hidden">
          <div className="min-h-0 shrink-0 lg:overflow-y-auto">
            <ProductModalGallery images={product.images} title={title} version={version} />
          </div>

          <div className="flex min-h-0 flex-col border-t border-line p-5 sm:p-6 lg:border-l lg:border-t-0 lg:overflow-y-auto">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-accent">
              {product.brand}
            </p>
            <h2 id={titleId} className="display mt-2 pr-10 text-2xl text-brand-blue sm:text-3xl">
              {title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              {content?.description || dict.product.leaseBlurb}
            </p>
            {content?.benefits?.length ? (
              <ul className="mt-4 space-y-2">
                {content.benefits.slice(0, 5).map((item) => (
                  <li
                    key={item}
                    className="border-l-2 border-accent pl-3 text-sm leading-relaxed text-text"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
            <ApplyButton
              category={title}
              className="btn btn-primary mt-6 w-full sm:w-auto"
            >
              {dict.product.orderCta}
            </ApplyButton>
            <p className="mt-4 text-[0.65rem] uppercase tracking-[0.12em] text-text-muted">
              {categoryLabel} · {product.model}
            </p>
          </div>
        </div>

        <div className="shrink-0 border-t border-line bg-bg">
          <div
            className="flex gap-0 overflow-x-auto border-b border-line px-2 sm:px-4"
            role="tablist"
          >
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                className={`shrink-0 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors sm:px-6 sm:text-sm ${
                  tab === id
                    ? "border-b-2 border-brand-blue text-brand-blue"
                    : "text-text-muted hover:text-text"
                }`}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="max-h-[min(40vh,360px)] overflow-y-auto p-4 sm:p-6">
            {tab === "model" ? (
              <div>
                {content?.variants?.length &&
                (product.equipmentCategory === "kelly-bars" ||
                  product.equipmentCategory === "casing-oscillators") ? (
                  <p className="mb-4 text-sm text-text-muted">
                    {product.equipmentCategory === "kelly-bars"
                      ? t(dict.product.kellyCompatibility, { brand: product.brand })
                      : t(dict.product.casingOscillatorIntro, { brand: product.brand })}
                  </p>
                ) : null}
                {content?.variants?.length ? (
                  <ul className="mb-6 space-y-1.5 text-sm text-text">
                    {content.variants.map((item) => (
                      <li key={item} className="border-l-2 border-line pl-3">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <ProductDetailSpecs product={product} content={content} dict={dict} />
              </div>
            ) : null}

            {tab === "description" ? (
              <div className="prose prose-sm max-w-none text-text-muted">
                <p className="whitespace-pre-line text-sm leading-relaxed">
                  {content?.longDescription || content?.description || dict.product.leaseBlurb}
                </p>
                {content?.benefits?.length ? (
                  <div className="mt-6">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                      {dict.product.benefitsTitle}
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {content.benefits.map((item) => (
                        <li key={item} className="text-sm leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}

            {tab === "media" ? (
              <ProductModalGallery
                images={product.images}
                title={title}
                version={version}
                compact
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
