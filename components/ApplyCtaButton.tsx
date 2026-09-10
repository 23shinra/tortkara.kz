"use client";

import { ApplyButton } from "@/components/ApplyModal";

type Props = {
  category?: string;
  className?: string;
  children: React.ReactNode;
};

export function ApplyCtaButton({ category = "", className, children }: Props) {
  return (
    <ApplyButton category={category} className={className}>
      {children}
    </ApplyButton>
  );
}
