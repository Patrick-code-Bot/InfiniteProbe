/**
 * Site-wide constants. Everything in [brackets] is a placeholder that must be
 * resolved before launch — see LAUNCH_CHECKLIST.md.
 */

export const SITE_URL = "https://www.infiniteprobe.com";
export const SITE_NAME = "InfiniteProbe";
export const TAGLINE = "Infinite Power · Perfect Meat";

export const SUPPORT_EMAIL = "[support@infiniteprobe.com]"; // CONFIRM ADDRESS

// External links — all placeholders until the real destinations exist.
export const LINKS = {
  appStore: "[APP STORE URL]",
  googlePlay: "[GOOGLE PLAY URL]",
  instagram: "[INSTAGRAM URL]",
  youtube: "[YOUTUBE URL]",
  facebook: "[FACEBOOK URL]",
  x: "[X URL]",
  userManualPdf: "[/downloads/user-manual.pdf]",
  quickStartPdf: "[/downloads/quick-start.pdf]",
  declarationPdf: "[/downloads/declaration-of-conformity.pdf]",
  shippingPolicy: "[SHIPPING POLICY URL]",
  warrantyPolicy: "[WARRANTY POLICY URL]",
  privacyPolicy: "[PRIVACY POLICY URL]",
  termsOfService: "[TERMS OF SERVICE URL]",
};

/** True if the value is still a [bracketed] placeholder. */
export function isPlaceholder(value: string): boolean {
  return value.startsWith("[") && value.endsWith("]");
}

/** Placeholder links render as href="#" until resolved. */
export function hrefOrHash(value: string): string {
  return isPlaceholder(value) ? "#" : value;
}
