"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { localePath } from "@/lib/i18n/config";
import { useLocale } from "@/components/LocaleProvider";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

export function LocaleLink({ href, ...props }: Props) {
  const { locale } = useLocale();
  const localized =
    href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")
      ? href
      : localePath(locale, href);

  return <Link href={localized} {...props} />;
}
