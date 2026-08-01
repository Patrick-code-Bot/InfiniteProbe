/**
 * REFERENCE — target: site/sanity/schemas/
 *
 * Localized page schema. Shows the field-level i18n pattern: one document per
 * page, with each translatable field an object keyed by locale.
 *
 * Field-level (this) vs document-level (one doc per locale) i18n:
 *   - Field-level keeps translations side by side — good for a small marketing
 *     site where an editor wants to see EN and its translation together, and
 *     where non-text fields (images, layout, ordering) are shared.
 *   - Document-level scales better past ~10 locales or when locales diverge
 *     structurally (different sections per market).
 * This site is 13 pages and ships `en` only, so field-level wins.
 */

import { defineField, defineType, defineArrayMember } from "sanity";

/* ------------------------------------------------------------------ */
/* Reusable localized primitives — sanity/schemas/objects/             */
/* ------------------------------------------------------------------ */

/**
 * Keep this list in sync with `locales` in lib/i18n.ts. Adding a locale means
 * adding a field here; existing documents keep working because every locale
 * field is optional except the default.
 */
const SUPPORTED_LOCALES = [
  { id: "en", title: "English", isDefault: true },
] as const;

export const localeString = defineType({
  name: "localeString",
  title: "Localized string",
  type: "object",
  fieldsets: [{ name: "translations", title: "Translations", options: { collapsible: true } }],
  fields: SUPPORTED_LOCALES.map((locale) =>
    defineField({
      name: locale.id,
      title: locale.title,
      type: "string",
      fieldset: locale.isDefault ? undefined : "translations",
      // Only the default locale is required — a page can ship before every
      // translation lands, and GROQ coalesces back to `en`.
      validation: locale.isDefault ? (Rule) => Rule.required() : undefined,
    })
  ),
});

export const localeText = defineType({
  name: "localeText",
  title: "Localized text",
  type: "object",
  fieldsets: [{ name: "translations", title: "Translations", options: { collapsible: true } }],
  fields: SUPPORTED_LOCALES.map((locale) =>
    defineField({
      name: locale.id,
      title: locale.title,
      type: "text",
      rows: 3,
      fieldset: locale.isDefault ? undefined : "translations",
    })
  ),
});

export const localeBlock = defineType({
  name: "localeBlock",
  title: "Localized rich text",
  type: "object",
  fieldsets: [{ name: "translations", title: "Translations", options: { collapsible: true } }],
  fields: SUPPORTED_LOCALES.map((locale) =>
    defineField({
      name: locale.id,
      title: locale.title,
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      fieldset: locale.isDefault ? undefined : "translations",
    })
  ),
});

/* ------------------------------------------------------------------ */
/* Section blocks — the page builder                                   */
/* ------------------------------------------------------------------ */

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "localeString" }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "localeString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "subheading", title: "Subheading", type: "localeText" }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        // Alt text is content, not metadata — it is localized and required.
        defineField({
          name: "alt",
          title: "Alt text",
          type: "localeString",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL (Shopify CDN)",
      type: "url",
      description:
        "Full https://cdn.shopify.com/... file URL. Leave empty to show the image instead.",
      validation: (Rule) =>
        Rule.uri({ scheme: ["https"] }).custom((value) =>
          !value || value.includes("cdn.shopify.com")
            ? true
            : "Must be a Shopify CDN URL"
        ),
    }),
    defineField({ name: "ctaLabel", title: "CTA label", type: "localeString" }),
    defineField({
      name: "ctaHref",
      title: "CTA link",
      type: "string",
      description:
        "App-relative path like /shop — the locale prefix is added automatically. " +
        "[Bracketed] values render as unresolved placeholders.",
    }),
  ],
  preview: {
    select: { title: "heading.en", media: "image" },
    prepare: ({ title, media }) => ({ title: title || "Hero", subtitle: "Hero", media }),
  },
});

export const featureGridSection = defineType({
  name: "featureGridSection",
  title: "Feature grid",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "localeString" }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "localeString",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "body", type: "localeText" }),
            defineField({ name: "icon", type: "image" }),
          ],
          preview: { select: { title: "title.en", media: "icon" } },
        }),
      ],
      validation: (Rule) => Rule.min(1).max(6),
    }),
  ],
  preview: {
    select: { title: "heading.en" },
    prepare: ({ title }) => ({ title: title || "Feature grid", subtitle: "Feature grid" }),
  },
});

export const richTextSection = defineType({
  name: "richTextSection",
  title: "Rich text",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "localeString" }),
    defineField({ name: "body", title: "Body", type: "localeBlock" }),
  ],
  preview: {
    select: { title: "heading.en" },
    prepare: ({ title }) => ({ title: title || "Rich text", subtitle: "Rich text" }),
  },
});

/* ------------------------------------------------------------------ */
/* SEO object                                                          */
/* ------------------------------------------------------------------ */

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      type: "localeString",
      description: "Falls back to the page title when empty.",
      validation: (Rule) => Rule.max(60).warning("Titles over 60 chars get truncated."),
    }),
    defineField({
      name: "metaDescription",
      type: "localeText",
      validation: (Rule) =>
        Rule.max(160).warning("Descriptions over 160 chars get truncated."),
    }),
    defineField({ name: "ogImage", type: "image" }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});

/* ------------------------------------------------------------------ */
/* Page document                                                       */
/* ------------------------------------------------------------------ */

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      description: "Editor-facing only. Never rendered.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      description:
        'Route path without the locale prefix. Use "home" for the landing page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        defineArrayMember({ type: "heroSection" }),
        defineArrayMember({ type: "featureGridSection" }),
        defineArrayMember({ type: "richTextSection" }),
      ],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({ title, subtitle: slug ? `/${slug}` : "no slug" }),
  },
});

/* ------------------------------------------------------------------ */
/* Registry — sanity/schemas/index.ts                                  */
/* ------------------------------------------------------------------ */

export const schemaTypes = [
  // objects
  localeString,
  localeText,
  localeBlock,
  seo,
  heroSection,
  featureGridSection,
  richTextSection,
  // documents
  page,
];
