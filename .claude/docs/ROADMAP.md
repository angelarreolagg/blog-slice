# Roadmap: Interactive MDX Blog

> This document defines **what** gets built, **in what order**, and **when a step is
> done**. It is the only document that describes sequence.
>
> [`STYLEGUIDE.md`](./STYLEGUIDE.md) is the source of truth for visual design and
> [`CODESTYLE.md`](./CODESTYLE.md) for how code is written. Where this document restates
> one of their rules it is a reminder, never a redefinition — if they disagree with what
> follows, they win.

## 1. Objective

Ship a statically prerendered personal blog whose prose carries pointer-aware
micro-interactions: on hover-capable devices a reader reveals keywords by pointing at
them; on coarse-pointer devices the same keywords reveal themselves in a staggered
sequence as the paragraph enters the viewport. Every post is real HTML at build time —
the interaction layer is an enhancement, never a precondition for reading, and a keyword
that never reveals is still fully legible.

The differentiator is Phase 5. Everything before it exists to make that phase possible;
everything after it exists to make it shippable.

## 2. Settled Product Decisions

These are closed. Do not reopen them mid-implementation.

| Decision                    | Answer                                                                 |
| --------------------------- | ---------------------------------------------------------------------- |
| Routes                      | Blog only — `/` is the post index, `/blog/:slug` is a post, `*` is 404 |
| Landing / About / Tag pages | Out of scope for v1                                                    |
| Seed posts                  | 3 published + 1 draft stub (4 files)                                   |
| Seed post language          | **Spanish** prose (this document and all code remain English)          |
| Seed post topics            | SOLID principles, React testing, Feature-Sliced Design / architecture  |
| Theme                       | Light **and** dark, with a persisted user toggle                       |
| Tags                        | Rendered as labels, decorative — no filtering, no routes               |
| Deploy target               | Vercel                                                                 |

**On the draft stub:** the 4th file is a near-empty post with `draft: true`. Its only
job is to prove that `publishedSlugs()` excludes drafts from the prerender output.
Without it, that branch ships unverified.

**Route scope note:** there is no landing route. `/` _is_ the post index.

## 3. Cross-Cutting Constraints

Every phase is bound by these. They are repeated from the style documents because they
are the rules most likely to be broken by muscle memory.

- **No `enum`, no parameter properties, no `namespace`** — `erasableSyntaxOnly`. Use
  string-literal unions.
- **No `baseUrl` in any tsconfig** — TypeScript 6 makes it a build-breaking error
  (`TS5101`). `paths` alone is correct. Most shadcn guides online tell you to add it.
- **The `@/*` alias lives in three files** — `tsconfig.json`, `tsconfig.app.json`,
  `vite.config.ts`. Changing one means changing all three.
- **No raw colour values in components.** Every colour resolves to a token. Both the
  raw `--p-*` value and its `@theme` mapping are required — a token with only one of the
  two silently generates nothing.
- **One accent.** The accent colour appears on keywords and the focus ring, nowhere else.
  Links are underlined, not coloured.
- **`bg-linear-to-*`**, never `bg-gradient-to-*` (deprecated v3 spelling).
- **Motion owns animated properties exclusively.** An element must never carry a
  Tailwind `transition-*` utility for a property Motion drives.
- **Motion animates only `opacity` and `transform`.** CSS may transition paint-only
  properties (`color`, `background-color`, `border-color`, `text-decoration-color`);
  Motion may not.
- **`useReducedMotion()` is mandatory** in any component with reveal or entrance
  animation, and the reduced branch renders the _final_ state.
- **`cn()` from `@/shared/lib/utils`** for conditional classes — never template strings.
- **Import Lucide icons individually**, never as a namespace import.

## 4. Phase Dependency Graph

```
Phase 0 ──> Phase 1 ──> Phase 2 ──┬──> Phase 4 ──┬──> Phase 6 ──> Phase 7 ──> Phase 8
                                  │              │
                                  └──> Phase 5 ──┘

Phase 3 (design tokens) implements the style document. Nothing visual is
         finalised before it lands.
```

