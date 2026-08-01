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
import NewsletterForm from "@/components/NewsletterForm";
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

  const page = await getPage("home", locale);

  return {
    title: text(
      page?.seo?.metaTitle,
      "InfiniteProbe — Infinite Power for Perfect Meat",
    ),
    description: text(
      page?.seo?.metaDescription,
      "The self-powered wireless meat thermometer. InfiniteProbe converts cooking heat into electricity — real-time wireless monitoring with no batteries, no charging, no guessing.",
    ),
    alternates: {
      canonical: localePath(locale, "/"),
      languages: languageAlternates("/"),
    },
    openGraph: {
      title: "InfiniteProbe — Infinite Power for Perfect Meat",
      description:
        "The self-powered wireless meat thermometer. No batteries. No charging. No guessing.",
      url: localePath(locale, "/"),
    },
  };
}

const PILLARS = [
  {
    num: "01",
    title: "Self-Powered Innovation",
    body: "Every other wireless thermometer dies when its battery does. InfiniteProbe harvests the heat of your cook and turns it into electricity — the hotter it gets, the more alive it becomes.",
  },
  {
    num: "02",
    title: "Wireless, Real-Time Monitoring",
    body: "Close the lid and walk away. Internal and ambient temperature, target, progress, and ETA stream live to your phone for the entire cook.",
  },
  {
    num: "03",
    title: "Precision from the Core",
    body: "The sensor reads where it matters: the dense center of the meat. Degree-level accuracy, from rare steak to twelve-hour brisket.",
  },
];

const CHAIN = [
  { num: "01", label: "COOKING HEAT", arrow: true },
  { num: "02", label: "THERMOELECTRIC CONVERSION", arrow: true },
  { num: "03", label: "POWER SUPPLY", arrow: true },
  { num: "04", label: "WIRELESS TRANSMISSION", arrow: true },
  { num: "05", label: "REAL-TIME MONITORING", arrow: false },
];

const USE_CASES = [
  "GRILL",
  "SMOKER",
  "OVEN",
  "OPEN FIRE",
  "STEAK",
  "TURKEY",
  "BRISKET",
];

const APP_BLOCKS = [
  {
    dir: "row" as const,
    tag: "LIVE READOUT",
    title: "Live readout.",
    body: "Current temperature and target, side by side — with percent cooked, degrees to go, and a live ETA. Ambient tracking watches the pit as well as the meat, with a recommended range for your cook.",
    src: IMAGES.uiLiveCook,
    alt: "InfiniteProbe app live cook screen",
  },
  {
    dir: "row-reverse" as const,
    tag: "COOKING LIBRARY · UI05",
    title: "A library of 26+ cuts.",
    body: "Beef, pork, poultry, and more — each with an editable reference target and a recommended ambient range for the cooker. Tap to adjust any temperature, or add your own custom cuts.",
    src: IMAGES.uiLibrary,
    alt: "InfiniteProbe app cooking library",
  },
  {
    dir: "row" as const,
    tag: "MULTI-PROBE",
    title: "Every probe, one screen.",
    body: "Run the brisket, the pork shoulder, and the salmon at once. Pair as many probes as your table demands; the home screen shows them all, live — with ambient at a glance.",
    src: IMAGES.uiMyProbes,
    alt: "InfiniteProbe app My Probes home screen",
  },
  {
    dir: "row-reverse" as const,
    tag: "ALERTS · UI03",
    title: "Alerts that find you.",
    body: "Sound and vibration the moment your meat hits target — plus an offline alert if a probe ever drops its connection. Configure each one, per probe.",
    src: IMAGES.uiSettings,
    alt: "InfiniteProbe app settings and alerts screen",
  },
];

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

