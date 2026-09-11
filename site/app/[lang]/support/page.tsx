import type { Metadata } from "next";
import { draftMode } from "next/headers";
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
import SectionRule from "@/components/SectionRule";
import ImageSlot from "@/components/ImageSlot";
import StoreBadges from "@/components/StoreBadges";
import FaqAccordion from "@/components/FaqAccordion";
import CartDrawer from "@/components/cart/CartDrawer";
import { IMAGES } from "@/data/images";
import { LINKS, SUPPORT_EMAIL, hrefOrHash } from "@/lib/site";
import { getPage } from "@/sanity/queries";
import { firstHero, text } from "@/sanity/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = parseLocale(lang) ?? defaultLocale;

  const page = await getPage("support", locale);

  return {
    title: text(page?.seo?.metaTitle, "Support"),
    description: text(
      page?.seo?.metaDescription,
      "InfiniteProbe support — getting started, documentation, FAQ, and contact. Everything you need to get from unboxing to first cook."
    ),
    alternates: {
      canonical: localePath(locale, "/support"),
      languages: languageAlternates("/support"),
    },
    openGraph: {
      title: "InfiniteProbe Support — How Can We Help?",
      description:
        "Getting started, documentation, and answers — from unboxing to first cook.",
      url: localePath(locale, "/support"),
    },
  };
}

const STEPS = [
  {
    num: "01",
    title: "Download the app",
    body: "Free for iOS and Android — or scan the QR code on the package. No account required.",
  },
  {
    num: "02",
    title: "Enable Bluetooth",
    body: "The app walks you through it on first launch. Probes connect over Bluetooth Low Energy; nothing leaves your device.",
  },
  {
    num: "03",
    title: "Wake the probe and tap to pair",
    body: "Wake a probe, tap the pairing card, and it appears on your home screen — ready to be named, assigned a cut, and put to work.",
  },
];

const FAQS = [
  {
    q: "What happens before the probe is hot enough to power itself?",
    a: "Before use, simply pick up the probe and tap the minimum insertion line to wake it up and connect it to the mobile app via Bluetooth. Once the probe is placed in an oven or touches a heat source, the internal thermoelectric core immediately converts the temperature difference into electricity, continuously powering the sensor and Bluetooth throughout the entire cook.",
  },
  {
    q: "Is the probe dishwasher safe?",
    a: "Yes, the probe is made of food-grade 304 stainless steel and features an IP68 water resistance rating, meaning it can be washed directly in the dishwasher.",
  },
  {
    q: "How many probes can I run at once?",
    a: "If you connect directly via the mobile app, the system allows you to pair as many probes as your table demands and view the status of all your probes simultaneously on a single screen. If you use the optional official Wi-Fi Display, that accessory can manage up to 4 probes at the same time.",
  },
  {
    q: "What's the wireless range?",
    a: "The probe utilizes Bluetooth 5.5 (BLE 5.5) for direct connection, with a maximum transmission range of up to 23 meters. If paired with the Wi-Fi Display, you can achieve seamless remote monitoring over your network.",
  },
  {
    q: "Does the app work without an internet connection?",
    a: "Yes. The app requires no account registration, and the probe pairs locally with your phone via Bluetooth Low Energy (BLE). The connection is entirely local — nothing leaves your device — so an internet connection is completely unnecessary for normal use.",
  },
  {
    q: "What temperatures can the probe survive?",
    a: "The probe is designed specifically for environments like open fires, grills, and ovens. Its specific operating range allows it to withstand temperatures up to 250 °C.",
  },
];

