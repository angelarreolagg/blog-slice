# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

An interactive MDX blog: statically prerendered prose whose keywords carry a
pointer-aware micro-interaction. Content is Spanish; all code, comments, and commits are
English.

Three documents govern the work and are the authority in their domain:

- `.claude/docs/STYLEGUIDE.md` — visual design: palette, typography, rhythm, components, motion.
- `.claude/docs/CODESTYLE.md` — how code is written, formatted, tested, committed.
- `.claude/docs/ROADMAP.md` — what gets built, in what order, and when a phase is done.

Read the relevant one before changing anything it covers. Do not restate their rules in code comments.

## Commands

Package manager is **pnpm**.

```bash
pnpm dev            # dev server
pnpm build          # typecheck then production build
pnpm typecheck      # tsc -b
pnpm lint           # eslint (includes FSD layer boundaries)
pnpm format         # prettier --write
pnpm test           # vitest watch
pnpm test:run       # vitest once
pnpm test:coverage  # vitest with coverage
pnpm release        # release-it
```

Git hooks are active: `pre-commit` runs lint-staged, `commit-msg` runs commitlint, `pre-push` runs typecheck and the full test suite.

## Architecture

**Feature-Sliced Design.** Layers, in import order: `app` → `pages` → `widgets` → `features` → `entities` → `shared`. A module imports only from layers strictly below it; `eslint-plugin-boundaries` enforces this and a violation fails `pnpm lint`. Cross-slice imports go through a slice's `index.ts`, never a deep path. `src/content/` holds authored `.mdx` prose and is data, not a layer.

**React Router framework mode**, `ssr: false` with `prerender` — static HTML per route, no server. `appDirectory` is `src/app`, so the framework's required files land inside the FSD `app` layer. Route modules stay thin: they declare `loader`, `meta`, `ErrorBoundary`, `default` and delegate rendering to a page slice.

`reactRouter()` replaces `@vitejs/plugin-react` in `vite.config.ts` — running both double-transforms JSX and breaks Fast Refresh. `@vitejs/plugin-react` stays installed because `vitest.config.ts` uses it; tests do not run the framework plugin.

**Content model.** Frontmatter is the single source of truth (`title`, `description`, `date`, optional `updated`, `tags`, `draft`). The slug is always the filename, so the URL and the file can never disagree. `import.meta.glob` builds the index; `react-router.config.ts` reads the same directory with `gray-matter` to enumerate prerender paths, which is how drafts are excluded from the build output.

## Gotchas

These cost time when rediscovered:

- **`providerImportSource: "@mdx-js/react"` is required** in the MDX plugin options. Without it `MDXProvider` is silently ignored and the component map never applies.
- **The MDX plugin must run `enforce: "pre"`**, before React Router's transform.
- **`baseUrl` is banned in every tsconfig.** TypeScript 6 makes it a build-breaking error (`TS5101`); `paths` alone is correct. Most shadcn guides tell you to add it.
- **The `@/*` alias lives in three files** — `tsconfig.json`, `tsconfig.app.json`, `vite.config.ts` — plus `vitest.config.ts`. They must stay in sync.
- **No `enum`, parameter properties, or `namespace`** — `erasableSyntaxOnly`. Use string-literal unions.
- **Tailwind v4 is CSS-first.** No `tailwind.config.js` and none should be added. Utilities are generated from a token's _prefix_, so a mis-prefixed token generates nothing. `bg-linear-to-*`, never `bg-gradient-to-*`.
- **shadcn is configured with Base UI, not Radix.** Online snippets assume Radix and need adapting. `cn` comes from the `cn` package, not `clsx` + `tailwind-merge`. Re-running `shadcn add` for an existing component overwrites local edits.
- **Vendored primitives arrive with their own palette.** Their vocabulary is aliased onto the project palette in the Tailwind entry; never maintain a second set of tokens.
- **Shiki must not reach the client bundle.** Highlighting is build-time only — verify no `shiki` chunk ships.
- **Import Lucide icons individually**, never as a namespace import.
- **jsdom implements no `matchMedia`.** The test setup stubs it; components reading pointer or motion preferences throw without it.

## Assets

`public/icons.svg` is a sprite of `<symbol>` elements: `bluesky-icon`, `discord-icon`, `documentation-icon`, `github-icon`, `social-icon`, `x-icon`. Use `<svg><use href="/icons.svg#github-icon" /></svg>`. Everything else comes from Lucide.

## Skills

`make-interfaces-feel-better` (`/make-interfaces-feel-better`) is installed in `.agents/skills/`, symlinked from `.claude/skills/`, pinned by `skills-lock.json`. Consult it for UI polish work.
