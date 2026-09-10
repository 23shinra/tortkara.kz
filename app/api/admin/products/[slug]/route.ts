import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { getProduct } from "@/lib/products";
import { removeProduct, setProductPreview, updateProduct, type ProductInput } from "@/lib/admin-products";
import { revalidatePublicSite } from "@/lib/revalidate-site";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await ctx.params;
  const product = getProduct(slug);
  if (!product) return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(request: Request, ctx: Ctx) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await ctx.params;
    const body = (await request.json()) as ProductInput & { preview?: string };

    const product =
      typeof body.preview === "string" && body.preview
        ? setProductPreview(slug, body.preview)
        : updateProduct(slug, body);

    revalidatePublicSite(slug, product.slug);
    return NextResponse.json({ product });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка обновления";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await ctx.params;
    removeProduct(slug);
    revalidatePublicSite(slug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка удаления";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
