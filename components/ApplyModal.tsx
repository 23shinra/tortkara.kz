"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "@phosphor-icons/react";
import { LeadForm } from "@/components/LeadForm";
import { useLocale } from "@/components/LocaleProvider";
import { company, phoneHref, whatsappHref } from "@/lib/company";

type ProductOption = { slug: string; title: string };

type ApplyModalContextValue = {
  open: boolean;
  openApply: (category?: string) => void;
  closeApply: () => void;
};

const ApplyModalContext = createContext<ApplyModalContextValue | null>(null);

export function useApplyModal() {
  const ctx = useContext(ApplyModalContext);
  if (!ctx) throw new Error("useApplyModal must be used within ApplyModalProvider");
  return ctx;
}

type ProviderProps = {
  children: ReactNode;
  productOptions?: ProductOption[];
};

export function ApplyModalProvider({ children, productOptions = [] }: ProviderProps) {
  const { dict } = useLocale();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const openApply = useCallback((nextCategory = "") => {
    setCategory(nextCategory);
    setOpen(true);
  }, []);

  const closeApply = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("menu-open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeApply();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeApply]);

  const modal =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <button
              type="button"
              className="absolute inset-0 bg-[var(--overlay)] backdrop-blur-[2px]"
              aria-label={dict.common.close}
              onClick={closeApply}
            />
            <div className="relative z-10 flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden border border-line bg-bg-elevated shadow-[0_24px_80px_var(--shadow)] sm:max-h-[88vh]">
              <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6 sm:py-5">
                <div>
                  <p className="eyebrow">{dict.apply.eyebrow}</p>
                  <h2 id={titleId} className="display mt-2 text-2xl sm:text-3xl">
                    {dict.apply.title}
                  </h2>
                </div>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-line-strong text-text"
                  aria-label={dict.common.close}
                  onClick={closeApply}
                >
                  <X size={20} weight="bold" />
                </button>
              </div>

              <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                <p className="mb-5 text-sm leading-relaxed text-text-muted">
                  {dict.apply.intro}{" "}
                  <a href={phoneHref} className="text-accent hover:underline">
                    {company.phoneDisplay}
                  </a>
                  .
                </p>
                <LeadForm
                  key={category || "default"}
                  defaultCategory={category}
                  productOptions={productOptions}
                />
                <div className="mt-6 border-t border-line pt-5 text-sm text-text-muted">
                  <p className="text-xs uppercase tracking-[0.14em] text-steel">{dict.apply.quick}</p>
                  <ul className="mt-3 space-y-2">
                    <li>
                      {dict.apply.phone}:{" "}
                      <a href={phoneHref} className="text-text hover:text-accent">
                        {company.phoneDisplay}
                      </a>
                    </li>
                    <li>
                      WhatsApp:{" "}
                      <a
                        href={whatsappHref}
                        className="text-text hover:text-accent"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {dict.apply.whatsappNow}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <ApplyModalContext.Provider value={{ open, openApply, closeApply }}>
      {children}
      {modal}
    </ApplyModalContext.Provider>
  );
}

type ApplyButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  category?: string;
};

export function ApplyButton({ category = "", onClick, type = "button", ...props }: ApplyButtonProps) {
  const { openApply } = useApplyModal();
  return (
    <button
      type={type}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) openApply(category);
      }}
    />
  );
}
