import { NextResponse } from "next/server";

/**
 * Newsletter signup endpoint.
 *
 * Wired to Kit (formerly ConvertKit) v4: POST https://api.kit.com/v4/subscribers
 * authenticated with the `X-Kit-Api-Key` header. The call is an upsert — Kit
 * updates an existing subscriber by email rather than erroring, so a repeat
 * signup is a success, not a duplicate.
 *
 * Double opt-in is deliberately left to the Kit account setting rather than
 * forced here: if the account requires confirmation, Kit sends the email and
 * the subscriber stays pending until they click. That keeps consent handling
 * in one place instead of split between Kit and this route.
 *
 * Config (server-side only, never NEXT_PUBLIC_):
 *   NEWSLETTER_PROVIDER=kit
 *   NEWSLETTER_API_KEY=<v4 key from Kit → Settings → Developer>
 *
 * Note this needs a **v4** key. A v3 key (the older `api_key` query-param
 * style) authenticates only against api.convertkit.com/v3 and cannot create
 * subscribers directly — it can only subscribe to a specific form.
 *
 * Signups are then associated with a Kit form (NEWSLETTER_FORM_ID). This is
 * what makes Kit automations of the form "subscriber joins form X" fire — a
 * bare subscriber created by the call above belongs to no form, so any such
 * automation (including a welcome-email sequence) would never trigger for it.
 * Kit requires this as a separate call: the form endpoint takes an existing
 * subscriber id, so creating and associating cannot be done in one request.
 */

/** Kit's create-subscriber endpoint. Upserts by email address. */
const KIT_SUBSCRIBERS_URL = "https://api.kit.com/v4/subscribers";

/** Adds an existing subscriber to a form, which is what fires form automations. */
function kitFormSubscribeUrl(formId: string) {
  return `https://api.kit.com/v4/forms/${encodeURIComponent(formId)}/subscribers`;
}

/** Cap on how long we wait for Kit before giving up on the request. */
const KIT_TIMEOUT_MS = 10_000;

/**
 * True when the value is set to something real.
 *
 * Rejects [bracketed] placeholders, matching the convention in lib/site.ts and
 * sanity/env.ts — a copied .env.example should read as "unconfigured" rather
 * than as an API key literally named "[api-key]".
 */
function isConfigured(value: string | undefined): value is string {
  return Boolean(value && !value.startsWith("["));
}

export async function POST(request: Request) {
  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const provider = process.env.NEWSLETTER_PROVIDER;
  const apiKey = process.env.NEWSLETTER_API_KEY;

  if (!isConfigured(provider) || !isConfigured(apiKey)) {
    // Not configured yet — fail loudly so the gap can't ship unnoticed.
    return NextResponse.json(
      {
        ok: false,
        error: "Newsletter signup isn't live yet — check back soon.",
      },
      { status: 503 }
    );
  }

  if (provider.toLowerCase() !== "kit") {
    // Only Kit is implemented. Anything else is a misconfiguration, not a
    // user error — say so rather than silently dropping the signup.
    console.error(
      `[newsletter] NEWSLETTER_PROVIDER is "${provider}" but only "kit" is implemented.`
    );
    return NextResponse.json(
      { ok: false, error: "Newsletter signup isn't available right now." },
      { status: 501 }
    );
  }

  let response: Response;
  try {
    response = await fetch(KIT_SUBSCRIBERS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Kit-Api-Key": apiKey,
      },
      body: JSON.stringify({ email_address: email.trim() }),
      signal: AbortSignal.timeout(KIT_TIMEOUT_MS),
    });
  } catch (error) {
    // Network failure or timeout — Kit never answered.
    console.error("[newsletter] Kit request failed:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong — please try again." },
      { status: 502 }
    );
  }

  // 200 = existing subscriber updated, 201 = created, 202 = queued.
  if (response.ok) {
    const formId = process.env.NEWSLETTER_FORM_ID;
    if (isConfigured(formId)) {
      // Best-effort: the subscriber is already captured, so a failure here
      // must not turn a successful signup into an error for the visitor. It
      // only means Kit's form automations won't fire for them, which is an
      // operator problem to fix from the logs.
      try {
        const created: unknown = await response.json();
        const subscriberId =
          typeof created === "object" &&
          created !== null &&
          "subscriber" in created
            ? (created as { subscriber?: { id?: number } }).subscriber?.id
            : undefined;

        if (subscriberId === undefined) {
          console.error(
            "[newsletter] Kit returned no subscriber id; skipping form association."
          );
        } else {
          const formResponse = await fetch(
            `${kitFormSubscribeUrl(formId)}/${subscriberId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Kit-Api-Key": apiKey,
              },
              body: JSON.stringify({ referrer: request.headers.get("referer") ?? undefined }),
              signal: AbortSignal.timeout(KIT_TIMEOUT_MS),
            }
          );
          if (!formResponse.ok) {
            const formDetail = await formResponse.text().catch(() => "");
            console.error(
              `[newsletter] Kit form association failed (${formResponse.status}): ${formDetail.slice(0, 500)}`
            );
          }
        }
      } catch (error) {
        console.error("[newsletter] Kit form association failed:", error);
      }
    }

    return NextResponse.json({ ok: true });
  }

  // Log the real reason server-side; never surface Kit's message or our
  // credentials state to the browser.
  const detail = await response.text().catch(() => "");
  console.error(
    `[newsletter] Kit responded ${response.status}: ${detail.slice(0, 500)}`
  );

  if (response.status === 401 || response.status === 403) {
    // Bad or revoked key — an operator problem, not the visitor's.
    return NextResponse.json(
      { ok: false, error: "Newsletter signup isn't available right now." },
      { status: 503 }
    );
  }

  if (response.status === 422) {
    // Kit rejected the address itself (malformed, blocked domain, etc.).
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (response.status === 429) {
    return NextResponse.json(
      { ok: false, error: "Too many signups right now — please try again in a moment." },
      { status: 429 }
    );
  }

  return NextResponse.json(
    { ok: false, error: "Something went wrong — please try again." },
    { status: 502 }
  );
}
