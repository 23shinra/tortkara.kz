import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LocaleProvider } from "@/components/LocaleProvider";
import { MobileDock } from "@/components/MobileDock";
import { SiteProviders } from "@/components/SiteProviders";
import { defaultLocale, htmlLang, isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const dict = await getDictionary(locale);

  return {
    title: {
      default: dict.meta.titleDefault,
      template: dict.meta.titleTemplate,
    },
    description: dict.meta.description,
    openGraph: {
      title: dict.meta.ogTitle,
      description: dict.meta.description,
      locale: htmlLang[locale],
      type: "website",
      images: [{ url: "/brand/logo.png" }],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = await getDictionary(locale);
  const productOptions = getProducts().map((p) => ({ slug: p.slug, title: p.title }));

  return (
    <LocaleProvider locale={locale} dict={dict}>
      <SiteProviders productOptions={productOptions}>
        <div
          className={`has-mobile-dock flex min-h-full flex-1 flex-col ${locale === "cn" ? "font-cjk" : ""}`}
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileDock />
        </div>
      </SiteProviders>
    </LocaleProvider>
  );
}
