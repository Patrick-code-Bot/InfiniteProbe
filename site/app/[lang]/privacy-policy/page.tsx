import type { Metadata } from "next";
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
import CartDrawer from "@/components/cart/CartDrawer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = parseLocale(lang) ?? defaultLocale;

  return {
    title: "Privacy Policy",
    description:
      "How InfiniteProbe Technologies Company collects, uses, and protects your information across our website, store, and app.",
    alternates: {
      canonical: localePath(locale, "/privacy-policy"),
      languages: languageAlternates("/privacy-policy"),
    },
    openGraph: {
      title: "InfiniteProbe Privacy Policy",
      description: "Collect little, explain everything, sell nothing.",
      url: localePath(locale, "/privacy-policy"),
    },
  };
}

const TOC = [
  { id: "collect", label: "Information IPT Collects" },
  { id: "use", label: "How IPT Uses Your Information" },
  { id: "share", label: "How IPT Shares Information" },
  { id: "cookies", label: "Cookies, Analytics & Tracking" },
  { id: "security", label: "Data Storage, Security & Retention" },
  { id: "rights", label: "Your Privacy Rights & Choices" },
  { id: "intl", label: "International Transfers & Children" },
  { id: "updates", label: "Updates to This Policy" },
  { id: "contact", label: "Contact the IPT Privacy Team" },
];

