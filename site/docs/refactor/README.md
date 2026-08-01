# Refactor plan: i18n + Sanity CMS + server-side Shopify

Design deliverable for the `refactor/architecture` branch. Nothing here is wired
into the running app yet — the files under `examples/` are reference
implementations to review before migration starts.

## Starting point (verified, not assumed)

The site is **already** a Next.js 14 App Router project with React Server
Components by default. The original request assumed a vanilla HTML/CSS/JS
codebase; that is not the case. Actual state:

- Next.js `14.2.35`, React 18, TypeScript strict
- 13 routes under `site/app/`, all statically generated
- 11 components under `site/components/`
- 8 `'use client'` files, each genuinely interactive:
  `Header` (mobile menu), `cart/CartProvider`, `cart/CartDrawer`,
  `FaqAccordion`, `WarrantyAccordion`, `SpecTables`, `NewsletterForm`,
  `app/shop/ShopPageClient`
- Path alias `@/*` → `site/*` (no `src/` directory)

So requirement 1 (App Router + clean RSC/client split) is substantially met.
The genuinely new work is **i18n routing**, **Sanity**, **server-side product
fetching**, and **video components**.

## Decisions taken

| Decision | Choice | Rationale |
|---|---|---|
| Shopify products | Move to RSC with `revalidate` | Better SEO, token out of the client bundle |
| Shopify cart | Stays client-side | Cart is per-user and mutation-heavy; preserves `configured: false` graceful degradation |
| `src/` directory | Skipped | Pure churn: rewrites every import for zero functional gain, and collides with the `[lang]` move |
| Locales | `en` only, i18n-ready | Full `[lang]` structure and localized Sanity fields ship now; adding a locale later needs no structural change |

## Prerequisite: Next.js upgrade

Current `sanity` (v6) and `next-sanity` (v13) target **Next 15/16**. This project
is on **14.2.35**. The upgrade is therefore a **blocking prerequisite** for the
Sanity phase, not an optional extra.

Options:
1. Upgrade to Next 16 first (`npx @next/codemod@canary upgrade latest`), then add Sanity. **Recommended.**
2. Pin older Sanity versions compatible with Next 14 — avoids the upgrade but starts on deprecated tooling.

Do the upgrade on its own commit, verify `npm run build`, then start phase 1.

## Phased migration

Each phase ends with a green `npm run build` and is independently revertible.

### Phase 0 — Next.js upgrade
Upgrade to Next 16. Verify all 13 routes still build and render.

### Phase 1 — i18n routing
1. Add `lib/i18n.ts` (locale list, default locale, `Dictionary` type).
2. Move `app/*/page.tsx` → `app/[lang]/*/page.tsx`. Keep `app/layout.tsx` as
   the root shell; add `app/[lang]/layout.tsx` that sets `<html lang>`.
3. Add `generateStaticParams()` returning the locale list so routes stay static.
4. Add proxy/middleware redirecting `/` → `/en`.
5. Keep `app/api/`, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx` at the root
   (they are not locale-scoped, though `sitemap.ts` should emit per-locale URLs).

**Watch:** `sitemap.ts` must emit one entry per locale per route, and pages need
`alternates.languages` metadata for hreflang.

### Phase 2 — Sanity
1. `npm i sanity next-sanity @sanity/image-url @sanity/vision`
2. `sanity/` directory: `env.ts`, `client.ts`, `schemas/`, `queries.ts`.
3. Studio mounted at `app/studio/[[...tool]]/page.tsx` (outside `[lang]` — the
   Studio is not localized).
4. Migrate content **one page at a time**, starting with a low-risk page
   (`/support` or `/why-different`) to validate the schema shape before
   touching Home.
5. Live preview via `next-sanity`'s draft-mode + `defineLive` once static
   rendering is confirmed working.

**Leave in code, do not move to Sanity:**
- `data/specs.json` — consumed by both Specs accordions and the home teaser,
  with `tbc` flags driving placeholder styling. Structured config, not copy.
- `data/products.ts` — Shopify handles and comparison-table rows.
- `data/images.ts` — image-slot registry with `null` → placeholder behavior.
- `lib/site.ts` — the `[bracketed]` placeholder convention.

Marketing **copy** belongs in Sanity. Structural config does not.

### Phase 3 — Shopify RSC + video
1. Split `lib/shopify.ts` into `lib/shopify/storefront.ts` (shared fetch),
   `products.server.ts` (RSC, cached), `cart.client.ts` (unchanged behavior).
2. Shop page becomes an RSC that fetches products and passes them to the
   existing `ShopPageClient` for cart interactivity.
3. Add `components/VideoPlayer.tsx` for Shopify CDN file URLs.

**Watch:** the server-side client must use a **private** Storefront token
(`SHOPIFY_STOREFRONT_ACCESS_TOKEN`, no `NEXT_PUBLIC_` prefix). Keep the public
one for the client-side cart. `isShopifyConfigured()` must keep returning false
when unset, or the site stops degrading gracefully.

## Placeholder convention

`[bracketed text]` renders as dashed burnt-orange "unconfirmed" styling and is
deliberate pre-launch behavior. When copy moves to Sanity, that convention must
survive — either keep brackets in Sanity string fields, or add an explicit
`unconfirmed: boolean` to localized text objects. Do not let the CMS migration
silently resolve placeholders. See `LAUNCH_CHECKLIST.md`.

## Reference files

| File | What it shows |
|---|---|
| `examples/folder-structure.md` | Target tree, annotated |
| `examples/sanity-schema-page.ts` | Localized page schema + reusable `localeString` |
| `examples/groq-queries.ts` | Typed GROQ helpers with locale coalescing |
| `examples/example-page.tsx` | `app/[lang]/page.tsx` — RSC composing Sanity + Shopify |
| `examples/i18n-config.ts` | Locale config and dictionary loading |
| `examples/VideoPlayer.tsx` | Shopify CDN video component |
