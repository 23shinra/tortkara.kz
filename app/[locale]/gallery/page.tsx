import type { Metadata } from "next";
import { AssortmentSection } from "@/components/AssortmentSection";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const dict = await getDictionary(isLocale(raw) ? raw : defaultLocale);
  return {
    title: dict.assortmentPage.metaTitle,
    description: dict.assortmentPage.metaDescription,
  };
}

export default function GalleryPage() {
  return (
    <div className="border-t border-line bg-bg-elevated">
      <AssortmentSection />
    </div>
  );
}
