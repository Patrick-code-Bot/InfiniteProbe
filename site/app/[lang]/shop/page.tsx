import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  parseLocale,
  localePath,
  languageAlternates,
  getDictionary,
  defaultLocale,
} from "@/lib/i18n";
import ShopPageClient from "./ShopPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = parseLocale(lang) ?? defaultLocale;

  return {
    title: "Shop",
    description:
      "Choose your InfiniteProbe setup — one probe or the whole table, every setup is self-powered, forever. Free shipping on all orders.",
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
 * Server wrapper: resolves the locale and dictionary, then hands them to the
 * client component that owns the cart interactivity.
 */
export default async function ShopPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = parseLocale(lang);
  if (!locale) notFound();
  const dict = await getDictionary(locale);

  return <ShopPageClient dict={dict} locale={locale} />;
}
