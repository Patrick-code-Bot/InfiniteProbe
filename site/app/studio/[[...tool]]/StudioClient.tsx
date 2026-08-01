"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

/**
 * The Studio is a client-only React app. Split from page.tsx so the server
 * component can gate on isSanityConfigured() before this ever loads.
 */
export default function StudioClient() {
  return <NextStudio config={config} />;
}
