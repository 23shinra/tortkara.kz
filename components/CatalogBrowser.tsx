"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowsDownUp, Funnel, MagnifyingGlass, X } from "@phosphor-icons/react";
import { ApplyButton } from "@/components/ApplyModal";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { useLocale } from "@/components/LocaleProvider";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { SiteSelect } from "@/components/SiteSelect";
import { t } from "@/lib/i18n/dictionary";
import { getProductContent, getProductTitle } from "@/lib/product-content";
import type { EquipmentCategory, Product, ProductSection } from "@/lib/products-meta";

type Props = {
  products: Product[];
  section: ProductSection;
  eyebrow: string;
  title: string;
  intro: string;
  initialEquipmentCategory?: EquipmentCategory;
};

type PhotosFilter = "all" | "yes" | "no";
type DepthFilter = "all" | "to60" | "60to90" | "from90";
type DiameterFilter = "all" | "to1800" | "1800to2200" | "from2200";
type SortOption = "added-desc" | "year-desc" | "year-asc";
type EquipmentFilter = "all" | EquipmentCategory;

function yearValue(year?: string) {
  if (!year) return 0;
  const nums = year.match(/\d{4}/g)?.map(Number) ?? [];
  return nums.length ? Math.max(...nums) : 0;
}

function addedValue(createdAt?: string) {
  if (!createdAt) return 0;
  const time = Date.parse(createdAt);
  return Number.isNaN(time) ? 0 : time;
}

function parseNums(raw?: string) {
  if (!raw) return [];
  return (raw.match(/\d+(?:[.,]\d+)?/g) || []).map((n) => Number(n.replace(",", ".")));
}

function depthMax(depth?: string) {
  const nums = parseNums(depth);
  return nums.length ? Math.max(...nums) : null;
}

function diameterMax(diameter?: string) {
  const nums = parseNums(diameter);
  return nums.length ? Math.max(...nums) : null;
}

function matchesDepth(depth: string | undefined, filter: DepthFilter) {
  const max = depthMax(depth);
  if (filter === "all" || max == null) return filter === "all";
  if (filter === "to60") return max <= 60;
  if (filter === "60to90") return max > 60 && max <= 90;
  return max > 90;
}

function matchesDiameter(diameter: string | undefined, filter: DiameterFilter) {
  const max = diameterMax(diameter);
  if (filter === "all" || max == null) return filter === "all";
  if (filter === "to1800") return max <= 1800;
  if (filter === "1800to2200") return max > 1800 && max <= 2200;
  return max > 2200;
}

