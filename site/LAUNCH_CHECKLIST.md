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
- [x] Warranty years `2` and return window `30` — `data/specs.json` → `warranty` (renders in the Home guarantee banner; `/warranty` glance tiles now read the same values)
- [ ] Ordering FAQ draft answers (4) — `app/shop/ShopPageClient.tsx` → `FAQS`: shipping time, international shipping, box contents, returns process

## 3 · Engineering specs — `data/specs.json`

Single source of truth; the Specs page and Home teaser both read this file.
Replace the value AND set `"tbc": false` to switch a row from dashed-orange
placeholder to verified styling. **Never invent numbers** (design-system rule).

- [x] Probe diameter — `5 mm`
- [x] Ambient / operating range — `-20–250 °C`
- [x] BLE range — `UP TO 23 M` (also `range.lineOfSight`, shown on How It Works)
- [x] Water resistance — `IP68` + dishwasher safe
- [x] Internal sensor range, max ambient exposure, accuracy, sensor type, resolution, sampling rate (§ 01)
- [x] Minimum activation temperature, cold-start behavior, energy storage (§ 02)
- [x] Typical closed-lid range, simultaneous probes per phone (§ 03)
- [x] Probe length, needle Ø, cap Ø, weight, minimum insertion depth (§ 04)
- [x] Platforms `iOS · Android`, languages `English · Spanish` (§ 05). Minimum OS versions are deliberately omitted from the marketing/spec page; maintain them in technical documentation if needed.
- [x] Box contents per SKU (§ 06)
- [x] Certifications `CE / FCC / RoHS / food-contact` (§ 07)
- [x] Specs-page datasheet SVG dimension labels (`app/[lang]/specs/page.tsx`) — now read from `data/specs.json` via `specRow()` instead of being hardcoded, so they can no longer drift from the spec tables

## 4 · Support content

- [ ] Support email `[support@infiniteprobe.com]` — `lib/site.ts` → `SUPPORT_EMAIL` (also remove the dashed "CONFIRM ADDRESS" treatment in `app/support/page.tsx` once real)
- [ ] Support FAQ draft answers (6) — `app/support/page.tsx` → `FAQS` (cold start, dishwasher, probe count, range, offline use, temperature limits)
- [x] User Manual PDF — hosted on Shopify's CDN, `LINKS.userManualPdf` set in `lib/site.ts`
- [x] Quick Start Guide PDF — hosted on Shopify's CDN, `LINKS.quickStartPdf` set
- [x] Declaration of Conformity PDF — **deliberately not published.** The download card and `LINKS.declarationPdf` were removed; the DoC is a legal document to hold on file and produce on request, not a required website asset. Re-add a card here only if distributors or retail buyers ask for it publicly.

## 5 · External links — `lib/site.ts` → `LINKS`

- [ ] `[APP STORE URL]` and `[GOOGLE PLAY URL]` (badges appear on Home, How It Works, App, Support)
- [ ] Social: `[INSTAGRAM URL]`, `[YOUTUBE URL]`, `[FACEBOOK URL]`, `[X URL]`
- [ ] Policies: `[SHIPPING POLICY URL]`, `[WARRANTY POLICY URL]`, `[PRIVACY POLICY URL]`, `[TERMS OF SERVICE URL]` — write the policy pages (Shopify can host these) and link them

## 6 · Photography / assets — `data/images.ts`

App screenshots (UI01–UI05) are live from the handoff. A slot that is still
`null` renders the dashed placeholder box. Two ways to fill one: drop a file
into `/public/images` and set the path, or paste a **Shopify Files CDN URL**
(`cdn.shopify.com` is already allowlisted in `next.config.mjs`, and `next/image`
optimizes remote sources the same way). Note that a Shopify URL's `?v=` is a
cache-buster — re-uploading the asset mints a new one, so re-copy the URL.

- [x] `heroProbe` — titanium probe hero shot on dark (Home hero, 4:3) — Shopify Files `ProbeOne2.png`
- [x] `lifestyleGrill` — grill / open-fire lifestyle scene (Home § 03, 16:9) — Shopify Files `IPApplication03_claude.png`
- [ ] `categorySteak` — full-bleed seared steak cross-section (Home § 07 dark band background)
- [x] `howItWorksHero` — exploded / cutaway probe render (How It Works hero, 4:3) — Shopify Files `Generate2Power.jpg`
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
- [ ] All 11 pages are wired for hero + SEO. To take over a page's hero, create a `page` document whose slug matches the route: `home`, `shop`, `specs`, `support`, `how-it-works`, `why-different`, `app`, `warranty`, `privacy-policy`, `terms-of-service`, `shipping-policy`
- [ ] Body content below the hero is still in code on every page — editing it is a deploy, not a CMS change

