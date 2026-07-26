/**
 * Maps the four Shop-page cards to Shopify products.
 *
 * Set each `shopifyHandle` to the product's handle in your Shopify store
 * (Shopify admin → Products → the URL slug). While a handle is still a
 * [bracketed] placeholder, the card renders the design's dashed-orange
 * placeholder price and ADD TO CART is disabled.
 *
 * Names, prices, and photos come from Shopify at runtime once wired —
 * change them in Shopify admin and the site updates with zero deploys.
 */

export interface BundleConfig {
  key: string;
  shopifyHandle: string;
  fallbackName: string;
  fallbackPrice: string;
  tag: string | null;
  description: string;
  meta: string;
  imagePlaceholder: string;
}

export const BUNDLES: BundleConfig[] = [
  {
    key: "a",
    shopifyHandle: "[bundle-a-solo-handle]",
    fallbackName: "[BUNDLE A — SOLO]",
    fallbackPrice: "[$XXX]",
    tag: null,
    description: "One probe. Everything it needs is in the fire.",
    meta: "1 × PROBE · [CASE TBC]",
    imagePlaceholder: "Product photo — single probe on cream",
  },
  {
    key: "b",
    shopifyHandle: "[bundle-b-duo-handle]",
    fallbackName: "[BUNDLE B — DUO]",
    fallbackPrice: "[$XXX]",
    tag: "MOST POPULAR",
    description: "Two probes for two zones — or dinner and dessert.",
    meta: "2 × PROBE · [CASE INCLUDED — TBC]",
    imagePlaceholder: "Product photo — two probes with case",
  },
  {
    key: "c",
    shopifyHandle: "[bundle-c-pitmaster-handle]",
    fallbackName: "[BUNDLE C — PITMASTER]",
    fallbackPrice: "[$XXX]",
    tag: null,
    description: "The full table: every protein, every zone, one screen.",
    meta: "[X] × PROBE · [CASE INCLUDED — TBC]",
    imagePlaceholder: "Product photo — full bundle spread",
  },
  {
    key: "d",
    shopifyHandle: "[accessory-dock-case-handle]",
    fallbackName: "[ACCESSORY — CHARGING-FREE DOCK / CASE]",
    fallbackPrice: "[$XX]",
    tag: null,
    description: "Spare storage for probes between cooks.",
    meta: "[ACCESSORY · CONTENTS TBC]",
    imagePlaceholder: "Product photo — accessory on cream",
  },
];

export const COMPARE_ROWS = [
  { label: "Probes", a: "[1]", b: "[2]", c: "[X]" },
  { label: "Storage case", a: "[TBC]", b: "[TBC]", c: "[TBC]" },
  { label: "Best for", a: "[Weeknight cooks]", b: "[Grill + oven]", c: "[Pitmasters]" },
  { label: "Warranty", a: "[X yr]", b: "[X yr]", c: "[X yr]" },
  { label: "Price", a: "[$XXX]", b: "[$XXX]", c: "[$XXX]" },
];
