import type { Metadata, Viewport } from "next";
import { Manrope, Unbounded } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileDock } from "@/components/MobileDock";
import { company } from "@/lib/company";
import "./globals.css";

const display = Unbounded({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0e0f10",
};

export const metadata: Metadata = {
  title: {
    default: `${company.shortName} — лизинг спецтехники в Казахстане`,
    template: `%s · ${company.shortName}`,
  },
  description:
    "ТОО «Tortkara Machinery» — 5 лет на рынке. Предоставляем наши услуги для вашего бизнеса: лизинг спецтехники и буровых установок в Казахстане. Алматы.",
  openGraph: {
    title: `${company.shortName} — лизинг спецтехники`,
    description: company.tagline,
    locale: "ru_KZ",
    type: "website",
    images: [{ url: "/brand/logo.png" }],
  },
  icons: {
    icon: [{ url: "/icon.png" }, { url: "/icon-32.png", sizes: "32x32" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="has-mobile-dock flex min-h-full flex-col bg-bg text-text">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileDock />
      </body>
    </html>
  );
}
