# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml`).

```bash
pnpm dev      # Vite dev server with HMR
pnpm build    # tsc -b (typecheck, project references) then vite build
pnpm lint     # eslint .
pnpm preview  # serve the production build
```

There is no test runner configured. Typechecking runs only via `pnpm build` — there is no standalone `typecheck` script, so use `pnpm exec tsc -b` for a check without bundling.

## Architecture

Vite + React 19 + TypeScript SPA. Currently a scaffold: `index.html` → `src/main.tsx` (mounts `<App />` in `StrictMode`) → `src/App.tsx`. There is no router, state manager, or backend layer yet.

**Tailwind CSS v4** is wired through the `@tailwindcss/vite` plugin, not PostCSS. There is no `tailwind.config.js` and none should be added — v4 configures via CSS. `src/index.css` is a single `@import "tailwindcss";`; theme tokens, custom variants, and utilities belong there using `@theme`, `@variant`, and `@utility`.

**`motion`** (Motion for React, the Framer Motion successor) is a dependency but not yet imported anywhere. Use it for animation work rather than adding another animation library.

**`public/icons.svg`** is an SVG sprite of `<symbol>` elements: `bluesky-icon`, `discord-icon`, `documentation-icon`, `github-icon`, `social-icon`, `x-icon`. Reference them with `<svg><use href="/icons.svg#github-icon" /></svg>`. Icons in `src/assets/` are Vite/React template leftovers.

## TypeScript config

Split via project references: `tsconfig.app.json` covers `src` (DOM libs, `react-jsx`), `tsconfig.node.json` covers `vite.config.ts` only. Both enable `noUnusedLocals`, `noUnusedParameters`, and `verbatimModuleSyntax` — type-only imports must be written as `import type { ... }`. `erasableSyntaxOnly` is on, which bans enums, parameter properties, and namespaces.

## Skills

`make-interfaces-feel-better` (invokable as `/make-interfaces-feel-better`) is installed in this repo via `npx skills add`. It lives in `.agents/skills/` with a symlink from `.claude/skills/`, pinned by `skills-lock.json`. Consult it for UI polish work: border radius, optical alignment, shadows, animations, icon states, typography details.
