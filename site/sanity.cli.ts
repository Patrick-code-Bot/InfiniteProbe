import { defineCliConfig } from "sanity/cli";
import { projectId, dataset } from "./sanity/env";

/**
 * CLI config for `npx sanity` commands (dataset management, schema deploy,
 * GraphQL). Reads the same env vars as the app.
 */
export default defineCliConfig({
  api: { projectId, dataset },
});