export function CatalogBrowser({
  products,
  section,
  eyebrow,
  title,
  intro,
  initialEquipmentCategory,
}: Props) {
  const { dict, locale } = useLocale();
  const c = dict.catalog;
  const [equipmentType, setEquipmentType] = useState<EquipmentFilter>(
    initialEquipmentCategory ?? "all",
  );
  const sectionProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.section === section &&
          (section !== "drilling-equipment" ||
            equipmentType === "all" ||
            product.equipmentCategory === equipmentType),
      ),
    [products, section, equipmentType],
  );

  const brands = useMemo(
    () => [...new Set(sectionProducts.map((p) => p.brand))].sort((a, b) => a.localeCompare(b)),
    [sectionProducts],
  );

  const conditions = useMemo(
    () =>
      [...new Set(sectionProducts.map((p) => p.specs.condition).filter(Boolean) as string[])].sort(),
    [sectionProducts],
  );

  const years = useMemo(() => {
    const set = new Set<string>();
    for (const p of sectionProducts) {
      if (!p.specs.year) continue;
      for (const part of p.specs.year.split(/[/,]/)) {
        const y = part.trim();
        if (/^\d{4}$/.test(y)) set.add(y);
      }
    }
    return [...set].sort((a, b) => b.localeCompare(a));
  }, [sectionProducts]);

  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [condition, setCondition] = useState("");
  const [year, setYear] = useState("");
  const [photos, setPhotos] = useState<PhotosFilter>("all");
  const [depth, setDepth] = useState<DepthFilter>("all");
  const [diameter, setDiameter] = useState<DiameterFilter>("all");
  const [sort, setSort] = useState<SortOption>("added-desc");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (section === "drilling-equipment") {
      setEquipmentType(initialEquipmentCategory ?? "all");
    }
  }, [section, initialEquipmentCategory]);

  const activeExtraFilters =
    Number(Boolean(condition)) +
    Number(Boolean(year)) +
    Number(photos !== "all") +
    Number(depth !== "all") +
    Number(diameter !== "all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sectionProducts.filter((p) => {
      if (brand && p.brand !== brand) return false;
      if (condition && p.specs.condition !== condition) return false;
      if (year && !p.specs.year?.includes(year)) return false;
      if (photos === "yes" && p.images.length === 0) return false;
      if (photos === "no" && p.images.length > 0) return false;
      if (!matchesDepth(p.specs.depth, depth)) return false;
      if (!matchesDiameter(p.specs.diameter, diameter)) return false;
      if (!q) return true;
      const hay = [p.title, getProductTitle(p, locale), getProductContent(p, locale)?.description, p.brand, p.model, p.specs.year, p.specs.condition, p.specs.depth, p.specs.diameter]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [sectionProducts, brand, query, condition, year, photos, depth, diameter, locale]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sort === "year-desc") {
      return list.sort((a, b) => yearValue(b.specs.year) - yearValue(a.specs.year));
    }
    if (sort === "year-asc") {
      return list.sort((a, b) => yearValue(a.specs.year) - yearValue(b.specs.year));
    }
    return list.sort((a, b) => addedValue(b.createdAt) - addedValue(a.createdAt));
  }, [filtered, sort]);

  function resetFilters() {
    setCondition("");
    setYear("");
    setPhotos("all");
    setDepth("all");
    setDiameter("all");
  }

  return (
    <div className="pb-20">
      <section className="border-b border-line bg-bg-elevated">
        <div className="container-wide py-16 md:py-24">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display mt-4 max-w-3xl text-4xl sm:text-5xl md:text-7xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted sm:mt-5 sm:text-base md:text-lg">
            {intro}
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-bg-soft">
        <div className="container-wide py-5 md:py-6">
          {section === "drilling-equipment" ? (
            <div className="mb-5 flex flex-wrap gap-2">
              {(
                [
                  ["all", c.equipmentAll],
                  ["kelly-bars", c.eqKellyBars],
                  ["casing-oscillators", c.eqCasingOscillators],
                  ["casing-system", c.eqCasingSystem],
                  ["drilling-tools", c.eqDrillingTools],
                  ["foundation-tools", c.eqFoundationTools],
                  ["cfa-dds", c.eqCfaDds],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setEquipmentType(value);
                    setBrand("");
                  }}
                  className={`border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] transition-colors ${
                    equipmentType === value
                      ? "border-accent bg-accent text-brand-blue"
                      : "border-line-strong bg-bg-elevated text-text-muted hover:border-text"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <MagnifyingGlass
                size={18}
                weight="bold"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={c.searchPlaceholder}
                className="field w-full !pl-10"
              />
            </div>
            <button
              type="button"
              className={`btn btn-ghost shrink-0 gap-2 ${filtersOpen ? "!border-accent !text-accent" : ""}`}
              onClick={() => setFiltersOpen((v) => !v)}
            >
              <Funnel size={18} weight="bold" />
              {c.filters}
              {activeExtraFilters ? (
                <span className="inline-flex min-h-5 min-w-5 items-center justify-center bg-accent px-1.5 text-[0.65rem] font-bold text-brand-blue">
                  {activeExtraFilters}
                </span>
              ) : null}
            </button>
            <div className="relative w-full lg:w-[18.5rem]">
              <SiteSelect
                id="catalog-sort"
                label={c.sortLabel}
                value={sort}
                onChange={(value) => setSort(value as SortOption)}
                leadingIcon={<ArrowsDownUp size={18} weight="bold" />}
                options={[
                  { value: "added-desc", label: c.sortAddedDesc },
                  { value: "year-desc", label: c.sortYearDesc },
                  { value: "year-asc", label: c.sortYearAsc },
                ]}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setBrand("")}
              className={`border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                brand === ""
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line-strong text-text-muted hover:border-text hover:text-text"
              }`}
            >
              {c.allBrands} · {sectionProducts.length}
            </button>
            {brands.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBrand(b)}
                className={`border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                  brand === b
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line-strong text-text-muted hover:border-text hover:text-text"
                }`}
              >
                {b} · {sectionProducts.filter((p) => p.brand === b).length}
              </button>
            ))}
          </div>

          {filtersOpen && section === "drilling-rigs" ? (
            <div className="mt-4 border border-line bg-bg-elevated p-4 md:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                  {c.filters}
                </p>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-text-muted hover:text-accent"
                  onClick={resetFilters}
                >
                  <X size={14} weight="bold" />
                  {c.resetFilters}
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <div>
                  <p className="label">{c.filterCondition}</p>
                  <SiteSelect
                    label={c.filterCondition}
                    value={condition}
                    onChange={setCondition}
                    options={[
                      { value: "", label: c.conditionAll },
                      ...conditions.map((item) => ({ value: item, label: item })),
                    ]}
                  />
                </div>
                <div>
                  <p className="label">{c.filterYear}</p>
                  <SiteSelect
                    label={c.filterYear}
                    value={year}
                    onChange={setYear}
                    options={[
                      { value: "", label: c.conditionAll },
                      ...years.map((item) => ({ value: item, label: item })),
                    ]}
                  />
                </div>
                <div>
                  <p className="label">{c.filterPhotos}</p>
                  <SiteSelect
                    label={c.filterPhotos}
                    value={photos}
                    onChange={(value) => setPhotos(value as PhotosFilter)}
                    options={[
                      { value: "all", label: c.photosAll },
                      { value: "yes", label: c.photosYes },
                      { value: "no", label: c.photosNo },
                    ]}
                  />
                </div>
                <div>
                  <p className="label">{c.filterDepth}</p>
                  <SiteSelect
                    label={c.filterDepth}
                    value={depth}
                    onChange={(value) => setDepth(value as DepthFilter)}
                    options={[
                      { value: "all", label: c.depthAll },
                      { value: "to60", label: c.depthTo60 },
                      { value: "60to90", label: c.depth60to90 },
                      { value: "from90", label: c.depthFrom90 },
                    ]}
                  />
                </div>
                <div>
                  <p className="label">{c.filterDiameter}</p>
                  <SiteSelect
                    label={c.filterDiameter}
                    value={diameter}
                    onChange={(value) => setDiameter(value as DiameterFilter)}
                    options={[
                      { value: "all", label: c.diameterAll },
                      { value: "to1800", label: c.diameterTo1800 },
                      { value: "1800to2200", label: c.diameter1800to2200 },
                      { value: "from2200", label: c.diameterFrom2200 },
                    ]}
                  />
                </div>
              </div>
            </div>
          ) : null}

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
            {t(c.results, { count: sorted.length })}
          </p>
        </div>
      </section>

      <section className="container-wide py-14 md:py-20">
        {sorted.length === 0 ? (
          <p className="text-sm text-text-muted">{c.empty}</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((product, index) => (
              <Reveal key={product.slug} delayMs={(index % 6) * 40} className="h-full">
                <ProductCard product={product} onOpen={setSelectedProduct} />
              </Reveal>
            ))}
          </div>
        )}
        <p className="mt-10 text-sm text-text-muted">
          {c.otherCategory}{" "}
          <ApplyButton className="text-accent hover:underline">
            {c.writeInApply}
          </ApplyButton>{" "}
          - подберём технику под задачу.
        </p>
      </section>

      {selectedProduct ? (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      ) : null}
    </div>
  );
}
