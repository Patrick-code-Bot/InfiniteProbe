# Target folder structure

Annotated. `[NEW]` = does not exist yet, `[MOVED]` = exists, relocates,
`[SPLIT]` = one file becomes several. Everything unmarked stays as-is.

```
site/
├── app/
│   ├── layout.tsx                    # root shell: fonts, CartProvider. No <html lang> — that moves to [lang]
│   ├── globals.css                   # design system (CSS vars + .btn-* utilities)
│   ├── icon.svg
│   ├── opengraph-image.tsx
│   ├── robots.ts
│   ├── sitemap.ts                    # MUST emit per-locale URLs after phase 1
│   │
│   ├── [lang]/                       # [NEW] locale segment — every marketing page lives here
│   │   ├── layout.tsx                # [NEW] sets <html lang>, loads dictionary, renders Header/Footer
│   │   ├── page.tsx                  # [MOVED] from app/page.tsx
│   │   ├── how-it-works/page.tsx     # [MOVED]
│   │   ├── why-different/page.tsx    # [MOVED]
│   │   ├── specs/page.tsx            # [MOVED]
│   │   ├── app/page.tsx              # [MOVED]
│   │   ├── support/page.tsx          # [MOVED]
│   │   ├── shop/
│   │   │   ├── page.tsx              # [MOVED] becomes RSC: fetches products server-side
│   │   │   └── ShopPageClient.tsx    # [MOVED] unchanged — receives products as props
│   │   ├── privacy-policy/page.tsx   # [MOVED]
│   │   ├── terms-of-service/page.tsx # [MOVED]
│   │   ├── shipping-policy/page.tsx  # [MOVED]
│   │   └── warranty/page.tsx         # [MOVED]
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
│   ├── Header.tsx                    # 'use client' — mobile menu. Needs locale-aware nav hrefs
│   ├── Footer.tsx
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
│   ├── i18n.ts                       # [NEW] locales, defaultLocale, Locale type
│   ├── dictionaries/                 # [NEW] UI chrome strings (nav, buttons) — NOT page copy
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
├── proxy.ts                          # [NEW] locale detection + redirect (`middleware.ts` on Next <16)
├── sanity.config.ts                  # [NEW] Studio config
├── sanity.cli.ts                     # [NEW]
└── next.config.mjs                   # add cdn.sanity.io to remotePatterns
```

## Notes on placement

**Why `[lang]` wraps pages but not `api/`, `sitemap.ts`, `robots.ts`, `studio/`.**
Those are single-instance resources. A sitemap should list all locales in one
document, not exist once per locale. The Studio is an editing tool, not
localized output.

**Why the root layout splits in two.** `app/layout.tsx` keeps fonts and
`CartProvider` (cart is locale-independent — same Shopify cart whatever
language you browse in). `app/[lang]/layout.tsx` owns `<html lang>` and the
dictionary. Keeping `CartProvider` at the root means switching locale doesn't
remount the cart.

**Why `data/` doesn't move to Sanity.** `specs.json` drives placeholder styling
via `tbc` flags; `images.ts` uses `null` to trigger `ImageSlot` placeholders;
`products.ts` holds Shopify handles. These are structural config with behavior
attached. Marketing prose goes to Sanity; these stay in code.

**Why `Header.tsx` is flagged.** It hardcodes hrefs like `/shop`. After phase 1
every nav link needs the locale prefix (`/${lang}/shop`) or navigation silently
drops users to the default locale.
