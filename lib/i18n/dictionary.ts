import type { Locale } from "@/lib/i18n/config";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import type ru from "@/dictionaries/ru.json";

export type Dictionary = typeof ru;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  kk: () => import("@/dictionaries/kk.json").then((m) => m.default),
  ru: () => import("@/dictionaries/ru.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  cn: () => import("@/dictionaries/cn.json").then((m) => m.default),
};

export async function getDictionary(locale: string): Promise<Dictionary> {
  const key = isLocale(locale) ? locale : defaultLocale;
  return dictionaries[key]();
}

export function t(template: string, vars: Record<string, string | number>) {
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)),
    template,
  );
}

export function localizeSpecValue(dict: Dictionary, value: string) {
  if (value === "Б/У, восстановленный") return dict.specs.conditions.refurbished;
  if (value === "Б/У, не восстановленный") return dict.specs.conditions.notRefurbished;
  if (value === "тросовой") return dict.specs.mastCable;
  return value;
}

export function localizeSpecs(dict: Dictionary, specs: Record<string, string | undefined>) {
  const out: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(specs)) {
    out[k] = v ? localizeSpecValue(dict, v) : v;
  }
  return out;
}
