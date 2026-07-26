import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionRule from "@/components/SectionRule";
import FaqAccordion from "@/components/FaqAccordion";
import CartDrawer from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "InfiniteProbe shipping — processing times, domestic and international rates, tracking, and what to do if a shipment goes wrong.",
  alternates: { canonical: "/shipping-policy" },
  openGraph: {
    title: "InfiniteProbe Shipping Policy",
    description: "From our door to your fire — how our shipping works.",
    url: "/shipping-policy",
  },
};

const GLANCE = [
  { value: "FREE", label: "SHIPPING ON ALL DOMESTIC ORDERS", tbc: false },
  { value: "[X–X] days", label: "ORDER PROCESSING · TBC", tbc: true },
  { value: "Tracked", label: "EVERY SHIPMENT, EVERY DESTINATION", tbc: false },
  { value: "DDP", label: "DUTIES PREPAID AT CHECKOUT · INTERNATIONAL", tbc: false },
];

const RATES = [
  { method: "Standard", cost: "FREE", transit: "[X–X] BUSINESS DAYS" },
  { method: "Expedited", cost: "[$XX — TBC]", transit: "[X–X] BUSINESS DAYS" },
  { method: "Priority / Overnight", cost: "[$XX — TBC]", transit: "[X–X] BUSINESS DAYS" },
];

const COUNTRIES = ["USA + TERRITORIES", "CANADA", "UK", "EU / EEA", "SWITZERLAND", "AUSTRALIA", "NEW ZEALAND"];

const TRACKING_STEPS = [
  { num: "01", title: "Order confirmed", body: "You'll get a confirmation email the moment your order is placed." },
  { num: "02", title: "Shipment notification", body: "A tracking link arrives by email as soon as your order ships." },
  { num: "03", title: "Track anywhere", body: "Follow your package from our door to yours. First scan may take up to 24 hours to appear." },
];

const FAQS = [
  {
    q: "My tracking hasn't moved in days.",
    a: "Carriers sometimes miss scans in transit — this doesn't always mean something is wrong. If tracking hasn't updated after [X] business days domestic / [XX] days international, contact us and we'll look into it.",
  },
  {
    q: "My order arrived damaged.",
    a: "Email us within [XX] days of delivery with photos of the damage and packaging, and we'll arrange a replacement or refund.",
  },
  {
    q: "My package says delivered, but it's not here.",
    a: "Check with neighbors and any safe-drop location first. If it's still missing after [X] days, contact us — we may need a police report or carrier claim reference to proceed.",
  },
  {
    q: "My order was lost in transit.",
    a: "Once the carrier confirms a shipment as lost, we'll replace it or refund you in full.",
  },
];

