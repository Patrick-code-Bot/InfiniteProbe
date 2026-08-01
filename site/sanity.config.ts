"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { projectId, dataset, apiVersion, studioUrl } from "./sanity/env";

/**
 * Embedded Studio config, mounted at /studio.
 *
 * Uses non-null assertions on projectId/dataset: this module is only ever
 * imported by app/studio/[[...tool]]/page.tsx, which is itself gated on
 * isSanityConfigured(). Sanity requires real values here and cannot be
 * constructed conditionally.
 */
export default defineConfig({
  basePath: studioUrl,
  projectId: projectId!,
  dataset: dataset!,
  schema: { types: schemaTypes },
  plugins: [
    structureTool(),
    // Query playground — dev only, to keep it out of the production bundle.
    ...(process.env.NODE_ENV === "development"
      ? [visionTool({ defaultApiVersion: apiVersion })]
      : []),
  ],
});
