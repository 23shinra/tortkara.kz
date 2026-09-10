import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { getProducts } from "@/lib/products";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function AdminNewProductPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const brands = [...new Set(getProducts().map((p) => p.brand))];
  return <ProductForm mode="create" brands={brands} />;
}
