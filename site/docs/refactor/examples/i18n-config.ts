/**
 * REFERENCE — target: site/lib/i18n.ts
 *
 * Locale configuration. Ships `en` only, but every locale-dependent code path
 * reads from here, so adding a locale is a one-line change plus a dictionary
 * file and Sanity field.
 */

export const locales = ["en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Display names for the locale switcher, in each locale's own language. */
export const localeNames: Record<Locale, string> = {
  en: "English",
};

/** Maps a locale to its BCP-47 tag for <html lang> and hreflang. */
export const localeToHtmlLang: Record<Locale, string> = {
  en: "en",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Narrows an unknown route param to a Locale.
 *
 * Prefer calling `notFound()` in the page when this returns null, rather than
 * silently falling back — a silent fallback makes `/fr/shop` render English
 * with a 200, which search engines will index as a duplicate.
 */
export function parseLocale(value: string): Locale | null {
  return isLocale(value) ? value : null;
}

/* ---------- Dictionaries ---------- */

/**
 * UI chrome only — nav labels, button text, form errors. Page *copy* lives in
 * Sanity. The split matters: chrome is developer-owned and changes with the
 * code, copy is editor-owned and changes without a deploy.
 */
export interface Dictionary {
  nav: {
    home: string;
    howItWorks: string;
    whyDifferent: string;
    specs: string;
    app: string;
    shop: string;
    support: string;
  };
  cart: {
    title: string;
    empty: string;
    addToCart: string;
    checkout: string;
    subtotal: string;
    remove: string;
  };
  common: {
    learnMore: string;
    readMore: string;
    close: string;
    menu: string;
  };
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en.json").then((m) => m.default as Dictionary),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

/* ---------- Route helpers ---------- */

/**
 * Prefixes an app-relative path with the locale.
 *
 *   localePath("en", "/shop")  → "/en/shop"
 *
 * Leaves absolute URLs, mailto:, tel: and "#" untouched so it is safe to wrap
 * every href in Header/Footer, including the [bracketed] placeholders from
 * lib/site.ts (which resolve to "#" via hrefOrHash).
 */
export function localePath(locale: Locale, path: string): string {
  if (
    path === "#" ||
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:")
  ) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}

/**
 * Strips the locale prefix from a pathname — needed by the locale switcher to
 * keep the user on the same page when they change language.
 *
 *   stripLocale("/en/shop") → "/shop"
 */
export function stripLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    return `/${segments.slice(1).join("/")}`;
  }
  return pathname;
}

/** hreflang alternates for page metadata. */
export function languageAlternates(
  path: string
): Record<string, string> {
  return Object.fromEntries(
    locales.map((l) => [localeToHtmlLang[l], localePath(l, path)])
  );
}
