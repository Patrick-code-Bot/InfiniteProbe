import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  parseLocale,
  localePath,
  languageAlternates,
  getDictionary,
  defaultLocale,
} from "@/lib/i18n";
import { SUPPORT_EMAIL } from "@/lib/site";
import { draftMode } from "next/headers";
import { getPage } from "@/sanity/queries";
import { firstHero, text } from "@/sanity/content";
import { notFound } from "next/navigation";
import SectionRule from "@/components/SectionRule";
import specs from "@/data/specs.json";
import WarrantyAccordion from "@/components/WarrantyAccordion";
import CartDrawer from "@/components/cart/CartDrawer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = parseLocale(lang) ?? defaultLocale;

  const page = await getPage("warranty", locale);

  return {
    title: text(page?.seo?.metaTitle, "Warranty & Returns"),
    description: text(
      page?.seo?.metaDescription,
      "The InfiniteProbe limited warranty and return policy — coverage, exclusions, and how to file a claim.",
    ),
    alternates: {
      canonical: localePath(locale, "/warranty"),
      languages: languageAlternates("/warranty"),
    },
    openGraph: {
      title: "InfiniteProbe Warranty & Returns",
      description: "Built for the fire. Backed in writing.",
      url: localePath(locale, "/warranty"),
    },
  };
}

const GLANCE = [
  {
    value: `${specs.warranty.years}-year`,
    label: "LIMITED WARRANTY",
    tbc: false,
  },
  {
    value: `${specs.warranty.returnDays}-day`,
    label: "RETURN WINDOW",
    tbc: false,
  },
  { value: "RMA first", label: "AUTHORIZED CLAIMS ONLY", tbc: false },
  {
    value: "We pay",
    label: "SHIPPING ON APPROVED WARRANTY REPLACEMENTS",
    tbc: false,
  },
];

const EXCLUSIONS = [
  "Misuse, abuse, or neglect, including exceeding the rated maximum temperature or inserting below the minimum insertion depth",
  "Accidental damage — drops, crushing, pet damage, or loss",
  "Unauthorized modification, disassembly, or repair, or an altered or removed serial number",
  "Normal wear and tear, such as scratches or discoloration",
  "Cleaning by unapproved methods, including harsh abrasives or solvents",
  "Commercial, rental, or other non-household use",
  "Purchases from unauthorized sellers, secondhand units, or uncertified countries (coverage requires the original purchaser and proof of purchase)",
];

const CLAIM_STEPS = [
  {
    num: "01",
    title: "Contact us first",
    body: "Email our support team with your order details and a description of the issue.",
  },
  {
    num: "02",
    title: "Receive your RMA",
    body: "We'll issue a Return Merchandise Authorization and shipping instructions.",
  },
  {
    num: "03",
    title: "Ship it back",
    body: "Send the original unit back using the provided authorization.",
  },
  {
    num: "04",
    title: "Repair, replace, or refund",
    body: "We'll resolve your claim by repair, replacement, or refund, at our discretion.",
  },
];

