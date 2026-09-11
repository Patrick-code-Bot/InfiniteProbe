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
import ImageSlot from "@/components/ImageSlot";
import StoreBadges from "@/components/StoreBadges";
import CartDrawer from "@/components/cart/CartDrawer";
import { IMAGES } from "@/data/images";
import specs from "@/data/specs.json";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = parseLocale(lang) ?? defaultLocale;

  const page = await getPage("how-it-works", locale);

  return {
    title: text(page?.seo?.metaTitle, "How It Works"),
    description: text(
      page?.seo?.metaDescription,
      "Inside InfiniteProbe, a thermoelectric core converts the heat of your cook into electricity — powering the sensor and the wireless link for as long as there's fire. Five steps, zero batteries.",
    ),
    alternates: {
      canonical: localePath(locale, "/how-it-works"),
      languages: languageAlternates("/how-it-works"),
    },
    openGraph: {
      title: "How InfiniteProbe Works — Powered by the Cook Itself",
      description: "Five steps, zero batteries. From fire to signal.",
      url: localePath(locale, "/how-it-works"),
    },
  };
}

const CHAIN_STEPS = [
  {
    num: "01",
    title: "Cooking Heat",
    body: "Your grill, smoker, oven, or open fire creates a temperature difference between the hot end of the probe and the cooler core of the meat.",
    bg: "#EAE6DA",
  },
  {
    num: "02",
    title: "Thermoelectric Conversion",
    body: "That temperature difference drives InfiniteProbe's thermoelectric generator, converting heat flow directly into electrical energy. No moving parts. Nothing to wear out.",
    bg: "#FBF9F3",
  },
  {
    num: "03",
    title: "Power Supply",
    body: "Power management circuitry conditions and stores the harvested energy, keeping the electronics running smoothly through the swings of a real cook.",
    bg: "#FBF9F3",
  },
  {
    num: "04",
    title: "Wireless Transmission",
    body: "A Bluetooth Low Energy 5.5 radio streams readings to your phone — continuously, for the entire cook.",
    bg: "#FBF9F3",
  },
  {
    num: "05",
    title: "Real-Time Monitoring",
    body: "The app turns the signal into a live readout: internal and ambient temperature, target, percent cooked, and an ETA you can plan dinner around.",
    bg: "#FBF9F3",
  },
];

const DOS = [
  "Insert into the thickest part, reaching the centre",
  "Cover the needle past the minimum insertion line",
  "Read the internal temperature, not the surface",
];

const DONTS = [
  "Touching bone",
  "Resting the tip in fat-only areas",
  "Shallow placement",
  "Letting the tip poke through the meat",
];

const BY_CUT = [
  { name: "STEAK", tip: "In from the side, to the centre." },
  { name: "CHICKEN BREAST", tip: "Thickest centre." },
  { name: "TURKEY", tip: "Thickest meat, away from bone." },
  { name: "BRISKET / ROAST", tip: "Deepest central portion." },
];

