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

### Phase 1 — i18n routing ✅ DONE

All 11 pages now live under `app/[lang]/`, statically generated per locale.

What was built:

1. **`lib/i18n.ts`** — `locales`, `defaultLocale`, `parseLocale()`,
   `localePath()`, `stripLocale()`, `languageAlternates()`, and the `Dictionary`
   type. Every locale-dependent path reads from here.
2. **`lib/dictionaries/en.json`** — UI chrome only (nav, footer labels). Page
   copy stays in components until phase 2 moves it to Sanity.
3. **`app/[lang]/layout.tsx`** — the app's *only* root layout.
4. **`proxy.ts`** — 308-redirects unprefixed paths to the default locale.
5. **`app/sitemap.ts`** — one entry per route per locale with hreflang
   alternates; per-page `metadata` became `generateMetadata` so `canonical` and
   `openGraph.url` carry the prefix.

Three decisions worth knowing:

**The root layout moved into `[lang]` rather than staying at `app/`.** Next
requires the root layout to render `<html>`/`<body>`, and `lang` must reflect
the locale — but a layout *above* `[lang]` never receives the param. Reading it
from `headers()` would have opted the entire site out of static generation. The
fix is to let `app/[lang]/layout.tsx` be the root layout; `app/layout.tsx` is
deleted. `CartProvider` still wraps everything, so switching locale will not
remount the cart.

**`dynamicParams = false`.** An unknown locale is a build-time 404 rather than
an on-demand render, so `/fr/` cannot be served English with a 200 and indexed
as duplicate content.

**Header/Footer stayed in the pages instead of being hoisted into the layout.**
Hoisting looked obvious — it would have removed 22 duplicate renders — but the
home page renders an announcement bar *above* `<Header />`, and every other page
does not. Hoisting would have reordered that bar, so `dict`/`locale` are threaded
through as props instead. Worth revisiting if the bar ever moves into the layout.

**Watch (phase 2):** `Header` derives its locale from `usePathname()` rather than
a prop, because it is a client component. That works today; if a locale switcher
lands, confirm it still reads correctly mid-navigation.

### Phase 2 — Sanity 🚧 FOUNDATION DONE, CONTENT MIGRATION ONGOING

Installed `sanity@6`, `next-sanity@13`, `@sanity/image-url@2`,
`@sanity/vision@6`, `styled-components@6`.

Built:

1. **`sanity/env.ts`** — config + `isSanityConfigured()`, which also rejects
   `[bracketed]` values so a copied `.env.example` reads as unconfigured.
2. **`sanity/client.ts`** — `client` is `null` when unconfigured; `sanityFetch`
   returns `null` instead of throwing.
3. **`sanity/queries.ts`** — GROQ with locale coalescing via `loc()`.
4. **`sanity/content.ts`** — `firstHero()` and `text()`, the fallback helpers.
5. **`sanity/schemas/`** — `localeString`/`localeText`/`localeBlock` generated
   from `locales` in `lib/i18n.ts`, three section types, `seo`, `page`.
6. **`/studio`** — embedded Studio with its own bare layout, outside `[lang]`.
7. **`/api/draft-mode/enable|disable`** — visual editing entry points.

**The central contract: Sanity is additive.** Every field falls back to the copy
committed in the component. If Sanity is unconfigured, the document is missing,
the query fails, or a field is empty, the page renders exactly what it rendered
before. This is what makes the migration safe page-by-page — an unmigrated page
and a migrated-but-unpopulated page are indistinguishable. Verified: the site
builds and every route 200s with no credentials at all.

**Placeholders keep their brackets** (decided by the user). Editors type
`[TBC]` into Sanity and `isPlaceholder()` in `lib/site.ts` still detects it,
rendering the dashed burnt-orange "unconfirmed" styling. Deliberately *not* a
separate `unconfirmed: boolean`: one representation everywhere means a flag and
its text can never disagree, and no existing copy needs migrating. Note `text()`
does **not** treat a bracketed string as empty — it is meaningful content.

**Schema i18n is generated from `lib/i18n.ts`.** The locale fields are built by
mapping over `locales`, so the schema cannot drift from the routing layer.

Migrated so far: **`/support`** (hero + SEO metadata) — chosen as the low-risk
validation case. Its FAQ answers are full of `[Placeholder — ...]` strings,
which made it a good test of the bracket convention.

**Remaining:** migrate the other 10 pages' copy one at a time, then wire live
preview (`defineLive`) once a real project exists. Do not migrate `data/`
(see below).

**Watch:** `getPage()` is called in both `generateMetadata` and the page body,
i.e. twice per render. Published fetches use `cache: "force-cache"`, so this
should collapse to one network call — but that is unverified, and it does not
hold in draft mode, where `cache: "no-store"` makes it two round trips per
render. If preview feels slow, wrap `getPage` in React's `cache()` before
looking anywhere else.

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
