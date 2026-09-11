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
    meta: "2 × PROBE",
    imagePlaceholder: "Product photo — two probes with case",
  },
  {
    key: "c",
    shopifyHandle: "c",
    fallbackName: "WI-FI Display",
    fallbackPrice: "$99.00",
    tag: null,
    description: "Cook with or without your phone — monitor up to 4 probes over WiFi.",
    meta: "DISPLAY · UP TO 4 PROBES · REQUIRES PROBE",
    imagePlaceholder: "Product photo — WiFi display on cream",
  },
];

export const COMPARE_ROWS = [
  { label: "What it is", a: "Thermometer", b: "Thermometer", c: "Display accessory" },
  { label: "Probes", a: "1", b: "2", c: "Requires probe" },
  { label: "Range", a: "Bluetooth · 23 m", b: "Bluetooth · 23 m", c: "WiFi — monitor anywhere" },
  { label: "Cook without phone", a: "No", b: "No", c: "Yes" },
  { label: "Probes managed", a: "—", b: "—", c: "Up to 4" },
  { label: "Best for", a: "Weeknight cooks", b: "Grill + oven", c: "Phone-free monitoring" },
  { label: "Warranty", a: "2 yr", b: "2 yr", c: "2 yr" },
  { label: "Price", a: "[$XXX]", b: "[$XXX]", c: "[$XXX]" },
];