- Phases 4 and 5 are independent of each other and may proceed in parallel.
- Phase 3 has no external blocker: the palette, type scale, rhythm, and component
  inventory are already specified. It is implementation, not design.
- Phase 8 gates the release and depends on everything.

---

## Phase 0 — Toolchain Migration to React Router Framework Mode

> Formatting, linting, git hooks, testing, and release tooling are already
> installed and configured — see [`CODESTYLE.md`](./CODESTYLE.md). This phase
> covers the framework migration and the FSD restructure only.

The current project is a plain Vite SPA. Framework mode is what makes prerendering,
per-route metadata, and file-based routing possible. Nothing else can start until this
lands.

- [x] Install routing dependencies: `react-router@^8.3.1`, `@react-router/dev@^8.3.1`
- [x] Create `react-router.config.ts` with `appDirectory: "src/app"`, `ssr: false`, and a
      `prerender` function (the `publishedSlugs()` body arrives in Phase 2 — stub it to
      return `getStaticPaths()` only for now)
- [x] Create `src/app/root.tsx` (document shell with `<Meta />`, `<Links />`,
      `<Scripts />`), `src/app/routes.ts`, and `src/app/entry.client.tsx`
- [x] Replace `@vitejs/plugin-react` with `reactRouter()` in `vite.config.ts`, and
      **uninstall** `@vitejs/plugin-react` — keeping both double-transforms JSX and
      breaks Fast Refresh
- [x] Change the build script to `react-router typegen && tsc -b && react-router build`
- [x] Add `.react-router/types/**/*` to `include` and `rootDirs` in `tsconfig.app.json`
- [x] Add `.react-router/` to `.gitignore`
- [x] Pin Node: `.nvmrc` with `26.4.0` and an `engines.node` field in `package.json`
- [x] Delete the scaffold `src/App.tsx` and the unused `src/assets/react.svg` /
      `src/assets/vite.svg`
- [x] Move existing files into their FSD layers: `src/components/ui` → `src/shared/ui`,
      `src/lib/utils.ts` → `src/shared/lib/utils.ts`, `src/index.css` →
      `src/app/styles/index.css`; update `components.json` to match
- [x] Swap the typeface: remove `@fontsource-variable/geist`, add
      `@fontsource-variable/inter` and `@fontsource-variable/newsreader` (italic subset
      only), imported from the app entry before the Tailwind stylesheet

**Done when:** `pnpm dev` serves the app, `pnpm build` completes, and `dist/index.html`
contains real rendered markup rather than an empty `<div id="root">`.

---

## Phase 1 — MDX Pipeline

Prove that an `.mdx` file can become a typed, styled, syntax-highlighted React route
before writing any real content against it.

- [x] Install MDX dependencies: `@mdx-js/react@^3.1.1`, and as dev deps
      `@mdx-js/rollup@^3.1.1`, `@types/mdx@^2.0.14`
- [x] Install content plugins: `remark-frontmatter@^5.0.0`,
      `remark-mdx-frontmatter@^5.2.0`, `remark-gfm@^4.0.1`, `rehype-slug@^6.0.0`,
      `rehype-pretty-code@^0.14.5`, `shiki@^4.4.3`
- [x] Register `@mdx-js/rollup` in `vite.config.ts` with `enforce: "pre"` — it must run
      before React Router's transform
- [x] Set `providerImportSource: "@mdx-js/react"` — **without it `MDXProvider` is
      silently ignored** and the component map never applies
- [x] Wire the remark chain (`remarkFrontmatter`, `remarkMdxFrontmatter` with
      `{ name: "frontmatter" }`, `remarkGfm`) and the rehype chain (`rehypeSlug`,
      `rehypePrettyCode`)
- [x] Create `src/mdx.d.ts` declaring `*.mdx` with a typed `frontmatter` named export
- [x] Create `src/entities/post/model/types.ts` with `PostFrontmatter`, `PostModule`,
      `PostSummary`
- [x] Add one throwaway `.mdx` file and render it through a temporary route

**Done when:** the throwaway post renders, `frontmatter` is typed at the import site
(not `any`), a fenced code block is highlighted in the built HTML, and grepping
`dist/assets/` finds no `shiki` chunk — highlighting must be build-time only.

