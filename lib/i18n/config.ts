export const locales = ["kk", "ru", "en", "cn"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";

export const localeNames: Record<Locale, string> = {
  kk: "ҚАЗ",
  ru: "РУС",
  en: "ENG",
  cn: "中文",
};

export const localeLabels: Record<Locale, string> = {
  kk: "Қазақша",
  ru: "Русский",
  en: "English",
  cn: "中文",
};

export const htmlLang: Record<Locale, string> = {
  kk: "kk",
  ru: "ru",
  en: "en",
  cn: "zh-CN",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localePath(locale: Locale, path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}
