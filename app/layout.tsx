import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Manrope, Montserrat, Noto_Sans_SC } from "next/font/google";
import { company } from "@/lib/company";
import "./globals.css";

const display = Montserrat({
  variable: "--font-display",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["500", "600", "700", "800"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600", "700"],
});

/** Matches logo wordmark (condensed industrial sans — Bebas Neue) */
const brand = Bebas_Neue({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: "400",
});

const cjk = Noto_Sans_SC({
  variable: "--font-cjk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f4f2ec",
};

export const metadata: Metadata = {
  title: {
    default: `${company.shortName} — роторно-буровая техника и сваебойные установки в лизинг`,
    template: `%s · ${company.shortName}`,
  },
  description:
    "ТОО «Tortkara Machinery» — 5 лет на рынке. Лизинг роторно-буровой техники и сваебойных установок — новых и б/у: предоплата 30%, срок до 3 лет. Алматы.",
  openGraph: {
    title: `${company.shortName} — роторно-буровая техника и сваебойные установки в лизинг`,
    description: company.about,
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
    <html lang="ru" className={`${display.variable} ${body.variable} ${brand.variable} ${cjk.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-bg text-text">{children}</body>
    </html>
  );
}