---

## Phase 2 — Content Model and Seed Corpus

Replace the throwaway file with a real corpus and the discovery logic that turns files
into routes.

- [x] Write 3 published posts in Spanish: - SOLID principles applied to React components - Testing strategy for React applications - Feature-Sliced Design as a frontend architecture
- [x] Each post must exercise the full element surface: `h2`–`h4`, ordered and unordered
      lists, inline code, fenced code blocks, a blockquote, an image, a table, and all
      four `<Keyword>` variants
- [x] Give the three posts distinct dates and at least one shared tag, so ordering and
      repeated tags are both observable
- [x] Add the 4th file as a `draft: true` stub
- [x] Create `src/entities/post/model/registry.ts` — eager glob, draft filter, date sort,
      plus `getPost(slug)`
- [x] Implement `publishedSlugs()` in `react-router.config.ts` using `gray-matter`
      (`pnpm add -D gray-matter@^4.0.3`) and feed it into `prerender`
- [x] Build the index route (`/`) listing posts, and the post route (`/blog/:slug`)

**Done when:** the index lists exactly 3 posts newest-first, `dist/blog/` contains one
directory per published post, and the draft's slug appears **nowhere** in `dist/`.

---

## Phase 3 — Design Tokens and Prose Typography

Implements the style document. Every later phase styles against these tokens, so nothing
visual is finalised before this lands.

- [x] Replace the generated token block with the two-layer palette: raw `--p-*` values in
      `:root`, overridden for dark mode, mapped to semantic names in `@theme`
- [x] Switch the dark-mode mechanism from a class to `data-theme`, with a `@custom-variant`
      that lets the system preference win when no explicit choice is stored
- [x] Alias the vendored primitives' vocabulary (`background`, `foreground`,
      `muted-foreground`, `border`, `ring`) onto the same palette so generated components
      render project colours without being rewritten
- [x] Declare the full type scale as `--text-*` tokens with their line heights, weights,
      and letter spacing
- [x] Declare `--font-sans`, `--font-serif`, `--font-mono`, the radius scale, the easings,
      and the two container widths
- [x] Build the `.prose` component layer with `:where()` so utilities can always override
      it: block rhythm in `em`, heading spacing weighted above rather than below,
      `text-wrap: pretty` on paragraphs and `balance` on headings
- [x] Scope the serif italic to `<em>` and `<blockquote>`, and nowhere else
- [x] Verify contrast with a real tool in both modes — OKLCH lightness is not WCAG
      relative luminance, so the numbers cannot be eyeballed

**Done when:** no component contains a raw colour value, every token generates the utility
it is supposed to, and text clears 4.5:1 in both modes.

---

## Phase 4 — MDX Component Map

The prose rendering layer. Independent of Phase 5.

- [x] Implement the full element map — `h1`–`h4`, `a`, `ul`/`ol`/`li`, `blockquote`,
      `code`, `pre`, `img`, `hr`, and table elements
- [x] `Heading` — consume the `rehype-slug` id and render an anchor with an accessible
      name (not a bare `#`)
- [x] `CodeBlock` — four highlight tokens only, a copy button revealed on hover and
      always on `focus-visible`, and a scrollable region with an accessible name
- [x] `ProseLink` — underlined text in prose colour, never the accent; external links
      get `rel="noopener noreferrer"` and an indicator glyph outside the link text
- [x] `ProseImage` — **require** explicit `width` and `height`; there is no image
      pipeline, so CLS prevention is manual
- [x] `Blockquote` and `Figure` — the serif italic lives in the first, explicit
      dimensions in the second
- [x] Register the map in `MDXProvider` on the post route
- [x] Vendor any needed primitives with `pnpm dlx shadcn@latest add <component>`, then
      restyle them onto project tokens before use

**Done when:** a post exercising every supported element renders with no unstyled
browser-default fallback anywhere on the page.

---

## Phase 5 — Motion System

The product differentiator. This is the phase the rest of the project exists to support.

