"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApplyModal } from "@/components/ApplyModal";
import { useLocale } from "@/components/LocaleProvider";
import { localePath } from "@/lib/i18n/config";

function OpenApplyAndRedirect() {
  const { openApply } = useApplyModal();
  const { locale } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("category") ?? "";
    openApply(category);
    router.replace(localePath(locale, "/"));
  }, [openApply, router, locale, searchParams]);

  return null;
}

export default function ApplyPage() {
  return (
    <Suspense fallback={null}>
      <OpenApplyAndRedirect />
    </Suspense>
  );
}
