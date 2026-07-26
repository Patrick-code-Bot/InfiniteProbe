# infiniteprobe.com

Production site for **InfiniteProbe** — the self-powered wireless meat
thermometer. Built with Next.js (App Router, TypeScript), statically generated
marketing pages, and Shopify Storefront API commerce. Converted pixel-for-pixel
from the Claude Design handoffs in `../ClaudeDesignProtoTypes/`.

**Before launch:** work through [`LAUNCH_CHECKLIST.md`](./LAUNCH_CHECKLIST.md) —
it lists every `[bracketed]` placeholder. Unresolved placeholders render in the
design system's dashed-orange "unconfirmed" style, so they're visible, not hidden.

## Develop

```bash
npm install
cp .env.example .env.local   # fill in Shopify credentials
npm run dev                  # http://localhost:3000
```

## Architecture

| Path | Purpose |
|---|---|
| `app/` | Six routes: `/` `/how-it-works` `/shop` `/specs` `/app` `/support` — all statically generated |
| `app/api/newsletter/` | Newsletter signup endpoint (provider stub — see checklist §8) |
| `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx` | SEO: sitemap.xml, robots.txt, OG image |
| `components/` | Shared header (sticky nav, cart-aware on /shop), footer, cart drawer, spec tables, FAQ accordions |
| `data/specs.json` | **Single source of truth for all spec values** — Specs page and Home teaser both read it. Edit a number here (even in GitHub's web editor) and redeploy |
| `data/products.ts` | Maps the 4 shop cards to Shopify product handles |
| `data/images.ts` | Photo slot registry — drop a file in `public/images/`, set its path here |
| `lib/shopify.ts` | Storefront API client: products, cart create/add/update/remove, checkout URL |
| `lib/site.ts` | Site URL, support email, external links |

## Content updates (no code knowledge needed)

- **Change a spec value** → edit `data/specs.json`, set `"tbc": false` when confirmed
- **Swap a photo** → replace the file in `public/images/` (same name), push
- **Change product name/price/photo** → Shopify admin; live immediately, no deploy
- **Videos** → host on YouTube/Vimeo or Vercel Blob/Cloudflare Stream; embed by URL (never commit video files)

## Commerce flow

Products render from Shopify at runtime (public Storefront token, client-side).
Cart is a persistent Shopify cart (localStorage cart ID); CHECKOUT redirects to
Shopify's hosted checkout (`cart.checkoutUrl`). Until Shopify env vars and
product handles are set, the shop renders the design's placeholder bundles and
the cart drawer explains what's missing.

## Deploy (Vercel)

Import the repo in Vercel with **Root Directory = `site`**, add the env vars
from `.env.example`, and attach the `infiniteprobe.com` domain. Details in
LAUNCH_CHECKLIST.md §10.
