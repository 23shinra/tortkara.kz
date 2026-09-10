import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/CatalogBrowser";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const dict = await getDictionary(isLocale(raw) ? raw : defaultLocale);
  return { title: dict.catalog.metaTitle, description: dict.catalog.metaDescription };
}

export default async function KatalogPage({ params }: Props) {
  const { locale: raw } = await params;
  const dict = await getDictionary(isLocale(raw) ? raw : defaultLocale);

  return (
    <CatalogBrowser
      products={getProducts()}
      section="drilling-rigs"
      eyebrow={dict.catalog.eyebrow}
      title={dict.catalog.title}
      intro={dict.catalog.intro}
    />
  );
}
