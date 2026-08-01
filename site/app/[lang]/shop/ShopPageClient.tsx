"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionRule from "@/components/SectionRule";
import CartDrawer from "@/components/cart/CartDrawer";
import { useCart } from "@/components/cart/CartProvider";
import { BUNDLES, COMPARE_ROWS, type BundleConfig } from "@/data/products";
import {
  type ShopifyProduct,
  formatPrice,
  getProductByHandle,
  isShopifyConfigured,
} from "@/lib/shopify";
import { isPlaceholder } from "@/lib/site";
import type { Dictionary, Locale } from "@/lib/i18n";

const DIRECT = [
  {
    num: "01",
    title: "Direct from Leizig",
    body: "Every probe ships from the people who engineered it — firmware-current, quality-checked, never grey-market.",
  },
  {
    num: "02",
    title: "[XX]-Day Returns",
    body: "If it doesn't change the way you cook, send it back. Terms awaiting confirmation.",
  },
  {
    num: "03",
    title: "Support That Answers",
    body: "Real humans who know the product, one email away — before and after you buy.",
  },
];

const PAYMENTS = [
  "VISA",
  "MASTERCARD",
  "AMEX",
  "APPLE PAY",
  "GOOGLE PAY",
  "SHOP PAY",
];

const FAQS = [
  {
    q: "When will my order ship?",
    a: "[Placeholder — confirm handling time and carrier options.]",
  },
  {
    q: "Do you ship internationally?",
    a: "[Placeholder — confirm regions, duties, and shipping rates.]",
  },
  {
    q: "What's included in the box?",
    a: "[Placeholder — confirm bundle contents per SKU.]",
  },
  {
    q: "How do returns work?",
    a: "[Placeholder — confirm return window, condition requirements, and refund process.]",
  },
];

/** Hero copy, already resolved against CMS + fallbacks by the server wrapper. */
interface ShopHero {
  eyebrow: string;
  heading: string;
  subheading: string;
}

