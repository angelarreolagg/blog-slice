# Code Style

> This document owns **how code is written, formatted, tested, and committed**. Rules
> here are enforced by tooling wherever enforcement is possible; the rest are review
> criteria. Visual design — color, typography, spacing, motion, component appearance —
> is out of its scope.

## 1. Language

- **All code, identifiers, comments, commit messages, branch names, and documentation
  are written in English.** No exceptions.
- The only Spanish in the repository is authored prose inside `src/content/posts/*.mdx`
  and the `lang` attribute that serves it.
- One exception: control copy that renders _inside_ the prose (the kit's `Paso 2 de 4`,
  `Paso siguiente`) follows the prose language, because a reader meets it mid-article.

## 2. Architecture: Feature-Sliced Design

The project follows FSD. Layers are ordered; **a module may only import from layers
strictly below its own**, never sideways within the same layer and never upward.

```
app       ← routing, providers, global styles, entry points
pages     ← one screen each, composed from lower layers
widgets   ← self-contained composite blocks reused across pages
features  ← a single user-facing interaction with its own state
entities  ← domain models and their presentational components
shared    ← framework-agnostic primitives, utilities, config
```

### Directory layout

```
src/
  app/
    root.tsx              # document shell
    routes.ts             # route table
    entry.client.tsx
    routes/               # thin route modules, one per route
    providers/            # MDXProvider, theme provider
    styles/index.css      # Tailwind entry and design tokens
  pages/
    post-list/
    post-detail/
    not-found/
  widgets/
    site-header/
    site-footer/
  features/
    theme-toggle/
    copy-code/
  entities/
    post/
  shared/
    ui/                   # shadcn/ui primitives
    lib/                  # cn, generic hooks and helpers
    config/
  content/
    posts/*.mdx           # authored prose (data, not code)
```

`src/content/` is a deliberate exception: it holds authored `.mdx` prose, which is data
rather than code, and is read by the `post` entity. It is not a layer and must not
import from one.

### Slice internals

A slice is a folder inside a layer. Slices are split into segments:

| Segment  | Holds                        |
| -------- | ---------------------------- |
| `ui/`    | React components             |
| `model/` | types, state, business logic |
| `lib/`   | helpers local to the slice   |
| `api/`   | data access                  |

Every slice exposes a **public API** through its own `index.ts`. Importing across slices
reaches only that file:

```ts
import { PostCard } from "@/entities/post"; // correct
import { PostCard } from "@/entities/post/ui/post-card"; // forbidden
```

The `shared` layer is exempt: import directly from its segments
(`@/shared/lib/utils`, `@/shared/ui/button`). Its segments are not slices, so
`shared` may also import from itself — `shared/ui` reaches `cn` and the media hooks
in `shared/lib`.

### Reconciling FSD with React Router framework mode

React Router requires `root.tsx`, `routes.ts`, and `entry.client.tsx` to live at the
configured `appDirectory`. Set `appDirectory: "src/app"` so the framework's required
files land inside the `app` layer, where routing belongs under FSD.

**Route modules stay thin.** A file in `src/app/routes/` declares the framework contract
— `loader`, `meta`, `ErrorBoundary`, `default` — and delegates rendering to a page:

```tsx
export { meta } from "@/pages/post-detail";
export { default } from "@/pages/post-detail";
```

No layout, no business logic, and no styling in a route module.

### Enforcement

`eslint-plugin-boundaries` encodes the layer graph as lint rules, so a forbidden import
fails `pnpm lint` and therefore the pre-commit hook. The layer order is declared once in
`eslint.config.js`; do not weaken it to unblock a change — restructure instead.

## 3. TypeScript

- **No `enum`, no parameter properties, no `namespace`** — `erasableSyntaxOnly` rejects
  them. Model closed sets as string-literal unions:
  ```ts
  export type Theme = "light" | "dark";
  ```
- **`import type` for every type-only import** — `verbatimModuleSyntax` requires it.
- **No `any`.** Use `unknown` and narrow. If a third-party type is wrong, cast at the
  boundary in one place, not at every call site.
- **No non-null assertion (`!`)** except where a framework guarantees presence and the
  guarantee is obvious from context (`document.getElementById("root")!` in the entry).
- **Prefer `type` over `interface`** for consistency. Use `interface` only when
  declaration merging is genuinely needed.
- **Use `satisfies`** for config objects that must stay inferrable:
  ```ts
  export default [...] satisfies RouteConfig;
  ```