function Section({
  num,
  id,
  title,
  children,
}: {
  num: string;
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      style={{
        padding: "clamp(48px,6vw,80px) 0",
        borderBottom: "1px solid rgba(20,20,20,0.1)",
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 12,
          letterSpacing: "0.2em",
          color: "#C9661A",
          marginBottom: 16,
        }}
      >
        § {num}
      </div>
      <h2
        style={{
          margin: "0 0 24px",
          fontSize: "clamp(24px,3vw,34px)",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          fontSize: 15.5,
          lineHeight: 1.7,
          color: "rgba(20,20,20,0.75)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Bullet({
  lead,
  children,
}: {
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <span style={{ color: "#C9661A", fontWeight: 800 }}>—</span>
      <span>
        {lead && <strong style={{ color: "#141414" }}>{lead}: </strong>}
        {children}
      </span>
    </div>
  );
}

function Note({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ background: "#EAE6DA", borderRadius: 16, padding: "24px 28px" }}
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
        {title}
      </div>
      <div
        style={{
          fontSize: 14.5,
          lineHeight: 1.65,
          color: "rgba(20,20,20,0.75)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Placeholder({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "#C9661A", fontWeight: 600 }}>{children}</span>;
}

export default async function PrivacyPolicyPage({
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

      {/* Hero */}
      <div
        style={{
          maxWidth: 900,
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
          PRIVACY POLICY
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
          Your Cook Is Your Business.
        </h1>
        <p
          style={{
            margin: "0 0 16px",
            fontSize: 16.5,
            lineHeight: 1.7,
            color: "rgba(20,20,20,0.78)",
          }}
        >
          InfiniteProbe Technologies Company (&quot;IPT&quot;, &quot;we&quot;,
          &quot;us&quot;) built a thermometer that works without the cloud — and
          we run our privacy the same way: collect little, explain everything,
          sell nothing. This policy describes what information we collect when
          you visit www.infiniteprobe.com, buy from our store, use the
          InfiniteProbe app, or talk to us — and the choices you have about all
          of it.
        </p>
        <p
          style={{
            margin: "0 0 32px",
            fontSize: 16.5,
            lineHeight: 1.7,
            color: "rgba(20,20,20,0.78)",
          }}
        >
          By using our website, store, or app, you agree to the practices
          described here. If anything is unclear, write to us — the address is
          at the bottom of this page.
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
          LAST UPDATED —{" "}
          <Placeholder>[MONTH DD, YYYY — SET AT PUBLICATION]</Placeholder>
        </div>
      </div>

      {/* TOC */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 24px clamp(56px,7vw,88px)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 14,
          }}
        >
          {TOC.map((t, i) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              className="card-hover-orange"
              style={{
                display: "flex",
                gap: 12,
                alignItems: "baseline",
                border: "1px solid rgba(20,20,20,0.12)",
                borderRadius: 14,
                padding: "16px 18px",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <span className="mono" style={{ color: "#C9661A", fontSize: 12 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{t.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <Section num="01" id="collect" title="Information IPT Collects">
          <p style={{ margin: 0 }}>
            We collect information in three ways: what you give us, what we
            observe automatically, and what we receive from partners.
          </p>
          <Bullet lead="Information you provide directly">
            Order data (name, email, address, phone) when you buy from our
            store; newsletter, support, review, promotion, or job-application
            correspondence you send us, which we retain to respond to you.
          </Bullet>
          <Bullet lead="Information collected automatically">
            IP address and approximate location, browser and operating system,
            device type, referring site, search terms, pages viewed, and timing
            — collected via cookies and similar technologies (see § 04).
          </Bullet>
          <Bullet lead="Information from third parties">
            Our e-commerce platform, payment processors, shipping carriers, and
            analytics/ad partners share order status, delivery confirmation,
            fraud signals, and campaign data with us. Social platforms share
            information per their own privacy policies when you interact with us
            there.
          </Bullet>
          <Bullet lead="What the InfiniteProbe app does NOT collect">
            The app connects to your probe over Bluetooth, locally. Your cook
            data stays on your device. No account is required, and IPT never
            sees your cooks.
          </Bullet>
        </Section>

        <Section num="02" id="use" title="How IPT Uses Your Information">
          <p style={{ margin: 0 }}>We use the information above to:</p>
          <Bullet lead="Fulfilling your order">
            Process payment, ship your product, and provide order updates.
          </Bullet>
          <Bullet lead="Supporting you">
            Respond to questions, warranty claims, and requests.
          </Bullet>
          <Bullet lead="Marketing — with your consent">
            Send product news and offers by email; every message includes
            one-click unsubscribe.
          </Bullet>
          <Bullet lead="Improving the website">
            Analyze traffic and usage in anonymized or aggregated form.
          </Bullet>
          <Bullet lead="Security and legal compliance">
            Detect fraud, enforce our terms, and meet legal obligations.
          </Bullet>
          <Note title="OUR BASELINE">
            We do not sell your personal information, and we do not use your
            data for purposes unrelated to running this store and supporting
            this product.
          </Note>
        </Section>

        <Section num="03" id="share" title="How IPT Shares Information">
          <p style={{ margin: 0 }}>
            We share information only as needed to run the business, and never
            to sell it:
          </p>
          <Bullet lead="Service providers">
            Shopify, payment processors, email providers, shipping carriers, and
            support tooling that process data on our behalf.
          </Bullet>
          <Bullet lead="Analytics and advertising partners">
            Aggregated or pseudonymized data to measure and improve marketing.
          </Bullet>
          <Bullet lead="Legal requirements">
            When required by law, subpoena, or valid legal process.
          </Bullet>
          <Bullet lead="Protecting rights and safety">
            To protect IPT, our customers, or the public from harm or fraud.
          </Bullet>
          <Bullet lead="Business transfers">
            In connection with a merger, acquisition, or sale of assets.
          </Bullet>
        </Section>

        <Section
          num="04"
          id="cookies"
          title="Cookies, Analytics, and Tracking Technologies"
        >
          <p style={{ margin: 0 }}>
            Cookies and pixels are small files that let a site remember you and
            measure usage. We use:
          </p>
          <Bullet lead="Essential">
            Cookies required for checkout and cart to function.
          </Bullet>
          <Bullet lead="Analytics">
            Cookies that show us aggregate traffic and usage patterns.
          </Bullet>
          <Bullet lead="Personalization">
            Cookies that remember your preferences.
          </Bullet>
          <Bullet lead="Marketing">
            Cookies used to measure and target advertising.
          </Bullet>
          <Note title="YOUR CONTROLS">
            Our cookie banner and a settings link in the footer let you adjust
            preferences at any time. We honor the Global Privacy Control signal.
            You can also block cookies at the browser level, though this may
            break checkout.
          </Note>
        </Section>

        <Section
          num="05"
          id="security"
          title="Data Storage, Security, and Retention"
        >
          <p style={{ margin: 0 }}>
            We use industry-standard measures to protect your information:
            encryption in transit (TLS), access limited to staff and vendors who
            need it, and vetted third-party processors. Payment processors never
            share full card numbers with us.
          </p>
          <p style={{ margin: 0 }}>
            If a breach occurs that affects your personal information, we will
            notify you as required by applicable law.
          </p>
          <p style={{ margin: 0 }}>
            We retain order records for as long as required by tax and
            commercial law, support correspondence for as long as needed to
            assist you, and marketing data until you unsubscribe. Anonymized or
            aggregated data may be retained indefinitely.
          </p>
        </Section>

        <Section num="06" id="rights" title="Your Privacy Rights and Choices">
          <p style={{ margin: 0 }}>
            Depending on where you live, you may have the right to:
          </p>
          <Bullet lead="Access & portability">
            Request a copy of the personal information we hold about you.
          </Bullet>
          <Bullet lead="Correction">
            Ask us to correct inaccurate information.
          </Bullet>
          <Bullet lead="Deletion">
            Ask us to delete your personal information, subject to legal
            exceptions.
          </Bullet>
          <Bullet lead="Opt out of marketing">
            Unsubscribe from emails at any time.
          </Bullet>
          <Bullet lead="Opt out of targeted advertising / “sale”">
            Under CCPA/CPRA, including via the Global Privacy Control. Under
            GDPR/UK GDPR, you may also object to or restrict processing,
            withdraw consent, and lodge a complaint with your local supervisory
            authority.
          </Bullet>
          <Note title="HOW REQUESTS WORK">
            Send requests to the address in § 09. We may need to verify your
            identity first. We aim to respond within{" "}
            <Placeholder>[X]</Placeholder> business days (typically 30–45 days),
            and you have the right to appeal our decision.
          </Note>
        </Section>

        <Section
          num="07"
          id="intl"
          title="International Data Transfers & Children's Privacy"
        >
          <p style={{ margin: 0 }}>
            IPT is headquartered in{" "}
            <Placeholder>[JURISDICTION — TBC]</Placeholder>, and our service
            providers operate in <Placeholder>[REGIONS — TBC]</Placeholder>.
            Where we transfer personal data from the EEA or UK, we rely on
            Standard Contractual Clauses or another approved transfer mechanism.
          </p>
          <p style={{ margin: 0 }}>
            Our website, store, and app are intended for adults. We do not
            knowingly collect information from anyone under 16. If you believe a
            child has provided us information, contact us and we will delete it.
          </p>
        </Section>

        <Section num="08" id="updates" title="Updates to This Privacy Policy">
          <p style={{ margin: 0 }}>
            We may update this policy as our practices change. The &quot;Last
            updated&quot; date at the top reflects the most recent revision. If
            a change is material, we will provide additional notice (such as a
            banner on the site or an email). Continued use of our website,
            store, or app after an update constitutes acceptance of the revised
            policy.
          </p>
        </Section>

        <Section num="09" id="contact" title="Contact the IPT Privacy Team">
          <p style={{ margin: 0 }}>
            Questions, requests, or complaints about this policy can be sent to
            the address below. We aim to acknowledge every message within{" "}
            <Placeholder>[X]</Placeholder> business days.
          </p>
        </Section>
      </div>

      {/* Contact CTA */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "clamp(48px,6vw,72px) 24px clamp(80px,10vw,128px)",
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
            Questions, Requests, Complaints
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
              marginBottom: 24,
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
              [privacy@infiniteprobe.com]
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
          <div
            className="mono"
            style={{
              fontSize: 12,
              letterSpacing: "0.1em",
              color: "rgba(20,20,20,0.55)",
              lineHeight: 1.8,
            }}
          >
            INFINITEPROBE TECHNOLOGIES COMPANY · ATTN: PRIVACY
            <br />
            <Placeholder>[REGISTERED ADDRESS — AWAITING LEGAL]</Placeholder>
          </div>
        </div>
      </div>

      <Footer dict={dict} locale={locale} />
      <CartDrawer />
    </>
  );
}
