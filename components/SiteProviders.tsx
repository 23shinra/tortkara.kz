"use client";

import { ApplyModalProvider } from "@/components/ApplyModal";

type ProductOption = { slug: string; title: string };

type Props = {
  children: React.ReactNode;
  productOptions: ProductOption[];
};

export function SiteProviders({ children, productOptions }: Props) {
  return <ApplyModalProvider productOptions={productOptions}>{children}</ApplyModalProvider>;
}
