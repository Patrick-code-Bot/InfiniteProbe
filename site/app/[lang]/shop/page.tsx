import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  parseLocale,
  localePath,
  languageAlternates,
  getDictionary,
  defaultLocale,
} from "@/lib/i18n";
import { draftMode } from "next/headers";
import { getPage } from "@/sanity/queries";
import { firstHero, text } from "@/sanity/content";
import ShopPageClient from "./ShopPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = parseLocale(lang) ?? defaultLocale;

  const page = await getPage("shop", locale);

  return {
    title: text(page?.seo?.metaTitle, "Shop"),
    description: text(
      page?.seo?.metaDescription,
      "Choose your InfiniteProbe setup — one probe or the whole table, every setup is self-powered, forever. Free shipping on all orders.",
    ),
    alternates: {
      canonical: localePath(locale, "/shop"),
      languages: languageAlternates("/shop"),
    },
    openGraph: {
      title: "Shop InfiniteProbe — Choose Your Setup",
      description:
        "One probe or the whole table — every setup is self-powered, forever.",
      url: localePath(locale, "/shop"),
    },
  };
}

/**
 * Server wrapper: resolves the locale, dictionary, and CMS hero, then hands
 * them to the client component that owns the cart interactivity.
 *
 * The hero is resolved to plain strings here rather than passed as the raw
 * document — a client component cannot call getPage(), and only these three
 * fields cross the boundary.
 */
export default async function ShopPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = parseLocale(lang);
  if (!locale) notFound();

  const { isEnabled: isDraft } = await draftMode();
  const [dict, page] = await Promise.all([
    getDictionary(locale),
    getPage("shop", locale, { draft: isDraft }),
  ]);

  const cms = firstHero(page);
  const hero = {
    eyebrow: text(cms?.eyebrow, "SHOP"),
    heading: text(cms?.heading, "Choose Your Setup"),
    subheading: text(
      cms?.subheading,
      "One probe or the whole table — every setup is self-powered, forever.",
    ),
  };

  return <ShopPageClient dict={dict} locale={locale} hero={hero} />;
}
