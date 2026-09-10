import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { getProducts } from "@/lib/products";
import { ProductTable } from "./ProductTable";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const products = getProducts();
  return <ProductTable products={products} />;
}
