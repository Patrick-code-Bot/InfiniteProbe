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
    title: "Terms of Service",
    description:
      "The terms governing use of the InfiniteProbe website, store, and app — acceptance, purchases, intellectual property, and dispute resolution.",
    alternates: {
      canonical: localePath(locale, "/terms-of-service"),
      languages: languageAlternates("/terms-of-service"),
    },
    openGraph: {
      title: "InfiniteProbe Terms of Service",
      description: "The deal, in plain terms.",
      url: localePath(locale, "/terms-of-service"),
    },
  };
}

const SUMMARY = [
  {
    title: "BUY",
    body: "Order from our store, we ship it, standard consumer protections apply — plus our warranty and return policy.",
  },
  {
    title: "USE",
    body: "The probe, app, and site are for personal, non-commercial use. Don't reverse engineer, scrape, or misuse them.",
  },
  {
    title: "OWN",
    body: "You own your device and your cook data. We own our designs, software, and brand. Feedback you send us, we may use.",
  },
  {
    title: "DISPUTE",
    body: "Talk to us first — most issues resolve in one email. Formal disputes go to individual binding arbitration, and you can opt out within 30 days.",
  },
];

const TOC = [
  { id: "accept", label: "Acceptance & Eligibility" },
  { id: "accounts", label: "Accounts & Security" },
  { id: "store", label: "Store Terms & Purchase Conditions" },
  { id: "ip", label: "Intellectual Property & License" },
  { id: "conduct", label: "Prohibited Activities" },
  { id: "feedback", label: "Feedback & Submissions" },
  { id: "thirdparty", label: "Third-Party Links & Tools" },
  { id: "liability", label: "Disclaimers, Liability & Indemnification" },
  { id: "disputes", label: "Governing Law & Dispute Resolution" },
  { id: "changes", label: "Changes, Severability & Termination" },
  { id: "contact", label: "Contact IPT Legal" },
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

export default async function TermsOfServicePage({
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
          TERMS OF SERVICE
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
          The Deal, in Plain Terms.
        </h1>
        <p
          style={{
            margin: "0 0 16px",
            fontSize: 16.5,
            lineHeight: 1.7,
            color: "rgba(20,20,20,0.78)",
          }}
        >
          These Terms of Service (&quot;Terms&quot;) govern your use of the
          InfiniteProbe website, store, and app (together, the
          &quot;Services&quot;), operated by InfiniteProbe Technologies Company
          (&quot;IPT&quot;, &quot;we&quot;, &quot;us&quot;). By browsing our
          site, placing an order, or using our app, you accept these Terms —
          including the arbitration agreement and class-action waiver in § 09.
          If you do not agree, please do not use the Services.
        </p>
        <p
          style={{
            margin: "0 0 32px",
            fontSize: 16.5,
            lineHeight: 1.7,
            color: "rgba(20,20,20,0.78)",
          }}
        >
          Our Privacy Policy and Warranty &amp; Returns policy are incorporated
          into these Terms by reference. Nothing here overrides
          consumer-protection rights that cannot be waived under your local law.
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
          EFFECTIVE DATE —{" "}
          <Placeholder>[MONTH DD, YYYY — SET AT PUBLICATION]</Placeholder>
        </div>

        {/* Short version summary cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 16,
            marginBottom: 56,
          }}
        >
          {SUMMARY.map((s) => (
            <div
              key={s.title}
              style={{
                background: "#FBF9F3",
                borderRadius: 16,
                padding: "24px 22px",
                boxShadow: "0 1px 2px rgba(20,20,20,0.05)",
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  color: "#C9661A",
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

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <Section num="01" id="accept" title="Acceptance & Eligibility">
          <p style={{ margin: 0 }}>
            By using the Services, you accept these Terms. If you use the
            Services on behalf of an organization, you represent that you have
            authority to bind it.
          </p>
          <p style={{ margin: 0 }}>
            You must be of the age of majority in your jurisdiction to purchase
            from our store, and at least 16 years old to use the Services at
            all. If any provision of these Terms is unenforceable in your
            jurisdiction, the remainder still applies.
          </p>
        </Section>

        <Section num="02" id="accounts" title="Accounts & Security">
          <p style={{ margin: 0 }}>
            The InfiniteProbe app requires no account. Where an account is
            offered or required (e.g. for order history):
          </p>
          <Bullet lead="Accurate information">
            You agree to provide accurate, current information.
          </Bullet>
          <Bullet lead="Your credentials, your responsibility">
            You are responsible for activity under your login.
          </Bullet>
          <Bullet lead="Our discretion">
            We may suspend or terminate accounts that violate these Terms.
          </Bullet>
        </Section>

        <Section num="03" id="store" title="Store Terms & Purchase Conditions">
          <p style={{ margin: 0 }}>
            Orders are processed through Shopify and third-party payment
            providers.
          </p>
          <Bullet lead="Pricing & errors">
            We strive for accuracy but may correct pricing or listing errors,
            including after an order is placed.
          </Bullet>
          <Bullet lead="Payment & taxes">
            You authorize us to charge your chosen payment method for the order
            total, including applicable taxes.
          </Bullet>
          <Bullet lead="Order acceptance">
            We may cancel or refuse any order for reasons including suspected
            fraud or stock unavailability.
          </Bullet>
          <Bullet lead="Shipping & risk">
            See our Shipping Policy (<Placeholder>[PENDING]</Placeholder>) for
            rates, timelines, and risk of loss.
          </Bullet>
          <Bullet lead="Cancellations & returns">
            Governed by our Warranty & Returns policy.
          </Bullet>
        </Section>

        <Section
          num="04"
          id="ip"
          title="Intellectual Property & Limited License"
        >
          <p style={{ margin: 0 }}>
            IPT owns all rights in the hardware design, thermoelectric
            technology, firmware, app, website content, and marks (including
            INFINITEPROBE and LEIZIG INSIDE). Buying a product transfers
            ownership of the physical device only — not the intellectual
            property in it.
          </p>
          <p style={{ margin: 0 }}>
            We grant you a personal, non-exclusive, non-transferable, revocable
            license to use the app and firmware with genuine InfiniteProbe
            hardware, and to access our site content for personal use. You may
            not use our marks in a way that implies endorsement, or link to us
            in a misleading way.
          </p>
        </Section>

        <Section num="05" id="conduct" title="Prohibited Activities">
          <p style={{ margin: 0 }}>
            You agree not to, and not to help anyone else to:
          </p>
          <Bullet lead="Break the law">
            Use the Services for any unlawful purpose.
          </Bullet>
          <Bullet lead="Attack or overload">
            Interfere with, overload, or attack our infrastructure.
          </Bullet>
          <Bullet lead="Scrape or harvest">
            Scrape or harvest data from our site without permission.
          </Bullet>
          <Bullet lead="Reverse engineer">
            Reverse engineer the app, firmware, or hardware.
          </Bullet>
          <Bullet lead="Misrepresent">
            Impersonate IPT or misrepresent your affiliation with us.
          </Bullet>
          <Note title="CONSEQUENCE">
            Violations may result in suspension or termination of access, and
            referral to law enforcement where appropriate. This does not waive
            any amounts you owe us.
          </Note>
        </Section>

        <Section
          num="06"
          id="feedback"
          title="User Comments, Feedback & Submissions"
        >
          <p style={{ margin: 0 }}>
            If you send us feedback, reviews, or suggestions, you grant IPT a
            worldwide, royalty-free, perpetual, sublicensable license to use
            them for any purpose, without compensation to you.
          </p>
          <p style={{ margin: 0 }}>
            You&apos;re responsible for ensuring anything you submit is lawful
            and doesn&apos;t infringe others&apos; rights. We may, but are not
            obligated to, moderate or remove submissions. If you believe your
            copyrighted work has been used without permission, contact us using
            the details in § 11.
          </p>
        </Section>

        <Section
          num="07"
          id="thirdparty"
          title="Third-Party Links & Integrated Tools"
        >
          <p style={{ margin: 0 }}>
            Our Services may link to or integrate with third-party tools and
            platforms (payment processors, analytics, social platforms). We
            don&apos;t control these third parties and provide such links
            &quot;as is,&quot; without warranty of any kind.
          </p>
        </Section>

        <Section
          num="08"
          id="liability"
          title="Disclaimers, Liability & Indemnification"
        >
          <p
            style={{
              margin: 0,
              textTransform: "uppercase",
              fontSize: 13.5,
              letterSpacing: "0.01em",
            }}
          >
            THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS
            AVAILABLE,&quot; WITHOUT WARRANTIES OF ANY KIND, EXCEPT FOR THE
            EXPRESS HARDWARE WARRANTY DESCRIBED IN OUR WARRANTY &amp; RETURNS
            POLICY.
          </p>
          <p
            style={{
              margin: 0,
              textTransform: "uppercase",
              fontSize: 13.5,
              letterSpacing: "0.01em",
            }}
          >
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IPT IS NOT LIABLE FOR
            INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING
            LOST PROFITS, LOST DATA, OR SPOILED FOOD. OUR TOTAL LIABILITY IS
            CAPPED AT THE GREATER OF THE AMOUNT YOU PAID US IN THE PAST 12
            MONTHS OR <Placeholder>[USD $100 — TBC]</Placeholder>. WHERE A
            JURISDICTION DOES NOT ALLOW THESE EXCLUSIONS, THEY APPLY TO THE
            FULLEST EXTENT PERMITTED.
          </p>
          <p style={{ margin: 0 }}>
            InfiniteProbe is a cooking aid, not a food-safety guarantee: always
            confirm food has reached a safe internal temperature according to
            your local food-safety guidance.
          </p>
          <p style={{ margin: 0 }}>
            You agree to defend, indemnify, and hold IPT harmless from claims
            arising out of your breach of these Terms, misuse of the Services,
            or violation of any law or third-party right.
          </p>
        </Section>

        <Section
          num="09"
          id="disputes"
          title="Governing Law, Jurisdiction & Dispute Resolution"
        >
          <p style={{ margin: 0 }}>
            These Terms are governed by the law of{" "}
            <Placeholder>[JURISDICTION — TBC]</Placeholder>. Before filing a
            formal claim, you agree to try to resolve the dispute informally by
            contacting us; we&apos;ll have <Placeholder>[XX]</Placeholder> days
            to respond.
          </p>
          <p style={{ margin: 0 }}>
            If informal resolution fails, disputes will be resolved by binding
            individual arbitration administered by{" "}
            <Placeholder>[ARBITRATION PROVIDER — TBC]</Placeholder>, seated in{" "}
            <Placeholder>[SEAT — TBC]</Placeholder>, except that either party
            may bring a small claims case, and IPT may seek injunctive relief
            for intellectual-property violations.{" "}
            <span style={{ textTransform: "uppercase" }}>
              YOU AND IPT EACH WAIVE THE RIGHT TO A JURY TRIAL AND TO
              PARTICIPATE IN A CLASS ACTION.
            </span>
          </p>
          <p style={{ margin: 0 }}>
            You may opt out of arbitration within 30 days of first accepting
            these Terms by writing to the address in § 11. If the class-action
            waiver is found unenforceable, this entire arbitration section is
            void and disputes will proceed in the courts of{" "}
            <Placeholder>[JURISDICTION — TBC]</Placeholder>.
          </p>
          <Note title="CONSUMER NOTE">
            Nothing here waives non-waivable consumer rights, including access
            to the EU Online Dispute Resolution platform where applicable.
          </Note>
        </Section>

        <Section
          num="10"
          id="changes"
          title="Modifications to Terms, Severability & Termination"
        >
          <p style={{ margin: 0 }}>
            We may update these Terms from time to time; we&apos;ll post the
            revised version with a new effective date, and material changes will
            be flagged. Continued use after an update means you accept the
            changes.
          </p>
          <p style={{ margin: 0 }}>
            If any provision is found unenforceable, the rest remains in effect.
            Our failure to enforce a provision isn&apos;t a waiver of it. We may
            terminate your access for violating these Terms. Sections concerning
            ownership, disclaimers, liability limits, indemnification, and
            dispute resolution survive termination. These Terms are the entire
            agreement between you and IPT regarding the Services, and you may
            not assign them without our consent.
          </p>
        </Section>

        <Section num="11" id="contact" title="Contact IPT Legal">
          <p style={{ margin: 0 }}>
            Questions about these Terms can be sent to the address below.
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
            Questions About These Terms
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
              [legal@infiniteprobe.com]
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
            INFINITEPROBE TECHNOLOGIES COMPANY · ATTN: LEGAL
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
