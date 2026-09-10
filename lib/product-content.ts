import type { Dictionary } from "@/lib/i18n/dictionary";
import type {
  EquipmentCategory,
  Product,
  ProductLocale,
} from "@/lib/products-meta";

export function getProductContent(product: Product, locale: ProductLocale) {
  return product.content?.[locale] ?? product.content?.ru;
}

export function getProductTitle(product: Product, locale: ProductLocale) {
  return getProductContent(product, locale)?.title || product.title;
}

export function getEquipmentCategoryLabel(
  dict: Dictionary,
  category?: EquipmentCategory,
) {
  const labels: Partial<Record<EquipmentCategory, string>> = {
    "kelly-bars": dict.catalog.eqKellyBars,
    "casing-oscillators": dict.catalog.eqCasingOscillators,
    "casing-system": dict.catalog.eqCasingSystem,
    "drilling-tools": dict.catalog.eqDrillingTools,
    "foundation-tools": dict.catalog.eqFoundationTools,
    "cfa-dds": dict.catalog.eqCfaDds,
  };
  return category ? labels[category] ?? dict.product.equipmentLabel : dict.product.equipmentLabel;
}
