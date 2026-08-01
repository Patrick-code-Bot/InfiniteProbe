import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/**
 * Flat config — required by ESLint 9+, and `next lint` was removed in Next 16
 * (the `lint` script now calls the ESLint CLI directly).
 *
 * eslint-config-next@16 exports flat-config arrays from its subpaths, so no
 * FlatCompat shim is needed.
 */
const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      // Reference-only files for the refactor; they import modules that do
      // not exist yet. Excluded from tsconfig for the same reason.
      "docs/**",
    ],
  },
];

export default eslintConfig;
