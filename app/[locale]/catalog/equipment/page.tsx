import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/CatalogBrowser";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { parseEquipmentType } from "@/lib/catalog-nav";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const dict = await getDictionary(isLocale(raw) ? raw : defaultLocale);
  return {
    title: dict.catalog.equipmentMetaTitle,
    description: dict.catalog.equipmentMetaDescription,
  };
}

export default async function CatalogEquipmentPage({ params, searchParams }: Props) {
  const { locale: raw } = await params;
  const { type } = await searchParams;
  const dict = await getDictionary(isLocale(raw) ? raw : defaultLocale);

  return (
    <CatalogBrowser
      products={getProducts()}
      section="drilling-equipment"
      eyebrow={dict.catalog.equipmentEyebrow}
      title={dict.catalog.equipmentTitle}
      intro={dict.catalog.equipmentIntro}
      initialEquipmentCategory={parseEquipmentType(type)}
    />
  );
}
