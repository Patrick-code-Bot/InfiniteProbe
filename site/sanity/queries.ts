import type { Locale } from "@/lib/i18n";
import { defaultLocale } from "@/lib/i18n";
import { sanityFetch } from "./client";

/**
 * GROQ queries with locale coalescing.
 *
 * The core trick: resolve localized objects to plain strings *in the query*, so
 * components receive `{ heading: string }` rather than `{ heading: { en } }`.
 * `coalesce` falls through to the default locale when a translation is missing,
 * so a half-translated page renders in English instead of showing blanks.
 */

/**
 * Builds a projection resolving a localized field to a single string.
 *
 *   loc("heading", "en")  ->  '"heading": heading.en'
 *
 * SAFETY: `locale` is interpolated as a GROQ *field path*, which cannot be
 * parameterized. It must always be a validated `Locale` from lib/i18n (i.e. the
 * output of `parseLocale`), never raw user input. `slug` and other values are
 * passed as bound parameters and are safe to take from the URL.
 */
function loc(field: string, locale: Locale, alias?: string): string {
  const name = alias ?? field.split(".").pop() ?? field;
  return locale === defaultLocale
    ? `"${name}": ${field}.${defaultLocale}`
    : `"${name}": coalesce(${field}.${locale}, ${field}.${defaultLocale})`;
}

const imageFragment = (locale: Locale) => `
  "url": asset->url,
  "dimensions": asset->metadata.dimensions,
  "lqip": asset->metadata.lqip,
  ${loc("alt", locale)}
`;

const sectionsFragment = (locale: Locale) => `
  sections[]{
    _key,
    _type,
    _type == "heroSection" => {
      ${loc("eyebrow", locale)},
      ${loc("heading", locale)},
      ${loc("subheading", locale)},
      ${loc("ctaLabel", locale)},
      ctaHref,
      videoUrl,
      image{ ${imageFragment(locale)} }
    },
    _type == "featureGridSection" => {
      ${loc("heading", locale)},
      features[]{
        _key,
        ${loc("title", locale)},
        ${loc("body", locale)},
        icon{ ${imageFragment(locale)} }
      }
    },
    _type == "richTextSection" => {
      ${loc("heading", locale)},
      "body": coalesce(body.${locale}, body.${defaultLocale})
    }
  }
`;

const seoFragment = (locale: Locale) => `
  seo{
    ${loc("metaTitle", locale)},
    ${loc("metaDescription", locale)},
    noIndex,
    ogImage{ "url": asset->url }
  }
`;

export const pageBySlugQuery = (locale: Locale) => `
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    ${sectionsFragment(locale)},
    ${seoFragment(locale)}
  }
`;

/* ---------- Types ---------- */

export interface SanityImage {
  url: string;
  alt: string;
  lqip?: string;
  dimensions?: { width: number; height: number };
}

export type PageSection =
  | {
      _key: string;
      _type: "heroSection";
      eyebrow?: string;
      heading: string;
      subheading?: string;
      ctaLabel?: string;
      ctaHref?: string;
      videoUrl?: string;
      image?: SanityImage;
    }
  | {
      _key: string;
      _type: "featureGridSection";
      heading?: string;
      features: Array<{
        _key: string;
        title: string;
        body?: string;
        icon?: SanityImage;
      }>;
    }
  | {
      _key: string;
      _type: "richTextSection";
      heading?: string;
      body?: unknown[];
    };

export interface PageDocument {
  _id: string;
  title: string;
  slug: string;
  sections: PageSection[] | null;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    noIndex?: boolean;
    ogImage?: { url: string };
  };
}

/* ---------- Accessors ---------- */

/**
 * Fetches a page by slug. Returns null when Sanity is unconfigured, the
 * document does not exist, or the query fails — callers render their in-code
 * copy in that case.
 */
export async function getPage(
  slug: string,
  locale: Locale,
  opts: { draft?: boolean } = {}
): Promise<PageDocument | null> {
  return sanityFetch<PageDocument>({
    query: pageBySlugQuery(locale),
    params: { slug },
    tags: [`page:${slug}`],
    draft: opts.draft,
  });
}