- **Type props inline or as a local `type`**, never with `React.FC`:
  ```ts
  type PostCardProps = { post: PostSummary };
  export function PostCard({ post }: PostCardProps) {}
  ```
- Exported functions that cross a slice boundary declare an explicit return type.
  Internal helpers may rely on inference.
- Unused bindings fail the build (`noUnusedLocals`, `noUnusedParameters`). Prefix
  deliberately unused parameters with `_`.

## 4. React

- **Function declarations for components**, not arrow constants assigned to a variable.
  Named exports everywhere except where a framework demands `default` (route modules,
  MDX files).
- **Derive, don't synchronise.** If a value can be computed during render, compute it.
  `useEffect` is for synchronising with something _outside_ React — the DOM, a
  subscription, storage — never for keeping one piece of state in step with another.
- **`useSyncExternalStore` for external stores**, including `matchMedia`. It is the only
  approach that stays correct under prerendered HTML.
- Custom hooks are named `use-thing.ts` and export `useThing`.
- Event handlers are `handleThing`; the props that receive them are `onThing`.
- **Keys come from stable identity** (a slug, an id), never an array index.
- **No prop spreading** except inside `shared/ui` primitives that intentionally forward
  the rest of their props.
- Components render one thing. When a component grows a second responsibility, split it
  before it grows a third.
- **Composition over configuration.** Prefer `children` and slots to a long list of
  boolean flags.
- Keep `useMemo` and `useCallback` for measured problems, not as a default wrapper.

## 5. Styling

- Every colour resolves to a design token. No raw hex, no direct palette classes.
- Conditional classes go through `cn()` from `@/shared/lib/utils`. Never build class
  strings with template literals.
- Component variants use `class-variance-authority`, not nested ternaries.
- `bg-linear-to-*`, never the deprecated `bg-gradient-to-*`.
- Inline `style` is allowed only for genuinely dynamic numeric values that cannot be a
  class.
- Motion owns the properties it animates; those properties carry no Tailwind
  `transition-*` utility.

## 6. Comments

Comments are rare and earn their place.

- **Explain why, never what.** The code already says what it does.
- Keep them short and technical — a clause or a single line. Full sentences of prose are
  a sign the code needs renaming instead.
- Write comments for an engineer joining the file cold, with no other context available.
- **Never reference process**: no mentions of documents, plans, phases, tickets,
  authors, dates, or review history. A comment describes the code, not the project.
- **Never leave commented-out code.** Version control already has it.
- No section banners, no decorative separators, no file headers.
- `JSDoc` only on exported functions whose contract is not obvious from the signature.
- `TODO:` is permitted only with a concrete, actionable next step in the same line.

Good:

```ts
// Server snapshot assumes hover so prerendered HTML matches the resting state.
() => true,
```

Bad:

```ts
// This function returns the posts
// Added during the content phase
export function getPosts() {}
```

## 7. Naming and files

- Files and folders: `kebab-case` (`post-card.tsx`, `use-pointer-capability.ts`).
- Components: `PascalCase`. Hooks: `useCamelCase`. Everything else: `camelCase`.
- Constants that are true module-level configuration: `SCREAMING_SNAKE_CASE`.
- One component per file. The filename matches the component, kebab-cased.
- Boolean props and variables read as assertions: `isOpen`, `hasTags`, `canHover`.

## 8. Formatting

**Prettier owns formatting; ESLint owns correctness.** They never overlap —
`eslint-config-prettier` disables every stylistic ESLint rule.

`.prettierrc.json`:

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 80,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

`prettier-plugin-tailwindcss` sorts utility classes canonically. Never reorder them by
hand — the plugin is the single source of truth for class order.

Formatting is never a review topic. If a discussion is about formatting, the answer is
to run Prettier.

## 9. Testing

**Vitest** with **React Testing Library** and **jsdom**.

### Configuration

Tests run from a **separate `vitest.config.ts`**, not from `vite.config.ts`. The
`reactRouter()` plugin is a build-time framework plugin and is not used under test;
`@vitejs/plugin-react` is kept as a dev dependency solely for the test environment.

`src/test/setup.ts` registers `@testing-library/jest-dom` and must provide a
`matchMedia` stub — jsdom does not implement it, and the pointer-capability hook reads
it on first render.

### What to test

- Pure logic: the post registry's draft filtering and date ordering.
- Behaviour that a user can observe: a keyword reveals on hover, the copy button reports
  success, the theme toggle persists a choice.
