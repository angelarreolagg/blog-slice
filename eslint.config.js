import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import boundaries from "eslint-plugin-boundaries";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

const LAYERS = ["app", "pages", "widgets", "features", "entities", "shared"];

// A layer may import only from layers below it. `app` is the composition root:
// its framework files, styles and providers legitimately reference each other.
const layerPolicies = LAYERS.map((layer, index) => {
  const reachable = LAYERS.slice(layer === "app" ? index : index + 1);

  return {
    from: [{ element: { type: layer } }],
    allow: reachable.map((allowed) => ({ to: { element: { type: allowed } } })),
  };
});

export default defineConfig([
  globalIgnores(["dist", "coverage", ".react-router", "build"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: { boundaries },
    settings: {
      "boundaries/include": ["src/**/*"],
      // `mode: "file"` has no replacement yet; the warning would be the only output.
      "boundaries/legacy-warnings": false,
      // The layer graph is meaningless unless the "@/*" alias resolves.
      "import/resolver": { typescript: { project: "tsconfig.app.json" } },
      "boundaries/elements": LAYERS.flatMap((layer) => [
        { type: layer, pattern: `src/${layer}/*`, capture: ["slice"] },
        // Framework files sit directly in the layer directory, outside any slice.
        { type: layer, pattern: `src/${layer}/*`, mode: "file" },
      ]),
    },
    rules: {
      "boundaries/dependencies": [
        2,
        { default: "disallow", policies: layerPolicies },
      ],
      "@typescript-eslint/consistent-type-imports": [
        2,
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-explicit-any": 2,
      "no-console": [1, { allow: ["warn", "error"] }],
    },
  },
  {
    // Generated primitives export variant helpers alongside their component,
    // and route modules must export the framework contract beside `default`.
    files: ["src/**/ui/**/*.tsx", "src/app/routes/**/*.tsx", "src/app/root.tsx"],
    rules: { "react-refresh/only-export-components": 0 },
  },
  {
    files: ["src/**/*.{test,spec}.{ts,tsx}", "src/test/**"],
    rules: { "boundaries/dependencies": 0 },
  },
  prettier,
]);
