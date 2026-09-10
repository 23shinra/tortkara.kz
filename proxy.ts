import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Legacy assortment URL → gallery
  for (const locale of locales) {
    if (pathname === `/${locale}/assortment` || pathname.startsWith(`/${locale}/assortment/`)) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.replace(`/${locale}/assortment`, `/${locale}/gallery`);
      return NextResponse.redirect(url);
    }
  }
  if (pathname === "/assortment" || pathname.startsWith("/assortment/")) {
    // Keep public image assets under /assortment/*.png
    if (/\.(png|jpe?g|webp|gif|svg)$/i.test(pathname)) {
      return NextResponse.next();
    }
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace("/assortment", `/${defaultLocale}/gallery`);
    return NextResponse.redirect(url);
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|admin|favicon.ico|icon.png|apple-touch-icon.png|brand|products|assortment|hero|.*\\..*).*)"],
};
