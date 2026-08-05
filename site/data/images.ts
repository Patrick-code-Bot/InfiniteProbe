/**
 * Photo slot registry. The app UI screenshots (UI01–UI05) shipped with the
 * design handoff and are live. Product / lifestyle photography has not been
 * shot yet — those slots are `null` and render the dashed-orange placeholder.
 *
 * To go live with a photo: drop the file into /public/images and replace the
 * null with its path (e.g. "/images/probe-hero.jpg"). Nothing else to change.
 */

export const IMAGES = {
  // App screenshots — provided in the handoff
  uiWelcome: "/images/UI01.png", // welcome / enable Bluetooth
  uiMyProbes: "/images/UI02.png", // My Probes home screen
  uiLiveCook: "/images/UI03.png", // live cook screen
  uiSettings: "/images/UI04.png", // settings & alerts
  uiLibrary: "/images/UI05.png", // cooking library

  // Photography — pending, see LAUNCH_CHECKLIST.md
  heroProbe:
    "https://cdn.shopify.com/s/files/1/0736/8877/6748/files/ProbeOne2.png?v=1785256637" as
      | string
      | null, // titanium probe hero shot on dark — hosted in Shopify Files
  lifestyleGrill:
    "https://cdn.shopify.com/s/files/1/0736/8877/6748/files/IPApplication03_claude.png?v=1785894240" as
      | string
      | null, // lifestyle photo — grill / open fire scene
  categorySteak: null as string | null, // full-bleed seared steak cross-section, dark kitchen
  howItWorksHero:
    "https://cdn.shopify.com/s/files/1/0736/8877/6748/files/Generate2Power.jpg?v=1785894505" as
      | string
      | null, // exploded / cutaway probe render
};
