# Handoff: Home, App, and How It Works Pages — InfiniteProbe Website

## Overview
Marketing site for InfiniteProbe, a self-powered wireless meat thermometer (Leizig Technologies Group / InfiniteProbe Technologies Company). This package covers three pages: the Homepage, the App feature page, and the How It Works page.

## About the Design Files
The files in this bundle (`Home.dc.html`, `App.dc.html`, `How It Works.dc.html`) are **design references built in HTML** — high-fidelity prototypes showing intended look, copy, and behavior. They are not production code to copy verbatim. The task is to **recreate these designs in the target codebase's existing environment** (React, Vue, Next.js, etc.) using its established component patterns, routing, and build tooling — or, if no environment exists yet, choose the most appropriate modern frontend framework and implement the designs there.

Note: these `.dc.html` files use a proprietary internal template syntax (`{{ }}` holes, `<sc-for>`, `<sc-if>`, `<x-import>`) from the design tool that produced them — this is NOT standard HTML/JS and should not be parsed or run as-is. Treat the files as annotated visual/structural references; read the rendered structure and inline styles, not the templating mechanics.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, copy, and component states are locked. Recreate pixel-perfectly using the codebase's component library where one exists.

## Design System

### Colors
- Background (ivory): `#F2EFE6`
- Card surface (beige): `#EAE6DA`
- Elevated card / list row (cream white): `#FBF9F3`
- Ink (text, primary buttons, rules): `#141414`
- Burnt orange (accent only — never a large fill): `#C9661A`
- Charcoal dark band: `#161513`
- Hairlines: `rgba(20,20,20,0.08–0.18)` depending on emphasis
- Dark-band body text: `rgba(242,239,230,0.6–0.78)`

### Typography
- Headline / UI font: **Inter**, weights 400/500/600/700/800
- Eyebrows, meta labels, mono data: **IBM Plex Mono**, weights 400–600
- H1: Inter 800, `clamp(40px,6.5vw,88px)`, letter-spacing -0.035em, line-height ~0.98
- H2: Inter 800, `clamp(28px,4.5vw,52px)`, letter-spacing -0.028em
- Eyebrow label: IBM Plex Mono 500, 11–13px, letter-spacing +0.2em to +0.24em, uppercase, usually orange; format `"§ 0X · TITLE CASE OR ALL CAPS"`
- Body copy: Inter 400, 15–18px, line-height 1.65–1.7, color `rgba(20,20,20,0.72–0.78)`
- Oversized data numerals (e.g. temperature readouts): Inter 800, `clamp(64px,8vw,110px)`, letter-spacing -0.04em; target/second value in orange

### Components
- **Primary button**: solid black pill (`background:#141414; color:#fff; border-radius:999px`), hover → orange `#C9661A`. On dark bands, inverted to cream fill / black text.
- **Secondary button**: transparent, 1.5px black (or cream on dark) border pill, hover fills to black/cream.
- **Hairline + meta label row**: flex row, 1px `rgba(20,20,20,0.15)` divider between an orange mono eyebrow (left) and a muted mono counter/label (right).
- **Live-readout chip**: black pill, cream mono text, small orange dot with a soft pulse animation, format `INTERNAL 54.2°C · TARGET 58.0 · CH-1 · LIVE`.
- **Pillar / feature card**: `#FBF9F3` background, 20px radius, 36–40px padding, mono numeral eyebrow, Inter 800 title, body copy.
- **Placeholder chip** (for any bracketed/unconfirmed value): 1.5px dashed `#C9661A` border, `rgba(201,102,26,0.04)` fill, muted value text, orange mono caption below (e.g. "AWAITING ENGINEERING").
- **Phone mockup**: app screenshots shown edge-to-edge at native aspect ratio (~862:1658), no extra bezel drawn (screenshots already include device chrome), `object-fit: contain`.
- Dark charcoal band (`#161513`) is reserved for exactly three moments sitewide: hero, app showcase, category statement — do not introduce it elsewhere.

### Logo
Double-loop "infinity" mark: two black (or cream, on dark) rounded-lobe paths meeting at center, with a small orange dot at the center junction. Wordmark: `INFINITE` (orange) + `PROBE` (ink/cream), letter-spacing 0.12em, weight 800. Tagline (footer/lockups only): "INFINITE POWER · PERFECT MEAT" in mono, +0.24–0.32em tracking.

## Screens / Views

