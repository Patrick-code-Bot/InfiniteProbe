import { notFound } from "next/navigation";
import { isSanityConfigured } from "@/sanity/env";
import StudioClient from "./StudioClient";

/**
 * Embedded Sanity Studio.
 *
 * Deliberately outside app/[lang]/: the Studio is an editing tool, not
 * localized output, and it must not inherit the site's <html lang> or chrome.
 *
 * 404s when Sanity is unconfigured rather than rendering a Studio that cannot
 * connect to anything.
 */
export const dynamic = "force-static";

export const metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  if (!isSanityConfigured()) notFound();
  return <StudioClient />;
}
