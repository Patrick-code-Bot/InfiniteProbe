import type { PageDocument, PageSection } from "./queries";

/**
 * Helpers for reading CMS content with an in-code fallback.
 *
 * The contract every migrated page follows: Sanity is *additive*. If the CMS is
 * unconfigured, the document is missing, or a field is empty, the page renders
 * the copy committed in the component. A CMS outage degrades a page to its
 * last-shipped content instead of blanking it.
 *
 * That is also what makes the migration safe to do one page at a time — an
 * unmigrated page and a migrated-but-unpopulated page render identically.
 */

/** The first hero section of a page document, if it has one. */
export function firstHero(
  page: PageDocument | null
): Extract<PageSection, { _type: "heroSection" }> | null {
  const section = page?.sections?.find((s) => s._type === "heroSection");
  return section ?? null;
}

/**
 * CMS value if it is a non-empty string, otherwise the fallback.
 *
 * Note this does *not* treat [bracketed] placeholders as empty — they are
 * meaningful content that renders in "unconfirmed" styling (see lib/site.ts
 * `isPlaceholder`). An editor typing "[TBC]" into Sanity gets the dashed
 * orange placeholder on the site, exactly as a bracketed string in code does.
 */
export function text(value: string | undefined | null, fallback: string): string {
  return typeof value === "string" && value.trim() !== "" ? value : fallback;
}
