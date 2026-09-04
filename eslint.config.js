import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import boundaries from "eslint-plugin-boundaries";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

const LAYERS = ["app", "pages", "widgets", "features", "entities", "shared"];

// A layer may import only from layers below it.
const allowedDependencies = LAYERS.map((layer, index) => ({
  from: [layer],
  allow: LAYERS.slice(index + 1),
}));

export default defineConfig([
  globalIgnores(["dist", "coverage", ".react-router"]),
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
      "boundaries/elements": LAYERS.map((layer) => ({
        type: layer,
        pattern: `src/${layer}/*`,
        capture: ["slice"],
      })),
    },
    rules: {
      "boundaries/element-types": [
        2,
        { default: "disallow", rules: allowedDependencies },
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
    // Generated primitives export variant helpers alongside their component.
    files: ["src/**/ui/**/*.tsx"],
    rules: { "react-refresh/only-export-components": 0 },
  },
  {
    files: ["src/**/*.{test,spec}.{ts,tsx}", "src/test/**"],
    rules: { "boundaries/element-types": 0 },
  },
  prettier,
]);
