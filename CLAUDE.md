# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Layout

- `site/` — the Next.js application. **All development happens here.** Run npm commands from this directory.
- `ClaudeDesignProtoTypes/` — static HTML design prototypes the site was converted from, pixel-for-pixel. Reference only; do not edit. Delivered as dated handoff bundles, newest last — **always work from the latest bundle that covers the page you're touching**:
  - `ProtoTypeHandoff_1st_20260723/` — all pages, plus the design system file (`InfiniteProbe Design System.dc.html`, which only exists here).
  - `ProtoTypeHandoff_2nd_20260727/` — all pages including the policy pages.
  - `ProtoTypeHandoff_3rd_260727/design_handoff_home_app_howitworks/` — Home, App, and How It Works only. Ships a `README.md` handoff spec and the real app screenshots in `assets/` (`UI01`–`UI05`, identical to `site/public/images/`).

## Commands

Run from `site/`:

```bash
npm install       # install dependencies
npm run dev       # dev server at localhost:3000
npm run build     # production build (also the best "does it compile" check)
npm run lint      # ESLint flat config (next/core-web-vitals + next/typescript)
```

There is no test suite. TypeScript is in strict mode; use `npm run build` to type-check.

## What This Is

Marketing + e-commerce site for the InfiniteProbe wireless cooking thermometer. Next.js 16 App Router, React 19, TypeScript. Eleven statically generated pages, all under a `[lang]` locale segment: `/[lang]`, `/how-it-works`, `/why-different`, `/shop`, `/specs`, `/app`, `/support`, `/warranty`, `/privacy-policy`, `/terms-of-service`, `/shipping-policy`. Checkout is handled by Shopify (hosted checkout); this site only manages the cart. Deployed to Vercel with root directory `site/`.

### i18n routing

Every page lives under `app/[lang]/`. Ships `en` only, but the structure is locale-ready.

- `lib/i18n.ts` is the single source of truth: `locales`, `defaultLocale`, and the helpers `parseLocale()`, `localePath()`, `stripLocale()`, `languageAlternates()`. **Never hardcode a locale prefix** — build hrefs with `localePath(locale, "/shop")`, and compare paths with `stripLocale()`.
- `lib/dictionaries/*.json` holds UI chrome strings only (nav, footer labels). Page copy lives in the page components.
- `app/[lang]/layout.tsx` is the **only** root layout — it renders `<html lang>`, fonts, and `CartProvider`. There is no `app/layout.tsx`; a layout above `[lang]` cannot read the locale param without forcing dynamic rendering.
- `proxy.ts` 308-redirects unprefixed paths (`/shop` → `/en/shop`). Locale-shaped but unsupported paths (`/fr`) pass through to a 404 rather than redirecting.
- Pages use `generateMetadata` (not `export const metadata`) so `canonical` and `openGraph.url` carry the locale prefix.
- Adding a locale: add it to `locales` in `lib/i18n.ts`, add `lib/dictionaries/<locale>.json`, add the field to the Sanity localized objects. No structural change.

## Architecture

### Data flow: single sources of truth in `site/data/`

- `data/specs.json` — every product spec. Consumed by both the Specs page accordions and the home-page teaser. Each value has a `tbc` flag; `tbc: true` renders in "unconfirmed" placeholder styling. Content edits happen here, not in page components.
- `data/products.ts` — maps the 4 shop bundles to Shopify product handles, plus comparison-table rows. Live names/prices/images come from Shopify at runtime; only handles live in code.
- `data/images.ts` — registry of image slots. A `null` path renders an orange dashed placeholder via `components/ImageSlot.tsx` instead of a broken image.
- `lib/site.ts` — site-wide constants (`SITE_URL`, `SUPPORT_EMAIL`, `LINKS`, etc.) and the `isPlaceholder()` / `hrefOrHash()` helpers: `[bracketed]` link values render as `href="#"` until resolved.

### Shopify integration

- `lib/shopify.ts` — Storefront API client (public token, client-side). Product fetch by handle, cart create/read/add/update/remove via GraphQL.
- `components/cart/CartProvider.tsx` — React Context for cart state. Cart ID persisted in localStorage (`infiniteprobe:cartId`). Degrades gracefully when Shopify env vars are unset (`configured: false`), so the site works without credentials.
- Env vars (see `site/.env.example`): `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`, `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`.

### Newsletter (Kit)

