import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <h1>Админка</h1>
        <p className="admin-muted" style={{ marginTop: 0, marginBottom: "1.25rem" }}>
          Tortkara Machinery — каталог
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
