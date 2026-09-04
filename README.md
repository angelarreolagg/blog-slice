# blog-demo

An interactive MDX blog. Prose is the product: every post ships as static HTML, and
selected keywords carry a micro-interaction that reveals them as you read — by hover on
devices with a pointer, by a staggered reveal as the paragraph enters view on everything
else.

Built with React 19, Vite 8, Tailwind CSS v4 and Motion, prerendered to static files by
React Router in framework mode. There is no server.

## Quick start

Requires **Node 26** (`.nvmrc`) and **pnpm**.

```bash
pnpm install
pnpm dev
```

The dev server prints a local URL. Posts live in `src/content/posts/` and hot-reload as
you edit them.

## Scripts

| Command              | What it does                                     |
| -------------------- | ------------------------------------------------ |
| `pnpm dev`           | Development server with HMR                      |
| `pnpm build`         | Typecheck, then prerender every route to `dist/` |
| `pnpm preview`       | Serve the production build locally               |
| `pnpm typecheck`     | `tsc -b`, no emit                                |
| `pnpm lint`          | ESLint, including architecture boundary rules    |
| `pnpm lint:fix`      | ESLint with autofix                              |
| `pnpm format`        | Prettier write                                   |
| `pnpm format:check`  | Prettier check, no writes                        |
| `pnpm test`          | Vitest in watch mode                             |
| `pnpm test:run`      | Vitest once                                      |
| `pnpm test:coverage` | Vitest with a coverage report                    |
| `pnpm release`       | Cut a release with release-it                    |

## Writing a post

Create an `.mdx` file in `src/content/posts/`. **The filename is the slug** — a file named
`solid-en-react.mdx` is served at `/blog/solid-en-react`. There is no slug field to keep
in sync.

```mdx
---
title: "SOLID aplicado a componentes de React"
description: "Qué sobrevive de los cinco principios cuando el componente es la unidad."
date: 2026-03-12
tags: ["arquitectura", "react"]
draft: false
---

Los componentes de React son <Keyword tone="define">funciones puras</Keyword> con
respecto a sus props, y esa es la razón por la que el principio de responsabilidad
única se traduce tan directamente.
```

| Field         | Required | Notes                                            |
| ------------- | -------- | ------------------------------------------------ |
| `title`       | yes      | Used as `<h1>`, page title, and OG title         |
| `description` | yes      | Listing subtitle and `og:description`            |
| `date`        | yes      | ISO 8601; drives ordering, newest first          |
| `updated`     | no       | ISO 8601                                         |
| `tags`        | no       | Rendered as labels; they do not link anywhere    |
| `draft`       | no       | `true` excludes the post from the build entirely |

A draft is not merely hidden. It is never prerendered, never listed, and appears in
neither `sitemap.xml` nor `rss.xml` — there is no unlisted URL to stumble onto.

### Keywords

`<Keyword>` is the site's one micro-interaction. It is **decorative emphasis, not a
control**: it takes no focus, exposes no role, and a keyword that never reveals is still
fully legible. Three tones, distinguished by underline treatment rather than colour:

| Tone        | Underline | Use for                   |
| ----------- | --------- | ------------------------- |
| `note`      | dotted    | an aside worth pausing on |
| `define`    | solid     | a term being introduced   |
| `reference` | dashed    | a term defined elsewhere  |

Budget six per paragraph. Past that the reveal reads as noise.

## Project layout

The codebase follows **Feature-Sliced Design**. A module imports only from layers below
its own, and ESLint fails the build when that is violated.

```
src/
  app/        routing, providers, global styles, entry points
  pages/      one screen each
  widgets/    composite blocks reused across pages
  features/   a single interaction with its own state
  entities/   domain models and their components
  shared/     primitives, utilities, config
  content/    authored .mdx prose
```

## Documentation

Three documents govern the project, each authoritative in its own domain:

| Document                                                   | Owns                                                            |
| ---------------------------------------------------------- | --------------------------------------------------------------- |
| [`.claude/docs/STYLEGUIDE.md`](.claude/docs/STYLEGUIDE.md) | Visual design — palette, typography, rhythm, components, motion |
| [`.claude/docs/CODESTYLE.md`](.claude/docs/CODESTYLE.md)   | How code is written, formatted, tested, and committed           |
| [`.claude/docs/ROADMAP.md`](.claude/docs/ROADMAP.md)       | What gets built, in what order, and when a phase is done        |

## Contributing

Commits follow Conventional Commits with a leading emoji, and `commitlint` enforces the
shape:

```
✨ feat: add pointer-aware keyword reveal
```

Git hooks run automatically:

| Hook         | Runs                                |
| ------------ | ----------------------------------- |
| `pre-commit` | Prettier and ESLint on staged files |
| `commit-msg` | Commit header validation            |
| `pre-push`   | Full typecheck and test suite       |

Before opening a change, work through the review checklist in the style guide. The rules
most often missed: no raw colour values, contrast verified in **both** light and dark,
Motion animating only `opacity` and `transform`, and every `<img>` carrying explicit
`width`, `height`, and `alt`.

## Deployment

`pnpm build` writes a fully static site to `dist/` — one HTML file per published post,
plus `sitemap.xml`, `rss.xml`, and `robots.txt`. Any static host will serve it. The
project deploys to Vercel with the Vite preset; no base path configuration is needed.

## License

Private, unlicensed. Demo project.
