import type { Product } from "@/lib/products-meta";

/** Cache-bust local product photos after admin preview/order changes. */
export function productMediaVersion(product: Pick<Product, "images" | "updatedAt" | "createdAt">) {
  if (product.updatedAt) return String(Date.parse(product.updatedAt) || product.updatedAt);
  if (product.createdAt) return String(Date.parse(product.createdAt) || product.createdAt);
  return String(product.images.length);
}

export function mediaUrl(src: string, version?: string) {
  if (!src || !version) return src;
  const sep = src.includes("?") ? "&" : "?";
  return `${src}${sep}v=${encodeURIComponent(version)}`;
}
