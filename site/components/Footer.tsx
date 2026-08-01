import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/Logo";
import { LINKS, hrefOrHash } from "@/lib/site";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";

type FooterLink = { key: keyof Dictionary["footer"]; href: string };

/**
 * Hrefs are locale-free; localePath() adds the prefix at render time and leaves
 * external URLs and unresolved [bracketed] placeholders (which hrefOrHash turns
 * into "#") untouched.
 */
const COLUMNS: { key: keyof Dictionary["footer"]; links: FooterLink[] }[] = [
  {
    key: "support",
    links: [
      { key: "gettingStarted", href: "/support#getting-started" },
      { key: "userManual", href: hrefOrHash(LINKS.userManualPdf) },
      { key: "faq", href: "/support#faq" },
      { key: "contactUs", href: "/support#contact" },
      { key: "appIos", href: "/app" },
      { key: "appAndroid", href: "/app" },
    ],
  },
  {
    key: "follow",
    links: [
      { key: "instagram", href: hrefOrHash(LINKS.instagram) },
      { key: "youtube", href: hrefOrHash(LINKS.youtube) },
      { key: "facebook", href: hrefOrHash(LINKS.facebook) },
      { key: "x", href: hrefOrHash(LINKS.x) },
    ],
  },
  {
    key: "legal",
    links: [
      { key: "shipping", href: hrefOrHash(LINKS.shippingPolicy) },
      { key: "warranty", href: hrefOrHash(LINKS.warrantyPolicy) },
      { key: "privacyPolicy", href: hrefOrHash(LINKS.privacyPolicy) },
      { key: "termsOfService", href: hrefOrHash(LINKS.termsOfService) },
    ],
  },
];

export default function Footer({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <footer style={{ borderTop: "2px solid #141414" }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "64px 24px 0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 40,
        }}
      >
        <div>
          <LogoMark
            width={56}
            height={28}
            style={{ marginBottom: 16, display: "block" }}
          />
          <div style={{ marginBottom: 10 }}>
            <Wordmark />
          </div>
          <div
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.24em",
              color: "rgba(20,20,20,0.5)",
            }}
          >
            INFINITE POWER · PERFECT MEAT
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div
            key={col.key}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <div
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.22em",
                color: "#C9661A",
                marginBottom: 6,
              }}
            >
              {dict.footer[col.key]}
            </div>
            {col.links.map((link) => (
              <Link
                key={link.key}
                href={localePath(locale, link.href)}
                style={{ fontSize: 14 }}
              >
                {dict.footer[link.key]}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1280, margin: "48px auto 0", padding: "0 24px" }}>
        <div
          className="mono"
          style={{
            borderTop: "1px solid rgba(20,20,20,0.12)",
            padding: "20px 0",
            textAlign: "center",
            fontSize: 10,
            letterSpacing: "0.2em",
            color: "rgba(20,20,20,0.5)",
          }}
        >
          INFINITEPROBE.COM · POWERED BY HEAT. ENGINEERED FOR PRECISION.
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(20,20,20,0.12)",
            padding: "22px 0 36px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            className="mono"
            style={{ fontSize: 12, letterSpacing: "0.28em", fontWeight: 600 }}
          >
            LEIZIG INSIDE
          </span>
          <span
            className="mono"
            style={{
              fontSize: 12,
              letterSpacing: "0.22em",
              color: "rgba(20,20,20,0.55)",
            }}
          >
            WWW.INFINITEPROBE.COM
          </span>
        </div>
      </div>
    </footer>
  );
}
