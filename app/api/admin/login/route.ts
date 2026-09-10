import { NextResponse } from "next/server";
import {
  createSessionToken,
  sessionCookieOptions,
  validateCredentials,
  ADMIN_COOKIE,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: string; password?: string };
    const username = (body.username || "").trim();
    const password = body.password || "";

    if (!validateCredentials(username, password)) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    }

    const token = createSessionToken(username);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions());
    return res;
  } catch {
    return NextResponse.json({ error: "Ошибка входа" }, { status: 500 });
  }
}
