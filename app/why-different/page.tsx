import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionRule from "@/components/SectionRule";
import CartDrawer from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: "Why Different",
  description:
    "InfiniteProbe removed the battery — and with it, every habit built around keeping one alive. See why a heat-powered thermometer changes everything about how you cook.",
  alternates: { canonical: "/why-different" },
  openGraph: {
    title: "Why InfiniteProbe Is Different",
    description: "Every wireless thermometer before this one traded convenience for a countdown clock. This one didn't.",
    url: "/why-different",
  },
};

const HABITS = [
  {
    old: "CHARGE BEFORE EVERY COOK",
    title: "No pre-cook ritual",
    body: "The probe is ready the moment the fire is. Pull it from the drawer and cook.",
  },
  {
    old: "CHECK THE BATTERY ICON",
    title: "No level anxiety",
    body: "There is no level to watch. If there's heat, there's power — for the whole cook.",
  },
  {
    old: "KEEP A CHARGING DOCK",
    title: "No dock on the counter",
    body: "Nothing to plug in, nothing to lose, nothing taking up an outlet.",
  },
  {
    old: "CUT THE COOK SHORT",
    title: "No countdown clock",
    body: "Twelve-hour brisket, overnight pork shoulder — the probe outlasts them all.",
  },
];

const COMPARISON = [
  { label: "Power source", old: "Disposable or rechargeable battery", new: "Cooking heat itself" },
  { label: "Charging dependency", old: "Charge before every cook", new: "None — ever" },
  { label: "Wireless monitoring", old: "Limited by battery life", new: "Real-time, for the whole cook" },
  { label: "Freedom during cooking", old: "Tethered to charge cycles", new: "Precision without battery anxiety" },
];

