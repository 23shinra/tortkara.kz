import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { createProduct, listProducts, type ProductInput } from "@/lib/admin-products";
import { revalidatePublicSite } from "@/lib/revalidate-site";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ products: listProducts() });
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ProductInput;
    const product = createProduct(body);
    revalidatePublicSite(product.slug);
    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка создания";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
