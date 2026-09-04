# STYLEGUIDE

The blog's visual system. This document is the source of truth for color, typography, rhythm, and components. If something isn't here, it doesn't exist yet: decide it, document it, then write the code.

**Stack:** React 19.2 · Vite 8 · TypeScript 6 · Tailwind CSS v4.3 · Motion 13 · Vitest · static prerender.
**Styling:** Tailwind is the only system. No CSS-in-JS.

---

## 1. Design direction

The blog is prose. The document leads; the interface disappears.

Four decisions drive everything else:

1. **One column, narrow.** No sidebar, no reading progress bar, no floating "related posts". Line length is the single most important design element on the page.
2. **Color does not create hierarchy.** Size, weight, and whitespace do. The grays carry the load.
3. **There is one chromatic accent and it is reserved.** Amber (`--color-accent`) appears only on interactive _keywords_ and on the focus ring. Regular links are NOT colored: they are underlined text. This makes keywords the only thing on the page that "glows", which is exactly the point of the project.
4. **Two modes, one personality.** Light and dark are the same design with the lightness scale inverted. The light mode isn't warmer and the dark mode isn't more "premium": both are neutral with the same barely-perceptible cool hue.

Analogy: a well-printed book. Paper is paper, ink is ink, and the only pencil underline is the one you drew because that word mattered.

### References