## 10 · Deployment (Vercel)

- [ ] Push repo to GitHub and import in Vercel (project root: `site/`)
- [ ] Add all env vars from `.env.example` to Vercel (Production + Preview)
- [ ] Add domain `infiniteprobe.com` + `www.infiniteprobe.com` in Vercel → Domains; set apex → www redirect (or vice versa); update DNS (A 76.76.21.21 / CNAME cname.vercel-dns.com)
- [ ] After first deploy: verify `https://www.infiniteprobe.com/sitemap.xml` and `/robots.txt`
- [ ] Submit sitemap in Google Search Console
- [ ] In Shopify: Settings → Checkout — confirm checkout branding matches (logo, colors) since checkout happens on Shopify's domain
- [ ] Test a full end-to-end order with Shopify's Bogus Gateway before enabling real payments

## 11 · New pages (2026-07-27 design handoff)

- [x] **Ambient sensing spec values** — `data/specs.json` § s1: `Sensor type / count` (`internal + ambient`), `Ambient sensor range` (`-20 °C – 250 °C`). Both resolved and marked non-TBC, consistent with the "Sensing" row.
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


CN Version

以下是该上线检查清单（Launch Checklist）的中文翻译：

---

# InfiniteProbe — 上线检查清单

代码库中每个 `[方括号]` 占位符都记录在此。所有仍带有方括号的内容在网站上都会显示为橘色虚线的“未确认”样式（根据设计系统），因此不会有任何未完成的内容被隐蔽发布——但在正式上线前，必须解决所有这些问题。

## 1 · Shopify (阻塞结账功能)

- [ ] **商店凭据 (Store credentials)** — 在 Vercel → Project → Settings → Environment Variables 中设置（以及本地的 `.env.local`）：
  - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` = `[your-store.myshopify.com]`
  - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` = `[storefront-access-token]`
    (Shopify 后台 → Settings → Apps and sales channels → Develop apps → 创建应用 → Storefront API 权限范围：`unauthenticated_read_product_listings`, `unauthenticated_write_checkouts`)
- [ ] **产品 Handle (Product handles)** — `data/products.ts`:
  - `[bundle-a-solo-handle]`
  - `[bundle-b-duo-handle]`
  - `[bundle-c-pitmaster-handle]`
  - `[accessory-dock-case-handle]`
- [ ] 在 Shopify 后台创建这四个产品，包含最终的名称、价格和照片。名称/价格/照片会自动同步至网站——完成初始对接后无需重新部署。
- [ ] **对比表 (Compare table)** — `data/products.ts` → `COMPARE_ROWS`：`[1]/[2]/[X]` 个探针、`[TBC]` 收纳盒行、`[Weeknight cooks]/[Grill + oven]/[Pitmasters]`、`[X yr]` 保修。（一旦连接 Handle，价格将从 Shopify 自动填充。）

## 2 · 商业条款 (商店页面 + 首页保障)

- [ ] `[XX]-DAY RETURNS`（[XX]天退货）与 `[X]-YEAR WARRANTY`（[X]年保修）— 商店 Hero 信任栏 (`app/shop/ShopPageClient.tsx`)
- [ ] `[XX]-Day Returns` 卡片正文 — “为什么选择官网直购” 区域 (`app/shop/ShopPageClient.tsx` → `DIRECT`)
- [x] 保修年限 `2` 和退货期限 `30` — `data/specs.json` → `warranty`（渲染在首页保障横幅中；`/warranty` 概览卡片现读取相同的值）
- [ ] 订购 FAQ 拟定答案 (4) — `app/shop/ShopPageClient.tsx` → `FAQS`：发货时间、国际运输、包装盒内容、退货流程

## 3 · 工程规格 — `data/specs.json`

单一事实来源 (Single source of truth)；规格页面和首页预览都会读取此文件。
替换值**并且**设置 `"tbc": false` 即可将表格行从橘色虚线占位符切换为已验证样式。**切勿凭空编造数字**（设计系统规则）。

