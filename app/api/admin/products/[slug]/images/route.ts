import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { addProductImages, removeProductImage } from "@/lib/admin-products";
import { revalidatePublicSite } from "@/lib/revalidate-site";

type Ctx = { params: Promise<{ slug: string }> };

export async function POST(request: Request, ctx: Ctx) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await ctx.params;
    const form = await request.formData();
    const files: File[] = [];
    for (const entry of form.getAll("files")) {
      if (typeof entry !== "string" && "arrayBuffer" in entry) files.push(entry as File);
    }
    const single = form.get("file");
    if (single && typeof single !== "string" && "arrayBuffer" in single) {
      files.push(single as File);
    }

    const product = await addProductImages(slug, files);
    revalidatePublicSite(slug);
    return NextResponse.json({ product });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка загрузки";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await ctx.params;
    const body = (await request.json()) as { path?: string };
    if (!body.path) {
      return NextResponse.json({ error: "Не указан path" }, { status: 400 });
    }
    const product = removeProductImage(slug, body.path);
    revalidatePublicSite(slug);
    return NextResponse.json({ product });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка удаления фото";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
