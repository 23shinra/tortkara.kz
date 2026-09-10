"use client";

import type { Dictionary } from "@/lib/i18n/dictionary";
import { localizeSpecValue } from "@/lib/i18n/dictionary";
import type { Product, ProductContent, ProductSpecs } from "@/lib/products-meta";

function AttributesGrid({
  attributes,
  details,
}: {
  attributes?: Record<string, string>;
  details?: { title: string; text: string }[];
}) {
  const entries =
    details?.map((item) => [item.title, item.text] as const) ?? Object.entries(attributes || {});
  if (!entries.length) return null;
  return (
    <dl className="grid gap-px bg-line sm:grid-cols-2">
      {entries.map(([label, value]) => (
        <div key={label} className="bg-bg-elevated px-4 py-4">
          <dt className="text-xs uppercase tracking-[0.12em] text-text-muted">{label}</dt>
          <dd className="mt-2 text-sm font-semibold text-text">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function RigSpecsGrid({ specs, dict }: { specs: ProductSpecs; dict: Dictionary }) {
  const labels = dict.specs;
  const entries = (
    [
      "year",
      "condition",
      "mast",
      "depth",
      "diameter",
      "engine",
      "power",
      "weight",
      "transport",
      "kelly",
    ] as const
  )
    .map((key) => ({
      key,
      label: labels[key],
      value: specs[key] ? localizeSpecValue(dict, specs[key]!) : undefined,
    }))
    .filter((e) => e.value);

  if (!entries.length) {
    return <p className="text-sm text-text-muted">{dict.product.specsEmpty}</p>;
  }

  return (
    <dl className="grid gap-px bg-line sm:grid-cols-2">
      {entries.map((e) => (
        <div key={e.key} className="bg-bg-elevated px-4 py-4">
          <dt className="text-xs uppercase tracking-[0.12em] text-text-muted">{e.label}</dt>
          <dd className="mt-2 text-sm font-semibold text-text">{e.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function SpecTables({ tables }: { tables: NonNullable<ProductContent["specTables"]> }) {
  return (
    <div className="space-y-8">
      {tables.map((table) => (
        <div key={table.title}>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-text-muted">
            {table.title}
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-bg-soft">
                  {table.columns.map((col) => (
                    <th
                      key={col}
                      className="px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-text-muted"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, i) => (
                  <tr key={i} className="border-b border-line last:border-b-0">
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-2.5 text-text">
                        {cell || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {table.note ? (
            <p className="mt-2 text-xs leading-relaxed text-text-muted">{table.note}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

type Props = {
  product: Product;
  content?: ProductContent;
  dict: Dictionary;
};

export function ProductDetailSpecs({ product, content, dict }: Props) {
  const specTables = content?.specTables;

  return (
    <div className="space-y-8">
      {product.section === "drilling-rigs" ? (
        <RigSpecsGrid specs={product.specs} dict={dict} />
      ) : (
        <AttributesGrid attributes={product.attributes} details={content?.details} />
      )}
      {specTables?.length ? <SpecTables tables={specTables} /> : null}
    </div>
  );
}
