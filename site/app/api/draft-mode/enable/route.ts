import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/client";
import { readToken } from "@/sanity/env";

/**
 * Draft-mode entry point for Sanity visual editing / Presentation.
 *
 * Validates the request against the Sanity token before enabling draft mode, so
 * this cannot be used to force uncached renders of the site.
 *
 * Requires SANITY_API_READ_TOKEN (server-only, never NEXT_PUBLIC_). Without it,
 * every request 401s and the live site is unaffected.
 */
export const { GET } =
  client && readToken
    ? defineEnableDraftMode({ client: client.withConfig({ token: readToken }) })
    : {
        GET: () =>
          new Response("Draft mode requires SANITY_API_READ_TOKEN.", {
            status: 401,
          }),
      };
