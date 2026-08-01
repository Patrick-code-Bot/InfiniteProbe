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

## Prerequisite: Next.js upgrade — DONE

Current `sanity` (v6) and `next-sanity` (v13) target **Next 15/16**, and this
project was on **14.2.35**, so the upgrade blocked the Sanity phase.

**Completed.** Now on Next `16.2.12`, React `19.2.8`, ESLint `9`.

## Phased migration

Each phase ends with a green `npm run build` and is independently revertible.

### Phase 0 — Next.js upgrade ✅ DONE

Next 14.2.35 → **16.2.12**, React 18 → **19.2.8**, ESLint 8 → **9**.

What the upgrade actually required:

1. **`npx @next/codemod@canary upgrade latest`** handled deps and most codemods.
   It stops on an interactive "Is your app deployed to Vercel?" prompt, leaving
   two codemods unapplied — finish them by hand (below).
2. **ESLint flat config.** `next lint` was **removed** in Next 16, so the `lint`
   script now calls `eslint .` directly, and `.eslintrc.json` was replaced by
   `eslint.config.mjs`. `eslint-config-next@16` exports flat-config arrays from
   its subpaths (`eslint-config-next/core-web-vitals`, `/typescript`) — import
   those directly. Do **not** use `FlatCompat`: it throws
   `Converting circular structure to JSON` against v16.
3. **ESLint pinned to 9, not 10.** The codemod installs `eslint@10`, but
   `eslint-config-next@16` bundles `eslint-plugin-react@7.37.5`, whose peer range
   stops at `^9.7`. On ESLint 10 every lint run dies with
   `contextOrFilename.getFilename is not a function`. Keep `eslint@^9` until
   the plugin ships ESLint 10 support.
4. **One real code fix.** Next 16's React Compiler lint rules flagged
   `components/Header.tsx`: an effect called `setMenuOpen(false)` on `pathname`
   change, causing a cascading render on every navigation
   (`react-hooks/set-state-in-effect`). Fixed by closing the panel in the link
   `onClick` handlers instead of reacting to the route after the fact.

What did **not** break: the async request API migration (Next 15's biggest
breaking change) was a no-op here, because no page used `cookies()`,
`headers()`, `draftMode()`, `params`, or `searchParams`. That changes in phase 1
— `app/[lang]/page.tsx` takes `params`, which in Next 16 is a **Promise** and
must be awaited.

Verified: `npm run build` clean, `npm run lint` clean, all 13 routes return 200
from `npm start` with content rendered and no hydration errors.

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
