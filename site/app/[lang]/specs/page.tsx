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
import { draftMode } from "next/headers";
import { getPage } from "@/sanity/queries";
import { firstHero, text } from "@/sanity/content";
import { notFound } from "next/navigation";
import SectionRule from "@/components/SectionRule";
import SpecTables from "@/components/SpecTables";
import CartDrawer from "@/components/cart/CartDrawer";
import { LINKS, hrefOrHash, isPlaceholder } from "@/lib/site";
import specs from "@/data/specs.json";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = parseLocale(lang) ?? defaultLocale;

  const page = await getPage("specs", locale);

  return {
    title: text(page?.seo?.metaTitle, "Specs"),
    description: text(
      page?.seo?.metaDescription,
      "Full specifications for InfiniteProbe One (model IP-X1) — the self-powered wireless meat thermometer. Temperature, power, wireless, physical, app compatibility, and warranty.",
    ),
    alternates: {
      canonical: localePath(locale, "/specs"),
      languages: languageAlternates("/specs"),
    },
    openGraph: {
      title: "InfiniteProbe One — Specifications",
      description:
        "Every number, earned. Full datasheet for the self-powered wireless meat thermometer.",
      url: localePath(locale, "/specs"),
    },
  };
}

const COMPARISON = [
  {
    label: "Power source",
    old: "Disposable or rechargeable battery",
    new: "Cooking heat itself",
  },
  {
    label: "Charging dependency",
    old: "Charge before every cook",
    new: "None — ever",
  },
  {
    label: "Wireless monitoring",
    old: "Limited by battery life",
    new: "Real-time, for the whole cook",
  },
  {
    label: "Freedom during cooking",
    old: "Tethered to charge cycles",
    new: "Precision without battery anxiety",
  },
];

/**
 * Pulls a single value out of data/specs.json so the probe diagram's callout
 * labels stay in sync with the spec tables instead of hardcoding a duplicate.
 */
function specRow(tableKey: string, label: string): string {
  const row = specs.tables
    .find((t) => t.key === tableKey)
    ?.rows.find((r) => r.label === label);
  return row?.value ?? "";
}

const DOWNLOADS = [
  { name: "User Manual — Full Edition", href: LINKS.userManualPdf, tbc: false },
  { name: "Quick Start Guide", href: LINKS.quickStartPdf, tbc: false },
];

