import { NextResponse } from "next/server";

/**
 * Newsletter signup endpoint.
 *
 * [PLACEHOLDER — NEWSLETTER SERVICE NOT CONNECTED]
 * Pick a provider and wire it below (see LAUNCH_CHECKLIST.md):
 *   - Mailchimp:  POST https://<dc>.api.mailchimp.com/3.0/lists/{LIST_ID}/members
 *   - Klaviyo:    POST https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs
 *   - ConvertKit: POST https://api.convertkit.com/v3/forms/{FORM_ID}/subscribe
 *   - Buttondown: POST https://api.buttondown.email/v1/subscribers
 * Store the API key in the NEWSLETTER_API_KEY env var (server-side only —
 * no NEXT_PUBLIC_ prefix) and set NEWSLETTER_PROVIDER accordingly.
 */
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

  if (!provider || !apiKey) {
    // Not configured yet — fail loudly so the gap can't ship unnoticed.
    return NextResponse.json(
      {
        ok: false,
        error: "Newsletter signup isn't live yet — check back soon.",
      },
      { status: 503 }
    );
  }

  // TODO [LAUNCH]: implement the chosen provider's subscribe call here.
  return NextResponse.json(
    {
      ok: false,
      error: "Newsletter provider integration not implemented.",
    },
    { status: 501 }
  );
}
