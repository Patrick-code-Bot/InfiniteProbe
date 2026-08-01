# Target folder structure

Annotated. `[DONE]` = built in phase 1, `[NEW]` = does not exist yet,
`[SPLIT]` = one file becomes several. Everything unmarked stays as-is.

```
site/
├── app/
│   ├── globals.css                   # design system (CSS vars + .btn-* utilities)
│   ├── icon.svg
│   ├── opengraph-image.tsx
│   ├── robots.ts
│   ├── sitemap.ts                    # [DONE] per-locale URLs + hreflang alternates
│   │                                 # NOTE: app/layout.tsx is GONE — the root
│   │                                 # layout lives under [lang] so it can read
│   │                                 # the locale param (see README phase 1).
│   │
│   ├── [lang]/                       # [DONE] locale segment — every page lives here
│   │   ├── layout.tsx                # [DONE] THE root layout: <html lang>, fonts, CartProvider
│   │   ├── page.tsx                  # [DONE]
│   │   ├── how-it-works/page.tsx     # [DONE]
│   │   ├── why-different/page.tsx    # [DONE]
│   │   ├── specs/page.tsx            # [DONE]
│   │   ├── app/page.tsx              # [DONE]
│   │   ├── support/page.tsx          # [DONE]
│   │   ├── shop/
│   │   │   ├── page.tsx              # [DONE] server wrapper; phase 3 adds product fetching
│   │   │   └── ShopPageClient.tsx    # [DONE] takes dict/locale props
│   │   ├── privacy-policy/page.tsx   # [DONE]
│   │   ├── terms-of-service/page.tsx # [DONE]
│   │   ├── shipping-policy/page.tsx  # [DONE]
│   │   └── warranty/page.tsx         # [DONE]
│   │
│   ├── studio/
│   │   └── [[...tool]]/page.tsx      # [NEW] embedded Sanity Studio — NOT under [lang]
│   │
│   └── api/
│       ├── newsletter/route.ts       # unchanged (still a stub)
│       └── draft-mode/
│           ├── enable/route.ts       # [NEW] Sanity visual editing entry
│           └── disable/route.ts      # [NEW]
│
├── components/                       # unchanged locations; RSC unless marked
│   ├── Header.tsx                    # [DONE] 'use client' — locale-aware nav, dict prop
│   ├── Footer.tsx                    # [DONE] dict/locale props
│   ├── Logo.tsx
│   ├── ImageSlot.tsx
│   ├── SectionRule.tsx
│   ├── StoreBadges.tsx
│   ├── FaqAccordion.tsx              # 'use client'
│   ├── WarrantyAccordion.tsx         # 'use client'
│   ├── SpecTables.tsx                # 'use client'
│   ├── NewsletterForm.tsx            # 'use client'
│   ├── VideoPlayer.tsx               # [NEW] Shopify CDN video
│   ├── PortableText.tsx              # [NEW] renders Sanity rich text
│   ├── LocaleSwitcher.tsx            # [NEW] 'use client'
│   └── cart/
│       ├── CartProvider.tsx          # 'use client' — unchanged
│       └── CartDrawer.tsx            # 'use client' — unchanged
│
├── sanity/                           # [NEW] all Sanity config
│   ├── env.ts                        # projectId / dataset / apiVersion, validated
│   ├── client.ts                     # createClient + sanityFetch wrapper
│   ├── image.ts                      # @sanity/image-url builder
│   ├── structure.ts                  # Studio desk structure
│   ├── queries.ts                    # GROQ helpers  → examples/groq-queries.ts
│   └── schemas/
│       ├── index.ts                  # schema registry
│       ├── objects/
│       │   ├── localeString.ts       # { en: string, ... }
│       │   ├── localeText.ts
│       │   ├── localeBlock.ts        # localized Portable Text
│       │   └── seo.ts
│       └── documents/
│           ├── page.ts               # → examples/sanity-schema-page.ts
│           ├── siteSettings.ts
│           └── faq.ts
│
├── lib/
│   ├── site.ts                       # unchanged — placeholder convention stays
│   ├── i18n.ts                       # [DONE] locales, helpers, Dictionary type
│   ├── dictionaries/                 # [DONE] UI chrome strings — NOT page copy
│   │   └── en.json
│   └── shopify/                      # [SPLIT] from the single lib/shopify.ts
│       ├── storefront.ts             # shared GraphQL fetch + types
│       ├── products.server.ts        # server-only, cached, private token
│       └── cart.client.ts            # 'use client' cart mutations, public token
│
├── data/                             # unchanged — structural config, NOT CMS content
│   ├── specs.json
│   ├── products.ts
│   └── images.ts
│
├── proxy.ts                          # [DONE] locale redirect (308)
├── sanity.config.ts                  # [NEW] Studio config
├── sanity.cli.ts                     # [NEW]
└── next.config.mjs                   # add cdn.sanity.io to remotePatterns
```

## Notes on placement

**Why `[lang]` wraps pages but not `api/`, `sitemap.ts`, `robots.ts`, `studio/`.**
Those are single-instance resources. A sitemap should list all locales in one
document, not exist once per locale. The Studio is an editing tool, not
localized output.

**Why there is no `app/layout.tsx`.** The original plan split the layout in two,
but a layout above `[lang]` never receives the locale param, and deriving it from
`headers()` would opt the whole site out of static generation. So
`app/[lang]/layout.tsx` *is* the root layout — it renders `<html lang>`, fonts,
and `CartProvider`. Cart state still sits above every page, so switching locale
will not remount it.

**Why `data/` doesn't move to Sanity.** `specs.json` drives placeholder styling
via `tbc` flags; `images.ts` uses `null` to trigger `ImageSlot` placeholders;
`products.ts` holds Shopify handles. These are structural config with behavior
attached. Marketing prose goes to Sanity; these stay in code.

**How `Header.tsx` gets its locale.** It is a client component, so it derives the
locale from `usePathname()` rather than taking it as a prop; labels come from the
`dict` prop. Every href goes through `localePath()`, and active-link comparison
goes through `stripLocale()` — comparing the raw pathname would never match once
paths carry an `/en` prefix.

**Why Header/Footer are not in the layout.** Hoisting them would remove 22
duplicate renders, but the home page renders an announcement bar *above*
`<Header />` and no other page does, so hoisting would reorder it. They stay in
the pages with `dict`/`locale` threaded through.