export default function ShopPageClient({
  dict,
  locale,
  hero,
}: {
  dict: Dictionary;
  locale: Locale;
  hero: ShopHero;
}) {
  const { addItem, openCart } = useCart();
  const [products, setProducts] = useState<Record<string, ShopifyProduct>>({});
  const [faqOpen, setFaqOpen] = useState(-1);

  // Live products from Shopify — prices/photos update with zero deploys.
  useEffect(() => {
    if (!isShopifyConfigured()) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[shop] Shopify is not configured — every card will render its placeholder. " +
            "Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN " +
            "in .env.local, then restart the dev server (NEXT_PUBLIC_* is inlined at build time).",
        );
      }
      return;
    }
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        BUNDLES.filter((b) => !isPlaceholder(b.shopifyHandle)).map(
          async (b) => {
            try {
              const product = await getProductByHandle(b.shopifyHandle);
              if (!product && process.env.NODE_ENV === "development") {
                console.warn(
                  `[shop] No Shopify product found for handle "${b.shopifyHandle}" (bundle ${b.key}) — ` +
                    "rendering placeholder. Check the handle in data/products.ts matches the product " +
                    "slug in Shopify admin, and that the product is published to this sales channel.",
                );
              }
              return product ? ([b.key, product] as const) : null;
            } catch (err) {
              if (process.env.NODE_ENV === "development") {
                console.warn(
                  `[shop] Shopify fetch failed for handle "${b.shopifyHandle}" (bundle ${b.key}) — ` +
                    "rendering placeholder. This is a config/network error, not a missing photo:",
                  err,
                );
              }
              return null;
            }
          },
        ),
      );
      if (!cancelled) {
        setProducts(
          Object.fromEntries(
            entries.filter((e): e is [string, ShopifyProduct] => Boolean(e)),
          ),
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleAdd(bundle: BundleConfig) {
    const product = products[bundle.key];
    if (product) {
      void addItem(product.variantId);
    } else {
      openCart(); // Shopify not wired yet — drawer explains what's missing
    }
  }

  function handleBuyPrimary() {
    const primary = BUNDLES.find((b) => b.tag) ?? BUNDLES[0];
    handleAdd(primary);
  }

  return (
    <>
      <Header dict={dict} />

      {/* 1 · Slim hero */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(56px,7vw,96px) 24px 0",
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 12,
            letterSpacing: "0.24em",
            color: "#C9661A",
            marginBottom: 22,
          }}
        >
          {hero.eyebrow}
        </div>
        <h1
          style={{
            margin: "0 0 18px",
            fontSize: "clamp(40px,6vw,76px)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 0.98,
          }}
        >
          {hero.heading}
        </h1>
        <p
          style={{
            margin: "0 0 36px",
            fontSize: 17,
            lineHeight: 1.65,
            color: "rgba(20,20,20,0.75)",
            maxWidth: 520,
          }}
        >
          {hero.subheading}
        </p>
        <div
          className="mono"
          style={{
            borderTop: "1px solid rgba(20,20,20,0.15)",
            borderBottom: "1px solid rgba(20,20,20,0.15)",
            padding: "16px 0",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px 28px",
            fontSize: 11,
            letterSpacing: "0.18em",
            color: "rgba(20,20,20,0.7)",
          }}
        >
          <span>FREE SHIPPING</span>
          <span style={{ color: "#C9661A" }}>·</span>
          <span style={{ color: "#C9661A" }}>[XX]-DAY RETURNS</span>
          <span style={{ color: "#C9661A" }}>·</span>
          <span style={{ color: "#C9661A" }}>[X]-YEAR WARRANTY</span>
        </div>
      </div>

      {/* 2 · Product grid */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(48px,6vw,72px) 24px 0",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))",
            gap: 20,
            alignItems: "stretch",
          }}
        >
          {BUNDLES.map((bundle) => {
            const product = products[bundle.key];
            return (
              <div
                key={bundle.key}
                style={{
                  background: "#FBF9F3",
                  borderRadius: 20,
                  boxShadow: "0 1px 2px rgba(20,20,20,0.05)",
                  border: bundle.tag
                    ? "2px solid #C9661A"
                    : "1px solid rgba(20,20,20,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {bundle.tag && (
                  <span
                    className="mono"
                    style={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      zIndex: 2,
                      background: "#C9661A",
                      color: "#FFFFFF",
                      borderRadius: 999,
                      padding: "7px 14px",
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      fontWeight: 600,
                    }}
                  >
                    {bundle.tag}
                  </span>
                )}
                <div style={{ aspectRatio: "4/3", background: "#EAE6DA" }}>
                  {product?.featuredImage ? (
                    <img
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText ?? product.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 24,
                      }}
                    >
                      <span
                        className="mono"
                        style={{
                          fontSize: 11,
                          letterSpacing: "0.18em",
                          color: "#C9661A",
                          textAlign: "center",
                          lineHeight: 1.8,
                        }}
                      >
                        {bundle.imagePlaceholder.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    padding: "28px 28px 30px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 20,
                      letterSpacing: "-0.015em",
                      color: product ? "#141414" : "rgba(20,20,20,0.45)",
                      marginBottom: 8,
                    }}
                  >
                    {product?.title ?? bundle.fallbackName}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "rgba(20,20,20,0.7)",
                      marginBottom: 16,
                    }}
                  >
                    {bundle.description}
                  </div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      color: "#C9661A",
                      marginBottom: 22,
                    }}
                  >
                    {bundle.meta}
                  </div>
                  <div style={{ marginTop: "auto" }}>
                    {product ? (
                      <div style={{ padding: "8px 0", marginBottom: 20 }}>
                        <span
                          style={{
                            fontSize: "clamp(26px,2.4vw,34px)",
                            fontWeight: 800,
                            letterSpacing: "-0.03em",
                          }}
                        >
                          {formatPrice(
                            product.price.amount,
                            product.price.currencyCode,
                          )}
                        </span>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "inline-block",
                          border: "1.5px dashed #C9661A",
                          background: "rgba(201,102,26,0.04)",
                          borderRadius: 12,
                          padding: "8px 18px",
                          marginBottom: 20,
                        }}
                      >
                        <span
                          style={{
                            fontSize: "clamp(26px,2.4vw,34px)",
                            fontWeight: 800,
                            letterSpacing: "-0.03em",
                            color: "rgba(20,20,20,0.35)",
                          }}
                        >
                          {bundle.fallbackPrice}
                        </span>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      <button
                        onClick={() => handleAdd(bundle)}
                        disabled={Boolean(product && !product.availableForSale)}
                        className="btn-ink"
                        style={{
                          width: "100%",
                          padding: "15px 24px",
                          fontSize: 13,
                        }}
                      >
                        {product && !product.availableForSale
                          ? "SOLD OUT"
                          : "ADD TO CART"}
                      </button>
                      <a
                        href="#compare"
                        className="mono"
                        style={{
                          alignSelf: "center",
                          fontSize: 11,
                          letterSpacing: "0.16em",
                          color: "rgba(20,20,20,0.55)",
                          borderBottom: "1px solid rgba(20,20,20,0.25)",
                          paddingBottom: 2,
                        }}
                      >
                        DETAILS
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 · Compare the Bundles */}
      <div
        id="compare"
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "clamp(64px,8vw,112px) 24px 0",
        }}
      >
        <SectionRule
          eyebrow="§ 01 · COMPARE"
          meta="CONTENTS TBC"
          metaColor="#C9661A"
        />
        <h2
          style={{
            margin: "0 0 40px",
            fontSize: "clamp(28px,3.6vw,42px)",
            fontWeight: 800,
            letterSpacing: "-0.028em",
            lineHeight: 1.05,
          }}
        >
          Compare the Bundles
        </h2>
        <div
          style={{
            background: "#FBF9F3",
            borderRadius: 20,
            overflowX: "auto",
            boxShadow: "0 1px 2px rgba(20,20,20,0.05)",
          }}
        >
          <div style={{ minWidth: 560 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(130px,1.2fr) 1fr 1fr 1fr",
                borderBottom: "2px solid #141414",
              }}
            >
              <div style={{ padding: "20px 24px" }} />
              <div
                className="mono"
                style={{
                  padding: "20px 14px",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  color: "rgba(20,20,20,0.55)",
                }}
              >
                {products.a?.title ?? "[BUNDLE A]"}
              </div>
              <div
                className="mono"
                style={{
                  padding: "20px 14px",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  color: "#C9661A",
                  fontWeight: 600,
                }}
              >
                {products.b?.title ?? "[BUNDLE B]"}
              </div>
              <div
                className="mono"
                style={{
                  padding: "20px 14px",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  color: "rgba(20,20,20,0.55)",
                }}
              >
                {products.c?.title ?? "[BUNDLE C]"}
              </div>
            </div>
            {COMPARE_ROWS.map((row) => (
              <div
                key={row.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(130px,1.2fr) 1fr 1fr 1fr",
                  borderBottom: "1px solid rgba(20,20,20,0.08)",
                }}
              >
                <div
                  style={{
                    padding: "20px 24px",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {row.label}
                </div>
                <div
                  className="mono"
                  style={{
                    padding: "20px 14px",
                    fontSize: 13,
                    color: "rgba(20,20,20,0.6)",
                  }}
                >
                  {row.label === "Price" && products.a
                    ? formatPrice(
                        products.a.price.amount,
                        products.a.price.currencyCode,
                      )
                    : row.a}
                </div>
                <div
                  className="mono"
                  style={{
                    padding: "20px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#141414",
                  }}
                >
                  {row.label === "Price" && products.b
                    ? formatPrice(
                        products.b.price.amount,
                        products.b.price.currencyCode,
                      )
                    : row.b}
                </div>
                <div
                  className="mono"
                  style={{
                    padding: "20px 14px",
                    fontSize: 13,
                    color: "rgba(20,20,20,0.6)",
                  }}
                >
                  {row.label === "Price" && products.c
                    ? formatPrice(
                        products.c.price.amount,
                        products.c.price.currencyCode,
                      )
                    : row.c}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 · Why Buy Direct */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(64px,8vw,112px) 24px 0",
        }}
      >
        <SectionRule eyebrow="§ 02 · WHY BUY DIRECT" marginBottom={32} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 20,
          }}
        >
          {DIRECT.map((d) => (
            <div
              key={d.num}
              style={{
                background: "#EAE6DA",
                borderRadius: 20,
                padding: "32px 30px",
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  color: "#C9661A",
                  marginBottom: 16,
                }}
              >
                {d.num}
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  letterSpacing: "-0.015em",
                  marginBottom: 10,
                }}
              >
                {d.title}
              </div>
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "rgba(20,20,20,0.72)",
                }}
              >
                {d.body}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5 · Reassurance row */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(64px,8vw,112px) 24px 0",
        }}
      >
        <SectionRule
          eyebrow="EARLY REVIEWS"
          meta="AWAITING QUOTES"
          marginBottom={32}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 20,
            marginBottom: 36,
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                border: "1.5px dashed #C9661A",
                background: "rgba(201,102,26,0.04)",
                borderRadius: 20,
                padding: 28,
              }}
            >
              <div
                style={{
                  color: "#C9661A",
                  fontSize: 15,
                  letterSpacing: "0.2em",
                  marginBottom: 14,
                }}
              >
                ★★★★★
              </div>
              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "rgba(20,20,20,0.4)",
                  fontStyle: "italic",
                  marginBottom: 16,
                }}
              >
                &quot;Quote from verified buyer.&quot;
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  color: "#C9661A",
                }}
              >
                NAME · VERIFIED PURCHASE
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {PAYMENTS.map((pay) => (
            <span
              key={pay}
              className="mono"
              style={{
                border: "1px solid rgba(20,20,20,0.2)",
                borderRadius: 8,
                padding: "9px 16px",
                fontSize: 11,
                letterSpacing: "0.12em",
                color: "rgba(20,20,20,0.6)",
                background: "#FBF9F3",
              }}
            >
              {pay}
            </span>
          ))}
        </div>
      </div>

      {/* 6 · Mini FAQ */}
      <div
        style={{
          maxWidth: 880,
          margin: "0 auto",
          padding: "clamp(64px,8vw,112px) 24px 0",
        }}
      >
        <SectionRule
          eyebrow="§ 03 · ORDERING FAQ"
          meta="[DRAFT]"
          metaColor="#C9661A"
          marginBottom={32}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQS.map((f, i) => (
            <div
              key={f.q}
              style={{
                background: "#FBF9F3",
                borderRadius: 16,
                boxShadow: "0 1px 2px rgba(20,20,20,0.05)",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}
                className="row-hover"
                aria-expanded={faqOpen === i}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "22px 26px",
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    flex: 1,
                    lineHeight: 1.4,
                  }}
                >
                  {f.q}
                </span>
                <span
                  className="mono"
                  style={{ fontSize: 16, color: "#C9661A" }}
                >
                  {faqOpen === i ? "−" : "+"}
                </span>
              </button>
              {faqOpen === i && (
                <div style={{ padding: "0 26px 24px" }}>
                  <div
                    style={{
                      border: "1.5px dashed #C9661A",
                      background: "rgba(201,102,26,0.04)",
                      borderRadius: 12,
                      padding: "16px 20px",
                    }}
                  >
                    <div
                      className="mono"
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.18em",
                        color: "#C9661A",
                        marginBottom: 8,
                      }}
                    >
                      DRAFT ANSWER — CONFIRM BEFORE PUBLISH
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        lineHeight: 1.65,
                        color: "rgba(20,20,20,0.55)",
                      }}
                    >
                      {f.a}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 7 · Closing CTA */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(80px,10vw,140px) 24px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            margin: "0 0 40px",
            fontSize: "clamp(40px,6vw,76px)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1,
          }}
        >
          Cook Smarter.
          <br />
          Cook Freer.
        </h2>
        <button
          onClick={handleBuyPrimary}
          className="btn-ink"
          style={{ padding: "19px 44px", fontSize: 15 }}
        >
          BUY INFINITEPROBE →
        </button>
      </div>

      <Footer dict={dict} locale={locale} />
      <CartDrawer />
    </>
  );
}
