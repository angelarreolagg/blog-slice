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

**Content model.** Frontmatter is the single source of truth (`title`, `description`, `date`, optional `updated`, `tags`, `draft`). The slug is always the filename, so the URL and the file can never disagree. `config/posts.ts` reads the directory with `gray-matter` and is the one source for both the prerender paths and the `virtual:published-posts` module the registry imports, which is how a draft stays out of the build output entirely.

**Build-time code lives in `config/`.** `vite.config.ts` and `react-router.config.ts` stay thin; the MDX plugin, the four-token highlight theme, post discovery and the feed writers live beside them in `config/`, covered by `tsconfig.node.json`.

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
- **jsdom implements no `matchMedia` and no `IntersectionObserver`.** The test setup stubs both; components reading pointer or motion preferences throw without them.
- **An eager `import.meta.glob` leaks drafts into the bundle.** Its keys are emitted as string literals, so the draft slug and its prose ship even when filtered at runtime. The registry reads `virtual:published-posts` instead, built from published files only.
- **JSX at the start of a line in `.mdx` becomes a block.** A `<Keyword>` that opens a line splits the paragraph in two. Keep it mid-line; Prettier will otherwise surround it with blank lines and make it permanent.
- **Motion decides at mount whether an element is a variant root.** Declaring `initial`, `animate` or any `while*` variant label sets `isControllingVariants`, and such an element never registers as a stagger child. The pointer gate resolves after hydration, so `Keyword` is keyed on which path it takes and remounts once.
- **`whileInView` does not propagate its variant to children.** Use `useInView` and drive `animate` for anything that has to orchestrate a stagger.
- **Motion applies `initial` during prerender.** An `initial={{ opacity: 0 }}` entrance ships invisible HTML; the article entrance is a CSS animation for that reason.
- **The icon sprite ships its own palette.** Its fills and strokes are `currentColor` so the footer can tint them with the ink tokens.

## Assets

`public/icons.svg` is a sprite of `<symbol>` elements: `bluesky-icon`, `discord-icon`, `documentation-icon`, `github-icon`, `social-icon`, `x-icon`. Use `<svg><use href="/icons.svg#github-icon" /></svg>`, or the `SpriteIcon` primitive. Everything else comes from Lucide. `public/test-categories.svg` is an authored diagram and carries its own `prefers-color-scheme` styles, since an SVG loaded through `<img>` cannot read the page's tokens.

## Skills

`make-interfaces-feel-better` (`/make-interfaces-feel-better`) is installed in `.agents/skills/`, symlinked from `.claude/skills/`, pinned by `skills-lock.json`. It governs how things move and feel — press scale, enter/exit values, icon swaps, shadows, hit areas — and `STYLEGUIDE.md` §6 is its application here. Read it before touching any motion or surface.
