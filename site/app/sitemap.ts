import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { locales, localePath, localeToHtmlLang } from "@/lib/i18n";

/**
 * One entry per route per locale, each carrying the full set of hreflang
 * alternates. Search engines use `alternates.languages` to treat the localized
 * copies as translations of one page rather than duplicate content.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/shop", priority: 0.9 },
    { path: "/how-it-works", priority: 0.8 },
    { path: "/specs", priority: 0.8 },
    { path: "/why-different", priority: 0.7 },
    { path: "/app", priority: 0.7 },
    { path: "/support", priority: 0.6 },
    { path: "/warranty", priority: 0.4 },
    { path: "/shipping-policy", priority: 0.3 },
    { path: "/privacy-policy", priority: 0.3 },
    { path: "/terms-of-service", priority: 0.3 },
  ];

  const lastModified = new Date();

  return routes.flatMap(({ path, priority }) =>
    locales.map((locale) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [
            localeToHtmlLang[l],
            `${SITE_URL}${localePath(l, path)}`,
          ]),
        ),
      },
    })),
  );
}