- [x] `src/shared/lib/use-pointer-capability.ts` — `useSyncExternalStore` over
      `(hover: hover) and (pointer: fine)`, with the server snapshot returning `true`
      so prerendered HTML matches the resting state on every device
- [x] `AnimatedParagraph` — orchestrates `staggerChildren`, but **only** when the device
      cannot hover; on hover-capable devices it stays in `rest`
- [x] `InteractiveWord` — shared `rest`/`active` variant vocabulary so hover and stagger
      converge on the same visual state
- [x] Implement the underline as a separate absolutely-positioned element animated with
      `scaleX` and `origin-left` — **not** by animating `background-size`, which repaints
      the word's box every frame
- [x] Implement the three tones (`note`, `define`, `reference`) as underline treatments
      — dotted, solid, dashed — all in the single accent. Tones never differ by colour
- [x] Add reduced-motion branches to both components that render the final revealed state
- [x] Mark the underline element `aria-hidden`
- [x] Confirm `<Keyword>` has no `tabIndex`, no `role`, and no cursor change — it is
      decorative emphasis, not a control
- [x] Verify the resting state clears 4.5:1 in both modes: a word that never reveals must
      still be fully readable. This is what makes a decorative reveal acceptable

**Done when:** hovering reveals a word on desktop; emulating a coarse pointer produces
the staggered reveal instead; `prefers-reduced-motion: reduce` yields a fully static,
fully legible page; and no element carries both a Tailwind `transition-*` and a
Motion-driven value for the same property.

> The staggered reveal is the one scroll-triggered animation the project permits. It is
> confined to keywords and may never gate legibility.

---

## Phase 6 — Shell, Navigation and Theme

- [x] Flesh out `src/app/root.tsx`: header, footer, and a skip-to-content link
- [x] Add a root error boundary
- [x] Build the 404 route
- [x] Theme toggle with `localStorage` persistence, setting `data-theme` on `<html>`.
      Three states — light, dark, and following the system — and it lives in the footer,
      not the header: it is not the page's primary action
- [x] **Inline pre-paint script in `app/root.tsx`** that reads the stored preference and
      applies `data-theme` before first paint. This is mandatory, not optional: the HTML
      is prerendered, so there is no server to resolve the theme and the page will
      otherwise flash the wrong palette on every load
- [x] Declare `color-scheme` in both modes so scrollbars and native controls match
- [x] Theme switching is not animated — a full-page crossfade flashes an intermediate grey
- [x] Fall back to `prefers-color-scheme` when no preference is stored
- [x] Ensure the toggle is keyboard reachable and announces its state with `aria-pressed`
- [x] Header and footer are static, never sticky

**Done when:** reloading the site in either theme, with a hard refresh and an empty
cache, produces no visible flash of the opposite palette.

---

## Phase 7 — SEO and Syndication

Prerendering is what makes this phase meaningful — it is why the project is not a plain
SPA.

- [x] Export `meta` from the post route: title, description, `og:title`,
      `og:description`, `og:type: article`
- [x] Export `meta` from the index route
- [x] Generate `sitemap.xml` in the `buildEnd` hook of `react-router.config.ts`, from
      the same `publishedSlugs()` source used for prerendering
- [x] Generate `rss.xml` from the same source
- [x] Add `robots.txt`
- [x] Set `<html lang="es">` — the prose is Spanish
- [x] Add canonical URLs

**Done when:** viewing source on a built post shows the full prose and correct OG tags
without executing JavaScript, and the draft post appears in none of `sitemap.xml`,
`rss.xml`, or `dist/`.

---

## Phase 8 — Quality Gates and Deploy

- [x] **Accessibility:** verify contrast in both themes for both keyword states; confirm
      full keyboard traversal; confirm a screen reader announces keyword text as ordinary
      prose with no interactive affordance; confirm the reduced-motion path
- [x] **Performance:** compare the bundle against the ~190 kB JS / ~60 kB gzip scaffold
      baseline; confirm Lucide icons are individually imported; confirm no `shiki` chunk
      ships; confirm zero CLS on a post with images
