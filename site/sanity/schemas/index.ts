import type { SchemaTypeDefinition } from "sanity";

import {
  localeString,
  localeText,
  localeBlock,
} from "./objects/locale";
import {
  heroSection,
  featureGridSection,
  richTextSection,
  seo,
} from "./objects/sections";
import { page } from "./documents/page";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Localized primitives — must register before anything that references them.
  localeString,
  localeText,
  localeBlock,
  // Objects
  seo,
  heroSection,
  featureGridSection,
  richTextSection,
  // Documents
  page,
];
