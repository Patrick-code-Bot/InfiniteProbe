/**
 * REFERENCE — target: site/app/[lang]/page.tsx
 *
 * The home page as a React Server Component: Sanity content and Shopify
 * products both fetched on the server, with client components used only where
 * interaction demands them.
 *
 * No 'use client' in this file. Note there is no `useState`, no `useEffect`,
 * and no event handler anywhere below — that is what keeps it a Server
 * Component and keeps the Sanity/Shopify tokens out of the browser bundle.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { parseLocale, getDictionary, localePath, languageAlternates } from "@/lib/i18n";
import { getPage, type PageSection } from "@/sanity/queries";
import { getProductsByHandles } from "@/lib/shopify/products.server";
import { BUNDLES } from "@/data/products";
import { hrefOrHash, isPlaceholder } from "@/lib/site";

import { VideoPlayer } from "@/components/VideoPlayer";
import { PortableText } from "@/components/PortableText";
import { AddToCartButton } from "@/components/cart/AddToCartButton"; // 'use client'

/**
 * Next 15+ passes route params as a Promise. On Next 14 these are plain
 * objects — drop the `await` and the Promise<> wrapper if you have not upgraded.
 */
type PageProps = { params: Promise<{ lang: string }> };

/** Pre-render one static page per locale. */
export function generateStaticParams() {
  return [{ lang: "en" }];
}

/** Revalidate hourly so CMS edits appear without a deploy. */
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const locale = parseLocale(lang);
  if (!locale) return {};

  const page = await getPage("home", locale);

  return {
    title: page?.seo?.metaTitle ?? undefined,
    description: page?.seo?.metaDescription ?? undefined,
    robots: page?.seo?.noIndex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: localePath(locale, "/"),
      languages: languageAlternates("/"),
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;

  // Reject unknown locales rather than falling back — a silent fallback would
  // serve English at /fr/ with a 200 and get indexed as duplicate content.
  const locale = parseLocale(lang);
  if (!locale) notFound();

  const { isEnabled: isDraft } = await draftMode();

  // Independent fetches run concurrently. Sequential awaits here would add the
  // Sanity and Shopify latencies together on every cold render.
  const [dict, page, products] = await Promise.all([
    getDictionary(locale),
    getPage("home", locale, { draft: isDraft }),
    getProductsByHandles(BUNDLES.map((b) => b.shopifyHandle)),
  ]);

  if (!page) notFound();

  return (
    <main>
      {page.sections?.map((section) => (
        <Section key={section._key} section={section} locale={locale} />
      ))}

      {/* Products: fetched server-side, rendered server-side. Only the
          add-to-cart button ships JavaScript. */}
      <section style={{ padding: "4rem 1.5rem" }}>
        <h2>{dict.nav.shop}</h2>
        <div
          style={{
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          {BUNDLES.map((bundle) => {
            const product = products.get(bundle.shopifyHandle);

            // Handle still a [bracketed] placeholder, or Shopify unconfigured:
            // fall back to the design's placeholder styling rather than hiding
            // the card. This preserves the pre-launch convention.
            const unresolved = !product || isPlaceholder(bundle.shopifyHandle);

            return (
              <article key={bundle.key}>
                {product?.featuredImage ? (
                  <Image
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText ?? bundle.fallbackName}
                    width={400}
                    height={400}
                    style={{ width: "100%", height: "auto" }}
                  />
                ) : (
                  <div className="image-placeholder">{bundle.imagePlaceholder}</div>
                )}

                <h3>{product?.title ?? bundle.fallbackName}</h3>
                <p className={unresolved ? "unconfirmed" : undefined}>
                  {product
                    ? formatPrice(product.price.amount, product.price.currencyCode)
                    : bundle.fallbackPrice}
                </p>

                {/* The one interactive island in this page. */}
                <AddToCartButton
                  variantId={product?.variantId ?? null}
                  disabled={unresolved || !product?.availableForSale}
                  label={dict.cart.addToCart}
                />
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Section renderer                                                    */
/* ------------------------------------------------------------------ */

function Section({
  section,
  locale,
}: {
  section: PageSection;
  locale: ReturnType<typeof parseLocale> & string;
}) {
  switch (section._type) {
    case "heroSection":
      return (
        <section>
          {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
          <h1>{section.heading}</h1>
          {section.subheading && <p>{section.subheading}</p>}

          {section.videoUrl ? (
            <VideoPlayer
              src={section.videoUrl}
              poster={section.image?.url}
              label={section.image?.alt ?? section.heading}
            />
          ) : (
            section.image && (
              <Image
                src={section.image.url}
                alt={section.image.alt}
                width={section.image.dimensions?.width ?? 1200}
                height={section.image.dimensions?.height ?? 800}
                placeholder={section.image.lqip ? "blur" : undefined}
                blurDataURL={section.image.lqip}
                priority
                style={{ width: "100%", height: "auto" }}
              />
            )
          )}

          {section.ctaLabel && section.ctaHref && (
            <Link
              className="btn-ink"
              href={
                isPlaceholder(section.ctaHref)
                  ? hrefOrHash(section.ctaHref)
                  : localePath(locale, section.ctaHref)
              }
            >
              {section.ctaLabel}
            </Link>
          )}
        </section>
      );

    case "featureGridSection":
      return (
        <section>
          {section.heading && <h2>{section.heading}</h2>}
          <div style={{ display: "grid", gap: "2rem" }}>
            {section.features.map((f) => (
              <div key={f._key}>
                {f.icon && <Image src={f.icon.url} alt={f.icon.alt} width={48} height={48} />}
                <h3>{f.title}</h3>
                {f.body && <p>{f.body}</p>}
              </div>
            ))}
          </div>
        </section>
      );

    case "richTextSection":
      return (
        <section>
          {section.heading && <h2>{section.heading}</h2>}
          {section.body && <PortableText value={section.body} locale={locale} />}
        </section>
      );

    default: {
      // Exhaustiveness check: adding a section type to the schema without
      // handling it here becomes a compile error, not a blank space in prod.
      const _never: never = section;
      return null;
    }
  }
}

function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}
