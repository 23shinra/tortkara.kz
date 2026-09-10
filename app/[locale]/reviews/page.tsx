import type { Metadata } from "next";
import { ReviewsSection } from "@/components/ReviewsSection";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const dict = await getDictionary(isLocale(raw) ? raw : defaultLocale);
  return {
    title: dict.reviewsPage.metaTitle,
    description: dict.reviewsPage.metaDescription,
  };
}

export default function OtzyvyPage() {
  return <ReviewsSection />;
}
