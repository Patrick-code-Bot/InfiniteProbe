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
import { notFound } from "next/navigation";
import ImageSlot from "@/components/ImageSlot";
import StoreBadges from "@/components/StoreBadges";
import CartDrawer from "@/components/cart/CartDrawer";
import { IMAGES } from "@/data/images";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = parseLocale(lang) ?? defaultLocale;

  return {
    title: "App",
    description:
      "The free InfiniteProbe app for iOS and Android — every probe, every temperature, every alert, live on your phone for the entire cook. No account required, nothing leaves your device.",
    alternates: {
      canonical: localePath(locale, "/app"),
      languages: languageAlternates("/app"),
    },
    openGraph: {
      title: "The InfiniteProbe App — The Whole Cook, On One Screen",
      description:
        "Free for iOS and Android. Live readout, 26+ cut library, multi-probe, and alerts that find you.",
      url: localePath(locale, "/app"),
    },
  };
}

const SCREENS = [
  {
    dir: "row" as const,
    eyebrow: "§ 01 · LIVE READOUT",
    meta: "REAL-TIME MONITORING",
    title: "The only number that matters, front and center.",
    body: "Current temperature and target, side by side — with percent cooked, degrees to go, and a live ETA. Ambient tracking watches the pit as well as the meat, so you can hold your cooker in the recommended range.",
    points: [
      "Oversized current → target readout with progress bar",
      "Live ambient temperature with recommended cook range",
      "Internal + ambient chart, record mode, and cook history",
      "Per-cook alert and vibrate toggles right on the screen",
    ],
    src: IMAGES.uiLiveCook,
    alt: "Live cook screen with ambient tracking",
  },
  {
    dir: "row-reverse" as const,
    eyebrow: "§ 02 · COOKING LIBRARY",
    meta: "26 CUTS · TAP TEMP TO EDIT",
    title: "A library of 26+ cuts.",
    body: "Beef, pork, poultry, and more — each with an editable reference target and a recommended ambient range for the cooker. Tap to adjust any temperature, or add your own custom cuts.",
    points: [
      "Reference targets for every cut, from rare steak to brisket",
      "Recommended oven / pit range per cut — e.g. brisket at 110–120 °C",
      "Tap any temperature to edit it in place",
      "Add custom cuts with your own targets",
    ],
    src: IMAGES.uiLibrary,
    alt: "Cooking Library screen",
  },
  {
    dir: "row" as const,
    eyebrow: "§ 03 · MULTI-PROBE",
    meta: "EVERY PROBE, ONE SCREEN",
    title: "Run the whole table at once.",
    body: "The brisket, the pork shoulder, and the salmon — together on one home screen, each with live temperature, target, and status. Pair as many probes as your table demands.",
    points: [
      "Live status for every paired probe at a glance",
      "Tap-to-pair a new probe in seconds",
      "Signal strength and probe state per device",
    ],
    src: IMAGES.uiMyProbes,
    alt: "My Probes home screen",
  },
  {
    dir: "row-reverse" as const,
    eyebrow: "§ 04 · ALERTS & SETTINGS",
    meta: "PER PROBE",
    title: "Alerts that find you.",
    body: "Sound and vibration the moment your meat hits target — plus an offline alert if a probe ever drops its connection. Configure each one, per probe.",
    points: [
      "Target-reached and offline alerts, individually configurable",
      "Distinct alert sounds per probe — tap to preview",
      "°C / °F and language settings, serial and firmware info",
    ],
    src: IMAGES.uiSettings,
    alt: "Settings and alerts screen",
  },
  {
    dir: "row" as const,
    eyebrow: "§ 05 · SET UP IN SECONDS",
    meta: "WAKE · TAP · COOK",
    title: "Paired before the grill is hot.",
    body: "Enable Bluetooth, wake a probe, and tap to pair. Your probes appear on the home screen with live status, ready to be named, assigned a cut, and put to work.",
    points: [
      "Bluetooth Low Energy pairing — no account required",
      "Probes connect locally; nothing leaves your device",
      "Name each probe and assign it a cut",
    ],
    src: IMAGES.uiWelcome,
    alt: "Welcome screen — enable Bluetooth",
  },
];