- [x] 探针直径 — `5 mm`
- [x] 环境 / 工作温度范围 — `-20–250 °C`
- [x] BLE (低功耗蓝牙) 范围 — `UP TO 23 M`（亦即 `range.lineOfSight`，显示在“工作原理”中）
- [x] 防水等级 — `IP68` + 洗碗机可用
- [x] 内部传感器范围、最高环境暴露温度、精确度、传感器类型、分辨率、采样率 (§ 01)
- [x] 最小激活温度、冷启动行为、能量储存 (§ 02)
- [x] 典型闭盖范围、每部手机支持的同步探针数 (§ 03)
- [x] 探针长度、针头直径 Ø、帽盖直径 Ø、重量、最小插入深度 (§ 04)
- [x] 支持平台 `iOS · Android`、语言列表 `English · Spanish` (§ 05)。营销/规格页面有意不标注最低操作系统版本；如有需要，可在技术文档中维护。
- [x] 每个 SKU 的包装盒内容 (§ 06)
- [x] 认证信息 `CE / FCC / RoHS / 食品接触认证` (§ 07)
- [x] 规格页面数据表 SVG 尺寸标注 (`app/[lang]/specs/page.tsx`)：现通过 `specRow()` 从 `data/specs.json` 读取，不再硬编码，因此不会与规格表脱节

## 4 · 支持内容 (Support content)

- [ ] 支持邮箱 `[support@infiniteprobe.com]` — `lib/site.ts` → `SUPPORT_EMAIL`（确认真实地址后同时移除 `app/support/page.tsx` 中虚线框的“CONFIRM ADDRESS”样式）
- [ ] 支持 FAQ 拟定答案 (6) — `app/support/page.tsx` → `FAQS`（冷启动、洗碗机、探针数量、传输范围、离线使用、温度限制）
- [x] 用户手册 PDF — 托管于 Shopify CDN，已设置 `lib/site.ts` 中的 `LINKS.userManualPdf`
- [x] 快速入门指南 PDF — 托管于 Shopify CDN，已设置 `LINKS.quickStartPdf`
- [x] 符合性声明 (DoC) PDF — **有意不在网站发布。** 已移除下载卡片及 `LINKS.declarationPdf`；DoC 属于须存档并按要求出示的法律文件，并非网站必备资源。仅在分销商或零售采购方要求公开时再重新添加。

## 5 · 外部链接 — `lib/site.ts` → `LINKS`

- [ ] `[APP STORE URL]` 和 `[GOOGLE PLAY URL]`（应用商店徽章将显示在首页、工作原理、App 和支持页面）
- [ ] 社交媒体链接：`[INSTAGRAM URL]`, `[YOUTUBE URL]`, `[FACEBOOK URL]`, `[X URL]`
- [ ] 政策页面：`[SHIPPING POLICY URL]`, `[WARRANTY POLICY URL]`, `[PRIVACY POLICY URL]`, `[TERMS OF SERVICE URL]` — 撰写政策页面（可托管在 Shopify 上）并建立链接

## 6 · 摄影 / 资源文件 — `data/images.ts`

App 截图（UI01–UI05）已从交接文件中上线。仍为 `null` 的插槽会渲染为虚线占位框。填充方式有两种：将文件存入 `/public/images` 并设置路径，或直接粘贴 **Shopify Files CDN 链接**（`cdn.shopify.com` 已在 `next.config.mjs` 中列入白名单，`next/image` 对远程图片同样会做优化处理）。注意 Shopify 链接中的 `?v=` 是缓存清除参数 — 重新上传素材会生成新的参数值，届时需要重新复制链接。

- [x] `heroProbe` — 深色背景下的钛合金探针特写图（首页 Hero，4:3）— Shopify Files `ProbeOne2.png`
- [x] `lifestyleGrill` — 烧烤 / 明火生活方式场景图（首页 § 03，16:9）— Shopify Files `IPApplication03_claude.png`
- [ ] `categorySteak` — 香煎牛排截面全幅图（首页 § 07 深色带背景）
- [x] `howItWorksHero` — 探针爆炸图 / 剖面渲染图（工作原理 Hero，4:3）— Shopify Files `Generate2Power.jpg`
- [ ] 4 个商店卡片的产品照片 — 在 **Shopify 后台** 设置为精选图片（而不是在代码库中）

## 7 · 评价与社会认同 (Reviews & social proof)

