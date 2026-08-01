/**
 * Locale configuration.
 *
 * Ships `en` only, but every locale-dependent code path reads from here, so
 * adding a locale means: add it to `locales`, add a dictionary JSON file, and
 * add the field to the Sanity localized objects. No structural change.
 */

export const locales = ["en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Display names for a future locale switcher, in each locale's own language. */
export const localeNames: Record<Locale, string> = {
  en: "English",
};

/** BCP-47 tags for <html lang> and hreflang. */
export const localeToHtmlLang: Record<Locale, string> = {
  en: "en",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Narrows an unknown route param to a Locale, or null.
 *
 * Pages call `notFound()` when this returns null rather than falling back to
 * the default — a silent fallback would serve English at /fr/ with a 200 and
 * get it indexed as duplicate content.
 */
export function parseLocale(value: string): Locale | null {
  return isLocale(value) ? value : null;
}

/* ---------- Route helpers ---------- */

/**
 * Prefixes an app-relative path with the locale.
 *
 *   localePath("en", "/shop")          -> "/en/shop"
 *   localePath("en", "/")              -> "/en"
 *   localePath("en", "/support#faq")   -> "/en/support#faq"
 *
 * Leaves absolute URLs, mailto:, tel:, and bare "#" untouched, so it is safe to
 * wrap every href — including the [bracketed] placeholders from lib/site.ts,
 * which resolve to "#" via hrefOrHash().
 */
export function localePath(locale: Locale, path: string): string {
  if (
    path === "#" ||
    path.startsWith("#") ||
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:")
  ) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

/**
 * Strips the locale prefix from a pathname.
 *
 *   stripLocale("/en/shop") -> "/shop"
 *   stripLocale("/en")      -> "/"
 *
 * Used for active-link comparison and by a future locale switcher.
 */
export function stripLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname;
}

/** hreflang alternates for page metadata, keyed by BCP-47 tag. */
export function languageAlternates(path: string): Record<string, string> {
  return Object.fromEntries(
    locales.map((l) => [localeToHtmlLang[l], localePath(l, path)]),
  );
}

/* ---------- Dictionaries ---------- */

/**
 * UI chrome only — nav labels, buttons, form strings. Page *copy* stays in the
 * page components for now and moves to Sanity in phase 2. The split matters:
 * chrome is developer-owned and ships with the code; copy is editor-owned.
 */
export interface Dictionary {
  nav: {
    howItWorks: string;
    whyDifferent: string;
    app: string;
    specs: string;
    support: string;
    shop: string;
    /** Desktop header button. */
    shopNow: string;
    /** Mobile panel button — same action, arrow affordance. */
    shopNowArrow: string;
    menu: string;
    closeMenu: string;
  };
  footer: {
    support: string;
    follow: string;
    legal: string;
    gettingStarted: string;
    userManual: string;
    faq: string;
    contactUs: string;
    appIos: string;
    appAndroid: string;
    instagram: string;
    youtube: string;
    facebook: string;
    x: string;
    shipping: string;
    warranty: string;
    privacyPolicy: string;
    termsOfService: string;
  };
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () =>
    import("./dictionaries/en.json").then((m) => m.default as Dictionary),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
