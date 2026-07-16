import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/Logo";
import { LINKS, hrefOrHash } from "@/lib/site";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "SUPPORT",
    links: [
      { label: "Getting Started", href: "/support#getting-started" },
      { label: "User Manual (PDF)", href: hrefOrHash(LINKS.userManualPdf) },
      { label: "FAQ", href: "/support#faq" },
      { label: "Contact Us", href: "/support#contact" },
      { label: "App for iOS", href: "/app" },
      { label: "App for Android", href: "/app" },
    ],
  },
  {
    title: "CONNECT",
    links: [
      { label: "Instagram", href: hrefOrHash(LINKS.instagram) },
      { label: "YouTube", href: hrefOrHash(LINKS.youtube) },
      { label: "Facebook", href: hrefOrHash(LINKS.facebook) },
      { label: "X", href: hrefOrHash(LINKS.x) },
    ],
  },
  {
    title: "POLICIES",
    links: [
      { label: "Shipping", href: hrefOrHash(LINKS.shippingPolicy) },
      { label: "Warranty", href: hrefOrHash(LINKS.warrantyPolicy) },
      { label: "Privacy Policy", href: hrefOrHash(LINKS.privacyPolicy) },
      { label: "Terms of Service", href: hrefOrHash(LINKS.termsOfService) },
    ],
  },
];

export default function Footer() {
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
          <LogoMark width={56} height={28} style={{ marginBottom: 16, display: "block" }} />
          <div style={{ marginBottom: 10 }}>
            <Wordmark />
          </div>
          <div
            className="mono"
            style={{ fontSize: 10, letterSpacing: "0.24em", color: "rgba(20,20,20,0.5)" }}
          >
            INFINITE POWER · PERFECT MEAT
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              className="mono"
              style={{ fontSize: 11, letterSpacing: "0.22em", color: "#C9661A", marginBottom: 6 }}
            >
              {col.title}
            </div>
            {col.links.map((link) => (
              <Link key={link.label} href={link.href} style={{ fontSize: 14 }}>
                {link.label}
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
            style={{ fontSize: 12, letterSpacing: "0.22em", color: "rgba(20,20,20,0.55)" }}
          >
            WWW.INFINITEPROBE.COM
          </span>
        </div>
      </div>
    </footer>
  );
}
