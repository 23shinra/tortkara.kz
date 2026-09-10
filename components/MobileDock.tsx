"use client";

import { ChatCircle, Phone } from "@phosphor-icons/react";
import { company, phoneHref, whatsappHref } from "@/lib/company";

const itemClass =
  "flex flex-col items-center gap-1 rounded-sm py-2 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-text-muted transition-colors";

export function MobileDock() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-[color-mix(in_srgb,var(--bg-elevated)_94%,transparent)] backdrop-blur-md lg:hidden">
      <div
        className="grid grid-cols-2 gap-1 px-2 pt-2"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <a
          href={phoneHref}
          className={itemClass}
          aria-label={`Позвонить ${company.phoneDisplay}`}
        >
          <Phone size={22} weight="bold" className="text-accent" />
          Звонок
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className={itemClass}
          aria-label="WhatsApp"
        >
          <ChatCircle size={22} weight="bold" className="text-accent" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
