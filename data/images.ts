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
  heroProbe: null as string | null, // Probe3.jpg — titanium probe hero shot on dark
  lifestyleGrill: null as string | null, // lifestyle photo — grill / open fire scene
  categorySteak: null as string | null, // full-bleed seared steak cross-section, dark kitchen
  howItWorksHero: null as string | null, // exploded / cutaway probe render
};
