"use client";

import { FormEvent, useMemo, useState } from "react";
import { buildMailtoLead, buildWhatsAppLead, company } from "@/lib/company";
import { products } from "@/lib/products";

type LeadFormProps = {
  defaultCategory?: string;
};

export function LeadForm({ defaultCategory = "" }: LeadFormProps) {
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState(defaultCategory);
  const [comment, setComment] = useState("");

  const message = useMemo(() => {
    const lines = [
      `Заявка на лизинг — ${company.shortName}`,
      `Имя: ${name || "—"}`,
      `Компания: ${org || "—"}`,
      `Телефон: ${phone || "—"}`,
      `Техника: ${category || "не указана"}`,
      `Комментарий: ${comment || "—"}`,
    ];
    return lines.join("\n");
  }, [name, org, phone, category, comment]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    window.location.href = buildMailtoLead(message);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">
            Имя
          </label>
          <input
            id="name"
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Как к вам обращаться"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="org">
            Компания
          </label>
          <input
            id="org"
            className="field"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            placeholder="ТОО / ИП"
            required
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="phone">
            Телефон
          </label>
          <input
            id="phone"
            className="field"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 ___ ___ __ __"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="category">
            Модель техники
          </label>
          <select
            id="category"
            className="field"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Выберите модель</option>
            {products.map((p) => (
              <option key={p.slug} value={p.title}>
                {p.title}
              </option>
            ))}
            <option value="Другая техника">Другая техника</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="comment">
          Комментарий
        </label>
        <textarea
          id="comment"
          className="field"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Модель, бюджет, срок, город поставки"
        />
      </div>

      <div className="btn-stack flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="btn btn-primary">
          Отправить на email
        </button>
        <a
          className="btn btn-ghost"
          href={buildWhatsAppLead(message)}
          target="_blank"
          rel="noreferrer"
        >
          Написать в WhatsApp
        </a>
      </div>

      <p className="text-xs leading-relaxed text-text-muted">
        Заявка откроется в почтовом клиенте или WhatsApp. Мы свяжемся по телефону{" "}
        {company.phoneDisplay} для уточнения условий. Итоговый расчёт — индивидуально.
      </p>
    </form>
  );
}
