/**
 * REFERENCE — target: site/sanity/queries.ts (+ sanity/client.ts, sanity/env.ts)
 *
 * GROQ helpers. The core trick is locale coalescing: resolve a localized field
 * to a plain string *in the query*, so page components receive
 * `{ heading: string }` rather than `{ heading: { en: "..." } }`.
 */

import { createClient, type QueryParams } from "next-sanity";
import type { Locale } from "@/lib/i18n";
import { defaultLocale } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/* env — sanity/env.ts                                                 */
/* ------------------------------------------------------------------ */

export const projectId = assertEnv(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID"
);
export const dataset = assertEnv(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "NEXT_PUBLIC_SANITY_DATASET"
);

/** Pin the API date. Never use a floating version — Sanity ships breaking changes behind dates. */
export const apiVersion = "2024-10-01";

/** Server-only. Required for draft-mode preview; absent in normal builds. */
const readToken = process.env.SANITY_API_READ_TOKEN;

function assertEnv(value: string | undefined, name: string): string {
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

/* ------------------------------------------------------------------ */
/* client — sanity/client.ts                                           */
/* ------------------------------------------------------------------ */

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // CDN for published content; bypassed automatically when previewing drafts.
  useCdn: true,
  perspective: "published",
  stega: { studioUrl: "/studio" },
});

/**
 * Fetch wrapper for Server Components.
 *
 * `revalidate` is the knob that decides how fresh CMS edits are. `false` means
 * "cache until a tag is revalidated" — correct once webhook revalidation is
 * wired. Until then, use a number.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  revalidate = 60,
  draft = false,
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
  revalidate?: number | false;
  draft?: boolean;
}): Promise<T> {
  if (draft && !readToken) {
    throw new Error("Draft mode requires SANITY_API_READ_TOKEN.");
  }

  return client
    .withConfig(
      draft
        ? { token: readToken, useCdn: false, perspective: "drafts", stega: true }
        : {}
    )
    .fetch<T>(query, params, {
      // Draft content must never be cached — it changes on every keystroke.
      cache: draft ? "no-store" : "force-cache",
      next: draft ? undefined : { revalidate: tags.length ? false : revalidate, tags },
    });
}

/* ------------------------------------------------------------------ */
/* Locale coalescing                                                   */
/* ------------------------------------------------------------------ */

/**
 * Builds a GROQ projection that resolves a localized object to one string.
 *
 *   loc("heading", "en")  →  '"heading": coalesce(heading.en, heading.en)'
 *
 * `coalesce` falls through to the default locale when a translation is missing,
 * so a half-translated page renders in English rather than showing blanks.
 *
 * Note the parameterless construction: locale keys are interpolated as GROQ
 * *field paths*, which cannot be parameterized. That is why `locale` must be a
 * validated `Locale` from lib/i18n, never raw user input — see safety note below.
 */
export function loc(field: string, locale: Locale, alias?: string): string {
  const name = alias ?? field.split(".").pop() ?? field;
  return locale === defaultLocale
    ? `"${name}": ${field}.${defaultLocale}`
    : `"${name}": coalesce(${field}.${locale}, ${field}.${defaultLocale})`;
}

/* ------------------------------------------------------------------ */
/* Fragments                                                           */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Queries                                                             */
/* ------------------------------------------------------------------ */

export const pageBySlugQuery = (locale: Locale) => `
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    ${sectionsFragment(locale)},
    ${seoFragment(locale)}
  }
`;

export const allPageSlugsQuery = `*[_type == "page" && defined(slug.current)].slug.current`;

/* ------------------------------------------------------------------ */
/* Typed accessors                                                     */
/* ------------------------------------------------------------------ */

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
      features: Array<{ _key: string; title: string; body?: string; icon?: SanityImage }>;
    }
  | {
      _key: string;
      _type: "richTextSection";
      heading?: string;
      body?: unknown[]; // Portable Text blocks
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

/**
 * SAFETY: `locale` is interpolated into the query string, so it must be a
 * validated `Locale` (use `parseLocale` on route params). `slug` is passed as a
 * bound parameter and is safe to take from the URL.
 */
export async function getPage(
  slug: string,
  locale: Locale,
  opts: { draft?: boolean } = {}
): Promise<PageDocument | null> {
  return sanityFetch<PageDocument | null>({
    query: pageBySlugQuery(locale),
    params: { slug },
    tags: [`page:${slug}`],
    draft: opts.draft,
  });
}

export async function getAllPageSlugs(): Promise<string[]> {
  return sanityFetch<string[]>({ query: allPageSlugsQuery, tags: ["page"] });
}
