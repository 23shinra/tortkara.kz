"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  EquipmentCategory,
  Product,
  ProductContent,
  ProductLocale,
  ProductSection,
  ProductSpecs,
  RigConditionGroup,
} from "@/lib/products-meta";
import { SpecFields } from "./SpecFields";

type Props = {
  mode: "create" | "edit";
  initial?: Product;
  brands?: string[];
};

type PendingPhoto = {
  id: string;
  file: File;
  url: string;
};

const DEFAULT_BRANDS = ["XCMG", "BAUER", "SANY", "BOERR", "LEFFER", "Tortkara"];
const CUSTOM_BRAND = "__custom__";
const LOCALES: { code: ProductLocale; label: string }[] = [
  { code: "ru", label: "Русский" },
  { code: "kk", label: "Қазақша" },
  { code: "en", label: "English" },
  { code: "cn", label: "中文" },
];

const emptySpecs = (): ProductSpecs => ({});

export function ProductForm({ mode, initial, brands = DEFAULT_BRANDS }: Props) {
  const router = useRouter();
  const brandOptions = useMemo(() => {
    const set = new Set([...DEFAULT_BRANDS, ...brands]);
    return [...set].filter(Boolean).sort((a, b) => a.localeCompare(b));
  }, [brands]);

  const initialBrand = initial?.brand || brandOptions[0] || "XCMG";
  const startsCustom = Boolean(initial?.brand && !brandOptions.includes(initial.brand));

  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [brandSelect, setBrandSelect] = useState(
    startsCustom ? CUSTOM_BRAND : brandOptions.includes(initialBrand) ? initialBrand : brandOptions[0],
  );
  const [customBrand, setCustomBrand] = useState(startsCustom ? initialBrand : "");
  const brand = brandSelect === CUSTOM_BRAND ? customBrand : brandSelect;
  const [model, setModel] = useState(initial?.model || "");
  const [category, setCategory] = useState(initial?.category || "burovye-ustanovki");
  const [section, setSection] = useState<ProductSection>(initial?.section || "drilling-rigs");
  const [conditionGroup, setConditionGroup] = useState<RigConditionGroup>(
    initial?.conditionGroup || "used",
  );
  const [equipmentCategory, setEquipmentCategory] = useState<EquipmentCategory>(
    initial?.equipmentCategory || "drilling-tools",
  );
  const [content, setContent] = useState<Product["content"]>(initial?.content || {});
  const [attributesText, setAttributesText] = useState(
    Object.entries(initial?.attributes || {})
      .map(([label, value]) => `${label}: ${value}`)
      .join("\n"),
  );
  const [specs, setSpecs] = useState<ProductSpecs>(() => ({
    ...emptySpecs(),
    ...(initial?.specs || {}),
  }));
  const [images, setImages] = useState<string[]>(initial?.images || []);
  const [pending, setPending] = useState<PendingPhoto[]>([]);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const slugLocked = mode === "edit";

  const canSave = useMemo(() => title.trim() && slug.trim() && brand.trim() && model.trim(), [
    title,
    slug,
    brand,
    model,
  ]);

  useEffect(() => {
    return () => {
      pending.forEach((p) => URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onTitleBlur() {
    if (mode === "create" && !slug.trim() && title.trim()) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      );
    }
  }

  function addPendingFiles(files: FileList | null) {
    if (!files?.length) return;
    const next: PendingPhoto[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        file,
        url: URL.createObjectURL(file),
      }));
    if (!next.length) return;
    setPending((prev) => [...prev, ...next]);
  }

  function removePending(id: string) {
    setPending((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return prev.filter((p) => p.id !== id);
    });
  }

  function setPendingPreview(id: string) {
    setPending((prev) => {
      const item = prev.find((p) => p.id === id);
      if (!item) return prev;
      return [item, ...prev.filter((p) => p.id !== id)];
    });
  }

  async function uploadFilesToSlug(productSlug: string, files: File[]) {
    if (!files.length) return null;
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    const res = await fetch(`/api/admin/products/${productSlug}/images`, {
      method: "POST",
      body: form,
    });
    const data = (await res.json()) as { error?: string; product?: Product };
    if (!res.ok) throw new Error(data.error || "Ошибка загрузки фото");
    return data.product ?? null;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setOk("");
    setSaving(true);
    try {
      const payload = {
        title,
        slug,
        brand,
        model,
        category,
        section,
        conditionGroup: section === "drilling-rigs" ? conditionGroup : undefined,
        equipmentCategory: section === "drilling-equipment" ? equipmentCategory : undefined,
        content,
        attributes: Object.fromEntries(
          attributesText
            .split("\n")
            .map((line) => line.split(":"))
            .filter((parts) => parts.length >= 2 && parts[0].trim())
            .map(([label, ...rest]) => [label.trim(), rest.join(":").trim()])
            .filter(([, value]) => value),
        ),
        specs,
        images: mode === "edit" ? images : [],
      };
      const res =
        mode === "create"
          ? await fetch("/api/admin/products", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
          : await fetch(`/api/admin/products/${initial!.slug}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
      const data = (await res.json()) as { error?: string; product?: Product };
      if (!res.ok) {
        setError(data.error || "Ошибка сохранения");
        return;
      }

      if (mode === "create" && data.product) {
        const createdSlug = data.product.slug;
        if (pending.length) {
          setUploading(true);
          try {
            await uploadFilesToSlug(
              createdSlug,
              pending.map((p) => p.file),
            );
          } catch (err) {
            setError(err instanceof Error ? err.message : "Товар создан, но фото не загрузились");
            router.replace(`/admin/products/${createdSlug}`);
            router.refresh();
            return;
          } finally {
            setUploading(false);
          }
        }
        pending.forEach((p) => URL.revokeObjectURL(p.url));
        setPending([]);
        router.replace(`/admin/products/${createdSlug}`);
        router.refresh();
        return;
      }

      if (data.product) {
        setImages(data.product.images);
        setOk("Сохранено");
        if (data.product.slug !== initial?.slug) {
          router.replace(`/admin/products/${data.product.slug}`);
        }
        router.refresh();
      }
    } catch {
      setError("Сеть недоступна");
    } finally {
      setSaving(false);
    }
  }

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    if (mode === "create") {
      addPendingFiles(files);
      return;
    }
    if (!initial) return;
    setUploading(true);
    setError("");
    setOk("");
    try {
      const product = await uploadFilesToSlug(initial.slug, Array.from(files));
      if (product) {
        setImages(product.images);
        setOk("Фото загружены");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setUploading(false);
    }
  }

  async function onRemoveImage(path: string) {
    if (!initial || !confirm("Удалить это фото?")) return;
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${initial.slug}/images`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      const data = (await res.json()) as { error?: string; product?: Product };
      if (!res.ok) {
        setError(data.error || "Не удалось удалить фото");
        return;
      }
      if (data.product) {
        setImages(data.product.images);
        router.refresh();
      }
    } catch {
      setError("Сеть недоступна");
    }
  }

  async function onSetPreview(path: string) {
    if (!initial || images[0] === path) return;
    setError("");
    setOk("");
    const nextImages = [path, ...images.filter((i) => i !== path)];
    setImages(nextImages);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${initial.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preview: path }),
      });
      const data = (await res.json()) as { error?: string; product?: Product };
      if (!res.ok) {
        setError(data.error || "Не удалось сохранить превью");
        setImages(initial.images);
        return;
      }
      if (data.product) {
        setImages(data.product.images);
        setOk("Превью обновлено — на сайте уже новое фото");
        router.refresh();
      }
    } catch {
      setError("Сеть недоступна");
      setImages(initial.images);
    } finally {
      setSaving(false);
    }
  }

  const photoCount = mode === "create" ? pending.length : images.length;

  function updateContent(locale: ProductLocale, patch: Partial<ProductContent>) {
    setContent((current) => {
      const existing = current?.[locale] || { description: "" };
      return { ...current, [locale]: { ...existing, ...patch } };
    });
  }

  return (
    <div className="admin-shell">
      <div className="admin-top">
        <div>
          <h1>{mode === "create" ? "Новый товар" : `Редактирование: ${initial?.title}`}</h1>
          <p className="admin-muted" style={{ margin: "0.25rem 0 0" }}>
            <Link href="/admin">← К списку</Link>
          </p>
        </div>
      </div>

      <form className="admin-card admin-form" onSubmit={onSubmit}>
        {error ? <div className="admin-error">{error}</div> : null}
        {ok ? <div className="admin-ok">{ok}</div> : null}

        <div className="admin-form-grid">
          <div>
            <label className="admin-label" htmlFor="title">
              Название
            </label>
            <input
              id="title"
              className="admin-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={onTitleBlur}
              required
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="slug">
              Slug (URL)
            </label>
            <input
              id="slug"
              className="admin-input"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              disabled={slugLocked}
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="brand">
              Бренд
            </label>
            <select
              id="brand"
              className="admin-select"
              value={brandSelect}
              onChange={(e) => setBrandSelect(e.target.value)}
              required={brandSelect !== CUSTOM_BRAND}
            >
              {brandOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
              <option value={CUSTOM_BRAND}>Другой бренд…</option>
            </select>
            {brandSelect === CUSTOM_BRAND ? (
              <input
                className="admin-input"
                style={{ marginTop: "0.5rem" }}
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
                placeholder="Название бренда"
                required
              />
            ) : null}
          </div>
          <div>
            <label className="admin-label" htmlFor="model">
              Модель
            </label>
            <input
              id="model"
              className="admin-input"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="category">
              Legacy-категория
            </label>
            <input
              id="category"
              className="admin-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="section">
              Раздел каталога
            </label>
            <select
              id="section"
              className="admin-select"
              value={section}
              onChange={(e) => setSection(e.target.value as ProductSection)}
            >
              <option value="drilling-rigs">Буровая техника</option>
              <option value="drilling-equipment">Буровое оборудование</option>
            </select>
          </div>
          {section === "drilling-rigs" ? (
            <div>
              <label className="admin-label" htmlFor="condition-group">
                Группа состояния
              </label>
              <select
                id="condition-group"
                className="admin-select"
                value={conditionGroup}
                onChange={(e) => setConditionGroup(e.target.value as RigConditionGroup)}
              >
                <option value="new">Новая</option>
                <option value="used">Б/у</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="admin-label" htmlFor="equipment-category">
                Тип оборудования
              </label>
              <select
                id="equipment-category"
                className="admin-select"
                value={equipmentCategory}
                onChange={(e) => setEquipmentCategory(e.target.value as EquipmentCategory)}
              >
                <option value="kelly-bars">Келли-штанги</option>
                <option value="casing-oscillators">Обсадные столы</option>
                <option value="casing-system">Обсадная система</option>
                <option value="drilling-tools">Буровой инструмент</option>
                <option value="foundation-tools">Свайный инструмент</option>
                <option value="cfa-dds">CFA / DDS</option>
              </select>
            </div>
          )}
        </div>

        {section === "drilling-rigs" ? <div>
          <p className="admin-label">Характеристики</p>
          <SpecFields specs={specs} onChange={setSpecs} />
        </div> : null}

        <div>
          <label className="admin-label" htmlFor="attributes">
            Дополнительные характеристики (по одной строке «Название: значение»)
          </label>
          <textarea
            id="attributes"
            className="admin-input"
            rows={6}
            value={attributesText}
            onChange={(e) => setAttributesText(e.target.value)}
            placeholder={"Диаметры: 520–1350 мм\nСоединение: 200×200 мм"}
          />
        </div>

        <div>
          <p className="admin-label">Описание товара по языкам</p>
          <div className="admin-form-grid">
            {LOCALES.map(({ code, label }) => {
              const item = content?.[code];
              return (
                <div key={code}>
                  <p className="admin-label">{label}</p>
                  <input
                    className="admin-input"
                    value={item?.title || ""}
                    onChange={(e) => updateContent(code, { title: e.target.value })}
                    placeholder="Локализованное название"
                  />
                  <textarea
                    className="admin-input"
                    rows={5}
                    style={{ marginTop: "0.5rem" }}
                    value={item?.description || ""}
                    onChange={(e) => updateContent(code, { description: e.target.value })}
                    placeholder="Описание"
                  />
                  <textarea
                    className="admin-input"
                    rows={4}
                    style={{ marginTop: "0.5rem" }}
                    value={(item?.benefits || []).join("\n")}
                    onChange={(e) =>
                      updateContent(code, { benefits: e.target.value.split("\n") })
                    }
                    placeholder="Преимущества — по одному на строку"
                  />
                  <textarea
                    className="admin-input"
                    rows={4}
                    style={{ marginTop: "0.5rem" }}
                    value={(item?.variants || []).join("\n")}
                    onChange={(e) =>
                      updateContent(code, { variants: e.target.value.split("\n") })
                    }
                    placeholder="Варианты — по одному на строку"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="admin-photos-block">
          <div className="admin-photos-head">
            <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Фото ({photoCount})</h2>
            <label className="admin-btn admin-btn-primary" style={{ cursor: "pointer" }}>
              {uploading ? (
                "Загрузка…"
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 7.5A2.5 2.5 0 0 1 6.5 5h2.2l1.1-1.6A1.5 1.5 0 0 1 11 2.8h2a1.5 1.5 0 0 1 1.2.6L15.3 5h2.2A2.5 2.5 0 0 1 20 7.5v10A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-10Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M12 6.2v3.2M10.4 7.8h3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
                  </svg>
                  Добавить фото
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                disabled={uploading || saving}
                onChange={(e) => {
                  void onUpload(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          {mode === "create" ? (
            pending.length === 0 ? (
              <p className="admin-muted">Пока нет фото — выберите файлы выше.</p>
            ) : (
              <div className="admin-thumbs">
                {pending.map((item, index) => {
                  const isPreview = index === 0;
                  return (
                    <div className={`admin-thumb${isPreview ? " is-preview" : ""}`} key={item.id}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.url} alt="" />
                      {isPreview ? <span className="admin-thumb-badge">Превью</span> : null}
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger admin-thumb-remove"
                        onClick={() => removePending(item.id)}
                        aria-label="Убрать фото"
                      >
                        ×
                      </button>
                      <div className="admin-thumb-actions">
                        {isPreview ? (
                          <span className="admin-btn" style={{ opacity: 0.85, cursor: "default" }}>
                            Текущее превью
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="admin-btn admin-btn-primary"
                            onClick={() => setPendingPreview(item.id)}
                          >
                            Превью
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : images.length === 0 ? (
            <p className="admin-muted">Пока нет фото</p>
          ) : (
            <div className="admin-thumbs">
              {images.map((src, index) => {
                const isPreview = index === 0;
                return (
                  <div className={`admin-thumb${isPreview ? " is-preview" : ""}`} key={src}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" />
                    {isPreview ? <span className="admin-thumb-badge">Превью</span> : null}
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger admin-thumb-remove"
                      onClick={() => onRemoveImage(src)}
                      aria-label="Удалить фото"
                    >
                      ×
                    </button>
                    <div className="admin-thumb-actions">
                      {isPreview ? (
                        <span className="admin-btn" style={{ opacity: 0.85, cursor: "default" }}>
                          Текущее превью
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="admin-btn admin-btn-primary"
                          disabled={saving}
                          onClick={() => onSetPreview(src)}
                        >
                          Превью
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="admin-actions">
          <button className="admin-btn admin-btn-primary" type="submit" disabled={!canSave || saving || uploading}>
            {saving || uploading
              ? uploading
                ? "Загрузка фото…"
                : "Сохранение…"
              : mode === "create"
                ? "Создать товар"
                : "Сохранить"}
          </button>
        </div>
      </form>
    </div>
  );
}
