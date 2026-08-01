import { defineField, defineType, defineArrayMember } from "sanity";
import { locales, defaultLocale, localeNames } from "@/lib/i18n";

/**
 * Localized field primitives, generated from `locales` in lib/i18n.ts so the
 * schema and the routing layer can never drift apart. Adding a locale there
 * adds the field here automatically.
 *
 * Field-level i18n (one document, one field per locale) rather than
 * document-level (one document per locale): this is an 11-page marketing site
 * shipping a single locale, so editors benefit from seeing translations side by
 * side, and non-text fields (images, ordering) stay shared.
 *
 * ── Placeholder convention ──────────────────────────────────────────────────
 * Unconfirmed copy is written as [bracketed text] and renders in dashed
 * burnt-orange "unconfirmed" styling. That convention carries into Sanity
 * unchanged: editors type the brackets, `isPlaceholder()` in lib/site.ts still
 * detects them, and LAUNCH_CHECKLIST.md still tracks them. Deliberately *not* a
 * separate `unconfirmed: boolean` — one representation everywhere means no way
 * for a flag and its text to disagree, and no migration of existing copy.
 */

const localeFields = locales.map((locale) =>
  defineField({
    name: locale,
    title: localeNames[locale],
    type: "string",
    // Only the default locale is required — a page can ship before every
    // translation lands, and the GROQ layer coalesces back to it.
    validation:
      locale === defaultLocale ? (Rule) => Rule.required() : undefined,
  })
);

export const localeString = defineType({
  name: "localeString",
  title: "Localized string",
  type: "object",
  fields: localeFields,
  options: { columns: 1 },
});

export const localeText = defineType({
  name: "localeText",
  title: "Localized text",
  type: "object",
  fields: locales.map((locale) =>
    defineField({
      name: locale,
      title: localeNames[locale],
      type: "text",
      rows: 4,
      validation:
        locale === defaultLocale ? (Rule) => Rule.required() : undefined,
    })
  ),
});

export const localeBlock = defineType({
  name: "localeBlock",
  title: "Localized rich text",
  type: "object",
  fields: locales.map((locale) =>
    defineField({
      name: locale,
      title: localeNames[locale],
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    })
  ),
});