export default function ShippingPolicyPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "clamp(64px,9vw,112px) 24px 0" }}>
        <div
          className="mono"
          style={{ fontSize: 12, letterSpacing: "0.24em", color: "#C9661A", marginBottom: 24 }}
        >
          SHIPPING POLICY
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
          From Our Door to Your Fire.
        </h1>
        <p style={{ margin: "0 0 40px", fontSize: 16.5, lineHeight: 1.7, color: "rgba(20,20,20,0.78)", maxWidth: 680 }}>
          Every InfiniteProbe ships from IPT with tracking, careful packaging, and no surprise
          fees at the door. Here is exactly how our shipping works — processing times, rates,
          international duties, and what to do if anything goes sideways in transit.
        </p>
        <div
          className="mono"
          style={{
            display: "inline-block",
            border: "1.5px dashed #C9661A",
            background: "rgba(201,102,26,0.04)",
            borderRadius: 999,
            padding: "10px 20px",
            fontSize: 11,
            letterSpacing: "0.16em",
            color: "#C9661A",
            marginBottom: 56,
          }}
        >
          LAST UPDATED — <span style={{ fontWeight: 600 }}>[MONTH DD, YYYY — SET AT PUBLICATION]</span>
        </div>

        {/* At a glance */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 20, marginBottom: 56 }}>
          {GLANCE.map((g) => (
            <div
              key={g.label}
              style={{
                borderRadius: 16,
                padding: "24px 20px",
                textAlign: "center",
                border: g.tbc ? "1.5px dashed #C9661A" : "1px solid rgba(20,20,20,0.15)",
                background: g.tbc ? "rgba(201,102,26,0.04)" : "#FBF9F3",
              }}
            >
              <div style={{ fontSize: "clamp(22px,2.4vw,30px)", fontWeight: 800, letterSpacing: "-0.02em", color: g.tbc ? "rgba(20,20,20,0.35)" : "#141414" }}>
                {g.value}
              </div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", marginTop: 8, color: g.tbc ? "#C9661A" : "rgba(20,20,20,0.5)" }}>
                {g.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px" }}>
        {/* § 01 */}
        <div style={{ padding: "clamp(40px,5vw,64px) 0", borderTop: "1px solid rgba(20,20,20,0.1)" }}>
          <SectionRule eyebrow="§ 01 · ORDER FULFILLMENT & PROCESSING" />
          <p style={{ margin: "0 0 16px", fontSize: 15.5, lineHeight: 1.7, color: "rgba(20,20,20,0.75)" }}>
            Orders are processed within <span style={{ color: "#C9661A", fontWeight: 600 }}>[X–X] business days</span>{" "}
            before shipping. Orders placed on weekends or holidays roll into the next business day.
            During peak season, processing may take up to{" "}
            <span style={{ color: "#C9661A", fontWeight: 600 }}>[X]</span> additional days.
          </p>
          <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.7, color: "rgba(20,20,20,0.75)" }}>
            Same-day processing cutoff is{" "}
            <span style={{ color: "#C9661A", fontWeight: 600 }}>[HH:MM TIMEZONE — TBC]</span>. Once
            an order enters fulfillment, we can no longer modify it (see § 05).
          </p>
        </div>

        {/* § 02 */}
        <div style={{ padding: "clamp(40px,5vw,64px) 0", borderTop: "1px solid rgba(20,20,20,0.1)" }}>
          <SectionRule eyebrow="§ 02 · DOMESTIC RATES & DELIVERY ESTIMATES" />
          <p style={{ margin: "0 0 24px", fontSize: 15.5, lineHeight: 1.7, color: "rgba(20,20,20,0.75)" }}>
            Standard shipping is free on every domestic order. Expedited options are calculated at
            checkout.
          </p>
          <div style={{ overflowX: "auto", marginBottom: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #141414" }}>
                  {["METHOD", "COST", "EST. TRANSIT"].map((h) => (
                    <th
                      key={h}
                      className="mono"
                      style={{ textAlign: "left", padding: "14px 16px", fontSize: 11, letterSpacing: "0.14em", color: "rgba(20,20,20,0.5)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RATES.map((r) => (
                  <tr key={r.method} style={{ borderBottom: "1px solid rgba(20,20,20,0.08)" }}>
                    <td style={{ padding: "16px", fontWeight: 700, fontSize: 14 }}>{r.method}</td>
                    <td style={{ padding: "16px", fontSize: 14, color: r.cost === "FREE" ? "#141414" : "#C9661A" }}>{r.cost}</td>
                    <td style={{ padding: "16px", fontSize: 14, color: "#C9661A" }}>{r.transit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "rgba(20,20,20,0.55)" }}>
            Estimates, not guarantees. Alaska, Hawaii, and US territories may add [X–X] additional
            days.
          </p>
        </div>

        {/* § 03 */}
        <div style={{ padding: "clamp(40px,5vw,64px) 0", borderTop: "1px solid rgba(20,20,20,0.1)" }}>
          <SectionRule eyebrow="§ 03 · INTERNATIONAL SHIPPING, DUTIES & CUSTOMS" />
          <p style={{ margin: "0 0 20px", fontSize: 15.5, lineHeight: 1.7, color: "rgba(20,20,20,0.75)" }}>
            We currently ship to the destinations below. Don&apos;t see your country? Contact us —
            we can often arrange it.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
            {COUNTRIES.map((c) => (
              <span
                key={c}
                className="mono"
                style={{ border: "1.5px solid #141414", borderRadius: 999, padding: "10px 18px", fontSize: 12, letterSpacing: "0.12em" }}
              >
                {c}
              </span>
            ))}
          </div>
          <div style={{ background: "#EAE6DA", borderRadius: 16, padding: "24px 28px", marginBottom: 16 }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", color: "#C9661A", marginBottom: 10 }}>
              NO SURPRISES AT THE DOOR — DDP
            </div>
            <div style={{ fontSize: 14.5, lineHeight: 1.65, color: "rgba(20,20,20,0.75)" }}>
              International orders ship Delivered Duties Paid: taxes and duties are collected at
              checkout, so there&apos;s nothing to pay the courier when your package arrives.
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "rgba(20,20,20,0.55)" }}>
            International transit is typically [X–XX] business days after dispatch, plus customs
            processing.
          </p>
        </div>

        {/* § 04 */}
        <div style={{ padding: "clamp(40px,5vw,64px) 0", borderTop: "1px solid rgba(20,20,20,0.1)" }}>
          <SectionRule eyebrow="§ 04 · ORDER TRACKING & NOTIFICATIONS" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
            {TRACKING_STEPS.map((s) => (
              <div key={s.num} style={{ background: "#FBF9F3", borderRadius: 16, padding: "26px 24px", boxShadow: "0 1px 2px rgba(20,20,20,0.05)" }}>
                <div className="mono" style={{ fontSize: 12, letterSpacing: "0.2em", color: "#C9661A", marginBottom: 14 }}>
                  {s.num}
                </div>
                <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(20,20,20,0.7)" }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* § 05 */}
        <div style={{ padding: "clamp(40px,5vw,64px) 0", borderTop: "1px solid rgba(20,20,20,0.1)" }}>
          <SectionRule eyebrow="§ 05 · ADDRESS CHANGES & CANCELLATIONS" />
          <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 15.5, lineHeight: 1.7, color: "rgba(20,20,20,0.75)" }}>
            <p style={{ margin: 0 }}>
              We can correct an address or cancel an order only while it&apos;s still in
              processing — contact us as soon as possible.
            </p>
            <p style={{ margin: 0 }}>
              If a package is returned to us as undeliverable, we&apos;ll refund the order minus
              original outbound shipping, or re-ship it at your cost.
            </p>
            <p style={{ margin: 0 }}>
              PO Boxes and APO/FPO addresses:{" "}
              <span style={{ color: "#C9661A", fontWeight: 600 }}>[CONFIRM WITH CARRIER]</span>.
              Military addresses may add [X–XX] additional days.
            </p>
          </div>
        </div>

        {/* § 06 FAQ */}
        <div id="lost-damaged" style={{ padding: "clamp(40px,5vw,64px) 0", borderTop: "1px solid rgba(20,20,20,0.1)" }}>
          <SectionRule eyebrow="§ 06 · LOST, DAMAGED, OR STOLEN SHIPMENTS" />
          <FaqAccordion items={FAQS} />
        </div>
      </div>

      {/* Contact CTA */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "clamp(48px,6vw,72px) 24px clamp(80px,10vw,128px)" }}>
        <div style={{ background: "#EAE6DA", borderRadius: 24, padding: "clamp(40px,5vw,56px)", textAlign: "center" }}>
          <div className="mono" style={{ fontSize: 12, letterSpacing: "0.22em", color: "#C9661A", marginBottom: 20 }}>
            § 07 · CONTACT
          </div>
          <h2 style={{ margin: "0 auto 24px", fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Where&apos;s My Probe?
          </h2>
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
            <span className="mono" style={{ fontSize: 15, letterSpacing: "0.06em", color: "rgba(20,20,20,0.45)" }}>
              [orders@infiniteprobe.com]
            </span>
            <span className="mono" style={{ fontSize: 10, letterSpacing: "0.16em", color: "#C9661A" }}>
              CONFIRM ADDRESS
            </span>
          </div>
        </div>
      </div>

      <Footer />
      <CartDrawer />
    </>
  );
}
