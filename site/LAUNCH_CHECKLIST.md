# InfiniteProbe — Launch Checklist

Every `[bracketed]` placeholder in the codebase, in one place. Anything still
bracketed renders on the site in the dashed-orange "unconfirmed" treatment
(per the design system), so nothing can silently ship half-done — but it all
must be resolved before going live.

## 1 · Shopify (blocks checkout)

- [ ] **Store credentials** — set in Vercel → Project → Settings → Environment Variables (and locally in `.env.local`):
  - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` = `[your-store.myshopify.com]`
  - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` = `[storefront-access-token]`
    (Shopify admin → Settings → Apps and sales channels → Develop apps → create app → Storefront API scopes: `unauthenticated_read_product_listings`, `unauthenticated_write_checkouts`)
- [ ] **Product handles** — `data/products.ts`:
  - `[bundle-a-solo-handle]`
  - `[bundle-b-duo-handle]`
  - `[bundle-c-pitmaster-handle]`
  - `[accessory-dock-case-handle]`
- [ ] Create the four products in Shopify admin with final names, prices, and photos. Names/prices/photos flow to the site automatically — no deploy needed after this initial wiring.
- [ ] **Compare table** — `data/products.ts` → `COMPARE_ROWS`: `[1]/[2]/[X]` probes, `[TBC]` case rows, `[Weeknight cooks]/[Grill + oven]/[Pitmasters]`, `[X yr]` warranty. (Prices auto-fill from Shopify once handles are wired.)

## 2 · Commerce terms (Shop page + Home guarantee)

- [ ] `[XX]-DAY RETURNS` and `[X]-YEAR WARRANTY` — Shop hero trust bar (`app/shop/ShopPageClient.tsx`)
- [ ] `[XX]-Day Returns` card body — "Why Buy Direct" section (`app/shop/ShopPageClient.tsx` → `DIRECT`)
- [ ] Warranty years `[X]` and return window `[XX]` — `data/specs.json` → `warranty` (renders in the Home guarantee banner)
- [ ] Ordering FAQ draft answers (4) — `app/shop/ShopPageClient.tsx` → `FAQS`: shipping time, international shipping, box contents, returns process

## 3 · Engineering specs — `data/specs.json`

Single source of truth; the Specs page and Home teaser both read this file.
Replace the value AND set `"tbc": false` to switch a row from dashed-orange
placeholder to verified styling. **Never invent numbers** (design-system rule).

- [ ] Probe diameter `[X.X] mm`
- [ ] Ambient / operating range `[XX]–[XXX] °C`
- [ ] BLE range `UP TO [XX] M` (also `range.lineOfSight`, shown on How It Works)
- [ ] Water resistance `[IPXX]` + dishwasher guidance
- [ ] Internal sensor range, max ambient exposure, accuracy, sensor type, resolution, sampling rate (§ 01)
- [ ] Minimum activation temperature, cold-start behavior, energy storage (§ 02)
- [ ] Typical closed-lid range, simultaneous probes per phone (§ 03)
- [ ] Probe length, needle Ø, cap Ø, weight, minimum insertion depth (§ 04)
- [ ] iOS/Android minimum versions, language list (§ 05)
- [ ] Box contents per SKU (§ 06)
- [ ] Certifications `[CE / FCC / RoHS / food-contact]` (§ 07)
- [ ] Specs-page datasheet SVG dimension labels (`app/specs/page.tsx`): `LENGTH [XXX mm]`, `NEEDLE Ø [X.X mm]`, `CAP Ø [XX mm]`, `MIN INSERTION [XX mm]`, `WEIGHT [XX g]`

## 4 · Support content

- [ ] Support email `[support@infiniteprobe.com]` — `lib/site.ts` → `SUPPORT_EMAIL` (also remove the dashed "CONFIRM ADDRESS" treatment in `app/support/page.tsx` once real)
- [ ] Support FAQ draft answers (6) — `app/support/page.tsx` → `FAQS` (cold start, dishwasher, probe count, range, offline use, temperature limits)
- [ ] User Manual PDF — upload and set `LINKS.userManualPdf` in `lib/site.ts`
- [ ] Quick Start Guide PDF — `LINKS.quickStartPdf`
- [ ] Declaration of Conformity PDF (if applicable) — `LINKS.declarationPdf`

