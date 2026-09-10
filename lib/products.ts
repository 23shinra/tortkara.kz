import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import type { Product, ProductSpecs } from "@/lib/products-meta";

export type { Product, ProductSpecs };
export { SPEC_KEYS, specLabels } from "@/lib/products-meta";

const DATA_PATH = path.join(process.cwd(), "data", "products.json");

function ensureDataFile() {
  if (!existsSync(DATA_PATH)) {
    const dir = path.dirname(DATA_PATH);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(DATA_PATH, "[]\n", "utf8");
  }
}

export function getProducts(): Product[] {
  ensureDataFile();
  const raw = readFileSync(DATA_PATH, "utf8");
  const parsed = JSON.parse(raw) as Product[];
  if (!Array.isArray(parsed)) return [];
  const base = Date.UTC(2024, 0, 1);
  return parsed.map((product, index) => ({
    ...product,
    createdAt:
      product.createdAt ??
      new Date(base + index * 86_400_000).toISOString(),
  }));
}

export function getProduct(slug: string) {
  return getProducts().find((p) => p.slug === slug);
}

export function productsWithPhotos() {
  return getProducts().filter((p) => p.images.length > 0);
}

export function saveProducts(next: Product[]) {
  ensureDataFile();
  writeFileSync(DATA_PATH, JSON.stringify(next, null, 2) + "\n", "utf8");
}

export function upsertProduct(product: Product) {
  const list = getProducts();
  const idx = list.findIndex((p) => p.slug === product.slug);
  if (idx >= 0) list[idx] = product;
  else list.push(product);
  saveProducts(list);
  return product;
}

export function deleteProduct(slug: string) {
  const list = getProducts();
  const next = list.filter((p) => p.slug !== slug);
  if (next.length === list.length) return false;
  saveProducts(next);
  return true;
}
