import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { SITE_URL, SITE_NAME, TAGLINE } from "@/lib/site";
import {
  locales,
  parseLocale,
  localeToHtmlLang,
  languageAlternates,
  type Locale,
} from "@/lib/i18n";
import { CartProvider } from "@/components/cart/CartProvider";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — The Self-Powered Wireless Meat Thermometer`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "InfiniteProbe converts cooking heat into electricity — powering real-time wireless monitoring of your meat's internal temperature. No batteries. No charging. No guessing.",
  keywords: [
    "wireless meat thermometer",
    "self-powered thermometer",
    "battery-free meat probe",
    "thermoelectric",
    "BBQ thermometer",
    "smart cooking",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — The Self-Powered Wireless Meat Thermometer`,
    description:
      "Infinite Power for Perfect Meat. Heat-powered, truly wireless, precision from the core.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${TAGLINE}`,
    description:
      "The self-powered wireless meat thermometer. No batteries. No charging. No guessing.",
  },
  robots: { index: true, follow: true },
  alternates: { languages: languageAlternates("/") },
};

/**
 * Root layout, scoped to the locale segment.
 *
 * This is the app's *only* root layout: it renders <html>/<body> from inside
 * [lang] so the locale param is available where `lang` is needed. Putting it
 * here rather than at app/ keeps every page statically generated — an outer
 * layout could not read the param without headers(), which would opt the whole
 * site out of static rendering.
 *
 * `dynamicParams = false` makes an unknown locale a build-time 404 instead of
 * an on-demand render, so /fr/ cannot be served English with a 200 and indexed
 * as duplicate content.
 *
 * CartProvider wraps children here. Cart state is locale-independent — the same
 * Shopify cart regardless of language.
 */
export const dynamicParams = false;

export function generateStaticParams(): { lang: Locale }[] {
  return locales.map((lang) => ({ lang }));
}

export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = parseLocale(lang);
  if (!locale) notFound();

  return (
    <html
      lang={localeToHtmlLang[locale]}
      className={`${inter.variable} ${plexMono.variable}`}
    >
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
