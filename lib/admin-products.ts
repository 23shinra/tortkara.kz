import { existsSync, mkdirSync, readdirSync, renameSync, rmSync, unlinkSync, writeFileSync } from "fs";
import path from "path";
import {
  EQUIPMENT_CATEGORIES,
  PRODUCT_SECTIONS,
  RIG_CONDITION_GROUPS,
  type EquipmentCategory,
  type Product,
  type ProductContent,
  type ProductLocale,
  type ProductSection,
  type ProductSpecs,
  type RigConditionGroup,
} from "@/lib/products-meta";
import { deleteProduct, getProduct, getProducts, upsertProduct } from "@/lib/products";

const PRODUCTS_ROOT = path.join(process.cwd(), "public", "products");

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/а/g, "a")
    .replace(/б/g, "b")
    .replace(/в/g, "v")
    .replace(/г/g, "g")
    .replace(/д/g, "d")
    .replace(/е/g, "e")
    .replace(/ё/g, "e")
    .replace(/ж/g, "zh")
    .replace(/з/g, "z")
    .replace(/и/g, "i")
    .replace(/й/g, "y")
    .replace(/к/g, "k")
    .replace(/л/g, "l")
    .replace(/м/g, "m")
    .replace(/н/g, "n")
    .replace(/о/g, "o")
    .replace(/п/g, "p")
    .replace(/р/g, "r")
    .replace(/с/g, "s")
    .replace(/т/g, "t")
    .replace(/у/g, "u")
    .replace(/ф/g, "f")
    .replace(/х/g, "h")
    .replace(/ц/g, "ts")
    .replace(/ч/g, "ch")
    .replace(/ш/g, "sh")
    .replace(/щ/g, "sch")
    .replace(/ъ/g, "")
    .replace(/ы/g, "y")
    .replace(/ь/g, "")
    .replace(/э/g, "e")
    .replace(/ю/g, "yu")
    .replace(/я/g, "ya")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export type ProductInput = {
  slug: string;
  title: string;
  brand: string;
  model: string;
  category?: string;
  section?: ProductSection;
  conditionGroup?: RigConditionGroup;
  equipmentCategory?: EquipmentCategory;
  content?: Partial<Record<ProductLocale, ProductContent>>;
  attributes?: Record<string, string>;
  specs?: ProductSpecs;
  images?: string[];
  catalogPreview?: string | null;
};

function cleanStringArray(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  const items = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length ? items : undefined;
}

function cleanContent(input: ProductInput["content"], existing?: Product["content"]) {
  const next: Product["content"] = {};
  const source = input ?? existing ?? {};
  for (const locale of ["ru", "kk", "en", "cn"] as ProductLocale[]) {
    const item = source[locale];
    if (!item?.description?.trim()) continue;
    const details = Array.isArray(item.details)
      ? item.details
          .filter((row) => row && typeof row.title === "string" && typeof row.text === "string")
          .map((row) => ({ title: row.title.trim(), text: row.text.trim() }))
          .filter((row) => row.title && row.text)
      : undefined;
    const specTables = Array.isArray(item.specTables)
      ? item.specTables
          .filter(
            (table) =>
              table &&
              typeof table.title === "string" &&
              Array.isArray(table.columns) &&
              Array.isArray(table.rows),
          )
          .map((table) => ({
            title: table.title.trim(),
            columns: table.columns.map((c) => String(c).trim()).filter(Boolean),
            rows: table.rows
              .filter((row) => Array.isArray(row))
              .map((row) => row.map((cell) => String(cell).trim())),
            note: table.note?.trim() || undefined,
          }))
          .filter((table) => table.title && table.columns.length && table.rows.length)
      : undefined;
    next[locale] = {
      title: item.title?.trim() || undefined,
      description: item.description.trim(),
      longDescription: item.longDescription?.trim() || undefined,
      benefits: cleanStringArray(item.benefits),
      variants: cleanStringArray(item.variants),
      details: details?.length ? details : undefined,
      specTables: specTables?.length ? specTables : undefined,
    };
  }
  return Object.keys(next).length ? next : undefined;
}

function cleanAttributes(input: ProductInput["attributes"], existing?: Product["attributes"]) {
  const source = input ?? existing ?? {};
  const next: Record<string, string> = {};
  for (const [label, value] of Object.entries(source)) {
    if (typeof value !== "string" || !label.trim() || !value.trim()) continue;
    next[label.trim()] = value.trim();
  }
  return Object.keys(next).length ? next : undefined;
}