| Reference                                                                                       | What we take from it                                                                        |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| jakubkrehel.com (attached screenshots)                                                          | Density, narrow column, underlined links with no color, **serif italics inside sans prose** |
| [OpenAI blog index](https://mobbin.com/sites/sections/5e1ab7e2-f65a-4900-a378-5fb2b1ad044c)     | Post list as plain text rows: title + meta. No thumbnails                                   |
| [Greptile — All Posts](https://mobbin.com/sites/sections/e09ffa72-0fab-4bd7-9f85-28059bc08467)  | Meta on the left, title on the right, rows separated by a hairline                          |
| [TIDAL — article](https://mobbin.com/sites/sections/356d601a-f6c9-4b62-a844-524df05e7ff1)       | Large title + deck, then prose. Nothing between the header and the text                     |
| [Cursor — compact list](https://mobbin.com/sites/sections/42e504ad-3bda-4b30-811c-313455e9b1c1) | Card as a subtle background block, no shadow                                                |

### Anti-patterns (automatic rejection in review)

- ALL-CAPS eyebrow labels above every heading.
- Meta strings joined with middle dots (`Author · Date · 5 min`). Use spaces and a comma.
- `→` appended to link and button text.
- Layered depth shadows in dark mode. Elevation there is a single white ring (`--shadow-border`, section 3).
- Nested surfaces sharing one radius. Outer radius = inner radius + padding.
- Identical cards with the same radius for everything, regardless of hierarchy.
- Decorative gradients.
- Scroll-triggered animation on layout or content blocks. The one permitted scroll
  trigger is the keyword stagger on coarse-pointer devices (section 5.11), and it may
  never gate legibility.
- Monospace for labels and dates. Mono is **only** for code.

---

## 2. Typography

### The two families

| Role     | Family                                 | Use                                            |
| -------- | -------------------------------------- | ---------------------------------------------- |
| Text     | **Inter** (variable)                   | All interface and prose text                   |
| Emphasis | **Newsreader** (variable, italic only) | `<em>` inline and `<blockquote>`. Nothing else |
| Code     | System stack                           | `<code>` and `<pre>`                           |

**About the reference.** A typeface can't be identified with certainty from a screenshot. The one in the reference is consistent with Inter or with the macOS system stack (SF Pro Text): large x-height, horizontal terminals, double-story `a`, low contrast. Inter is the safe pick because it renders nearly identically across all three platforms, which the system stack does not.

**The decision that does come straight out of the screenshot** is the italic. In "I think _a lot_ about…" and "you can _feel_ the difference", the italics are not the sans italic: they're a **serif italic**. That contrast is the site's only typographic gesture and it carries all the personality. That's why Newsreader is italic-only and scoped to two places — the moment it shows up in a heading it stops being a gesture and becomes decoration.

Both families are self-hosted via Fontsource, never the Google Fonts CDN: a static
prerender must not depend on a third party in the critical path.

```bash
pnpm add @fontsource-variable/inter @fontsource-variable/newsreader
```

```ts
// Imported by the app entry, before the Tailwind entry stylesheet.
import "@fontsource-variable/inter/index.css";
import "@fontsource-variable/newsreader/italic.css"; // italic only
```

Budget: Inter Variable latin ≈ 60 KB woff2, Newsreader italic latin ≈ 45 KB. If fonts exceed ~120 KB, subset before adding anything else.

### Scale

```css
--text-caption: 0.8125rem; /* 13px — image caption */
--text-meta: 0.875rem; /* 14px — date, tag, nav */
--text-body: 1.0625rem; /* 17px — prose body */
--text-lead: 1.1875rem; /* 19px — deck under the title */
--text-h3: 1.25rem; /* 20px */
--text-h2: 1.5rem; /* 24px */
--text-h1: clamp(1.875rem, 1.4rem + 2.2vw, 2.5rem);
--text-display: clamp(2.25rem, 1.6rem + 3vw, 3.25rem);
```

Weights: **400** body · **500** meta, nav, soft emphasis · **600** headings. There is no 700; Inter at 600 already carries enough weight, and 700 breaks the restraint.

Negative tracking starts at `--text-h1`. Text sizes stay at normal tracking — tightening body copy is the most common typographic mistake in dark mode.

Numerals in dates and meta: `font-feature-settings: "tnum"` so date columns in the index don't jitter.

---

## 3. Tokens

Two layers. The raw palette lives in `:root` and flips per mode; `@theme` only maps semantic names onto those variables. A component never knows which mode it's in.

Tailwind v4 generates utilities from the **prefix**: a mis-prefixed token generates nothing.

```css
/* Tailwind entry stylesheet */
@import "tailwindcss";

/* Variant for the manual toggle; the default follows the system */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

/* ---------- Palette: light mode (default) ---------- */
:root {
  color-scheme: light;

  --p-bg: oklch(0.99 0.002 260);
  --p-surface: oklch(0.965 0.003 260);
  --p-surface-hover: oklch(0.94 0.004 260);
  --p-line: oklch(0.91 0.004 260);
  --p-line-strong: oklch(0.8 0.006 260);

  --p-ink: oklch(0.22 0.006 260);
  --p-ink-muted: oklch(0.46 0.008 260);
  --p-ink-faint: oklch(0.56 0.008 260);
  --p-ink-disabled: oklch(0.74 0.006 260);

  --p-accent: oklch(0.58 0.12 70);
  --p-accent-dim: oklch(0.74 0.08 70);

  --p-code-comment: oklch(0.58 0.01 260);
  --p-code-string: oklch(0.48 0.09 150);
  --p-code-keyword: oklch(0.48 0.13 300);
  --p-code-number: oklch(0.5 0.1 50);

  --p-shadow-panel: 0 8px 24px -8px oklch(0.22 0.006 260 / 0.16);
  --p-shadow-border:
    0 0 0 1px oklch(0 0 0 / 0.06), 0 1px 2px -1px oklch(0 0 0 / 0.06),
    0 2px 4px 0 oklch(0 0 0 / 0.04);
  --p-shadow-border-hover:
    0 0 0 1px oklch(0 0 0 / 0.08), 0 1px 2px -1px oklch(0 0 0 / 0.08),
    0 2px 4px 0 oklch(0 0 0 / 0.06);
  --p-image-edge: oklch(0 0 0 / 0.1);
}

/* ---------- Palette: dark mode ---------- */
:root:not([data-theme="light"]) {
  @media (prefers-color-scheme: dark) {
    color-scheme: dark;

    --p-bg: oklch(0.16 0.006 260);
    --p-surface: oklch(0.2 0.007 260);
    --p-surface-hover: oklch(0.23 0.008 260);
    --p-line: oklch(0.27 0.008 260);
    --p-line-strong: oklch(0.36 0.01 260);

    --p-ink: oklch(0.94 0.004 260);
    --p-ink-muted: oklch(0.72 0.006 260);
    --p-ink-faint: oklch(0.6 0.006 260);
    --p-ink-disabled: oklch(0.45 0.006 260);

    --p-accent: oklch(0.84 0.07 85);
    --p-accent-dim: oklch(0.66 0.055 85);

    --p-code-comment: oklch(0.55 0.01 260);
    --p-code-string: oklch(0.8 0.06 150);
    --p-code-keyword: oklch(0.78 0.07 300);
    --p-code-number: oklch(0.82 0.065 60);

    --p-shadow-panel: 0 8px 24px -8px oklch(0 0 0 / 0.6);
    --p-shadow-border: 0 0 0 1px oklch(1 0 0 / 0.08);
    --p-shadow-border-hover: 0 0 0 1px oklch(1 0 0 / 0.13);
    --p-image-edge: oklch(1 0 0 / 0.1);
  }
}

/* Manual override (theme button) — same values as the block above */
[data-theme="dark"] {
  color-scheme: dark;
  /* …repeat the dark-mode --p-* values… */
}

/* ---------- Semantic mapping ---------- */
@theme {
  --color-bg: var(--p-bg);
  --color-surface: var(--p-surface);
  --color-surface-hover: var(--p-surface-hover);
  --color-line: var(--p-line);
  --color-line-strong: var(--p-line-strong);

  --color-ink: var(--p-ink);
  --color-ink-muted: var(--p-ink-muted);
  --color-ink-faint: var(--p-ink-faint);
  --color-ink-disabled: var(--p-ink-disabled);

  --color-accent: var(--p-accent);
  --color-accent-dim: var(--p-accent-dim);

  --color-code-comment: var(--p-code-comment);
  --color-code-string: var(--p-code-string);
  --color-code-keyword: var(--p-code-keyword);
  --color-code-number: var(--p-code-number);

  --shadow-panel: var(--p-shadow-panel);
  --shadow-border: var(--p-shadow-border);
  --shadow-border-hover: var(--p-shadow-border-hover);
  --color-image-edge: var(--p-image-edge);

  --font-sans:
    "Inter Variable", ui-sans-serif, system-ui, -apple-system, "Segoe UI",
    Roboto, sans-serif;
  --font-serif:
    "Newsreader Variable", ui-serif, "Iowan Old Style", Charter, Georgia, serif;
  --font-mono:
    ui-monospace, "SF Mono", "Cascadia Mono", "JetBrains Mono", Menlo, Consolas,
    monospace;

  --text-caption: 0.8125rem;
  --text-caption--line-height: 1.5;
  --text-meta: 0.875rem;
  --text-meta--line-height: 1.5;
  --text-body: 1.0625rem;
  --text-body--line-height: 1.7;
  --text-lead: 1.1875rem;
  --text-lead--line-height: 1.6;
  --text-h3: 1.25rem;
  --text-h3--line-height: 1.4;
  --text-h3--font-weight: 600;
  --text-h2: 1.5rem;
  --text-h2--line-height: 1.3;
  --text-h2--font-weight: 600;
  --text-h2--letter-spacing: -0.01em;
  --text-h1: clamp(1.875rem, 1.4rem + 2.2vw, 2.5rem);
  --text-h1--line-height: 1.15;
  --text-h1--font-weight: 600;
  --text-h1--letter-spacing: -0.022em;
  --text-display: clamp(2.25rem, 1.6rem + 3vw, 3.25rem);
  --text-display--line-height: 1.05;
  --text-display--font-weight: 600;
  --text-display--letter-spacing: -0.03em;

  --radius-sm: 0.25rem; /* inline code, tag */
  --radius-md: 0.5rem; /* button, image, keyword panel */
  --radius-lg: 0.75rem; /* post card, code block */

  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-soft: cubic-bezier(0.45, 0, 0.15, 1);

  --spacing: 0.25rem;
  --breakpoint-sm: 40rem;
  --breakpoint-md: 48rem;
  --breakpoint-lg: 64rem;
}
```

**Column width.** The v4 `--container-*` namespace generates `max-w-*` utilities. Declare
the two the layout needs rather than reaching for arbitrary values.

```css
--container-prose: 38rem; /* ~65ch at 17px → max-w-prose */
--container-wide: 52rem; /* header, footer, index → max-w-wide */
```

### Vendored primitives

Generated primitives ship with their own semantic vocabulary (`background`, `foreground`,
`muted-foreground`, `border`, `ring`). Do not maintain a second palette for them and do
not rewrite their internals. Alias their names onto this palette inside the same
`@theme` block, so a vendored component renders these colors without knowing they exist:

```css
@theme {
  --color-background: var(--p-bg);
  --color-foreground: var(--p-ink);
  --color-muted: var(--p-surface);
  --color-muted-foreground: var(--p-ink-muted);
  --color-border: var(--p-line);
  --color-ring: var(--p-accent);
}
```

The tokens above are the canonical names. The aliases exist only to keep vendored code
compiling; new code never uses them.

### Elevation and edges

**Shadows for elevation, borders for structure.** A container that has a border only
to look raised uses `shadow-border` (three transparent layers in light mode, one white
ring in dark mode) and `shadow-border-hover` on hover, transitioned over 150ms. Borders
stay where they separate: dividers, table cells, the theme toggle's frame, focus rings.
Images carry `outline-image-edge` (`1px`, inset) — pure black or white at 10%, never a
tinted neutral, which reads as dirt on the edge.

### Color usage rules

| Token       | Yes                                                  | No                                           |
| ----------- | ---------------------------------------------------- | -------------------------------------------- |
| `ink`       | Prose, headings, link text                           | Meta, dates                                  |
| `ink-muted` | Deck, card description, inactive nav                 | Prose body                                   |
| `ink-faint` | Date, tag, image caption                             | Any text that has to be read carefully       |
| `accent`    | Keyword, focus ring, the active element of a diagram | Links, buttons, headings, decorative borders |
| `line`      | Hairlines, card border at rest                       | Separating paragraphs                        |

Check contrast with a real tool before moving any `L` value: OKLCH lightness is not WCAG relative luminance. Floor: **4.5:1** for text under 24px, **in both modes**.

### What changes between modes and what doesn't

|                            | Changes                                | Stays the same      |
| -------------------------- | -------------------------------------- | ------------------- |
| Lightness scale            | ✅ inverted                            |                     |
| Hue (260) and chroma       |                                        | ✅ identical        |
| Radii, spacing, typography |                                        | ✅ identical        |
| Shadows                    | ✅ visible in light, near-zero in dark |                     |
| Accent                     | ✅ `L 0.58` light, `L 0.84` dark       | ✅ same hue (70–85) |

The theme toggle is a `<button>` with `aria-pressed`, placed in the footer, not the header. It is not the page's primary action.

---

## 4. Layout and vertical rhythm

```
┌──────────────────────────────────────────────┐
│  ← home                          notes  ↗gh  │  header, max-w-wide, 14px, ink-faint
├──────────────────────────────────────────────┤
│                                              │
│        ┌────────────────────────┐            │
│        │ March 12, 2026         │  meta      │
│        │                        │            │
│        │ A title that can run   │  h1        │
│        │ across two lines       │            │
│        │                        │            │
│        │ A one- or two-line     │  lead      │
│        │ deck, in ink-muted.    │            │
│        │                        │            │
│        │ A prose paragraph that │            │
│        │ never exceeds ~65      │  max-w     │
│        │ characters per line.   │  prose     │
│        │ Here a [word] is       │            │
│        │ interactive.           │            │
│        └────────────────────────┘            │
│                                              │
├──────────────────────────────────────────────┤
│  ← notes                  theme  rss  gh  x  │  footer
└──────────────────────────────────────────────┘
```

- **Alignment: always left.** Nothing is centered except the footer. Centered prose is the fastest way to make a blog look generic.
- **The prose column is `max-w-prose` (38rem).** Header, footer, and index use `max-w-wide` (52rem) and sit visibly wider than the text. That offset frames the reading.
- **Horizontal padding:** `px-6` on mobile, `px-8` from `sm` up.
- **Vertical air:** `py-16` between header and title; `py-24` before the footer. Space is the default separator; `<hr>` is the exception.

### Prose rhythm

MDX renders `<p>`, `<h2>`, `<em>` without classes, so rhythm is defined by a `.prose` component in `@layer components`, using `:where()` to keep specificity at 0 so any Tailwind utility can override it.

```css
@layer components {
  .prose {
    color: var(--color-ink);
    font-size: var(--text-body);
    line-height: 1.7;
    text-wrap: pretty;
  }

  .prose :where(p, ul, ol, figure, pre, blockquote) + * {
    margin-top: 1.25em;
  }
  .prose :where(h2) {
    margin-top: 2.75rem;
    margin-bottom: 0.75rem;
  }
  .prose :where(h3) {
    margin-top: 2rem;
    margin-bottom: 0.5rem;
  }
  .prose :where(h2, h3) {
    text-wrap: balance;
  }
  .prose :where(hr) {
    margin-block: 3rem;
  }
  .prose :where(li) + li {
    margin-top: 0.5em;
  }
  .prose > :first-child {
    margin-top: 0;
  }

  /* The site's typographic gesture: serif italic inside sans prose */
  .prose :where(em, i) {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 1.06em; /* the serif reads smaller at the same size */
    letter-spacing: 0.005em;
  }
}
```

Rules:

- Block spacing is measured in `em`, not `rem`, so it scales with text size.
- An `h2` always has **more** space above than below. It belongs to the text it introduces, not the text before it.
- `text-wrap: pretty` on paragraphs, `balance` on headings. Modern CSS is allowed here and it kills widows without JS.
- `<strong>` does NOT change family. Weight 600 only. If `em` and `strong` compete inside the same paragraph, the paragraph is badly written.

---

## 5. Primitives

Sixteen components. Variants are literal unions, never `enum`.

Generated primitives are allowed as the starting point for anything with a real
accessibility surface — focus management, dismissal, keyboard traversal. They are
vendored into the repository, restyled with the tokens above, and owned from that point
on. Everything purely presentational is written by hand; pulling in a dependency to
render a row with a hairline is not a trade worth making.

```ts
export type ButtonVariant = "primary" | "ghost";
export type ButtonSize = "sm" | "md";
export type KeywordTone = "note" | "define" | "reference";
export type Theme = "light" | "dark" | "system";
```

### 5.1 Link (`<a>`)

Underlined text in the same color as the prose. No color, no arrow.

- Rest: `text-ink underline decoration-line-strong underline-offset-[3px] decoration-1`
- Hover: `decoration-ink`
- Focus: accent ring, see section 7
- External: `rel="noopener noreferrer" target="_blank"` and an `↗` glyph **outside** the link text.

### 5.2 Button

Two variants, two sizes. There is no third.

|            | `primary`                    | `ghost`                                  |
| ---------- | ---------------------------- | ---------------------------------------- |
| Background | `bg-ink text-bg`             | `bg-transparent text-ink-muted`          |
| Border     | none                         | `border border-line`                     |
| Hover      | `bg-ink/90`                  | `bg-surface text-ink border-line-strong` |
| Use        | One action per page, maximum | Everything else                          |

Sizes: `sm` → `h-8 px-3 text-meta`; `md` → `h-10 px-4 text-meta`. Radius `rounded-md`.
Always `<button type="button">` with an explicit `cursor-pointer` (Tailwind v4 no longer applies it by default).
Press: `scale(0.96)` over 150ms `ease-out` as a CSS transition, so a release mid-press returns smoothly. A `static` prop opts out where the motion would only distract.

### 5.3 PostCard

A row, not a card.

```
┌───────────────────────────────────────────────┐
│ Post title                                    │  h3, ink
│ One-line description                          │  meta, ink-muted
│ Mar 12, 2026   typography                     │  meta, ink-faint
└───────────────────────────────────────────────┘
   ↑ hairline border-b border-line between rows
```

- The whole row is the click target: an `<a>` wrapping the block, with the title as accessible text.
- Rest: no background, just `border-b border-line`.
- Hover / focus-within: `bg-surface`, `rounded-lg`, and the `border-b` goes transparent. Use `:has()` for the container state.
- There is **no** cover image. There is no image pipeline.

### 5.4 Tag

`inline-flex items-center h-6 px-2 rounded-sm text-meta text-ink-faint bg-surface`

No caps, no `#`, no border. If it navigates, it inherits Link states.

### 5.5 CodeBlock (`<pre><code>`)

The highlighter's `<figure>` is the surface: `rounded-lg bg-surface shadow-border overflow-hidden`. Inside it the `<pre>` is `p-4 overflow-x-auto font-mono text-[0.875rem] leading-[1.65]`.

- A fenced ` ```json title="eas.json" ` renders a title bar: `border-b border-line font-mono text-caption text-ink-muted px-4 py-2`.
- Highlighted lines (` ```ts {2,4-5} `) get `bg-surface-hover` and a 2px `line-strong` inset bar, bleeding across the scroll width. No accent.

- `surface` background, one step off the page in both modes.
- Highlighting uses the four `--color-code-*` tokens. Four colors, not twelve.
- No line numbers unless the post references them.
- Copy button as `ghost sm`, visible on `group-hover` and **always** on `focus-visible`.
- The `<pre>` carries `tabindex="0"` and `role="region"` with an `aria-label` naming the language.

### 5.6 InlineCode (`<code>`)

`font-mono text-[0.9375em] px-1 py-0.5 rounded-sm bg-surface text-ink`

Sized in `em` so it doesn't break the baseline of its paragraph.

### 5.7 Blockquote

The second and last place `--font-serif` appears.

`font-serif italic text-lead text-ink-muted border-l border-line pl-5`

No oversized decorative quote marks. Not centered. Attribution goes in an inner `<footer>` with `text-meta text-ink-faint` **in sans**.

### 5.8 Figure

```html
<figure>
  <img
    class="outline-image-edge h-auto w-full rounded-md outline -outline-offset-1"
    width="1600"
    height="900"
    loading="lazy"
    decoding="async"
    alt="…"
  />
  <figcaption class="text-caption text-ink-faint mt-3">…</figcaption>
</figure>
```

- `width` and `height` are mandatory: with no image pipeline, CLS is prevented by hand.
- The image may bleed out to `max-w-wide`; the `figcaption` stays aligned to the left edge of the prose column.
- `alt=""` only when the caption fully describes the image.

### 5.9 Divider (`<hr>`)

`border-0 border-t border-line`, `margin-block: 3rem`. One weight only.

### 5.10 Header / Footer / Nav

- Static, not sticky. A sticky header steals 56px of reading on every scroll.
- `text-meta text-ink-faint`, hover to `text-ink`.
- Nav of 2–4 links. Current page marked with `aria-current="page"` and `text-ink`.
- Footer: theme toggle + the 6 sprite logos, `size-4`, `text-ink-faint`, hover `text-ink`, each with an `aria-label`.
- The theme toggle marks its choice with one `bg-surface-hover` indicator that slides between options (`translate`, 150ms `ease-out`) — only after a click, never on page load. The pressed option also turns `text-ink`, so the slide is never the only cue.

### 5.11 Keyword — the distinctive component

The site's only micro-interaction and the only use of the accent. A keyword is
**decorative emphasis, not a control**: it reveals itself, it does not disclose hidden
content.

**At rest** the word reads as prose, carrying a faint accent underline. **Revealed**, the
underline fills to solid accent and the word reaches full ink. What triggers the reveal
depends on what the device can do:

| Device                        | Trigger                                                 |
| ----------------------------- | ------------------------------------------------------- |
| Fine pointer (`hover: hover`) | hovering the word                                       |
| Coarse pointer                | a staggered reveal as the paragraph enters the viewport |

Both paths animate to the same visual state, so there is one appearance to design and
one to review. The gate lives in a single hook, never scattered across components.

**Implementation:** the underline is a separate absolutely-positioned element animated
with `scaleX` from `origin-left` — never `background-size`, which repaints the word's box
on every frame. The word's text animates `opacity` only.

```css
/* resting underline */
height: 1px;
background: color-mix(in oklab, var(--color-accent) 45%, transparent);
```

**Tones** (`KeywordTone`) are distinguished by underline treatment, never by color. There
is one accent and it has no variants:

| Tone        | Underline | Use for                   |
| ----------- | --------- | ------------------------- |
| `note`      | dotted    | an aside worth pausing on |
| `define`    | solid     | a term being introduced   |
| `reference` | dashed    | a term defined elsewhere  |

**Accessibility contract (non-negotiable):**

- Rendered as a `<span>`. No `role`, no `tabIndex`, no cursor change — nothing may
  promise an interaction that touch and keyboard users cannot perform.
- The underline element is `aria-hidden`. A screen reader announces ordinary prose.
- **Contrast clears 4.5:1 in both the resting and revealed states, in both modes.** This
  is what makes a purely decorative reveal acceptable: a word that never reveals is still
  fully readable. It is the single most important rule in this section.
- Under `prefers-reduced-motion: reduce`, the word renders in its revealed state
  immediately. The reduced path never hides content.
- Budget: **6 keywords per paragraph**. Past that the stagger reads as noise.

**Deliberately not built:** a disclosure panel carrying a note. That would make the
keyword a `<button>` with `aria-expanded`, `aria-controls`, and dismissal handling — a
different component with a different contract. If it is ever wanted, it is added here
first, as a separate primitive.

### 5.12 Callout

An aside that interrupts the prose on purpose. `role="note"`, `shadow-border rounded-lg bg-surface p-4`, a Lucide icon at `strokeWidth={1.5}` beside the text. Two tones, distinguished by icon and accessible name, never by colour: `note` (`Info`) and `warning` (`TriangleAlert`).

```ts
export type CalloutTone = "note" | "warning";
```

### 5.13 Compare (tabs)

Base UI Tabs, vendored and restyled: `tablist` / `tab` / `tabpanel`, arrow keys, uncontrolled `defaultValue` so prerender and hydration agree. Tabs are `text-meta`, `text-ink-muted`, the active one `text-ink` with a `border-b border-ink` — that border is the static cue. A hairline indicator slides under the active tab (`translate` + `width`, 200ms `ease-out`); it is hidden until measured and is never the only cue. Authored as `<Compare label defaultItem>` with `<CompareItem id label>` children.

### 5.14 Flow

A linear diagram: `<ol aria-label>` of nodes with one arrow between each pair. Horizontal from `sm`, vertical below it (one `ArrowRight` icon, `rotate-90 sm:rotate-0`). Nodes are `shadow-border rounded-md px-3 py-2 text-meta text-center`. `activeId` gives one node `ring-1 ring-accent text-ink` and `aria-current="step"`. Purely presentational.

### 5.15 Layers

Stacked bands, one per item, in a `role="group" aria-label`. Each band is a real `<button type="button" aria-pressed>` toggle at least `min-h-11` tall; hover highlights on fine pointers, a tap sets state on touch. The active band is `ring-1 ring-accent bg-surface text-ink`; bands the active one `reaches` get `bg-surface`; the rest drop to `opacity-60` and must still clear 4.5:1. Every state change is a CSS transition ≤150ms.

### 5.16 Steps

A walkthrough that owns an index: a `Flow` with the active node, a `Paso n de N` counter in `tabular-nums`, and previous/next `ghost sm` buttons with `aria-label`s, disabled at the ends. The description lives in a stable `aria-live="polite"` wrapper of fixed minimum height; the text inside enters with `opacity + translateY 12px + blur 4px` over 200ms and exits with `translateY -12px` over 150ms. The first step is what the prerendered HTML shows.

The kit is declared from `.mdx` with data; a post never ships its own components. Its control copy (`Paso 2 de 4`, `Paso siguiente`) is in the prose language, because it reads as part of the article.

---

## 6. Motion

The installed skill `.agents/skills/make-interfaces-feel-better/` (animations.md,
surfaces.md, icons.md) is the authority on how things move and feel; this section is
its application to the blog.

Hard rules:

1. **Motion animates `opacity`, `transform` and, for icon swaps and step panels only, `filter`.** `width`, `height`, `box-shadow`, `background-size`, `top/left` and `margin` are never animated by anything.
2. **Interactive state uses CSS transitions**, which retarget mid-flight; **keyframes are for one-shot sequences** (page entrances). Never `transition-all` — name the properties.
3. An element animated by Motion does **not** carry a Tailwind `transition-*` on the same property.
4. **Motion is never the only feedback channel.** Every animated state also has a static cue: colour, icon, label or attribute.
5. `prefers-reduced-motion: reduce` is mandatory, and the reduced state shows **the final content** with no delayed chunks.
6. **No custom animation on high-frequency interactions.** Row hovers and keystrokes get instant feedback or a ≤150ms `opacity` / `background-color` transition.

**Durations:** hover 100–150ms · press 150ms · icon swap 300ms · step panel 200ms in, 150ms out · page-header entrance 400ms with chunks 100ms apart. Nothing else exceeds 300ms.

| Moment                  | Property                                                           | Duration               | Easing                                                  |
| ----------------------- | ------------------------------------------------------------------ | ---------------------- | ------------------------------------------------------- |
| Link hover              | `text-decoration-color`                                            | 120ms                  | `--ease-soft`                                           |
| Post row hover          | `background-color`                                                 | 100ms                  | `ease-out`                                              |
| Surface hover           | `box-shadow` (`shadow-border-hover`)                               | 150ms                  | `ease-out`                                              |
| Button press            | `scale(0.96)`, CSS transition                                      | 150ms                  | `ease-out`                                              |
| Contextual icon         | `scale .25→1`, `opacity 0→1`, `blur 4→0`                           | spring 300ms, bounce 0 | Motion; CSS `cubic-bezier(0.2, 0, 0, 1)` when no Motion |
| Theme indicator         | `translate`, after a click only                                    | 150ms                  | `ease-out`                                              |
| Page-header entrance    | `opacity`, `translateY 12→0`, `blur 4→0`, once, chunks 100ms apart | 400ms                  | `--ease-out-quart`                                      |
| Body entrance           | `opacity` 0→1, once, 200ms after the header                        | 240ms                  | `--ease-out-quart`                                      |
| Step panel              | in: `opacity`, `y 12→0`, `blur`; out: `y → -12`, `blur`            | 200ms / 150ms          | `--ease-out-quart` / `ease-out`                         |
| Diagram highlight       | `box-shadow`, `background-color`, `color`, `opacity`               | 150ms                  | `ease-out`                                              |
| Keyword reveal (hover)  | `scaleX` + `opacity`                                               | 180ms                  | `--ease-out-quart`                                      |
| Keyword stagger (touch) | `scaleX` + `opacity`                                               | 180ms, 120ms apart     | `--ease-out-quart`                                      |

Page entrances are CSS keyframes on the prerendered markup so the prose is visible before, and without, JavaScript. Split the header into its semantic chunks (date, title, deck, tags) and stagger them; the body is one chunk. Nothing scroll-triggers except the keyword stagger.

**Theme switching is not animated.** A full-page crossfade is expensive and produces an intermediate gray flash.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    animation-delay: 0ms !important;
  }
}
```

The zeroed delay matters: a staggered chunk with `animation-fill-mode: both` stays invisible for its delay even at zero duration. In Motion, also read the preference and pass `transition={{ duration: 0 }}` — the media query does not stop a JS-driven animation.

---

## 7. Accessibility (floor, not aspiration)

- **Visible focus:** `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`. Never `outline-none` without a replacement.
- **Contrast:** 4.5:1 for text under 24px, 3:1 for large text and for borders that communicate state. Verified in **both modes**.
- One `<h1>` per page. MDX headings do not skip levels.
- Skip link as the first element in `<body>`, visible on focus only.
- `<html lang="…">` set to the post's actual language.
- `color-scheme` declared in both modes so scrollbars and native controls match.
- Minimum hit area 44×44 px on touch and 40×40 px in dense desktop UI, extended with a pseudo-element when the visible control is smaller; two hit areas never overlap. Keywords are not controls and get none.
- The theme toggle respects `prefers-color-scheme` by default and persists an explicit choice in `localStorage`. An inline script in `<head>` applies `data-theme` before first paint to avoid the wrong-theme flash.

---

## 8. Testing

Deliberately narrow scope: design is reviewed with your eyes, not with assertions. Tests
cover **contracts**, not appearance. Test runner configuration is not defined here.

### What gets tested

Three categories only. Everything else is noise.

1. **Render smoke.** The component mounts and shows the content it receives via props.
   One test per primitive.
2. **Accessibility contract.** Correct role, ARIA that reflects state, working keyboard,
   focus where it belongs. Most of the effort goes here.
3. **Stateful logic.** Theme toggle, code copy button, and the keyword's pointer gate.
   Nothing else holds state.

### What does not get tested

- Tailwind classes (`expect(el).toHaveClass("bg-surface")`). Breaks on every refactor and
  proves nothing about how it looks.
- Computed styles. Stylesheets are not processed under test, on purpose.
- Markup snapshots. They get approved without being read and stop meaning anything by
  week three.
- Animation frames, easing curves, intermediate transform values.
- That MDX compiles. The build proves that.

### Example: the Keyword contract

The keyword is decorative, so its contract is mostly about what it must **not** expose.

```tsx
describe("Keyword", () => {
  it("renders as prose, not as a control", () => {
    render(<Keyword tone="define">hydration</Keyword>);

    expect(screen.getByText("hydration")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("hides the underline from assistive technology", () => {
    const { container } = render(<Keyword tone="note">hydration</Keyword>);

    expect(container.querySelector("[aria-hidden]")).toBeInTheDocument();
  });

  it("renders revealed when the reader asks for less motion", () => {
    mockMatchMedia({ "(prefers-reduced-motion: reduce)": true });
    render(<Keyword tone="define">hydration</Keyword>);

    expect(screen.getByText("hydration")).toBeVisible();
  });
});
```

### Example: the pointer gate

The one piece of keyword logic worth asserting is which reveal path a device gets.

```tsx
it("staggers on coarse pointers instead of waiting for hover", () => {
  mockMatchMedia({ "(hover: hover) and (pointer: fine)": false });
  render(<AnimatedParagraph>…</AnimatedParagraph>);

  expect(screen.getByTestId("paragraph")).toHaveAttribute(
    "data-reveal",
    "stagger",
  );
});
```

A `matchMedia` stub is required: no headless DOM implements it, and both the pointer gate
and the reduced-motion branch read it during first render.

Coverage target: **there isn't one**. Every primitive has its contract tests or the change
does not land. The rest does not count.

## 9. PR checklist

- [ ] Every token I used has the correct prefix and generates a utility.
- [ ] No hardcoded color values. No `style={{}}`.
- [ ] Looks right in **light and dark**, and contrast clears 4.5:1 in both.
- [ ] `bg-linear-to-*`, not `bg-gradient-to-*`.
- [ ] Variants are literal unions, no `enum`.
- [ ] Motion animates only `opacity`, `transform` and — for icon swaps and step panels — `filter`.
- [ ] Interactive states are CSS transitions with named properties; keyframes only run once.
- [ ] Press scale is exactly `0.96`; nested radii are concentric; raised surfaces use `shadow-border`, not a border.
- [ ] No Motion element carries a Tailwind `transition-*` on the same property.
- [ ] `prefers-reduced-motion` respected, and the reduced state shows full content.
- [ ] Visible keyboard focus on every new interactive element.
- [ ] Every `<img>` has `width`, `height`, and `alt`.
- [ ] Prose does not exceed `max-w-prose`.
- [ ] The serif appears only in `<em>` and `<blockquote>`.
- [ ] Keywords clear 4.5:1 at rest, not only when revealed.
- [ ] The component's contract tests exist and pass.
- [ ] No meta string uses `·`, no label uses ALL CAPS, no link ends in `→`.

---

## 10. Out of scope

Documented so nobody assumes otherwise:

- Image pipeline: no automatic resize, WebP, or `srcset`. Dimensions are written by hand.
- Storybook.
- End-to-end and visual regression tests.
- A keyword disclosure panel (see section 5.11).

**In scope, with conditions.** A generated component library and an icon set are part of
the project. Both are constrained rather than banned:

- Vendored primitives are restyled with the tokens in section 3 before use. A primitive
  that still renders its own palette has not been adopted, only installed.
- Icons come from one library plus the existing brand sprite. Never a third source.
- Neither may introduce a second styling system, a second palette, or a second set of
  motion durations.

When anything else enters the project, its section is added here before the first line of
code is written.