export default async function HomePage({
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
    getPage("home", locale, { draft: isDraft }),
  ]);

  // CMS content is additive — every field falls back to the copy below.
  const hero = firstHero(page);

  return (
    <>
      {/* 0 · Announcement bar */}
      <div
        className="mono"
        style={{
          background: "#161513",
          color: "#F2EFE6",
          textAlign: "center",
          padding: "10px 16px",
          fontSize: 11,
          letterSpacing: "0.2em",
        }}
      >
        <span style={{ fontWeight: 600 }}>FREE SHIPPING ON ALL ORDERS</span>
        <span style={{ color: "rgba(242,239,230,0.55)" }}>
          {" "}
          · LAUNCH OFFER — INFINITEPROBE ONE NOW AVAILABLE
        </span>
      </div>

      <Header dict={dict} />

      {/* 1 · Hero (dark band 1/3) */}
      <div
        id="top"
        style={{
          background: "#161513",
          color: "#F2EFE6",
          position: "relative",
          overflow: "hidden",
        }}
      >
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
              {text(
                hero?.eyebrow,
                "THE SELF-POWERED WIRELESS MEAT THERMOMETER",
              )}
            </div>
            <h1
              style={{
                margin: "0 0 28px",
                fontSize: "clamp(44px,7vw,88px)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 0.98,
              }}
            >
              {text(hero?.heading, "Infinite Power for Perfect Meat")}
            </h1>
            <p
              style={{
                margin: "0 0 40px",
                fontSize: "clamp(16px,1.4vw,18px)",
                lineHeight: 1.65,
                color: "rgba(242,239,230,0.75)",
                maxWidth: 520,
              }}
            >
              {text(
                hero?.subheading,
                "InfiniteProbe converts cooking heat into electricity — powering real-time wireless monitoring of your meat's internal temperature. No batteries. No charging. No guessing.",
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
              <a href="#how">
                <button
                  className="btn-outline-light"
                  style={{ padding: "16px 34px", fontSize: 14 }}
                >
                  SEE HOW IT WORKS
                </button>
              </a>
            </div>
          </div>
          <div
            style={{
              flex: "1 1 380px",
              minWidth: 280,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 440,
                aspectRatio: "4/3",
                position: "relative",
              }}
            >
              <div style={{ position: "absolute", inset: 0 }}>
                <ImageSlot
                  src={IMAGES.heroProbe}
                  alt="InfiniteProbe One — titanium probe hero shot"
                  label="PROBE HERO SHOT · AWAITING PHOTOGRAPHY"
                  radius={20}
                  priority
                />
              </div>
              <div
                className="mono"
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: -18,
                  transform: "translateX(-50%)",
                  background: "#141414",
                  border: "1px solid rgba(242,239,230,0.18)",
                  color: "#F2EFE6",
                  borderRadius: 999,
                  padding: "12px 22px",
                  fontSize: "clamp(9px, 2.6vw, 12px)",
                  letterSpacing: "0.1em",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  whiteSpace: "nowrap",
                  maxWidth: "94vw",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#C9661A",
                    animation: "livePulse 1.6s infinite",
                  }}
                />
                INTERNAL{" "}
                <span style={{ color: "#C9661A", fontWeight: 600 }}>54.2°</span>{" "}
                · AMBIENT 116° · TARGET 58.0 · LIVE
              </div>
            </div>
          </div>
        </div>
        {/* Hero stat strip */}
        <div style={{ borderTop: "1px solid rgba(242,239,230,0.14)" }}>
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "0 24px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            }}
          >
            <div
              style={{
                padding: "28px 24px 28px 0",
                borderRight: "1px solid rgba(242,239,230,0.14)",
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  letterSpacing: "-0.01em",
                  marginBottom: 6,
                }}
              >
                Self-Powered
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(242,239,230,0.6)",
                  lineHeight: 1.5,
                }}
              >
                Runs on cooking heat itself. Never charge it.
              </div>
            </div>
            <div
              style={{
                padding: "28px 24px",
                borderRight: "1px solid rgba(242,239,230,0.14)",
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  letterSpacing: "-0.01em",
                  marginBottom: 6,
                }}
              >
                Truly Wireless
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(242,239,230,0.6)",
                  lineHeight: 1.5,
                }}
              >
                Live temperature on your phone, over Bluetooth LE.
              </div>
            </div>
            <div style={{ padding: "28px 0 28px 24px" }}>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  letterSpacing: "-0.01em",
                  marginBottom: 6,
                }}
              >
                Stainless Steel 304 Body
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(242,239,230,0.6)",
                  lineHeight: 1.5,
                }}
              >
                Food-grade metal, built for the fire.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2 · Three Pillars */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(72px,9vw,128px) 24px 0",
        }}
      >
        <SectionRule
          eyebrow="§ 01 · POWERED BY HEAT, NOT BY HASSLE"
          meta="03"
        />
        <h2
          style={{
            margin: "0 0 48px",
            fontSize: "clamp(32px,4.5vw,52px)",
            fontWeight: 800,
            letterSpacing: "-0.028em",
            lineHeight: 1.02,
            maxWidth: 720,
          }}
        >
          Powered by Heat, Not by Hassle
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 24,
          }}
        >
          {PILLARS.map((p) => (
            <div
              key={p.num}
              style={{
                background: "#FBF9F3",
                borderRadius: 20,
                padding: "40px 36px",
                boxShadow: "0 1px 2px rgba(20,20,20,0.05)",
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 13,
                  letterSpacing: "0.2em",
                  color: "#C9661A",
                  marginBottom: 22,
                }}
              >
                {p.num}
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 22,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                  marginBottom: 14,
                }}
              >
                {p.title}
              </div>
              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: "rgba(20,20,20,0.72)",
                }}
              >
                {p.body}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 · How It Works */}
      <div
        id="how"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(72px,9vw,128px) 24px 0",
        }}
      >
        <SectionRule eyebrow="§ 02 · HOW INFINITEPROBE WORKS" meta="05 STEPS" />
        <h2
          style={{
            margin: "0 0 40px",
            fontSize: "clamp(32px,4.5vw,52px)",
            fontWeight: 800,
            letterSpacing: "-0.028em",
            lineHeight: 1.02,
          }}
        >
          From Fire to Signal
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "stretch",
            gap: 12,
            marginBottom: 40,
          }}
        >
          {CHAIN.map((step) => (
            <div
              key={step.num}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flex: "1 1 auto",
              }}
            >
              <div
                style={{
                  background: "#EAE6DA",
                  borderRadius: 14,
                  padding: "18px 20px",
                  flex: 1,
                  minWidth: 150,
                }}
              >
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    color: "rgba(20,20,20,0.45)",
                    marginBottom: 8,
                  }}
                >
                  {step.num}
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.14em",
                    fontWeight: 600,
                  }}
                >
                  {step.label}
                </div>
              </div>
              {step.arrow && (
                <span
                  className="mono"
                  style={{ color: "#C9661A", fontSize: 16 }}
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 40,
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 16,
              lineHeight: 1.7,
              color: "rgba(20,20,20,0.78)",
              maxWidth: 680,
            }}
          >
            The moment InfiniteProbe meets heat, its thermoelectric core begins
            converting the temperature difference into electrical energy. That
            energy powers the sensor and the Bluetooth link — so the probe
            monitors your cook for as long as the cook lasts. No charging dock.
            No dead battery at the worst possible moment. Just heat, turned into
            insight.
          </p>
          <Link href={localePath(locale, "/how-it-works")}>
            <button
              className="btn-outline-dark"
              style={{
                padding: "15px 30px",
                fontSize: 13,
                whiteSpace: "nowrap",
              }}
            >
              LEARN THE TECHNOLOGY →
            </button>
          </Link>
        </div>
      </div>

      {/* 4 · Built for Serious Cooking */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(72px,9vw,128px) 24px 0",
        }}
      >
        <SectionRule eyebrow="§ 03 · BUILT FOR SERIOUS COOKING" />
        <h2
          style={{
            margin: "0 0 32px",
            fontSize: "clamp(32px,4.5vw,52px)",
            fontWeight: 800,
            letterSpacing: "-0.028em",
            lineHeight: 1.02,
          }}
        >
          Wherever There&apos;s Fire
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 36,
          }}
        >
          {USE_CASES.map((u) => (
            <span
              key={u}
              className="mono"
              style={{
                border: "1.5px solid #141414",
                borderRadius: 999,
                padding: "12px 24px",
                fontSize: 13,
                letterSpacing: "0.16em",
              }}
            >
              {u}
            </span>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 40,
            alignItems: "flex-start",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 16,
              lineHeight: 1.7,
              color: "rgba(20,20,20,0.78)",
              maxWidth: 640,
            }}
          >
            From a Tuesday-night steak to a competition brisket, InfiniteProbe
            keeps you in control of the only number that decides the outcome —
            core temperature. Sear it, smoke it, roast it, or cook it over open
            flame: if there&apos;s heat, the probe is powered and reporting.
          </p>
          <div
            style={{ flex: "1 1 320px", minWidth: 280, aspectRatio: "16/9" }}
          >
            <ImageSlot
              src={IMAGES.lifestyleGrill}
              alt="Grilling over open fire with InfiniteProbe"
              label="LIFESTYLE PHOTO · GRILL / OPEN FIRE · AWAITING PHOTOGRAPHY"
              radius={20}
            />
          </div>
        </div>
      </div>

      {/* 5 · App Showcase (dark band 2/3) */}
      <div
        id="app"
        style={{
          background: "#161513",
          color: "#F2EFE6",
          marginTop: "clamp(72px,9vw,128px)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "clamp(72px,9vw,120px) 24px",
          }}
        >
          <SectionRule
            eyebrow="§ 04 · YOUR COOK, LIVE"
            meta="IOS · ANDROID"
            dark
          />
          <h2
            style={{
              margin: "0 0 64px",
              fontSize: "clamp(32px,4.5vw,52px)",
              fontWeight: 800,
              letterSpacing: "-0.028em",
              lineHeight: 1.02,
              maxWidth: 640,
            }}
          >
            The Whole Cook, On One Screen
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(56px,7vw,96px)",
            }}
          >
            {APP_BLOCKS.map((b) => (
              <div
                key={b.tag}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 48,
                  alignItems: "center",
                  flexDirection: b.dir,
                }}
              >
                <div
                  style={{
                    flex: "1 1 300px",
                    minWidth: 270,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "min(300px,80vw)",
                      aspectRatio: "862/1658",
                    }}
                  >
                    <ImageSlot
                      src={b.src}
                      alt={b.alt}
                      label={b.tag}
                      radius={28}
                      fit="contain"
                      sizes="(max-width: 768px) 80vw, 300px"
                    />
                  </div>
                </div>
                <div style={{ flex: "1 1 340px", minWidth: 280 }}>
                  <div
                    className="mono"
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.2em",
                      color: "#C9661A",
                      marginBottom: 16,
                    }}
                  >
                    {b.tag}
                  </div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "clamp(24px,2.6vw,32px)",
                      letterSpacing: "-0.022em",
                      lineHeight: 1.1,
                      marginBottom: 16,
                    }}
                  >
                    {b.title}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      lineHeight: 1.7,
                      color: "rgba(242,239,230,0.7)",
                      maxWidth: 460,
                    }}
                  >
                    {b.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 72,
              borderTop: "1px solid rgba(242,239,230,0.14)",
              paddingTop: 32,
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 12,
                letterSpacing: "0.18em",
                color: "rgba(242,239,230,0.65)",
              }}
            >
              °C OR °F · MULTI-LANGUAGE · BLUETOOTH 5.0 · NOTHING LEAVES YOUR
              DEVICE
            </div>
            <div style={{ display: "flex", gap: 14 }}>
              <StoreBadges variant="light" />
            </div>
          </div>
        </div>
      </div>

      {/* 6 · Why It's Different */}
      <div
        id="different"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(72px,9vw,128px) 24px 0",
        }}
      >
        <SectionRule eyebrow="§ 05 · WHY IT'S DIFFERENT" />
        <h2
          style={{
            margin: "0 0 48px",
            fontSize: "clamp(30px,4vw,48px)",
            fontWeight: 800,
            letterSpacing: "-0.028em",
            lineHeight: 1.05,
            maxWidth: 820,
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
              gridTemplateColumns: "minmax(120px,1.1fr) 1fr 1fr",
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
                gridTemplateColumns: "minmax(120px,1.1fr) 1fr 1fr",
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

      {/* 7 · Social Proof (placeholder) */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(72px,9vw,128px) 24px 0",
        }}
      >
        <SectionRule eyebrow="EARLY REVIEWS" meta="AWAITING QUOTES" />
        <h2
          style={{
            margin: "0 0 40px",
            fontSize: "clamp(30px,4vw,48px)",
            fontWeight: 800,
            letterSpacing: "-0.028em",
            lineHeight: 1.05,
          }}
        >
          Cooks Who Refuse to Guess
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 20,
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                border: "1.5px dashed #C9661A",
                background: "rgba(201,102,26,0.04)",
                borderRadius: 20,
                padding: 32,
              }}
            >
              <div
                style={{
                  color: "#C9661A",
                  fontSize: 16,
                  letterSpacing: "0.2em",
                  marginBottom: 16,
                }}
              >
                ★★★★★
              </div>
              <div
                style={{
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: "rgba(20,20,20,0.4)",
                  fontStyle: "italic",
                  marginBottom: 20,
                }}
              >
                &quot;Quote from early tester or press outlet.&quot;
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  color: "#C9661A",
                }}
              >
                NAME · TITLE / PUBLICATION
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8 · Key Specs Teaser — values come from data/specs.json */}
      <div
        id="specs"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(72px,9vw,128px) 24px 0",
        }}
      >
        <SectionRule
          eyebrow="§ 06 · ENGINEERED FOR PRECISION"
          marginBottom={40}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 20,
            marginBottom: 40,
          }}
        >
          {specs.homeTeaser.map((s) => (
            <div
              key={s.label}
              style={{
                borderRadius: 16,
                padding: "28px 24px",
                textAlign: "center",
                border: s.tbc
                  ? "1.5px dashed #C9661A"
                  : "1px solid rgba(20,20,20,0.15)",
                background: s.tbc ? "rgba(201,102,26,0.04)" : "#FBF9F3",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(28px,3vw,40px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: s.tbc ? "rgba(20,20,20,0.35)" : "#141414",
                }}
              >
                {s.value}
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  marginTop: 10,
                  color: s.tbc ? "#C9661A" : "rgba(20,20,20,0.5)",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link href={localePath(locale, "/specs")}>
            <button
              className="btn-outline-dark"
              style={{ padding: "15px 30px", fontSize: 13 }}
            >
              FULL SPECIFICATIONS →
            </button>
          </Link>
        </div>
      </div>

      {/* 9 · Category Statement (dark band 3/3) */}
      <div
        style={{
          background: "#161513",
          color: "#F2EFE6",
          marginTop: "clamp(72px,9vw,128px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {IMAGES.categorySteak && (
          <div style={{ position: "absolute", inset: 0, opacity: 0.45 }}>
            <ImageSlot
              src={IMAGES.categorySteak}
              alt="Seared steak cross-section in a dark kitchen"
              label=""
              radius={0}
              sizes="100vw"
            />
          </div>
        )}
        <div
          style={{
            position: "relative",
            maxWidth: 1280,
            margin: "0 auto",
            padding: "clamp(96px,12vw,180px) 24px",
            textAlign: "center",
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 12,
              letterSpacing: "0.24em",
              color: "#C9661A",
              marginBottom: 28,
            }}
          >
            § 07 · A NEW CATEGORY
          </div>
          <h2
            style={{
              margin: "0 auto 28px",
              fontSize: "clamp(36px,5.5vw,68px)",
              fontWeight: 800,
              letterSpacing: "-0.032em",
              lineHeight: 1,
              maxWidth: 820,
            }}
          >
            A New Category in Smart Cooking
          </h2>
          <p
            style={{
              margin: "0 auto",
              fontSize: "clamp(16px,1.5vw,19px)",
              lineHeight: 1.7,
              color: "rgba(242,239,230,0.75)",
              maxWidth: 620,
            }}
          >
            InfiniteProbe is more than a thermometer. It&apos;s a new approach
            to cooking intelligence — heat-powered innovation, wireless
            precision, and premium design in one elegant instrument.
          </p>
        </div>
      </div>

      {/* 10 · Guarantee (placeholder) */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(72px,9vw,128px) 24px 0",
        }}
      >
        <div
          style={{
            border: "1.5px dashed #C9661A",
            background: "rgba(201,102,26,0.04)",
            borderRadius: 24,
            padding: "clamp(40px,5vw,64px)",
            textAlign: "center",
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 12,
              letterSpacing: "0.22em",
              color: "#C9661A",
              marginBottom: 20,
            }}
          >
            OUR PROMISE · TERMS AWAITING CONFIRMATION
          </div>
          <h2
            style={{
              margin: "0 auto 20px",
              fontSize: "clamp(28px,3.8vw,44px)",
              fontWeight: 800,
              letterSpacing: "-0.028em",
              lineHeight: 1.05,
              maxWidth: 680,
            }}
          >
            Guaranteed to Outlast Your Longest Cook
          </h2>
          <p
            style={{
              margin: "0 auto",
              fontSize: 16,
              lineHeight: 1.7,
              color: "rgba(20,20,20,0.55)",
              maxWidth: 600,
            }}
          >
            Every InfiniteProbe One is backed by a{" "}
            <span
              className="mono"
              style={{ color: "#C9661A", fontWeight: 600 }}
            >
              {specs.warranty.years}-year warranty
            </span>{" "}
            and a{" "}
            <span
              className="mono"
              style={{ color: "#C9661A", fontWeight: 600 }}
            >
              {specs.warranty.returnDays}-day money-back guarantee
            </span>
            . If it doesn&apos;t change the way you cook, send it back.
          </p>
        </div>
      </div>

      {/* 11 · Final CTA + newsletter */}
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
            fontSize: "clamp(40px,6vw,76px)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1,
          }}
        >
          Cook Smarter.
          <br />
          Cook Freer.
        </h2>
        <Link href={localePath(locale, "/shop")}>
          <button
            className="btn-ink"
            style={{ padding: "19px 44px", fontSize: 15 }}
          >
            BUY INFINITEPROBE →
          </button>
        </Link>
        <div
          style={{
            margin: "72px auto 0",
            maxWidth: 520,
            borderTop: "1px solid rgba(20,20,20,0.15)",
            paddingTop: 40,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>
            Stay in touch.
          </div>
          <div
            style={{
              fontSize: 14,
              color: "rgba(20,20,20,0.6)",
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            Recipes, firmware updates, and new-product news — no spam, ever.
          </div>
          <NewsletterForm />
        </div>
      </div>

      <Footer dict={dict} locale={locale} />
      <CartDrawer />
    </>
  );
}