export default async function HowItWorksPage({
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
    getPage("how-it-works", locale, { draft: isDraft }),
  ]);

  // CMS content is additive — every field falls back to the copy below.
  const hero = firstHero(page);

  return (
    <>
      <Header dict={dict} />

      {/* 1 · Hero (dark band) */}
      <div style={{ background: "#161513", color: "#F2EFE6" }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "clamp(64px,9vw,120px) 24px clamp(56px,7vw,96px)",
            display: "flex",
            flexWrap: "wrap",
            gap: 56,
            alignItems: "center",
          }}
        >
          <div style={{ flex: "1 1 480px", minWidth: 300 }}>
            <div
              className="mono"
              style={{
                fontSize: 12,
                letterSpacing: "0.24em",
                color: "#C9661A",
                marginBottom: 28,
              }}
            >
              {text(hero?.eyebrow, "HOW IT WORKS")}
            </div>
            <h1
              style={{
                margin: "0 0 28px",
                fontSize: "clamp(40px,6.5vw,80px)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 0.98,
              }}
            >
              {text(hero?.heading, "Powered by the Cook Itself")}
            </h1>
            <p
              style={{
                margin: "0 0 40px",
                fontSize: "clamp(16px,1.4vw,18px)",
                lineHeight: 1.7,
                color: "rgba(242,239,230,0.75)",
                maxWidth: 560,
              }}
            >
              {text(
                hero?.subheading,
                "Every wireless thermometer before this one had the same weakness: a battery. InfiniteProbe removed it. Inside the probe, a thermoelectric core converts the heat of your cook into electricity — powering the sensor and the wireless link for as long as there's fire.",
              )}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              <Link href={localePath(locale, "/shop")}>
                <button
                  className="btn-cream"
                  style={{ padding: "17px 34px", fontSize: 14 }}
                >
                  SHOP NOW →
                </button>
              </Link>
              <Link href={localePath(locale, "/specs")}>
                <button
                  className="btn-outline-light"
                  style={{ padding: "16px 34px", fontSize: 14 }}
                >
                  SEE THE SPECS
                </button>
              </Link>
            </div>
          </div>
          <div style={{ flex: "1 1 380px", minWidth: 280, aspectRatio: "790/484" }}>
            <ImageSlot
              src={IMAGES.howItWorksHero}
              alt="Exploded cutaway render of the InfiniteProbe"
              label="EXPLODED / CUTAWAY PROBE RENDER · AWAITING ASSET"
              radius={20}
              fit="contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* 2 · The Energy Chain */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(72px,9vw,128px) 24px 0",
        }}
      >
        <SectionRule eyebrow="§ 01 · FROM FIRE TO SIGNAL" meta="05 STEPS" />
        <h2
          style={{
            margin: "0 0 48px",
            fontSize: "clamp(32px,4.5vw,52px)",
            fontWeight: 800,
            letterSpacing: "-0.028em",
            lineHeight: 1.02,
          }}
        >
          Five Steps, Zero Batteries
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 20,
          }}
        >
          {CHAIN_STEPS.map((s, i) => (
            <div
              key={s.num}
              style={{
                background: s.bg,
                borderRadius: 20,
                padding: "32px 28px",
                boxShadow: "0 1px 2px rgba(20,20,20,0.05)",
                animation: `chainGlow 6s ${i * 1.2}s infinite`,
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 13,
                  letterSpacing: "0.2em",
                  color: "#C9661A",
                  marginBottom: 20,
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 19,
                  letterSpacing: "-0.015em",
                  lineHeight: 1.2,
                  marginBottom: 12,
                }}
              >
                {s.title}
              </div>
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "rgba(20,20,20,0.72)",
                }}
              >
                {s.body}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 · The Principle */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(72px,9vw,128px) 24px 0",
        }}
      >
        <SectionRule eyebrow="§ 02 · THE SCIENCE, BRIEFLY" />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 56,
            alignItems: "center",
          }}
        >
          <div style={{ flex: "1 1 440px", minWidth: 300 }}>
            <h2
              style={{
                margin: "0 0 28px",
                fontSize: "clamp(30px,4vw,48px)",
                fontWeight: 800,
                letterSpacing: "-0.028em",
                lineHeight: 1.05,
              }}
            >
              Heat Wants to Move. We Put It to Work.
            </h2>
            <p
              style={{
                margin: "0 0 20px",
                fontSize: 16,
                lineHeight: 1.7,
                color: "rgba(20,20,20,0.78)",
              }}
            >
              Whenever one end of a thermoelectric material is hotter than the
              other, electrons flow — a physical effect known for nearly two
              centuries and trusted in applications from spacecraft to
              industrial sensors. InfiniteProbe brings it to the kitchen: the
              same heat gradient that cooks your meat generates the power that
              monitors it.
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.7,
                color: "rgba(20,20,20,0.78)",
              }}
            >
              The result is a probe with no charging port, no battery door, and
              no countdown clock. It cannot die mid-brisket, because the brisket
              is what&apos;s powering it.
            </p>
          </div>
          <div
            style={{
              flex: "1 1 380px",
              minWidth: 290,
              background: "#EAE6DA",
              borderRadius: 20,
              padding: "40px 32px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: "#C9661A",
                }}
              >
                HOT END · FIRE SIDE
              </span>
              <span
                className="mono"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: "rgba(20,20,20,0.5)",
                }}
              >
                COLD END · MEAT CORE
              </span>
            </div>
            <div
              style={{
                height: 56,
                borderRadius: 999,
                background:
                  "linear-gradient(90deg, #C9661A 0%, #DFA269 45%, #EAE0CB 100%)",
                position: "relative",
                marginBottom: 22,
              }}
            >
              <svg
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                }}
                viewBox="0 0 400 56"
                preserveAspectRatio="none"
              >
                <line
                  x1="30"
                  y1="28"
                  x2="370"
                  y2="28"
                  stroke="#141414"
                  strokeWidth="2"
                  strokeDasharray="4 8"
                  style={{ animation: "electronFlow 1.2s linear infinite" }}
                />
                <polygon points="370,22 382,28 370,34" fill="#141414" />
              </svg>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#C9661A",
                }}
              >
                ΔT
              </span>
              <span
                className="mono"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  color: "rgba(20,20,20,0.55)",
                }}
              >
                TEMPERATURE DIFFERENCE → ELECTRON FLOW → POWER
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 · Placement */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(72px,9vw,128px) 24px 0",
        }}
      >
        <SectionRule
          eyebrow="§ 03 · PLACEMENT IS PRECISION"
          meta="MANUAL FIG. 07"
        />
        <h2
          style={{
            margin: "0 0 16px",
            fontSize: "clamp(30px,4vw,48px)",
            fontWeight: 800,
            letterSpacing: "-0.028em",
            lineHeight: 1.05,
          }}
        >
          Accurate Readings Start with Placement
        </h2>
        <p
          style={{
            margin: "0 0 48px",
            fontSize: 17,
            lineHeight: 1.6,
            color: "rgba(20,20,20,0.75)",
            maxWidth: 560,
          }}
        >
          Bury the sensor in the dense center of the meat — and keep the tip
          safely inside.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              flex: "1 1 420px",
              minWidth: 300,
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
                FIG. 07
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
                SIDE INSERTION · CROSS-SECTION
              </span>
            </div>
            <svg
              viewBox="0 0 560 340"
              style={{ width: "100%", height: "auto", display: "block" }}
              aria-label="Probe insertion diagram: side insertion into meat cross-section"
            >
              <path
                d="M60 190 C55 120 130 72 235 68 C340 64 430 96 448 160 C464 220 400 282 285 290 C170 298 66 262 60 190 Z"
                fill="#EAE6DA"
                stroke="#141414"
                strokeWidth="2.5"
              />
              <path
                d="M105 188 C102 138 158 104 240 101 C322 98 390 121 403 166 C415 208 366 251 278 257 C190 263 109 238 105 188 Z"
                fill="none"
                stroke="#141414"
                strokeWidth="1"
                strokeDasharray="2 5"
                opacity="0.35"
              />
              <rect
                x="470"
                y="164"
                width="58"
                height="26"
                rx="13"
                fill="#141414"
              />
              <circle cx="499" cy="177" r="4" fill="#C9661A" />
              <rect
                x="253"
                y="172"
                width="220"
                height="10"
                rx="5"
                fill="#141414"
              />
              <circle cx="256" cy="177" r="7" fill="#C9661A" />
              <line
                x1="392"
                y1="120"
                x2="392"
                y2="238"
                stroke="#C9661A"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              <text
                x="392"
                y="110"
                textAnchor="middle"
                fontFamily="IBM Plex Mono, monospace"
                fontSize="11"
                letterSpacing="1.5"
                fill="#C9661A"
              >
                MINIMUM INSERTION LINE
              </text>
              <text
                x="392"
                y="256"
                textAnchor="middle"
                fontFamily="IBM Plex Mono, monospace"
                fontSize="10"
                letterSpacing="1.2"
                fill="rgba(20,20,20,0.5)"
              >
                COVER PAST THIS MARK
              </text>
              <line
                x1="256"
                y1="168"
                x2="210"
                y2="94"
                stroke="#141414"
                strokeWidth="1"
              />
              <circle cx="210" cy="94" r="2.5" fill="#141414" />
              <text
                x="14"
                y="66"
                fontFamily="IBM Plex Mono, monospace"
                fontSize="11"
                letterSpacing="1.2"
                fill="#141414"
              >
                SENSOR TIP · THICKEST CENTRE
              </text>
              <text
                x="14"
                y="84"
                fontFamily="IBM Plex Mono, monospace"
                fontSize="10"
                letterSpacing="1"
                fill="#C9661A"
              >
                TIP STAYS INSIDE
              </text>
              <line
                x1="150"
                y1="255"
                x2="120"
                y2="298"
                stroke="#141414"
                strokeWidth="1"
              />
              <circle cx="150" cy="255" r="2.5" fill="#141414" />
              <text
                x="116"
                y="314"
                fontFamily="IBM Plex Mono, monospace"
                fontSize="10"
                letterSpacing="1.2"
                fill="rgba(20,20,20,0.5)"
              >
                READ THE CORE, NOT THE SURFACE
              </text>
            </svg>
          </div>
          <div
            style={{
              flex: "1 1 380px",
              minWidth: 290,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div
              style={{
                background: "#FBF9F3",
                borderRadius: 20,
                padding: "30px 32px",
                boxShadow: "0 1px 2px rgba(20,20,20,0.05)",
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: "#C9661A",
                  marginBottom: 16,
                }}
              >
                BEST PRACTICE
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {DOS.map((d) => (
                  <div
                    key={d}
                    style={{
                      display: "flex",
                      gap: 12,
                      fontSize: 15,
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: "#C9661A", fontWeight: 800 }}>✓</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                background: "#FBF9F3",
                borderRadius: 20,
                padding: "30px 32px",
                boxShadow: "0 1px 2px rgba(20,20,20,0.05)",
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: "rgba(20,20,20,0.5)",
                  marginBottom: 16,
                }}
              >
                AVOID
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {DONTS.map((d) => (
                  <div
                    key={d}
                    style={{
                      display: "flex",
                      gap: 12,
                      fontSize: 15,
                      lineHeight: 1.5,
                      color: "rgba(20,20,20,0.7)",
                    }}
                  >
                    <span style={{ fontWeight: 800 }}>✕</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 16,
          }}
        >
          {BY_CUT.map((c) => (
            <div
              key={c.name}
              style={{
                border: "1px solid rgba(20,20,20,0.15)",
                borderRadius: 16,
                padding: "22px 24px",
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: "#C9661A",
                  marginBottom: 10,
                }}
              >
                {c.name}
              </div>
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: "rgba(20,20,20,0.75)",
                }}
              >
                {c.tip}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5 · Range & Signal */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(72px,9vw,128px) 24px 0",
        }}
      >
        <SectionRule eyebrow="§ 04 · STAYING CONNECTED" />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div style={{ flex: "1 1 460px", minWidth: 300 }}>
            <h2
              style={{
                margin: "0 0 24px",
                fontSize: "clamp(30px,4vw,48px)",
                fontWeight: 800,
                letterSpacing: "-0.028em",
                lineHeight: 1.05,
              }}
            >
              A Clear Line to Your Phone
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.7,
                color: "rgba(20,20,20,0.78)",
                maxWidth: 600,
              }}
            >
              InfiniteProbe streams over Bluetooth Low Energy 5.5. Keep your
              phone within the app&apos;s working range and avoid heavy
              obstacles — thick walls, metal enclosures, or closed metal lids
              can weaken any Bluetooth signal. If a probe ever drops its
              connection, the app&apos;s offline alert tells you immediately,
              and reconnects the moment the signal returns.
            </p>
          </div>
          <div
            style={{
              flex: "0 1 340px",
              minWidth: 270,
              border: "1px solid rgba(20,20,20,0.15)",
              background: "#FBF9F3",
              borderRadius: 20,
              padding: 32,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "clamp(34px,3.5vw,46px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#141414",
              }}
            >
              {specs.range.lineOfSight}
            </div>
            <div
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.18em",
                color: "rgba(20,20,20,0.5)",
                marginTop: 10,
              }}
            >
              LINE-OF-SIGHT RANGE
            </div>
          </div>
        </div>
      </div>

      {/* 6 · Pairing */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(72px,9vw,128px) 24px 0",
        }}
      >
        <SectionRule eyebrow="§ 05 · SET UP IN SECONDS" meta="IOS · ANDROID" />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 56,
            alignItems: "center",
          }}
        >
          <div style={{ flex: "1 1 440px", minWidth: 300 }}>
            <h2
              style={{
                margin: "0 0 24px",
                fontSize: "clamp(30px,4vw,48px)",
                fontWeight: 800,
                letterSpacing: "-0.028em",
                lineHeight: 1.05,
              }}
            >
              Wake. Tap. Cook.
            </h2>
            <p
              style={{
                margin: "0 0 36px",
                fontSize: 16,
                lineHeight: 1.7,
                color: "rgba(20,20,20,0.78)",
                maxWidth: 560,
              }}
            >
              InfiniteProbe pairs with the free companion app over Bluetooth Low
              Energy. Download it for iOS or Android — or scan the QR code on
              the package — then wake a probe and tap to pair. Your probes
              appear on the home screen with live status, ready to be named,
              assigned a cut, and put to work.
            </p>
            <div style={{ display: "flex", gap: 14 }}>
              <StoreBadges />
            </div>
          </div>
          <div
            style={{
              flex: "1 1 400px",
              minWidth: 280,
              display: "flex",
              gap: 20,
              justifyContent: "center",
            }}
          >
            <div style={{ width: "min(220px,42vw)", aspectRatio: "862/1658" }}>
              <ImageSlot
                src={IMAGES.uiWelcome}
                alt="InfiniteProbe app welcome screen — enable Bluetooth"
                label="UI01 — WELCOME / ENABLE BLUETOOTH"
                radius={24}
                fit="contain"
                sizes="220px"
              />
            </div>
            <div style={{ width: "min(220px,42vw)", aspectRatio: "862/1658" }}>
              <ImageSlot
                src={IMAGES.uiMyProbes}
                alt="InfiniteProbe app My Probes screen — pairing"
                label="UI04 — MY PROBES, PAIRING"
                radius={24}
                fit="contain"
                sizes="220px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 7 · Closing CTA */}
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
          No Battery. No Guessing.
          <br />
          No Limits.
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
          <Link href={localePath(locale, "/specs")}>
            <button
              className="btn-outline-dark"
              style={{ padding: "18px 40px", fontSize: 15 }}
            >
              FULL SPECIFICATIONS
            </button>
          </Link>
        </div>
      </div>

      <Footer dict={dict} locale={locale} />
      <CartDrawer />
    </>
  );
}
