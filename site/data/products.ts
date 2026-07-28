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
    shopifyHandle: "a",
    fallbackName: "Self-powered wireless ProbeOne",
    fallbackPrice: "$115.00",
    tag: null,
    description: "Self-powered wireless meat thermometer",
    meta: "1 × PROBE",
    imagePlaceholder: "Product photo — single probe on cream",
  },
  {
    key: "b",
    shopifyHandle: "b",
    fallbackName: "Self-powered wireless ProbePro",
    fallbackPrice: "$199.00",
    tag: "MOST POPULAR",
    description: "Two probes for two zones — or dinner and dessert.",
    meta: "2 × PROBE · [CASE INCLUDED — TBC]",
    imagePlaceholder: "Product photo — two probes with case",
  },
  {
    key: "c",
    shopifyHandle: "c",
    fallbackName: "WI-FI Display",
    fallbackPrice: "$99.00",
    tag: null,
    description: "The full table: every protein, every zone, one screen.",
    meta: "[4] × PROBE · [CASE INCLUDED — TBC]",
    imagePlaceholder: "Product photo — full bundle spread",
  },
];

export const COMPARE_ROWS = [
  { label: "Probes", a: "[1]", b: "[2]", c: "[X]" },
  { label: "Storage case", a: "[TBC]", b: "[TBC]", c: "[TBC]" },
  { label: "Best for", a: "[Weeknight cooks]", b: "[Grill + oven]", c: "[Pitmasters]" },
  { label: "Warranty", a: "[X yr]", b: "[X yr]", c: "[X yr]" },
  { label: "Price", a: "[$XXX]", b: "[$XXX]", c: "[$XXX]" },
];