- Accessibility contracts: keywords expose no interactive role; headings expose named
  anchors.
- The reduced-motion branch renders the final state.

### What not to test

- Animation frames, easing curves, or intermediate transform values.
- Implementation details: internal state, hook call counts, component names.
- Third-party behaviour. Trust Base UI and Motion; test our usage of them.
- Snapshots, except for serialising a small pure data structure.

### Rules

- Test files are colocated with the code they cover: `post-card.test.tsx` beside
  `post-card.tsx`.
- Query by accessible role first (`getByRole`), then label, then text. Reach for
  `data-testid` only when no accessible query exists, and treat that as a smell in the
  component.
- Use `@testing-library/user-event`, not `fireEvent`.
- One behaviour per test. The test name states the behaviour, not the function name.
- No conditional logic inside a test body.
- Tests never import across a slice's public API boundary any differently than
  production code does.

## 10. Git

### Branches

`type/short-description` in kebab-case — `feat/keyword-hover`, `fix/draft-prerender`.

### Commit format

```
{emoji} {type}: {short title}
```

- A single emoji always opens the header, chosen from the table below by type.
- Lowercase type, colon, one space, then a short title.
- **Imperative mood** — `add`, `update`, `remove`. This keeps generated changelog
  entries readable.
- No trailing period. Header stays within 72 characters.
- A body is optional and used only when the title genuinely cannot carry the change.
  When present, it is bullet points, separated from the header by a blank line.

```
✨ feat: add pointer-aware keyword reveal

- gate stagger orchestration behind a hover-capability check
- animate the underline with scaleX instead of background-size
- render the final state under prefers-reduced-motion
```

### Type and emoji table

| Type       | Emoji | Use for                                          |
| ---------- | ----- | ------------------------------------------------ |
| `feat`     | ✨    | a new user-facing capability                     |
| `fix`      | 🐛    | a bug fix                                        |
| `docs`     | 📝    | documentation only                               |
| `style`    | 💄    | visual or formatting change with no logic change |
| `refactor` | ♻️    | restructuring with no behaviour change           |
| `perf`     | ⚡️    | performance                                      |
| `test`     | ✅    | adding or correcting tests                       |
| `build`    | 📦    | build system, bundler, dependencies              |
| `ci`       | 👷    | CI configuration                                 |
| `chore`    | 🔧    | tooling and maintenance                          |
| `revert`   | ⏪️    | reverting a previous commit                      |

🎉 is reserved for a repository's initial commit.

The emoji must match the type. `commitlint` validates the header shape and the type
against this list; the emoji-to-type pairing is a review responsibility.

## 11. Git hooks

Managed by **husky**. Three hooks, each with a distinct job:

| Hook         | Runs                                                 | Blocks                               |
| ------------ | ---------------------------------------------------- | ------------------------------------ |
| `pre-commit` | `lint-staged` — Prettier then ESLint on staged files | unformatted or lint-failing code     |
| `commit-msg` | `commitlint`                                         | a malformed commit header            |
| `pre-push`   | `pnpm typecheck && pnpm test:run`                    | a push that fails typecheck or tests |

`pre-commit` is scoped to staged files so it stays fast. `pre-push` runs the full
typecheck and test suite, which is why it belongs on push rather than on every commit.

Hooks are not optional. `--no-verify` is for recovering a broken repository, not for
routine work.

## 12. Releases

Versioning is handled by **release-it** with the conventional-changelog plugin, which
derives the next version and the changelog from commit types — which is why the commit
format is enforced rather than encouraged.

- `feat` → minor, `fix` → patch, `BREAKING CHANGE:` in the body → major.
- While the project is a demo it stays on `0.x`; a breaking change bumps the minor.
- `CHANGELOG.md` is generated. Never edit it by hand.
- A release is cut from a clean tree on the default branch. release-it tags the commit
  and the tag is the release artifact.

## 13. Scripts

| Script          | Purpose                              |
| --------------- | ------------------------------------ |
| `dev`           | development server                   |
| `build`         | typegen, typecheck, production build |
| `preview`       | serve the production build           |
| `lint`          | ESLint across the repository         |
| `lint:fix`      | ESLint with autofix                  |
| `format`        | Prettier write                       |
| `format:check`  | Prettier check, no writes            |
| `typecheck`     | `tsc -b`                             |
| `test`          | Vitest in watch mode                 |
| `test:run`      | Vitest once, for hooks and CI        |
| `test:coverage` | Vitest with a coverage report        |
| `release`       | release-it                           |