const SECTIONS = [
  {
    id: "returns",
    title: "RETURN & REFUND POLICY",
    body: (
      <>
        <p style={{ margin: 0 }}>
          You may return a purchase within{" "}
          <span style={{ color: "#C9661A", fontWeight: 600 }}>[XX]</span>-days
          of delivery, provided the item is in its original condition and
          packaging with all accessories, and you have proof of purchase.
        </p>
        <p style={{ margin: 0 }}>
          Contact us first to start an RMA. You&apos;re responsible for return
          shipping costs — tracked shipping is recommended, since we can&apos;t
          refund lost return packages. Refunds are issued within [X] business
          days of receiving and inspecting the return.
        </p>
        <p style={{ margin: 0 }}>
          This policy covers purchases made directly on infiniteprobe.com. If
          you bought from a retailer, their return policy applies. Unauthorized
          returns may not be processed and may be forfeited.
        </p>
      </>
    ),
  },
  {
    id: "coverage",
    title: "LIMITED WARRANTY COVERAGE",
    body: (
      <>
        <p style={{ margin: 0 }}>
          InfiniteProbe Technologies Company (&quot;IPT&quot;) warrants to the
          original purchaser that InfiniteProbe products are free from defects
          in materials and workmanship under normal home use for{" "}
          <span style={{ color: "#C9661A", fontWeight: 600 }}>[X]</span> year(s)
          from the date of delivery (the &quot;Warranty Period&quot;).
        </p>
        <p style={{ margin: 0 }}>
          At our discretion, we&apos;ll repair, replace (with a new or
          refurbished unit of equal or better function), or refund a covered
          product. A replacement is warranted for the remainder of the original
          Warranty Period, or [XX] days from the replacement&apos;s delivery —
          whichever is longer.
        </p>
        <p style={{ margin: 0 }}>
          Proof of purchase is required, and we may request diagnostics or
          photos. The original unit must be returned — a prepaid label is
          provided on approved claims — before or alongside your replacement.
        </p>
      </>
    ),
  },
  {
    id: "exclusions",
    title: "WHAT IS NOT COVERED",
    body: (
      <>
        <p style={{ margin: 0 }}>This warranty does not cover:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {EXCLUSIONS.map((e) => (
            <div key={e} style={{ display: "flex", gap: 12 }}>
              <span style={{ fontWeight: 800, color: "rgba(20,20,20,0.5)" }}>
                ✕
              </span>
              <span>{e}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "disclaimer",
    title: "WARRANTY DISCLAIMER & LIMITATION OF LIABILITY",
    body: (
      <>
        <p
          style={{
            margin: 0,
            textTransform: "uppercase",
            fontSize: 13.5,
            letterSpacing: "0.01em",
          }}
        >
          THIS IS THE EXCLUSIVE WARRANTY AND REMEDY. WE DISCLAIM ALL IMPLIED
          WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, AND NON-INFRINGEMENT, EXCEPT WHERE LAW PROHIBITS THIS — IN
          WHICH CASE IMPLIED WARRANTIES ARE LIMITED TO THE WARRANTY PERIOD.
        </p>
        <p
          style={{
            margin: 0,
            textTransform: "uppercase",
            fontSize: 13.5,
            letterSpacing: "0.01em",
          }}
        >
          WE EXCLUDE LIABILITY FOR INDIRECT, INCIDENTAL, SPECIAL, OR
          CONSEQUENTIAL DAMAGES, INCLUDING SPOILED FOOD, RUINED COOKS, OR LOSS
          OF USE OR DATA. OUR TOTAL LIABILITY IS CAPPED AT THE PURCHASE PRICE
          PAID.
        </p>
        <p style={{ margin: 0 }}>
          InfiniteProbe is a cooking aid, not a food-safety guarantee: always
          verify that food has reached a safe internal temperature according to
          your local food-safety guidance. Nothing on this page limits rights
          that consumer law grants you and that cannot be waived.
        </p>
      </>
    ),
  },
  {
    id: "law",
    title: "GOVERNING LAW & REGION-SPECIFIC TERMS",
    body: (
      <>
        <p style={{ margin: 0 }}>
          This warranty is governed by the law of{" "}
          <span style={{ color: "#C9661A", fontWeight: 600 }}>
            [JURISDICTION — TBC]
          </span>
          . In the EU, UK, Australia, and New Zealand, statutory consumer
          guarantees apply in addition to, or in place of, these terms where
          they conflict, and may exceed the stated Warranty Period.
        </p>
        <p style={{ margin: 0, color: "#C9661A" }}>
          [Regional warranty durations, distributor contacts, and any extended
          holiday return window — awaiting confirmation from legal and
          operations.]
        </p>
      </>
    ),
  },
];

export default async function WarrantyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = parseLocale(lang);
  if (!locale) notFound();

  const { isEnabled: isDraft } = await draftMode();
  const [dict, page] = await Promise.all([
    getDictionary(locale),
    getPage("warranty", locale, { draft: isDraft }),
  ]);

  // CMS content is additive — every field falls back to the copy below.
  const hero = firstHero(page);

  return (
    <>
      <Header dict={dict} />

      {/* Hero */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "clamp(64px,9vw,112px) 24px 0",
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 12,
            letterSpacing: "0.24em",
            color: "#C9661A",
            marginBottom: 24,
          }}
        >
          {text(hero?.eyebrow, "WARRANTY & RETURNS · POLICY")}
        </div>
        <h1
          style={{
            margin: "0 0 24px",
            fontSize: "clamp(38px,6vw,64px)",
            fontWeight: 800,
            letterSpacing: "-0.032em",
            lineHeight: 1,
          }}
        >
          {text(hero?.heading, "Built for the Fire. Backed in Writing.")}
        </h1>
        <p
          style={{
            margin: "0 0 32px",
            fontSize: 16.5,
            lineHeight: 1.7,
            color: "rgba(20,20,20,0.78)",
            maxWidth: 680,
          }}
        >
          {text(
            hero?.subheading,
            "Every InfiniteProbe is engineered to outlast your longest cook — and covered by a warranty written to be read, not skimmed. Here is exactly what we promise, what we cover, and how to reach us if something goes wrong.",
          )}
        </p>
        <div
          style={{
            background: "#EAE6DA",
            borderRadius: 16,
            padding: "24px 28px",
            marginBottom: 56,
            maxWidth: 680,
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              color: "#C9661A",
              marginBottom: 10,
            }}
          >
            YOUR STATUTORY RIGHTS
          </div>
          <div
            style={{
              fontSize: 14.5,
              lineHeight: 1.65,
              color: "rgba(20,20,20,0.75)",
            }}
          >
            Consumer law in the EU, UK, Australia, and New Zealand may grant you
            additional rights that can&apos;t be limited. Some exclusions below
            may not apply in every jurisdiction.
          </div>
        </div>

        {/* At a glance */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 20,
            marginBottom: 56,
          }}
        >
          {GLANCE.map((g) => (
            <div
              key={g.label}
              style={{
                borderRadius: 16,
                padding: "24px 20px",
                textAlign: "center",
                border: g.tbc
                  ? "1.5px dashed #C9661A"
                  : "1px solid rgba(20,20,20,0.15)",
                background: g.tbc ? "rgba(201,102,26,0.04)" : "#FBF9F3",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(22px,2.4vw,30px)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: g.tbc ? "rgba(20,20,20,0.35)" : "#141414",
                }}
              >
                {g.value}
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  marginTop: 8,
                  color: g.tbc ? "#C9661A" : "rgba(20,20,20,0.5)",
                }}
              >
                {g.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accordion sections */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 24px clamp(56px,7vw,88px)",
        }}
      >
        <WarrantyAccordion sections={SECTIONS} />
      </div>

      {/* Claims process */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 24px clamp(56px,7vw,88px)",
        }}
      >
        <SectionRule eyebrow="§ 06 · HOW TO FILE A CLAIM" />
        <h2
          style={{
            margin: "0 0 20px",
            fontSize: "clamp(26px,3.4vw,38px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Four Steps. No Runaround.
        </h2>
        <div
          style={{
            background: "#EAE6DA",
            borderRadius: 16,
            padding: "20px 24px",
            marginBottom: 32,
            maxWidth: 680,
          }}
        >
          <div
            style={{
              fontSize: 14.5,
              lineHeight: 1.65,
              color: "rgba(20,20,20,0.78)",
            }}
          >
            One rule above all:{" "}
            <strong>
              never ship anything before we&apos;ve authorized it.
            </strong>{" "}
            Unauthorized shipments can&apos;t receive warranty service and risk
            being unreturnable.
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 20,
          }}
        >
          {CLAIM_STEPS.map((s) => (
            <div
              key={s.num}
              style={{
                background: "#FBF9F3",
                borderRadius: 16,
                padding: "26px 24px",
                boxShadow: "0 1px 2px rgba(20,20,20,0.05)",
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  color: "#C9661A",
                  marginBottom: 14,
                }}
              >
                {s.num}
              </div>
              <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8 }}>
                {s.title}
              </div>
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "rgba(20,20,20,0.7)",
                }}
              >
                {s.body}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 24px clamp(80px,10vw,128px)",
        }}
      >
        <div
          style={{
            background: "#EAE6DA",
            borderRadius: 24,
            padding: "clamp(40px,5vw,56px)",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: "0 auto 24px",
              fontSize: "clamp(24px,3vw,34px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            We Read Every Message
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                border: "1px solid rgba(20,20,20,0.15)",
                background: "#FBF9F3",
                borderRadius: 999,
                padding: "16px 30px",
                textDecoration: "none",
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: 15,
                  letterSpacing: "0.06em",
                  color: "#141414",
                }}
              >
                {SUPPORT_EMAIL}
              </span>
            </a>
            <Link href={localePath(locale, "/support")}>
              <button
                className="btn-outline-dark"
                style={{ padding: "16px 30px", fontSize: 13 }}
              >
                VISIT SUPPORT
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer dict={dict} locale={locale} />
      <CartDrawer />
    </>
  );
}
