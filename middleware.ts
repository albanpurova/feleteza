import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "fleteza_admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Lejo faqen e kyçjes dhe API-të e adminit (login/logout menaxhojnë vetë).
  if (pathname.startsWith("/admin/login") || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const hasCookie = req.cookies.has(COOKIE_NAME);
    if (!hasCookie) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
