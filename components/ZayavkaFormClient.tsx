"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LeadForm } from "@/components/LeadForm";

function FormWithParams() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "";
  return <LeadForm defaultCategory={category} />;
}

export function ZayavkaFormClient() {
  return (
    <Suspense fallback={<LeadForm />}>
      <FormWithParams />
    </Suspense>
  );
}