- [ ] 首页 “ Cook 不靠猜测” 模块 — 3 张评价卡片 (`app/page.tsx`)：引言、姓名、头衔/出版物
- [ ] 商店 “早期评价” — 3 张已验证买家卡片 (`app/shop/ShopPageClient.tsx`)

## 8 · 新闻通讯 (Newsletter)

- [ ] 选择服务商（Mailchimp / Klaviyo / ConvertKit / Buttondown），并在 `app/api/newsletter/route.ts` 中实现订阅调用（TODO 标记了具体位置）
- [ ] 在 Vercel 中设置 `NEWSLETTER_PROVIDER` 和 `NEWSLETTER_API_KEY` 环境变量
- [ ] 在此之前，表单将返回“新闻订阅尚未开启” — 不会假装订阅成功

## 9 · 公告栏与文案检查

- [ ] 首页公告栏：确认上线时 “全场包邮 · 上线特惠 (FREE SHIPPING ON ALL ORDERS · LAUNCH OFFER)” 准确无误 (`app/page.tsx`)
- [ ] 型号 `IP-X1` — 确认最终型号 (`data/specs.json` → `model`)

## 9b · Sanity CMS (可选 — 网站在没有它的情况下也可以正常工作)

未配置 Sanity 时，网站仍能完整构建和渲染；每个字段都会回退至组件中提交的文案。只有在需要编辑人员无需重新部署即可修改文案时才进行配置。