- `app/api/newsletter/route.ts` is fully wired to Kit (formerly ConvertKit) and live in production. It creates the subscriber (an upsert by email), then makes a second call to add them to a form — that second step is what fires Kit automations of the form "subscriber joins form X", such as a welcome sequence.
- Server-side env vars, never `NEXT_PUBLIC_`: `NEWSLETTER_PROVIDER=kit`, `NEWSLETTER_API_KEY`, `NEWSLETTER_FORM_ID`. All three are set in Vercel production.
- **The key must be a v4 key** (starts with `kit_`). An older v3 key authenticates only against `api.convertkit.com/v3` and cannot create subscribers, so it fails here.
- Unset or `[bracketed]` credentials return 503 rather than failing silently — `isConfigured()` rejects placeholders the same way `lib/site.ts` does. Form association is best-effort: it logs and moves on, so a failure there never turns a captured signup into a visitor-facing error.
- Double opt-in follows the Kit account setting, deliberately not forced in code, keeping consent handling in one place.

### Sanity CMS

Headless CMS for marketing copy. **Additive, never required** — the site builds and renders fully with no Sanity credentials.

- `sanity/env.ts` — config + `isSanityConfigured()`. `sanity/client.ts` — `client` is `null` when unconfigured, and `sanityFetch` returns `null` instead of throwing.
- `sanity/queries.ts` — GROQ with locale coalescing. **`locale` is interpolated as a GROQ field path and cannot be parameterized** — only ever pass a validated `Locale` from `parseLocale()`, never raw input. Values like `slug` are bound parameters and are safe.
- `sanity/content.ts` — `firstHero()` and `text(cmsValue, fallback)`. **Every CMS read must have an in-code fallback**: `text(hero?.heading, "How Can We Help?")`. This is what makes the page-by-page migration safe and keeps a CMS outage from blanking a page.
- `sanity/schemas/objects/locale.ts` — localized field types are **generated from `locales` in `lib/i18n.ts`**, so the schema cannot drift from the routing layer.
- `/studio` — embedded Studio, deliberately outside `[lang]` with its own bare `app/studio/layout.tsx` (the site's root layout lives under `[lang]`). 404s when unconfigured.
- `app/api/draft-mode/enable|disable` — visual editing; requires server-only `SANITY_API_READ_TOKEN`, 401s without it.
- **All 11 pages are CMS-wired** for hero (eyebrow/heading/subheading) + SEO title/description. Body content below the hero is still in code. Three deliberate exceptions: `/specs`' subheading interpolates `{specs.model}`, and the `/privacy-policy` + `/terms-of-service` lead paragraphs are legal text — all three stay in code.
- Sanity `page` documents are keyed by slug: `home`, `shop`, `specs`, `support`, `how-it-works`, `why-different`, `app`, `warranty`, `privacy-policy`, `terms-of-service`, `shipping-policy`.

**Do not move `data/` to Sanity.** `specs.json` (`tbc` flags drive placeholder styling), `products.ts` (Shopify handles), and `images.ts` (`null` triggers `ImageSlot` placeholders) are structural config with behavior attached, not editorial copy.

### Placeholder convention (important)

Unconfirmed content is written as `[bracketed text]` throughout the codebase and intentionally renders with dashed burnt-orange "unconfirmed" styling. This is deliberate pre-launch behavior — do not "fix" or invent values for these placeholders. `site/LAUNCH_CHECKLIST.md` tracks every placeholder that must be resolved before launch.

**This convention carries into Sanity unchanged**: editors type the brackets into CMS fields, and `isPlaceholder()` still detects them. There is deliberately no separate `unconfirmed` boolean — one representation everywhere means a flag and its text can never disagree. Note that `text()` does not treat a bracketed string as empty; it is meaningful content, not a missing value.

**Always derive the styling, never hardcode it.** The dashed treatment must come from `isPlaceholder(value)` (or a `tbc` flag in `specs.json`) evaluated at render time — as `ImageSlot`, `SpecTables`, and `FaqAccordion` all do. A component that applies the dashed frame unconditionally keeps announcing "DRAFT" long after the copy is finalized, and no amount of content editing will clear it. `FaqAccordion` shipped with exactly that bug; if resolved content still renders as unconfirmed, suspect the component before the data.

### Styling

No CSS framework or component library. Design system lives in `app/globals.css` (CSS variables + utility classes like `.btn-ink`, `.btn-cream`, `.btn-outline-dark`), with inline styles in components for layout. Palette: ivory `#F2EFE6` background, ink `#141414` text, burnt orange `#C9661A` as accent only (never large fills). Fonts: Inter + IBM Plex Mono. New UI should match the handoff prototypes in `ClaudeDesignProtoTypes/` (see Repository Layout for which bundle is current).

### Other notes

- `@/*` path alias maps to the `site/` root.
- `next.config.mjs` allowlists `cdn.shopify.com` for `next/image`.
- SEO files are generated: `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`.
- No video files in the repo — video is embedded from external hosts by URL.