### 1. Home (`Home.dc.html`)
- **Purpose**: primary landing page — pitch, proof, and path to purchase.
- **Layout**: single-column vertical flow, max-width 1280px content container, generous section padding (`clamp(72px,9vw,128px)` vertical rhythm).
- **Sections in order**:
  1. Announcement bar (dark, centered mono text, free shipping + launch offer)
  2. Sticky nav: logo left, center link row (hidden <900px), black "SHOP NOW" pill right
  3. **Hero** (dark band #161513): eyebrow, H1 "Infinite Power for Perfect Meat", intro paragraph, primary+secondary CTA buttons, hero product image slot with live-readout chip overlay, 3-column stat strip below (Self-Powered / Truly Wireless / Stainless Steel 304 Body) separated by vertical hairlines
  4. **Three Pillars**: eyebrow "§ 01 · POWERED BY HEAT, NOT BY HASSLE", H2, 3-card grid (Self-Powered Innovation / Wireless Real-Time Monitoring / Precision from the Core)
  5. **How It Works flow**: eyebrow "§ 02", H2 "From Fire to Signal", 5-step horizontal chain (COOKING HEAT → THERMOELECTRIC CONVERSION → POWER SUPPLY → WIRELESS TRANSMISSION → REAL-TIME MONITORING) with orange arrow connectors, body paragraph + "LEARN THE TECHNOLOGY" secondary button
  6. **Built for Serious Cooking**: eyebrow "§ 03", H2 "Wherever There's Fire", pill-shaped use-case tags (GRILL/SMOKER/OVEN/OPEN FIRE/STEAK/TURKEY/BRISKET), body copy + lifestyle image slot
  7. **App Showcase** (dark band #161513): eyebrow "§ 04 · YOUR COOK, LIVE", H2 "The Whole Cook, On One Screen", 4 alternating left/right rows pairing a phone screenshot with a feature block: Live Readout (UI02), Cooking Library 26+ cuts (UI05), Multi-Probe home (UI04), Alerts/Settings (UI03); capability strip + App Store/Google Play badges below
  8. **Why It's Different**: eyebrow "§ 05", H2 "The Last Thermometer Habit You'll Break Is Charging It", comparison table (Traditional Thermometers vs. InfiniteProbe columns, orange checkmarks in the InfiniteProbe column) — 4 rows: Power source, Charging dependency, Wireless monitoring, Freedom during cooking
  9. **Social proof**: "Cooks Who Refuse to Guess" — 3 dashed-placeholder review cards (star row, italic quote placeholder, name/title placeholder)
  10. **Key Specs teaser**: eyebrow "§ 06 · ENGINEERED FOR PRECISION", 4-up big-number strip (mix of confirmed values e.g. "BLE 5.0" and dashed placeholder chips e.g. "[X.X] mm"), "FULL SPECIFICATIONS →" secondary button
  11. **Category Statement** (dark band #161513, full-bleed dim background image slot): eyebrow "§ 07 · A NEW CATEGORY", centered H2 "A New Category in Smart Cooking", centered body copy
  12. **Guarantee**: dashed-placeholder block, "[X]-year warranty" and "[XX]-day money-back guarantee" as inline placeholder spans
  13. **Final CTA + newsletter**: H2 "Cook Smarter. Cook Freer.", black "BUY INFINITEPROBE →" pill, email input + SUBSCRIBE button
  14. **Footer** (shared across all pages — see Footer spec below)

### 2. App (`App.dc.html`)
- **Purpose**: deep-dive on the companion app; expands the homepage app-showcase section into a full page.
- **Layout**: same container/rhythm conventions as Home.
- **Sections**: dark-band hero (headline "The Whole Cook, On One Screen", phone mockup of UI02 live-readout screen), then one alternating left/right section per screen — Live Readout (UI02), Cooking Library 26+ cuts (UI05, mentions per-cut recommended ambient/oven range), Multi-Probe home (UI04), Settings & Alerts (UI03), Welcome/Pairing (UI01) — each with a phone screenshot and a feature-copy block drawn from manual sections 08–10; capability strip (°C/°F · multi-language · BLE 5.0 · nothing leaves your device); App Store / Google Play badges; closing CTA "GET THE APP, THEN GET THE PROBE" with black pill button; standard footer.
- Phone screenshots are shown at ~862:1658 aspect ratio, `object-fit: contain`, no extra drawn bezel (screenshots include their own chrome).

### 3. How It Works (`How It Works.dc.html`)
- **Purpose**: explains the thermoelectric technology and correct probe placement.
- **Layout**: same container/rhythm conventions as Home.
- **Sections in order**:
  1. Dark-band hero: eyebrow "HOW IT WORKS", H1 "Powered by the Cook Itself", intro paragraph, CTA buttons, hero image slot (probe render)
  2. **§ 01 · From Fire to Signal**: H2 "Five Steps, Zero Batteries", 5 sequential cards (Cooking Heat → Thermoelectric Conversion → Power Supply → Wireless Transmission → Real-Time Monitoring), each with a subtle looping glow animation staggered by index
  3. **§ 02 · The Science, Briefly**: two-column — copy left ("Heat Wants to Move. We Put It to Work."), right side a hot-end/cold-end gradient diagram bar with an animated flowing-dash arrow and "ΔT" label
  4. **§ 03 · Placement Is Precision**: H2 "Accurate Readings Start with Placement", insertion diagram image slot + Best Practice (do's) and Avoid (don'ts) checklists, plus a 4-up by-cut tip grid (Steak/Chicken Breast/Turkey/Brisket)
  5. **§ 04 · Staying Connected**: two-column — copy on BLE 5.0 signal behavior, right side a dashed placeholder chip "up to [XX] m" (line-of-sight range)
  6. **§ 05 · Set Up in Seconds**: pairing copy + two phone screenshots (UI01, UI04) side by side, App Store/Google Play badges
  7. **Closing CTA**: H2 "No Battery. No Guessing. No Limits.", primary "BUY INFINITEPROBE →" + secondary "FULL SPECIFICATIONS" buttons
  8. Standard footer

## Shared Header (nav)
- Sticky, `rgba(242,239,230,0.92)` background with backdrop blur, 68px height, bottom hairline.
- Left: logo mark + wordmark, links to Home.
- Center (desktop ≥900px only): mono uppercase nav links — HOW IT WORKS / WHY DIFFERENT / APP / SPECS / SUPPORT — current page link shown in orange.
- Right: black "SHOP NOW" pill button.
- Below 900px, center links are hidden entirely (no hamburger menu in current prototype — flag this as a gap to resolve during implementation, e.g. add a mobile menu).

## Shared Footer (identical on every page)
- Top hairline (2px black) before a 4-column grid (responsive to 1 column on mobile): Brand block (logo + wordmark + tagline), Support links, Connect (social) links, Policies links (Shipping, Warranty, Privacy Policy, Terms of Service).
- Below that: centered mono strapline "INFINITEPROBE.COM · POWERED BY HEAT. ENGINEERED FOR PRECISION."
- Bottom row: "LEIZIG INSIDE" (left, bold mono, wide tracking) / "WWW.INFINITEPROBE.COM" (right, muted mono) — this exact signature line appears on every page of the site.

## Interactions & Behavior
- Buttons: hover state swaps background/color per component spec above (see Components).
- Live-readout chip on Home hero: orange status dot pulses via opacity keyframe animation (~1.6s loop).
- How It Works step cards: staggered glow/box-shadow pulse animation (~6s loop, offset per card index) to suggest sequential energy flow.
- How It Works ΔT diagram: dashed line + arrowhead animates via `stroke-dashoffset` to suggest flow from hot to cold end.
- Nav center links hide/show based on a `matchMedia('(min-width: 900px)')` listener (currently JS-driven display toggle, not CSS media query — reimplement as responsive CSS in production).
- All CTA buttons reading "SHOP NOW" / "BUY INFINITEPROBE" are visual-only in this prototype — wire to the real cart/checkout flow.

## State Management
No client state beyond simple UI toggles (nav link visibility breakpoint). No forms submit anywhere except the newsletter email field on Home, which is currently non-functional — wire to your email service provider.

## Design Tokens
```
--color-bg-ivory: #F2EFE6;
--color-surface-beige: #EAE6DA;
--color-surface-cream: #FBF9F3;
--color-ink: #141414;
--color-accent-orange: #C9661A;
--color-dark-band: #161513;
--font-display: 'Inter', sans-serif;
--font-mono: 'IBM Plex Mono', monospace;
--radius-card: 20px;
--radius-pill: 999px;
--space-section-y: clamp(72px, 9vw, 128px);
--maxwidth-content: 1280px;
```

## Assets
- Phone screenshots: `UI01.png` (welcome/pairing), `UI02.png` (live readout with ambient temperature), `UI03.png` (alerts/settings), `UI04.png` (multi-probe home), `UI05.png` (cooking library) — sourced from the user's real app UI, included in `/assets`.
- Hero/lifestyle/category-statement images are user-fillable drag-and-drop placeholders in the prototype (an `<image-slot>` custom element) — no final photography has been supplied yet. Source real product/lifestyle photography before shipping.
- Logo is an inline SVG (two rounded-lobe paths + center dot) — reproduce as a vector asset (SVG/icon component), not a raster image.

## Files
- `Home.dc.html` — Homepage prototype
- `App.dc.html` — App feature page prototype
- `How It Works.dc.html` — How It Works page prototype
- `assets/UI01.png` – `assets/UI05.png` — real app screenshots referenced by the above pages