- [ ] 在 [sanity.io/manage](https://sanity.io/manage) 创建项目，然后设置 `NEXT_PUBLIC_SANITY_PROJECT_ID` 和 `NEXT_PUBLIC_SANITY_DATASET`（参见 `.env.example`）
- [ ] 创建 Viewer token → `SANITY_API_READ_TOKEN`（仅限服务端，绝不要使用 `NEXT_PUBLIC_`）— 草稿模式预览所必需
- [ ] 将部署后的 Studio URL (`https://www.infiniteprobe.com/studio`) 添加到 Sanity → API → CORS origins，并允许凭据 (credentials)
- [ ] 访问 `/studio`，创建一个 Slug 为 `support` 的 `page` 文档，并确认 Hero 覆盖了预设文案
- [ ] **占位符在 Sanity 中保留其方括号。** 在 CMS 字段中输入 `[TBC]` 与在代码中使用带方括号的字符串一样，都会渲染出橘色虚线的“未确认”样式 — 本检查清单中的条目同样适用于 CMS 内容
- [ ] 所有 11 个页面均已配置 Hero + SEO。如需接管某个页面的 Hero，请创建一个 Slug 与路由匹配的 `page` 文档：`home`, `shop`, `specs`, `support`, `how-it-works`, `why-different`, `app`, `warranty`, `privacy-policy`, `terms-of-service`, `shipping-policy`
- [ ] Hero 以下的正文内容在每个页面中仍保留在代码中 — 编辑正文需要部署，而非 CMS 修改

## 10 · 部署 (Vercel)

- [ ] 将仓库推送到 GitHub 并导入 Vercel（项目根目录：`site/`）
- [ ] 将 `.env.example` 中的所有环境变量添加到 Vercel（Production + Preview）
- [ ] 在 Vercel → Domains 中添加域名 `infiniteprobe.com` + `www.infiniteprobe.com`；设置主域名到 www 的重定向（或反之）；更新 DNS（A 76.76.21.21 / CNAME cname.vercel-dns.com）
- [ ] 首次部署后：验证 `https://www.infiniteprobe.com/sitemap.xml` 与 `/robots.txt`
- [ ] 在 Google Search Console 中提交站点地图
- [ ] 在 Shopify 中：Settings → Checkout — 确认结账页面的品牌形象（Logo、颜色）一致，因为结账发生在 Shopify 域名上
- [ ] 在启用真实支付前，使用 Shopify 的 Bogus Gateway 测试完整的端到端订单

## 11 · 新页面 (2026-07-27 设计交接文件)

- [x] **环境感应规格值** — `data/specs.json` § s1：`Sensor type / count` (`internal + ambient`)、`Ambient sensor range` (`-20 °C – 250 °C`)。两项均已确认并标记为非 TBC，与“Sensing”行保持一致。
- [x] **App 截图** — 已在第 3 次交接 (2026-07-27) 中解决：更新后的 `UI02`（我的探针，单探针 `AMB` 读数）、`UI03`（实时烹饪，带 `AMBIENT 116°C` + `REC 110–120°` 及内部/环境/目标图表）、`UI05`（烹饪库，带不同肉切块的烤箱温度范围）现已放入 `/public/images`。`UI01`/`UI04` 保持不变。`data/images.ts` 中的位置映射正确且未变 — 请注意第 3 次交接 README 的资源列表对 UI02/UI03/UI04 的标注有误，但原型自身的脚本注释和实际像素证实了：`UI01=welcome, UI02=My Probes, UI03=live cook, UI04=settings, UI05=library`。
- [ ] **`/why-different`** — 新的独立页面 (`app/why-different/page.tsx`)。设计交接中的内容已完成/非占位符；未引入新的方括号。
- [ ] **`/privacy-policy`** (`app/privacy-policy/page.tsx`) — 占位符：`[MONTH DD, YYYY — SET AT PUBLICATION]` (最后更新时间)、`[privacy@infiniteprobe.com]` (确认邮箱)、`[REGISTERED ADDRESS — AWAITING LEGAL]` (注册地址 — 待法务确定)、`[JURISDICTION — TBC]` (司法管辖区 — 待定)、`[REGIONS — TBC]` (地区 — 待定)、`[X]` 个工作日的请求确认窗口。
- [ ] **`/shipping-policy`** (`app/shipping-policy/page.tsx`) — 占位符：最后更新日期、`[X–X] days` 处理时间 (×2)、旺季 `[X]` 天延迟、`[HH:MM TIMEZONE — TBC]` 截止时间、`[$XX — TBC]` 加急/优先运费率、AK/HI/海外领地 `[X–X]` 天延迟、`[X–XX] business days` 国际运输时间、`[CONFIRM WITH CARRIER]` 邮政信箱/APO 指引、`[X–XX]` 军事地址延迟、FAQ 中的物流无更新/损坏/包裹丢失天数阈值、`[orders@infiniteprobe.com]`。
- [ ] **`/terms-of-service`** (`app/terms-of-service/page.tsx`) — 占位符：生效日期、`[PENDING]` 发货政策交叉引用（现可解决 — 确认后链接）、`[USD $100 — TBC]` 责任上限、`[JURISDICTION — TBC]` (×2)、`[XX]` 天非正式解决期限、`[ARBITRATION PROVIDER — TBC]` (仲裁机构 — 待定)、`[SEAT — TBC]` (仲裁地 — 待定)、`[legal@infiniteprobe.com]`、`[REGISTERED ADDRESS — AWAITING LEGAL]`。**未获得法务签署批准前切勿上线** — 司法管辖区、仲裁机构/地点和责任上限将实质性影响可执行性。
- [ ] **`/warranty`** (`app/warranty/page.tsx`) — 占位符：`[X]` 年保修时长 (×2，概览卡片 + § 02 正文)、`[XX]` 天退货窗口 (×2)、`[XX]` 天换货保修延长、`[X]` 个工作日退款处理、`[JURISDICTION — TBC]`、一整个未撰写的子章节 (`[Regional warranty durations, distributor contacts, and any extended holiday return window — awaiting confirmation from legal and operations.]` 区域保修时长、分销商联系方式及延长假期退货窗口 — 待法务及运营确认)、`[support@infiniteprobe.com]`。同时确认一旦解决，`data/specs.json` → `warranty.years` / `warranty.returnDays` 保持匹配（首页保障横幅读取相同的值）。
- [ ] **页脚/导航栏政策链接** — `lib/site.ts` → `LINKS.shippingPolicy` / `warrantyPolicy` / `privacyPolicy` / `termsOfService` 现在指向新的内部路由而非外部 `[带方括号]` 的 URL；一旦页面自身的内容最终确定，无需在此处采取进一步操作。

## 持续更新内容的注意事项

- **规格参数** → 编辑 `data/specs.json`（单行修改，可在 GitHub Web 编辑器中进行）
- **图片资源** → 替换 `/public/images` 中的文件，如果添加新的插槽请更新 `data/images.ts`
- **视频资源** → 请勿提交视频文件；请托管在 YouTube/Vimeo 或 Vercel Blob / Cloudflare Stream 上并通过 URL 嵌入
- **产品与价格** → 仅在 Shopify 后台管理；网站将通过 Storefront API 自动反映变更，零部署