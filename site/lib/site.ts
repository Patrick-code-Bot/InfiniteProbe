/**
 * Site-wide constants. Everything in [brackets] is a placeholder that must be
 * resolved before launch — see LAUNCH_CHECKLIST.md.
 */

export const SITE_URL = "https://www.infiniteprobe.com";
export const SITE_NAME = "InfiniteProbe";
export const TAGLINE = "Infinite Power · Perfect Meat";

export const SUPPORT_EMAIL = "one@infiniteprobe.com";

// External links — all placeholders until the real destinations exist.
export const LINKS = {
  appStore: "[APP STORE URL]",
  googlePlay: "[GOOGLE PLAY URL]",
  instagram: "[INSTAGRAM URL]",
  youtube: "[YOUTUBE URL]",
  facebook: "[FACEBOOK URL]",
  x: "[X URL]",
  // Product documentation is hosted on Shopify's CDN, not in public/.
  userManualPdf:
    "https://cdn.shopify.com/s/files/1/0736/8877/6748/files/InfiniteProbe_One_User_Manual_EN.pdf?v=1785785178",
  quickStartPdf:
    "https://cdn.shopify.com/s/files/1/0736/8877/6748/files/InfiniteProbe_One_Quick_Start.pdf?v=1785785161",
  shippingPolicy: "/shipping-policy",
  warrantyPolicy: "/warranty",
  privacyPolicy: "/privacy-policy",
  termsOfService: "/terms-of-service",
};

/** True if the value is still a [bracketed] placeholder. */
export function isPlaceholder(value: string): boolean {
  return value.startsWith("[") && value.endsWith("]");
}

/** Placeholder links render as href="#" until resolved. */
export function hrefOrHash(value: string): string {
  return isPlaceholder(value) ? "#" : value;
}
