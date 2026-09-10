"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/products-meta";

type ViewMode = "list" | "grid";

const VIEW_KEY = "tortkara-admin-catalog-view";

function ListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function ProductTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [view, setView] = useState<ViewMode>("list");

  useEffect(() => {
    const saved = window.localStorage.getItem(VIEW_KEY);
    if (saved === "list" || saved === "grid") setView(saved);
  }, []);

  function changeView(next: ViewMode) {
    setView(next);
    window.localStorage.setItem(VIEW_KEY, next);
  }

  async function onDelete(slug: string, title: string) {
    if (!confirm(`Удалить «${title}»? Фото тоже будут удалены.`)) return;
    setBusy(slug);
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${slug}`, { method: "DELETE" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Не удалось удалить");
        return;
      }
      router.refresh();
    } catch {
      setError("Сеть недоступна");
    } finally {
      setBusy(null);
    }
  }

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-shell">
      <div className="admin-top">
        <div className="admin-top-left">
          <div className="admin-view-toggle" role="group" aria-label="Вид списка">
            <button
              type="button"
              className={`admin-view-btn${view === "list" ? " is-active" : ""}`}
              aria-pressed={view === "list"}
              title="Список"
              onClick={() => changeView("list")}
            >
              <ListIcon />
              <span>Список</span>
            </button>
            <button
              type="button"
              className={`admin-view-btn${view === "grid" ? " is-active" : ""}`}
              aria-pressed={view === "grid"}
              title="Значки"
              onClick={() => changeView("grid")}
            >
              <GridIcon />
              <span>Значки</span>
            </button>
          </div>
          <div>
            <h1>Каталог</h1>
            <p className="admin-muted" style={{ margin: "0.25rem 0 0" }}>
              {products.length} позиций
            </p>
          </div>
        </div>
        <div className="admin-actions">
          <Link className="admin-btn admin-btn-primary" href="/admin/products/new">
            Добавить товар
          </Link>
          <Link className="admin-btn" href="/" target="_blank">
            На сайт
          </Link>
          <button type="button" className="admin-btn" onClick={onLogout}>
            Выйти
          </button>
        </div>
      </div>

      {error ? <div className="admin-error" style={{ marginBottom: "1rem" }}>{error}</div> : null}

      <div className="admin-card">
        {products.length === 0 ? (
          <p className="admin-muted">Каталог пуст. Добавьте первый товар.</p>
        ) : view === "list" ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Превью</th>
                <th>Название</th>
                <th>Бренд</th>
                <th>Раздел</th>
                <th>Slug</th>
                <th>Фото</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const preview = p.images[0];
                return (
                  <tr key={p.slug}>
                    <td>
                      {preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="admin-list-preview" src={preview} alt="" />
                      ) : (
                        <div className="admin-list-preview-empty">нет<br />фото</div>
                      )}
                    </td>
                    <td>
                      <strong>{p.title}</strong>
                      <div className="admin-muted">{p.model}</div>
                    </td>
                    <td>{p.brand}</td>
                    <td>
                      {p.section === "drilling-equipment"
                        ? `Оборудование · ${p.equipmentCategory || "—"}`
                        : `Буровая · ${p.conditionGroup === "new" ? "новая" : "б/у"}`}
                    </td>
                    <td>
                      <code>{p.slug}</code>
                    </td>
                    <td>{p.images.length}</td>
                    <td>
                      <div className="admin-actions">
                        <Link className="admin-btn" href={`/admin/products/${p.slug}`}>
                          Изменить
                        </Link>
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger"
                          disabled={busy === p.slug}
                          onClick={() => onDelete(p.slug, p.title)}
                        >
                          {busy === p.slug ? "…" : "Удалить"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="admin-product-grid">
            {products.map((p) => {
              const preview = p.images[0];
              return (
                <article key={p.slug} className="admin-product-tile">
                  <div className="admin-product-tile-media">
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview} alt="" />
                    ) : (
                      <div className="admin-product-tile-empty">нет фото</div>
                    )}
                  </div>
                  <div className="admin-product-tile-body">
                    <strong>{p.title}</strong>
                    <p className="admin-muted">
                      {p.brand} ·{" "}
                      {p.section === "drilling-equipment"
                        ? p.equipmentCategory
                        : p.conditionGroup === "new"
                          ? "новая"
                          : "б/у"}{" "}
                      · {p.images.length} фото
                    </p>
                    <div className="admin-actions">
                      <Link className="admin-btn" href={`/admin/products/${p.slug}`}>
                        Изменить
                      </Link>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger"
                        disabled={busy === p.slug}
                        onClick={() => onDelete(p.slug, p.title)}
                      >
                        {busy === p.slug ? "…" : "Удалить"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