export default function WhyDifferentPage() {
  return (
    <>
      <Header />

      {/* 1 · Hero (dark band, text-only) */}
      <div style={{ background: "#161513", color: "#F2EFE6" }}>
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "clamp(64px,9vw,120px) 24px clamp(56px,7vw,96px)",
            textAlign: "center",
          }}
        >
          <div
            className="mono"
            style={{ fontSize: 12, letterSpacing: "0.24em", color: "#C9661A", marginBottom: 28 }}
          >
            WHY IT&apos;S DIFFERENT
          </div>
          <h1
            style={{
              margin: "0 auto 28px",
              fontSize: "clamp(36px,6vw,64px)",
              fontWeight: 800,
              letterSpacing: "-0.032em",
              lineHeight: 1.05,
              maxWidth: 820,
            }}
          >
            The Last Thermometer Habit You&apos;ll Break Is Charging It
          </h1>
          <p
            style={{
              margin: "0 auto 40px",
              fontSize: "clamp(16px,1.4vw,18px)",
              lineHeight: 1.65,
              color: "rgba(242,239,230,0.75)",
              maxWidth: 620,
            }}
          >
            Every wireless thermometer before this one traded convenience for a countdown clock.
            InfiniteProbe removed the battery — and with it, every habit built around keeping one
            alive.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
            <Link href="/shop">
              <button className="btn-cream" style={{ padding: "17px 34px", fontSize: 14 }}>
                SHOP NOW →
              </button>
            </Link>
            <Link href="/how-it-works">
              <button className="btn-outline-light" style={{ padding: "16px 34px", fontSize: 14 }}>
                SEE HOW IT WORKS
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2 · The Habits */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(72px,9vw,128px) 24px 0" }}>
        <SectionRule eyebrow="§ 01 · THE HABITS" />
        <h2
          style={{
            margin: "0 0 48px",
            fontSize: "clamp(32px,4.5vw,52px)",
            fontWeight: 800,
            letterSpacing: "-0.028em",
            lineHeight: 1.02,
            maxWidth: 760,
          }}
        >
          Everything You Do for a Battery, You Stop Doing
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
          {HABITS.map((h) => (
            <div
              key={h.title}
              style={{
                background: "#FBF9F3",
                borderRadius: 20,
                padding: "36px 32px",
                boxShadow: "0 1px 2px rgba(20,20,20,0.05)",
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  color: "rgba(20,20,20,0.4)",
                  textDecoration: "line-through",
                  marginBottom: 18,
                }}
              >
                {h.old}
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 20,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  marginBottom: 12,
                }}
              >
                {h.title}
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(20,20,20,0.72)" }}>{h.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 · Comparison table */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "clamp(72px,9vw,128px) 24px 0" }}>
        <SectionRule eyebrow="§ 02 · SIDE BY SIDE" />
        <h2
          style={{
            margin: "0 0 48px",
            fontSize: "clamp(30px,4vw,48px)",
            fontWeight: 800,
            letterSpacing: "-0.028em",
            lineHeight: 1.05,
          }}
        >
          Traditional vs. InfiniteProbe
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
              style={{ padding: "20px 16px", fontSize: 11, letterSpacing: "0.14em", color: "rgba(20,20,20,0.5)" }}
            >
              TRADITIONAL THERMOMETERS
            </div>
            <div
              className="mono"
              style={{ padding: "20px 16px", fontSize: 11, letterSpacing: "0.14em", color: "#C9661A", fontWeight: 600 }}
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
              <div style={{ padding: "22px 24px", fontWeight: 700, fontSize: 14 }}>{row.label}</div>
              <div style={{ padding: "22px 16px", fontSize: 14, color: "rgba(20,20,20,0.6)", lineHeight: 1.5 }}>
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

      {/* 4 · The Physics Advantage */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(72px,9vw,128px) 24px 0" }}>
        <SectionRule eyebrow="§ 03 · THE PHYSICS ADVANTAGE" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 56, alignItems: "center" }}>
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
              The Hotter the Fire, the More Alive It Gets
            </h2>
            <p style={{ margin: "0 0 20px", fontSize: 16, lineHeight: 1.7, color: "rgba(20,20,20,0.78)" }}>
              A battery is at its weakest exactly when a cook is at its longest. Thermoelectric
              power inverts that relationship: the twelve-hour brisket that would drain a battery
              is precisely what keeps InfiniteProbe running. There is no worst-case cook — the
              worst case is its power source.
            </p>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "rgba(20,20,20,0.78)" }}>
              No moving parts. Nothing to wear out. Nothing to remember.
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
              className="mono"
              style={{ fontSize: 11, letterSpacing: "0.2em", color: "#C9661A", marginBottom: 24 }}
            >
              COOK LENGTH → POWER
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span className="mono" style={{ fontSize: 11, letterSpacing: "0.16em", color: "rgba(20,20,20,0.55)" }}>
                    BATTERY
                  </span>
                  <span style={{ color: "rgba(20,20,20,0.4)", fontWeight: 800 }}>↓</span>
                </div>
                <div
                  style={{
                    height: 20,
                    borderRadius: 999,
                    background: "linear-gradient(90deg, rgba(20,20,20,0.55) 0%, rgba(20,20,20,0.05) 100%)",
                  }}
                />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span className="mono" style={{ fontSize: 11, letterSpacing: "0.16em", color: "#C9661A" }}>
                    INFINITE
                  </span>
                  <span style={{ color: "#C9661A", fontWeight: 800 }}>∞</span>
                </div>
                <div style={{ height: 20, borderRadius: 999, background: "#C9661A" }} />
              </div>
            </div>
            <div
              className="mono"
              style={{ fontSize: 10, letterSpacing: "0.12em", color: "rgba(20,20,20,0.5)", marginTop: 24, lineHeight: 1.7 }}
            >
              A BATTERY FADES OVER A LONG COOK. HEAT-POWERED MEANS POWERED FOR AS LONG AS THE COOK
              LASTS.
            </div>
          </div>
        </div>
      </div>

      {/* 5 · Category statement (dark band) */}
      <div
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
            padding: "clamp(96px,12vw,180px) 24px",
            textAlign: "center",
          }}
        >
          <div
            className="mono"
            style={{ fontSize: 12, letterSpacing: "0.24em", color: "#C9661A", marginBottom: 28 }}
          >
            § 04 · A NEW CATEGORY
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
            InfiniteProbe is more than a thermometer. It&apos;s a new approach to cooking
            intelligence — heat-powered innovation, wireless precision, and premium design in one
            elegant instrument.
          </p>
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
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
          <Link href="/shop">
            <button className="btn-ink" style={{ padding: "19px 44px", fontSize: 15 }}>
              BUY INFINITEPROBE →
            </button>
          </Link>
          <Link href="/specs">
            <button className="btn-outline-dark" style={{ padding: "18px 44px", fontSize: 15 }}>
              FULL SPECIFICATIONS
            </button>
          </Link>
        </div>
      </div>

      <Footer />
      <CartDrawer />
    </>
  );
}