## 5 · External links — `lib/site.ts` → `LINKS`

- [ ] `[APP STORE URL]` and `[GOOGLE PLAY URL]` (badges appear on Home, How It Works, App, Support)
- [ ] Social: `[INSTAGRAM URL]`, `[YOUTUBE URL]`, `[FACEBOOK URL]`, `[X URL]`
- [ ] Policies: `[SHIPPING POLICY URL]`, `[WARRANTY POLICY URL]`, `[PRIVACY POLICY URL]`, `[TERMS OF SERVICE URL]` — write the policy pages (Shopify can host these) and link them

## 6 · Photography / assets — `data/images.ts`

App screenshots (UI01–UI05) are live from the handoff. Still `null` (rendering
dashed placeholder boxes) — drop files into `/public/images` and set the path:

- [ ] `heroProbe` — titanium probe hero shot on dark (Home hero, 4:3)
- [ ] `lifestyleGrill` — grill / open-fire lifestyle scene (Home § 03, 16:9)
- [ ] `categorySteak` — full-bleed seared steak cross-section (Home § 07 dark band background)
- [ ] `howItWorksHero` — exploded / cutaway probe render (How It Works hero, 4:3)
- [ ] Product photos for the 4 shop cards — set as featured images **in Shopify admin** (not in the repo)

## 7 · Reviews & social proof

- [ ] Home "Cooks Who Refuse to Guess" — 3 review cards (`app/page.tsx`): quote, name, title/publication
- [ ] Shop "Early Reviews" — 3 verified-buyer cards (`app/shop/ShopPageClient.tsx`)

## 8 · Newsletter

- [ ] Choose a provider (Mailchimp / Klaviyo / ConvertKit / Buttondown) and implement the subscribe call in `app/api/newsletter/route.ts` (the TODO marks the spot)
- [ ] Set `NEWSLETTER_PROVIDER` and `NEWSLETTER_API_KEY` env vars in Vercel
- [ ] Until then, the form returns "Newsletter signup isn't live yet" — it will not pretend to succeed

## 9 · Announcement bar & copy checks

- [ ] Home announcement bar: confirm "FREE SHIPPING ON ALL ORDERS · LAUNCH OFFER" is accurate at launch (`app/page.tsx`)
- [ ] Model number `IP-X1` — confirm final (`data/specs.json` → `model`)

## 9b · Sanity CMS (optional — the site works without it)

The site builds and renders fully with Sanity unconfigured; every field falls back to the copy committed in the components. Only do this if you want editors changing copy without deploys.

