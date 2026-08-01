import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "./lib/i18n";

/**
 * Locale routing. Every page lives under /[lang], so requests without a locale
 * prefix are redirected to the default locale.
 *
 * Named proxy.ts because Next 16 renamed middleware.ts (see the
 * middleware-to-proxy codemod).
 *
 * Redirects are 308 (permanent) so search engines transfer the old unprefixed
 * URLs' ranking to the prefixed ones rather than treating them as duplicates.
 */
/** Path segments that look like a locale code: "fr", "pt-BR". */
const LOCALE_SHAPED = /^[a-z]{2}(-[A-Za-z0-9]{2,8})?$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "";

  // Already localized — nothing to do.
  if ((locales as readonly string[]).includes(firstSegment)) {
    return NextResponse.next();
  }

  // Locale-shaped but not one we ship (/fr, /pt-BR): pass through so the
  // [lang] segment 404s on it. Redirecting would send /fr to /en/fr, which is
  // a nonexistent URL that 404s anyway — via a misleading extra hop.
  //
  // Real routes are never locale-shaped ("app" is 3 chars, the rest hyphenate),
  // so this cannot swallow a legitimate page.
  if (LOCALE_SHAPED.test(firstSegment)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  /**
   * Skip everything that is not a page: API routes, Next internals, the
   * generated SEO files, and any path with a file extension (favicon, images,
   * fonts). Without the extension guard, /icon.svg would redirect to
   * /en/icon.svg and 404.
   */
  matcher: [
    "/((?!api|_next/static|_next/image|sitemap\\.xml|robots\\.txt|opengraph-image|icon|.*\\.[\\w]+$).*)",
  ],
};
