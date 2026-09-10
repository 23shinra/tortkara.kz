import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { getProduct, getProducts } from "@/lib/products";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function AdminEditProductPage({ params }: Props) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const brands = [...new Set(getProducts().map((p) => p.brand))];
  return <ProductForm mode="edit" initial={product} brands={brands} />;
}