- [x] Confirm the keyword budget of 6 per paragraph holds across the corpus
- [x] Run the style document's review checklist against every page
- [x] Run `pnpm lint` clean
- [ ] Create the Vercel project — framework preset Vite, build command `pnpm build`,
      output `dist`. No base path configuration is needed
- [ ] Verify prerendered routes resolve correctly on Vercel, including a deep link
      straight to `/blog/:slug` and a 404 on an unknown path

**Done when:** the production URL is live and Lighthouse scores ≥ 95 on both
Accessibility and SEO.

> The two unchecked steps need the Vercel account itself. `vercel.json` pins the
> preset, build command and output directory, and `pnpm preview` now serves
> `dist/` the way a static host does, so a deep link and an unknown path can be
> checked locally before the deploy.

---

## Phase 9 — Interaction Kit and Polish

The polish skill in `.agents/skills/make-interfaces-feel-better/` governs how things
move and feel from here on; the style document's §6 is its application. Each post
feels unique by composing a shared, data-driven kit from `.mdx` — no per-post code.

- [x] Adopt the skill's values in the shell: `antialiased` root, press `scale(0.96)`
      with a `static` opt-out, icon swap on the copy button, a sliding theme indicator
      that never animates on load, named transition properties everywhere
- [x] Add `shadow-border` / `shadow-border-hover` and `image-edge` tokens; raised
      surfaces drop their borders, images gain the inset outline
- [x] Staged page-header entrance (CSS keyframes, 100ms chunks) on the index and the
      post; the body follows as one chunk; reduced motion zeroes delays too
- [x] Style the highlighter output the pipeline already emits: `title="…"` bars and
      highlighted lines
- [x] Kit: `Callout`, `Compare` (Base UI Tabs), `Flow`, `Layers`, `Steps`, registered
      in the MDX map with contract tests; the accent marks a diagram's active element
- [x] Write "React Native y Expo: el entorno de EAS y cómo funcionan las
      actualizaciones OTA" for complete newcomers, exercising every kit element
- [x] Retrofit the three existing posts with at least one kit element each and delete
      the `<img>`-loaded diagram they no longer need
- [x] Browser pass: every state at 10% speed, both themes, 320/390/1280, keyboard
      through `Layers` → `Compare` → `Steps`, reduced motion, no hydration errors

**Done when:** every post uses the kit, the shell follows the skill's numbers, and
the review checklist in the style document passes on all four posts.

---

## 5. Explicitly Out of Scope for v1

Recorded as decisions, not oversights:

- Tag routes (`/tags/:tag`) and tag filtering
- Search
- Index pagination
- Comments
- Generated Open Graph images (would use `satori` at build time if added)
- A landing page and an `/about` page
- A keyword disclosure panel — the keyword stays decorative
- Migration to Next.js; framework mode already provides the static generation and
  metadata that would have motivated it

## 6. Known Risks

- **The palette has never been rendered.** Every OKLCH value is specified but unproven,
  and OKLCH lightness is not WCAG relative luminance. Expect Phase 3 to retune lightness
  values once real text is on screen, particularly the accent in light mode.
- **Base UI, not Radix.** shadcn is configured with the `base` primitive library. Most
  shadcn snippets published online assume Radix, so imports and prop names from
  third-party examples will need adapting.
- **Vendored primitives arrive with their own palette.** A generated component renders
  the wrong colours until its vocabulary is aliased onto the project palette in Phase 3.
  Installing a primitive is not adopting it.
- **`shadcn add` overwrites.** Re-running `pnpm dlx shadcn@latest add <component>` for a
  component already in `src/shared/ui/` discards local edits. Treat a second `add`
  as a deliberate reset.
- **Prerender plus client-side theming is a known flash hazard.** Phase 6's inline
  script is the mitigation; skipping it will not fail the build, only the experience.
- **The keyword stagger is the project's one exception to its own anti-patterns.** It was
  kept deliberately. If it ever reads as noise, the honest fix is to drop it rather than
  to relax the rule further.
- **The pointer gate has no perfect server snapshot.** Devices that both hover and touch
  (laptops with touchscreens, tablets with trackpads) resolve to the hover model. This
  is a deliberate simplification, not a bug to fix.
