import { createClient, type QueryParams } from "next-sanity";
import {
  projectId,
  dataset,
  apiVersion,
  readToken,
  studioUrl,
  isSanityConfigured,
} from "./env";

/**
 * Storefront-side Sanity client.
 *
 * Null when Sanity is unconfigured, so the site builds and renders on a fresh
 * clone with no credentials — the same graceful-degradation contract
 * lib/shopify.ts follows.
 */
export const client = isSanityConfigured()
  ? createClient({
      projectId: projectId!,
      dataset: dataset!,
      apiVersion,
      useCdn: true,
      perspective: "published",
      stega: { studioUrl },
    })
  : null;

/**
 * Fetch wrapper for Server Components.
 *
 * Returns `null` rather than throwing when Sanity is unconfigured or the query
 * fails: callers fall back to their in-code copy, so a CMS outage degrades the
 * page to its committed content instead of 500-ing the route.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  revalidate = 3600,
  draft = false,
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
  revalidate?: number | false;
  draft?: boolean;
}): Promise<T | null> {
  if (!client) return null;

  // Draft mode needs a token; without one, fall back to published content
  // rather than failing the render.
  const useDraft = draft && Boolean(readToken);

  try {
    return await client
      .withConfig(
        useDraft
          ? {
              token: readToken,
              useCdn: false,
              perspective: "drafts",
              stega: true,
            }
          : {}
      )
      .fetch<T>(query, params, {
        // Draft content changes on every keystroke — never cache it.
        cache: useDraft ? "no-store" : "force-cache",
        next: useDraft
          ? undefined
          : { revalidate: tags.length ? false : revalidate, tags },
      });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[sanity] Query failed — falling back to in-code content:",
        error
      );
    }
    return null;
  }
}