export default async function SpecsPage({
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
    getPage("specs", locale, { draft: isDraft }),
  ]);

  // CMS content is additive — every field falls back to the copy below.
  const hero = firstHero(page);

  return (
    <>
      <Header dict={dict} />

      {/* 1 · Hero (cream, datasheet style) */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(56px,8vw,104px) 24px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 56,
            alignItems: "center",
          }}
        >
          <div style={{ flex: "1 1 460px", minWidth: 300 }}>
            <div
              className="mono"
              style={{
                fontSize: 12,
                letterSpacing: "0.24em",
                color: "#C9661A",
                marginBottom: 24,
              }}
            >
              {text(hero?.eyebrow, "SPECIFICATIONS")}
            </div>
            <h1
              style={{
                margin: "0 0 20px",
                fontSize: "clamp(42px,6.5vw,84px)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 0.98,
              }}
            >
              {text(hero?.heading, "InfiniteProbe One")}
            </h1>
            <p
              style={{
                margin: "0 0 36px",
                fontSize: 17,
                lineHeight: 1.65,
                color: "rgba(20,20,20,0.78)",
              }}
            >
              The self-powered wireless meat thermometer. Model{" "}
              <span className="mono" style={{ fontWeight: 600 }}>
                {specs.model}
              </span>
              .
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              <Link href={localePath(locale, "/shop")}>
                <button
                  className="btn-ink"
                  style={{ padding: "17px 34px", fontSize: 14 }}
                >
                  SHOP NOW →
                </button>
              </Link>
              <a
                href={hrefOrHash(LINKS.userManualPdf)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  className="btn-outline-dark"
                  style={{ padding: "16px 34px", fontSize: 14 }}
                >
                  DOWNLOAD USER MANUAL (PDF)
                </button>
              </a>
            </div>
          </div>
          <div
            style={{
              flex: "1 1 400px",
              minWidth: 280,
              background: "#FBF9F3",
              borderRadius: 20,
              boxShadow: "0 1px 2px rgba(20,20,20,0.05)",
              padding: "28px 28px 20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 8,
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  color: "#C9661A",
                }}
              >
                {specs.model}
              </span>
              <span
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(20,20,20,0.15)",
                }}
              />
              <span
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  color: "rgba(20,20,20,0.45)",
                }}
              >
                DIMENSIONS · MM
              </span>
            </div>
            <svg
              viewBox="0 0 560 340"
              style={{ width: "100%", height: "auto", display: "block" }}
              aria-label="Dimensioned probe datasheet drawing"
            >
              <rect
                x="60"
                y="160"
                width="330"
                height="14"
                rx="7"
                fill="none"
                stroke="#141414"
                strokeWidth="2.5"
              />
              <circle cx="66" cy="167" r="4" fill="#C9661A" />
              <rect
                x="390"
                y="148"
                width="110"
                height="38"
                rx="19"
                fill="#141414"
              />
              <circle cx="445" cy="167" r="5" fill="#C9661A" />
              <line
                x1="330"
                y1="146"
                x2="330"
                y2="188"
                stroke="#C9661A"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <text
                x="330"
                y="206"
                textAnchor="middle"
                fontFamily="IBM Plex Mono, monospace"
                fontSize="10"
                letterSpacing="1"
                fill="#C9661A"
              >
                MIN INSERTION {specRow("s4", "Minimum insertion depth").split("—")[0].trim()}
              </text>
              <line
                x1="60"
                y1="92"
                x2="208"
                y2="92"
                stroke="#141414"
                strokeWidth="1"
              />
              <line
                x1="352"
                y1="92"
                x2="500"
                y2="92"
                stroke="#141414"
                strokeWidth="1"
              />
              <line
                x1="60"
                y1="84"
                x2="60"
                y2="100"
                stroke="#141414"
                strokeWidth="1"
              />
              <line
                x1="500"
                y1="84"
                x2="500"
                y2="100"
                stroke="#141414"
                strokeWidth="1"
              />
              <rect
                x="212"
                y="76"
                width="136"
                height="30"
                rx="8"
                fill="rgba(201,102,26,0.06)"
                stroke="#C9661A"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
              <text
                x="280"
                y="96"
                textAnchor="middle"
                fontFamily="IBM Plex Mono, monospace"
                fontSize="12"
                letterSpacing="1"
                fill="#C9661A"
              >
                LENGTH {specRow("s4", "Probe length")}
              </text>
              <line
                x1="130"
                y1="174"
                x2="130"
                y2="252"
                stroke="#141414"
                strokeWidth="1"
              />
              <rect
                x="64"
                y="252"
                width="180"
                height="28"
                rx="8"
                fill="rgba(201,102,26,0.06)"
                stroke="#C9661A"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
              <text
                x="154"
                y="271"
                textAnchor="middle"
                fontFamily="IBM Plex Mono, monospace"
                fontSize="11"
                letterSpacing="1"
                fill="#C9661A"
              >
                NEEDLE Ø {specRow("s4", "Needle diameter")}
              </text>
              <line
                x1="445"
                y1="186"
                x2="445"
                y2="252"
                stroke="#141414"
                strokeWidth="1"
              />
              <rect
                x="356"
                y="252"
                width="160"
                height="28"
                rx="8"
                fill="rgba(201,102,26,0.06)"
                stroke="#C9661A"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
              <text
                x="436"
                y="271"
                textAnchor="middle"
                fontFamily="IBM Plex Mono, monospace"
                fontSize="11"
                letterSpacing="1"
                fill="#C9661A"
              >
                CAP Ø {specRow("s4", "Handle (cap) diameter")}
              </text>
              <text
                x="60"
                y="318"
                fontFamily="IBM Plex Mono, monospace"
                fontSize="10"
                letterSpacing="1.2"
                fill="rgba(20,20,20,0.5)"
              >
                BODY · STAINLESS STEEL 304 · WEIGHT {specRow("s4", "Weight")}
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* 2 · At a Glance — values from data/specs.json */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(56px,7vw,88px) 24px 0",
        }}
      >
        <SectionRule
          eyebrow="AT A GLANCE"
          meta="VALUES PENDING ENGINEERING"
          marginBottom={32}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 16,
          }}
        >
          {specs.glance.map((g) => (
            <div
              key={g.label}
              style={{
                borderRadius: 16,
                padding: "26px 20px",
                textAlign: "center",
                border: g.tbc
                  ? "1.5px dashed #C9661A"
                  : "1px solid rgba(20,20,20,0.15)",
                background: g.tbc ? "rgba(201,102,26,0.04)" : "#FBF9F3",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(24px,2.6vw,34px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: g.tbc ? "rgba(20,20,20,0.35)" : "#141414",
                }}
              >
                {g.value}
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  marginTop: 10,
                  lineHeight: 1.6,
                  color: g.tbc ? "#C9661A" : "rgba(20,20,20,0.5)",
                }}
              >
                {g.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 · Spec tables (collapsible) */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "clamp(56px,7vw,88px) 24px 0",
        }}
      >
        <SpecTables />
      </div>

      {/* 4 · Comparison anchor */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "clamp(64px,8vw,112px) 24px 0",
        }}
      >
        <SectionRule eyebrow="WHY IT'S DIFFERENT" />
        <h2
          style={{
            margin: "0 0 40px",
            fontSize: "clamp(28px,3.6vw,42px)",
            fontWeight: 800,
            letterSpacing: "-0.028em",
            lineHeight: 1.05,
          }}
        >
          The Last Thermometer Habit You&apos;ll Break Is Charging It
        </h2>
        <div
          style={{
            background: "#FBF9F3",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 1px 2px rgba(20,20,20,0.05)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(110px,1.1fr) 1fr 1fr",
              borderBottom: "2px solid #141414",
            }}
          >
            <div style={{ padding: "20px 24px" }} />
            <div
              className="mono"
              style={{
                padding: "20px 16px",
                fontSize: 11,
                letterSpacing: "0.14em",
                color: "rgba(20,20,20,0.5)",
              }}
            >
              TRADITIONAL THERMOMETERS
            </div>
            <div
              className="mono"
              style={{
                padding: "20px 16px",
                fontSize: 11,
                letterSpacing: "0.14em",
                color: "#C9661A",
                fontWeight: 600,
              }}
            >
              INFINITEPROBE
            </div>
          </div>
          {COMPARISON.map((row) => (
            <div
              key={row.label}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(110px,1.1fr) 1fr 1fr",
                borderBottom: "1px solid rgba(20,20,20,0.08)",
              }}
            >
              <div
                style={{ padding: "22px 24px", fontWeight: 700, fontSize: 14 }}
              >
                {row.label}
              </div>
              <div
                style={{
                  padding: "22px 16px",
                  fontSize: 14,
                  color: "rgba(20,20,20,0.6)",
                  lineHeight: 1.5,
                }}
              >
                {row.old}
              </div>
              <div
                style={{
                  padding: "22px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: 1.5,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <span style={{ color: "#C9661A", fontWeight: 800 }}>✓</span>
                <span>{row.new}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5 · Downloads */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "clamp(64px,8vw,112px) 24px 0",
        }}
      >
        <SectionRule eyebrow="DOCUMENTATION" marginBottom={32} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 16,
          }}
        >
          {DOWNLOADS.map((d) => (
            <a
              key={d.name}
              href={isPlaceholder(d.href) ? "#" : d.href}
              {...(isPlaceholder(d.href)
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
              className="card-hover-orange"
              style={{
                border: d.tbc
                  ? "1.5px dashed #C9661A"
                  : "1px solid rgba(20,20,20,0.15)",
                background: d.tbc ? "rgba(201,102,26,0.04)" : "#FBF9F3",
                borderRadius: 16,
                padding: "26px 28px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                cursor: "pointer",
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  border: "1px solid rgba(20,20,20,0.25)",
                  borderRadius: 6,
                  padding: "6px 9px",
                  color: "rgba(20,20,20,0.6)",
                }}
              >
                PDF
              </span>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 15,
                  color: d.tbc ? "rgba(20,20,20,0.45)" : "#141414",
                }}
              >
                {d.name}
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  color: "#C9661A",
                  fontWeight: 800,
                }}
              >
                ↓
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* 6 · Closing CTA */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(80px,10vw,140px) 24px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            margin: "0 0 40px",
            fontSize: "clamp(36px,5.5vw,68px)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
          }}
        >
          Every Number, Earned.
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
          }}
        >
          <Link href={localePath(locale, "/shop")}>
            <button
              className="btn-ink"
              style={{ padding: "19px 40px", fontSize: 15 }}
            >
              BUY INFINITEPROBE →
            </button>
          </Link>
          <Link href={localePath(locale, "/app")}>
            <button
              className="btn-outline-dark"
              style={{ padding: "18px 40px", fontSize: 15 }}
            >
              GET THE APP
            </button>
          </Link>
        </div>
      </div>

      <Footer dict={dict} locale={locale} />
      <CartDrawer />
    </>
  );
}
