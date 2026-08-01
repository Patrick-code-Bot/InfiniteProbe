import { defineField, defineType, defineArrayMember } from "sanity";

/**
 * A marketing page.
 *
 * `slug` is the route path without the locale prefix, matching the paths in
 * app/[lang]/ — "home" for the landing page, "shop", "how-it-works", and so on.
 * The route itself is still defined by the filesystem; this document supplies
 * its content.
 */
export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      description: "Editor-facing only. Never rendered on the site.",
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
    prepare: ({ title, slug }) => ({
      title,
      subtitle: slug ? `/${slug}` : "no slug",
    }),
  },
});