export default async function AppPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = parseLocale(lang);
  if (!locale) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <Header dict={dict} />

      {/* Hero (dark band) */}
      <div
        style={{ background: "#161513", color: "#F2EFE6", overflow: "hidden" }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "clamp(64px,9vw,120px) 24px 0",
            display: "flex",
            flexWrap: "wrap",
            gap: 56,
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              flex: "1 1 460px",
              minWidth: 300,
              paddingBottom: "clamp(56px,7vw,96px)",
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
              THE INFINITEPROBE APP · IOS + ANDROID · FREE
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
              The Whole Cook, On One Screen
            </h1>
            <p
              style={{
                margin: "0 0 40px",
                fontSize: "clamp(16px,1.4vw,18px)",
                lineHeight: 1.7,
                color: "rgba(242,239,230,0.75)",
                maxWidth: 520,
              }}
            >
              Every probe, every temperature, every alert — live on your phone
              for the entire cook. Download it free, pair in seconds, and never
              open the lid to check again.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              <StoreBadges variant="light" padding="14px 24px" fontSize={12} />
            </div>
          </div>
          <div
            style={{
              flex: "1 1 340px",
              minWidth: 280,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "min(340px,80vw)",
                aspectRatio: "862/1658",
                marginBottom: -1,
              }}
            >
              <ImageSlot
                src={IMAGES.uiLiveCook}
                alt="InfiniteProbe app live cook screen"
                label="LIVE COOK SCREEN"
                radius={28}
                fit="contain"
                sizes="340px"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Capabilities strip */}
      <div style={{ borderBottom: "1px solid rgba(20,20,20,0.12)" }}>
        <div
          className="mono"
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "22px 24px",
            display: "flex",
            flexWrap: "wrap",
            gap: "12px 32px",
            justifyContent: "center",
            fontSize: 12,
            letterSpacing: "0.18em",
            color: "rgba(20,20,20,0.7)",
          }}
        >
          <span>INTERNAL + AMBIENT</span>
          <span style={{ color: "#C9661A" }}>·</span>
          <span>°C OR °F</span>
          <span style={{ color: "#C9661A" }}>·</span>
          <span>MULTI-LANGUAGE</span>
          <span style={{ color: "#C9661A" }}>·</span>
          <span>BLUETOOTH 5.0</span>
          <span style={{ color: "#C9661A" }}>·</span>
          <span>NOTHING LEAVES YOUR DEVICE</span>
        </div>
      </div>

      {/* Screen sections */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {SCREENS.map((s) => (
          <div
            key={s.eyebrow}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "clamp(32px,5vw,72px)",
              alignItems: "center",
              padding: "clamp(56px,7vw,96px) 0",
              borderBottom: "1px solid rgba(20,20,20,0.1)",
              flexDirection: s.dir,
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
                  width: "min(300px,78vw)",
                  aspectRatio: "862/1658",
                  background: "#161513",
                  borderRadius: 32,
                  overflow: "hidden",
                }}
              >
                <ImageSlot
                  src={s.src}
                  alt={s.alt}
                  label={s.alt.toUpperCase()}
                  radius={32}
                  fit="contain"
                  sizes="300px"
                />
              </div>
            </div>
            <div style={{ flex: "1 1 380px", minWidth: 290 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.22em",
                    color: "#C9661A",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.eyebrow}
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
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    color: "rgba(20,20,20,0.4)",
                  }}
                >
                  {s.meta}
                </span>
              </div>
              <h2
                style={{
                  margin: "0 0 18px",
                  fontSize: "clamp(28px,3.6vw,42px)",
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                }}
              >
                {s.title}
              </h2>
              <p
                style={{
                  margin: "0 0 24px",
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "rgba(20,20,20,0.78)",
                  maxWidth: 520,
                }}
              >
                {s.body}
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {s.points.map((pt) => (
                  <div
                    key={pt}
                    style={{
                      display: "flex",
                      gap: 12,
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: "rgba(20,20,20,0.75)",
                      maxWidth: 520,
                    }}
                  >
                    <span style={{ color: "#C9661A", fontWeight: 800 }}>✓</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Closing CTA */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(80px,10vw,140px) 24px",
          textAlign: "center",
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
          FREE DOWNLOAD · NO ACCOUNT REQUIRED
        </div>
        <h2
          style={{
            margin: "0 0 40px",
            fontSize: "clamp(34px,5vw,64px)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
          }}
        >
          Get the App,
          <br />
          Then Get the Probe.
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
            marginBottom: 28,
          }}
        >
          <StoreBadges padding="14px 26px" fontSize={12} />
        </div>
        <Link href={localePath(locale, "/shop")}>
          <button
            className="btn-ink"
            style={{ padding: "19px 40px", fontSize: 15 }}
          >
            BUY INFINITEPROBE →
          </button>
        </Link>
      </div>

      <Footer dict={dict} locale={locale} />
      <CartDrawer />
    </>
  );
}
