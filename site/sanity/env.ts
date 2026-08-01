/**
 * Sanity environment configuration.
 *
 * Mirrors the Shopify pattern in lib/shopify.ts: the site must keep working
 * with these unset, so `isSanityConfigured()` gates every fetch and pages fall
 * back to their in-code copy. That keeps `npm run build` green on a fresh
 * clone with no credentials.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

/**
 * Pinned API date. Never use a floating version — Sanity ships breaking
 * changes behind dates, so an unpinned client can change behavior on its own.
 */
export const apiVersion = "2024-10-01";

/** Server-only token for draft-mode preview. Absent in normal builds. */
export const readToken = process.env.SANITY_API_READ_TOKEN;

/** Where the embedded Studio is mounted. Used for stega/visual editing links. */
export const studioUrl = "/studio";

/**
 * True when both public vars are set to real values.
 *
 * Also rejects [bracketed] placeholders, matching the convention in
 * lib/site.ts — a copied .env.example should read as "unconfigured", not as a
 * project id literally named "[project-id]".
 */
export function isSanityConfigured(): boolean {
  return Boolean(
    projectId &&
      dataset &&
      !projectId.startsWith("[") &&
      !dataset.startsWith("[")
  );
}
