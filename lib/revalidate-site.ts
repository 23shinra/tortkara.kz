import { existsSync, rmSync } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { locales } from "@/lib/i18n/config";

/** Bust Next.js image optimizer cache so replaced/reordered previews show up. */
export function clearImageOptimizerCache() {
  const dir = path.join(process.cwd(), ".next", "cache", "images");
  if (!existsSync(dir)) return;
  try {
    rmSync(dir, { recursive: true, force: true });
  } catch {
    // ignore — cache may be locked briefly
  }
}

export function revalidatePublicSite(slug?: string, nextSlug?: string) {
  clearImageOptimizerCache();
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");

  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/catalog`);
    revalidatePath(`/${locale}/catalog/equipment`);
    revalidatePath(`/${locale}/gallery`);
    revalidatePath(`/${locale}/apply`);
    if (slug) revalidatePath(`/${locale}/catalog/${slug}`);
    if (nextSlug && nextSlug !== slug) {
      revalidatePath(`/${locale}/catalog/${nextSlug}`);
    }
  }
}
