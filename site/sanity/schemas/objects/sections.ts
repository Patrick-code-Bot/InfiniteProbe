import { defineField, defineType, defineArrayMember } from "sanity";

/**
 * Section blocks for the page builder.
 *
 * Kept deliberately small: three generic sections that cover the shapes the
 * existing pages already use. Resist adding a bespoke section type per page —
 * that turns the CMS into a mirror of the component tree and makes every
 * design tweak a schema migration.
 */

/** Shared image field with required localized alt text. */
const imageField = defineField({
  name: "image",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "localeString",
      description: "Describes the image for screen readers. Required.",
      validation: (Rule) => Rule.required(),
    }),
  ],
});

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
    imageField,
    defineField({
      name: "videoUrl",
      title: "Video URL (Shopify CDN)",
      type: "url",
      description:
        "Full https://cdn.shopify.com/... file URL. Leave empty to show the image instead.",
      validation: (Rule) =>
        Rule.uri({ scheme: ["https"] }).custom((value) =>
          !value || String(value).includes("cdn.shopify.com")
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
    prepare: ({ title, media }) => ({
      title: title || "Hero",
      subtitle: "Hero",
      media,
    }),
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
          name: "feature",
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
    prepare: ({ title }) => ({
      title: title || "Feature grid",
      subtitle: "Feature grid",
    }),
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
    prepare: ({ title }) => ({
      title: title || "Rich text",
      subtitle: "Rich text",
    }),
  },
});

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "localeString",
      description: "Falls back to the page title when empty.",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "localeText",
    }),
    defineField({ name: "ogImage", title: "Social share image", type: "image" }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