export default async function SupportPage({
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
    getPage("support", locale, { draft: isDraft }),
  ]);

  // CMS content is additive: every field falls back to the copy below, so this
  // page renders identically whether or not Sanity is configured or populated.
  const hero = firstHero(page);

  return (
    <>
      <Header dict={dict} />

      {/* Hero */}
      <div
        style={{
          maxWidth: 1280,
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
          {text(hero?.eyebrow, "SUPPORT")}
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
          {text(hero?.heading, "How Can We Help?")}
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 17,
            lineHeight: 1.65,
            color: "rgba(20,20,20,0.75)",
            maxWidth: 560,
          }}
        >
          {text(
            hero?.subheading,
            "Getting started, documentation, and answers — everything you need to get from unboxing to first cook."
          )}
        </p>
      </div>

      {/* Getting Started */}
      <div
        id="getting-started"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(64px,8vw,104px) 24px 0",
        }}
      >
        <SectionRule eyebrow="§ 01 · GETTING STARTED" meta="03 STEPS" />
        <h2
          style={{
            margin: "0 0 48px",
            fontSize: "clamp(30px,4vw,48px)",
            fontWeight: 800,
            letterSpacing: "-0.028em",
            lineHeight: 1.05,
          }}
        >
          From Box to First Cook in Minutes
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(32px,5vw,64px)",
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: "1 1 420px",
              minWidth: 300,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {STEPS.map((s) => (
              <div
                key={s.num}
                style={{
                  background: "#FBF9F3",
                  borderRadius: 20,
                  padding: "30px 32px",
                  boxShadow: "0 1px 2px rgba(20,20,20,0.05)",
                  display: "flex",
                  gap: 24,
                  alignItems: "flex-start",
                }}
              >
                <div
                  className="mono"
                  style={{
                    fontSize: 13,
                    letterSpacing: "0.2em",
                    color: "#C9661A",
                    paddingTop: 3,
                  }}
                >
                  {s.num}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 19,
                      letterSpacing: "-0.015em",
                      marginBottom: 8,
                    }}
                  >
                    {s.title}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      lineHeight: 1.6,
                      color: "rgba(20,20,20,0.72)",
                    }}
                  >
                    {s.body}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
              <StoreBadges />
            </div>
          </div>
          <div
            style={{
              flex: "0 1 300px",
              minWidth: 260,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "min(280px,74vw)",
                aspectRatio: "862/1658",
                background: "#161513",
                borderRadius: 32,
                overflow: "hidden",
              }}
            >
              <ImageSlot
                src={IMAGES.uiWelcome}
                alt="InfiniteProbe app welcome screen — enable Bluetooth"
                label="WELCOME / ENABLE BLUETOOTH"
                radius={32}
                fit="contain"
                sizes="280px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Documentation */}
      <div
        id="manual"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(64px,8vw,104px) 24px 0",
        }}
      >
        <SectionRule eyebrow="§ 02 · DOCUMENTATION" marginBottom={32} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 20,
          }}
        >
          <a
            href={hrefOrHash(LINKS.userManualPdf)}
            target="_blank"
            rel="noopener noreferrer"
            className="card-hover-orange"
            style={{
              background: "#FBF9F3",
              border: "1px solid rgba(20,20,20,0.12)",
              borderRadius: 20,
              padding: "34px 32px",
              cursor: "pointer",
              display: "block",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 20,
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
              <span style={{ color: "#C9661A", fontWeight: 800, fontSize: 18 }}>
                ↓
              </span>
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 20,
                letterSpacing: "-0.015em",
                marginBottom: 8,
              }}
            >
              User Manual — Full Edition
            </div>
            <div
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: "rgba(20,20,20,0.65)",
              }}
            >
              Complete guide: pairing, probe placement, range and signal,
              cooking library, care and cleaning.
            </div>
          </a>
          <a
            href={hrefOrHash(LINKS.quickStartPdf)}
            target="_blank"
            rel="noopener noreferrer"
            className="card-hover-orange"
            style={{
              background: "#FBF9F3",
              border: "1px solid rgba(20,20,20,0.12)",
              borderRadius: 20,
              padding: "34px 32px",
              cursor: "pointer",
              display: "block",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 20,
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
              <span style={{ color: "#C9661A", fontWeight: 800, fontSize: 18 }}>
                ↓
              </span>
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 20,
                letterSpacing: "-0.015em",
                marginBottom: 8,
              }}
            >
              Quick Start Guide
            </div>
            <div
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: "rgba(20,20,20,0.65)",
              }}
            >
              The three steps above, on one printable page — the same guide that
              ships in the box.
            </div>
          </a>
        </div>
      </div>

      {/* FAQ */}
      <div
        id="faq"
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "clamp(64px,8vw,104px) 24px 0",
        }}
      >
        <SectionRule
          eyebrow="§ 03 · FAQ"
          meta="[DRAFT — CONFIRM ANSWERS]"
          metaColor="#C9661A"
        />
        <h2
          style={{
            margin: "0 0 40px",
            fontSize: "clamp(30px,4vw,48px)",
            fontWeight: 800,
            letterSpacing: "-0.028em",
            lineHeight: 1.05,
          }}
        >
          Asked Before You Ask
        </h2>
        <FaqAccordion items={FAQS} />
      </div>

      {/* Contact */}
      <div
        id="contact"
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "clamp(64px,8vw,104px) 24px clamp(80px,10vw,128px)",
        }}
      >
        <div
          style={{
            background: "#EAE6DA",
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
            § 04 · STILL STUCK?
          </div>
          <h2
            style={{
              margin: "0 auto 16px",
              fontSize: "clamp(26px,3.4vw,40px)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
            }}
          >
            Talk to a Human
          </h2>
          <p
            style={{
              margin: "0 auto 32px",
              fontSize: 16,
              lineHeight: 1.65,
              color: "rgba(20,20,20,0.7)",
              maxWidth: 480,
            }}
          >
            Write to us and we&apos;ll get back within one business day.
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              border: "1.5px dashed #C9661A",
              background: "rgba(201,102,26,0.04)",
              borderRadius: 999,
              padding: "16px 30px",
            }}
          >
            <span
              className="mono"
              style={{
                fontSize: 15,
                letterSpacing: "0.06em",
                color: "rgba(20,20,20,0.45)",
              }}
            >
              {SUPPORT_EMAIL}
            </span>
            <span
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.16em",
                color: "#C9661A",
              }}
            >
              CONFIRM ADDRESS
            </span>
          </div>
        </div>
      </div>

      <Footer dict={dict} locale={locale} />
      <CartDrawer />
    </>
  );
}