export function normalizeProductInput(input: ProductInput, existing?: Product): Product {
  const slug = input.slug.trim().toLowerCase();
  if (!isValidSlug(slug)) {
    throw new Error("Некорректный slug (только a-z, 0-9 и дефис)");
  }
  const title = input.title.trim();
  const brand = input.brand.trim();
  const model = input.model.trim();
  if (!title || !brand || !model) {
    throw new Error("Заполните title, brand и model");
  }

  const specs: ProductSpecs = {};
  const raw = input.specs || {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string" && value.trim()) {
      (specs as Record<string, string>)[key] = value.trim();
    }
  }

  const section = PRODUCT_SECTIONS.includes(input.section as ProductSection)
    ? input.section!
    : existing?.section ?? "drilling-rigs";
  const conditionGroup =
    section === "drilling-rigs"
      ? RIG_CONDITION_GROUPS.includes(input.conditionGroup as RigConditionGroup)
        ? input.conditionGroup
        : existing?.conditionGroup ?? "used"
      : undefined;
  const equipmentCategory =
    section === "drilling-equipment"
      ? EQUIPMENT_CATEGORIES.includes(input.equipmentCategory as EquipmentCategory)
        ? input.equipmentCategory
        : existing?.equipmentCategory ?? "drilling-tools"
      : undefined;

  return {
    slug,
    title,
    brand,
    model,
    category: (input.category || existing?.category || "burovye-ustanovki").trim() || "burovye-ustanovki",
    section,
    conditionGroup,
    equipmentCategory,
    content: cleanContent(input.content, existing?.content),
    attributes: cleanAttributes(input.attributes, existing?.attributes),
    images: input.images ?? existing?.images ?? [],
    specs,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    updatedAt: existing?.updatedAt,
    catalogPreview:
      input.catalogPreview === null
        ? undefined
        : input.catalogPreview ?? existing?.catalogPreview,
  };
}

export function createProduct(input: ProductInput) {
  if (getProduct(input.slug)) {
    throw new Error("Товар с таким slug уже есть");
  }
  const product = normalizeProductInput(input);
  product.updatedAt = new Date().toISOString();
  const dir = path.join(PRODUCTS_ROOT, product.slug);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return upsertProduct(product);
}

export function updateProduct(slug: string, input: ProductInput) {
  const existing = getProduct(slug);
  if (!existing) throw new Error("Товар не найден");

  const nextSlug = input.slug.trim().toLowerCase();
  if (nextSlug !== slug && getProduct(nextSlug)) {
    throw new Error("Товар с таким slug уже есть");
  }

  const product = normalizeProductInput({ ...input, images: input.images ?? existing.images }, existing);

  const imagesChanged =
    JSON.stringify(product.images) !== JSON.stringify(existing.images);

  if (product.slug !== slug) {
    const from = path.join(PRODUCTS_ROOT, slug);
    const to = path.join(PRODUCTS_ROOT, product.slug);
    if (existsSync(from)) {
      if (existsSync(to)) throw new Error("Папка фото для нового slug уже существует");
      renameSync(from, to);
    }
    product.images = product.images.map((img) =>
      img.replace(`/products/${slug}/`, `/products/${product.slug}/`),
    );
    deleteProduct(slug);
  }

  if (imagesChanged || product.slug !== slug) {
    product.updatedAt = new Date().toISOString();
  } else {
    product.updatedAt = existing.updatedAt ?? existing.createdAt;
  }

  return upsertProduct(product);
}

/** Move a photo to the front of the gallery (site cover / preview). */
export function setProductPreview(slug: string, imagePath: string) {
  const product = getProduct(slug);
  if (!product) throw new Error("Товар не найден");
  if (!product.images.includes(imagePath)) {
    throw new Error("Фото не найдено у товара");
  }

  product.images = [imagePath, ...product.images.filter((i) => i !== imagePath)];
  // Manual photo preview overrides generated transparent cutout on cards.
  delete product.catalogPreview;
  product.updatedAt = new Date().toISOString();
  return upsertProduct(product);
}

export function removeProduct(slug: string) {
  const ok = deleteProduct(slug);
  if (!ok) throw new Error("Товар не найден");
  const dir = path.join(PRODUCTS_ROOT, slug);
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
  }
  return true;
}

function nextImageName(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const files = readdirSync(dir).filter((f) => /^\d+\.(jpe?g|png|webp)$/i.test(f));
  let max = 0;
  for (const f of files) {
    const n = parseInt(f, 10);
    if (!Number.isNaN(n) && n > max) max = n;
  }
  return `${String(max + 1).padStart(2, "0")}.jpg`;
}

export async function addProductImages(slug: string, files: File[]) {
  const product = getProduct(slug);
  if (!product) throw new Error("Товар не найден");

  const dir = path.join(PRODUCTS_ROOT, slug);
  const added: string[] = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;
    const name = nextImageName(dir);
    const buf = Buffer.from(await file.arrayBuffer());
    writeFileSync(path.join(dir, name), buf);
    added.push(`/products/${slug}/${name}`);
  }

  if (!added.length) throw new Error("Нет подходящих изображений");

  product.images = [...product.images, ...added];
  product.updatedAt = new Date().toISOString();
  upsertProduct(product);
  return product;
}

export function removeProductImage(slug: string, imagePath: string) {
  const product = getProduct(slug);
  if (!product) throw new Error("Товар не найден");

  if (!product.images.includes(imagePath)) {
    throw new Error("Фото не найдено у товара");
  }

  product.images = product.images.filter((i) => i !== imagePath);
  product.updatedAt = new Date().toISOString();
  upsertProduct(product);

  if (imagePath.startsWith(`/products/${slug}/`)) {
    const file = path.join(process.cwd(), "public", imagePath);
    if (existsSync(file)) unlinkSync(file);
  }

  return product;
}

export function listProducts() {
  return getProducts();
}
