"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LeadForm } from "@/components/LeadForm";

type Props = {
  productOptions: { slug: string; title: string }[];
};

function FormWithParams({ productOptions }: Props) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "";
  return <LeadForm defaultCategory={category} productOptions={productOptions} />;
}

export function ZayavkaFormClient({ productOptions }: Props) {
  return (
    <Suspense fallback={<LeadForm productOptions={productOptions} />}>
      <FormWithParams productOptions={productOptions} />
    </Suspense>
  );
}
