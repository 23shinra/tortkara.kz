"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { CaretDown } from "@phosphor-icons/react";

export type SiteSelectOption = {
  value: string;
  label: string;
};

type Props = {
  id?: string;
  label: string;
  value: string;
  options: SiteSelectOption[];
  onChange: (value: string) => void;
  className?: string;
  triggerClassName?: string;
  leadingIcon?: ReactNode;
  align?: "left" | "right";
};

export function SiteSelect({
  id,
  label,
  value,
  options,
  onChange,
  className = "",
  triggerClassName = "",
  leadingIcon,
  align = "left",
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const autoId = useId();
  const listId = `${autoId}-list`;
  const controlId = id ?? `${autoId}-control`;
  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <label className="sr-only" htmlFor={controlId}>
        {label}
      </label>
      <button
        type="button"
        id={controlId}
        className={`field flex w-full items-center gap-2 !py-0 text-left ${
          leadingIcon ? "!pl-10" : ""
        } !pr-10 ${triggerClassName}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        {leadingIcon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {leadingIcon}
          </span>
        ) : null}
        <span className="min-w-0 flex-1 whitespace-nowrap">{selected?.label}</span>
        <CaretDown
          size={16}
          weight="bold"
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          id={listId}
          role="listbox"
          aria-label={label}
          className={`absolute top-[calc(100%+0.35rem)] z-[80] max-h-64 w-full min-w-full overflow-auto border border-line-strong bg-bg-elevated py-1 shadow-[0_12px_40px_var(--shadow)] ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {options.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                className={`flex w-full px-3 py-2.5 text-left text-sm transition-colors ${
                  active
                    ? "bg-accent font-semibold text-brand-blue"
                    : "text-text-muted hover:bg-bg-soft hover:text-text"
                }`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