- [ ] Create a project at [sanity.io/manage](https://sanity.io/manage), then set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` (see `.env.example`)
- [ ] Create a Viewer token → `SANITY_API_READ_TOKEN` (server-side only, never `NEXT_PUBLIC_`) — required for draft-mode preview
- [ ] Add the deployed Studio URL (`https://www.infiniteprobe.com/studio`) to Sanity → API → CORS origins, with credentials allowed
- [ ] Visit `/studio`, create a `page` document with slug `support`, and confirm the hero overrides the committed copy
- [ ] **Placeholders keep their brackets in Sanity.** Typing `[TBC]` into a CMS field renders the same dashed-orange "unconfirmed" styling as a bracketed string in code — the entries in this checklist apply to CMS content too
- [ ] Only `/support` is CMS-wired so far; the other 10 pages render from committed copy regardless of what exists in Sanity

## 10 · Deployment (Vercel)

- [ ] Push repo to GitHub and import in Vercel (project root: `site/`)
- [ ] Add all env vars from `.env.example` to Vercel (Production + Preview)
- [ ] Add domain `infiniteprobe.com` + `www.infiniteprobe.com` in Vercel → Domains; set apex → www redirect (or vice versa); update DNS (A 76.76.21.21 / CNAME cname.vercel-dns.com)
- [ ] After first deploy: verify `https://www.infiniteprobe.com/sitemap.xml` and `/robots.txt`
- [ ] Submit sitemap in Google Search Console
- [ ] In Shopify: Settings → Checkout — confirm checkout branding matches (logo, colors) since checkout happens on Shopify's domain
- [ ] Test a full end-to-end order with Shopify's Bogus Gateway before enabling real payments

## 11 · New pages (2026-07-27 design handoff)

- [ ] **Ambient sensing spec values** — `data/specs.json` § s1: `Sensor type / count` (`[internal + ambient — confirm]`), `Ambient sensor range` (`[XX °C – XXX °C — confirm]`). Confirm with engineering whether dual internal+ambient sensing is final before launch (the "Sensing" row is asserted as non-TBC copy already).
- [x] **App screenshots** — resolved in the 3rd handoff (2026-07-27): updated `UI02` (My Probes, per-probe `AMB` readings), `UI03` (live cook with `AMBIENT 116°C` + `REC 110–120°` and an internal/ambient/target chart), and `UI05` (Cooking Library with per-cut oven ranges) are now in `/public/images`. `UI01`/`UI04` unchanged. Slot mapping in `data/images.ts` is correct and unchanged — note the 3rd handoff README's asset list mislabels UI02/UI03/UI04, but the prototype's own script comment and the actual pixels confirm: `UI01=welcome, UI02=My Probes, UI03=live cook, UI04=settings, UI05=library`.
- [ ] **`/why-different`** — new standalone page (`app/why-different/page.tsx`). Content is finished/non-placeholder in the design handoff; no new brackets introduced.
- [ ] **`/privacy-policy`** (`app/privacy-policy/page.tsx`) — placeholders: `[MONTH DD, YYYY — SET AT PUBLICATION]` (last updated), `[privacy@infiniteprobe.com]` (confirm address), `[REGISTERED ADDRESS — AWAITING LEGAL]`, `[JURISDICTION — TBC]`, `[REGIONS — TBC]`, `[X]` business-day request-acknowledgment window.
- [ ] **`/shipping-policy`** (`app/shipping-policy/page.tsx`) — placeholders: last-updated date, `[X–X] days` processing time (×2), peak-season `[X]` day delay, `[HH:MM TIMEZONE — TBC]` cutoff, `[$XX — TBC]` expedited/priority rates, AK/HI/territory `[X–X]` day delay, `[X–XX] business days` international transit, `[CONFIRM WITH CARRIER]` PO Box/APO guidance, `[X–XX]` military address delay, tracking-silence/damage/missing-package day thresholds in the FAQ, `[orders@infiniteprobe.com]`.
- [ ] **`/terms-of-service`** (`app/terms-of-service/page.tsx`) — placeholders: effective date, `[PENDING]` Shipping Policy cross-reference (now resolvable — link once confirmed), `[USD $100 — TBC]` liability cap, `[JURISDICTION — TBC]` (×2), `[XX]` days informal-resolution period, `[ARBITRATION PROVIDER — TBC]`, `[SEAT — TBC]`, `[legal@infiniteprobe.com]`, `[REGISTERED ADDRESS — AWAITING LEGAL]`. **Do not launch without legal sign-off** — jurisdiction, arbitration provider/seat, and liability cap materially affect enforceability.
- [ ] **`/warranty`** (`app/warranty/page.tsx`) — placeholders: `[X]`-year warranty length (×2, glance tile + § 02 body), `[XX]`-day return window (×2), `[XX]` days replacement-warranty extension, `[X]` business days refund processing, `[JURISDICTION — TBC]`, an entire unwritten sub-section (`[Regional warranty durations, distributor contacts, and any extended holiday return window — awaiting confirmation from legal and operations.]`), `[support@infiniteprobe.com]`. Also confirm `data/specs.json` → `warranty.years` / `warranty.returnDays` match once resolved (Home guarantee banner reads the same values).
- [ ] **Footer/nav policy links** — `lib/site.ts` → `LINKS.shippingPolicy` / `warrantyPolicy` / `privacyPolicy` / `termsOfService` now point at the new internal routes instead of external `[bracketed]` URLs; no further action needed there once the pages' own content is finalized.

## Notes for ongoing content updates

- **Specs** → edit `data/specs.json` (one-line edit, works in GitHub web editor)
- **Images** → replace files in `/public/images`, update `data/images.ts` if adding new slots
- **Videos** → don't commit video files; host on YouTube/Vimeo or Vercel Blob / Cloudflare Stream and embed by URL
- **Products & prices** → Shopify admin only; the site reflects changes automatically via the Storefront API, zero deploys
