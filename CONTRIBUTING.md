# Contributing to gorlab

This doc is for developers working on the gorlab framework itself: routes, components, data loading, theming, tests, and CLI.

**Are you a site owner?** You don't need any of this. See [starter-template/README.md](starter-template/README.md) for setup, configuration, and usage.


## How the app is structured

The codebase has two distinct layers that should never blur:

| Layer       | Location                                          | Who owns it |
| ----------- | ------------------------------------------------- | ----------- |
| **App**     | `src/` — routes, components, data loading, styles | Developer   |
| **Content** | `posts/`, `gorlab.config.js`, `staticman.yml`    | Site owner  |

SvelteKit prebuilds every route at build time (fully static output to `build/`). There is no server at runtime.

Posts are markdown files in `posts/` — flat or in subdirectories. Subdirectory names have no effect on categories; categories come entirely from the `category:` frontmatter field in each file.

```
src/
├── app.css                    # Tailwind + Skeleton theme imports
├── routes/
│   ├── +layout.ts             # export const prerender = true
│   ├── +layout.svelte         # global nav, theme, dark mode
│   ├── +page.server.ts        # load() — parsePosts + filter dimensions
│   ├── +page.svelte           # catalog: search, filters, sort, pagination
│   ├── resource/[slug]/
│   │   ├── +page.server.ts    # load() + entries() for prerender
│   │   └── +page.svelte       # resource detail page
│   ├── submit/
│   │   └── +page.svelte       # Staticman submission form
│   └── feed.xml/
│       └── +server.ts         # prerendered RSS 2.0 feed
└── lib/
    ├── posts.ts               # parsePosts(), getCategories(), normalizeSubtexts()
    ├── filters.ts             # applyFilters(), sortPosts(), paginate(), getAuthors/Genres/Costs()
    ├── catalog.ts             # reads gorlab.config.js, applies defaults
    ├── config.ts              # TypeScript interfaces (CatalogConfig, CustomField, …)
    ├── CardGrid.svelte        # responsive grid, empty state
    ├── ResourceCard.svelte    # card with cover image / gradient placeholder
    ├── FilterBar.svelte       # dropdown filters + sort select
    ├── TagCloud.svelte        # category pill buttons
    ├── SearchInput.svelte     # text search input
    └── Pagination.svelte      # Skeleton Pagination wrapper
```


## Prerequisites

- Node.js ≥ 20
- npm


## Dev setup

```bash
npm install
npm run dev
```

Opens `http://localhost:5173`. The dev server reads `posts/` directly via Node.js `fs` in the SvelteKit `load()` functions on every request. Expect a brief CPU spike on first load — all posts are parsed from disk each time in dev mode. The built output prerenders everything once and is served instantly.

Changes to `src/` hot-reload automatically. Changes to `posts/` require a manual browser refresh (the files are read at request time, not watched).


## Running tests

```bash
npm run test:unit    # Vitest unit + component tests
npm run test:e2e     # Playwright E2E tests (requires a built preview server)
npm run test         # both in sequence
```

The E2E suite requires a built site:

```bash
npm run build
npm run test:e2e
```

Playwright starts `vite preview` automatically against the built `build/` output and runs tests in Chromium on desktop (1280px) and mobile (375px) viewports.


## Building

```bash
npm run build
```

Outputs a fully static site to `build/`. Every route is prerendered: the catalog index, one HTML file per resource slug, the submission form, and the RSS feed. If `posts/` is empty or absent the build still succeeds — resource pages are simply skipped and the catalog renders its empty state.

To preview the built output locally:

```bash
npm run preview
```

Opens `http://localhost:4173`. If `basePath` is set in `gorlab.config.js` (required for GitHub Pages project sites), the catalog will be at `http://localhost:4173/<basePath>/` instead.


## Theming

The app uses [Skeleton UI](https://skeleton.dev) v4. Themes are CSS files that define Skeleton's custom properties under a `[data-theme='name']` selector. Tailwind utility classes in components reference those properties, so swapping a theme reskins the entire app without touching component code.

`+layout.svelte` sets `data-theme` on `<body>` at runtime via a `$effect`, which makes Skeleton's global styles (background color, base typography) pick up the theme correctly. The `theme` key in `gorlab.config.js` controls which value is applied.

### Bundled presets

Six presets are imported in `src/app.css`: `cerberus`, `wintry`, `vintage`, `crimson`, `pine`, `modern`. The default is `vintage`.

To add more Skeleton presets, import them in `src/app.css`:

```css
@import '@skeletonlabs/skeleton/themes/mona';
```

Full preset list: `cerberus`, `wintry`, `vintage`, `crimson`, `pine`, `modern`, `mona`, `vox`, `seafoam`, `mint`, `rocket`, `concord`, `nouveau`, `legacy`, `sahara`, `hamlindigo`, `rose`, `fennec`, `nosh`, `terminus`, `reign`, `catppuccin`.

### Adding a custom theme (developer path)

1. Open the [Skeleton Theme Generator](https://themes.skeleton.dev/), customize, and copy the generated CSS.
2. Save it (e.g. `src/my-theme.css`) and import it in `src/app.css`:

```css
@import './my-theme.css';
```

3. Set `theme: "my-theme"` in `gorlab.config.js`.

Site owners who don't have access to `src/` can use the `customCss` config option instead — see [starter-template/README.md](starter-template/README.md).

### Dark mode

Dark mode uses `localStorage` + a `$effect` in `+layout.svelte`. The header toggle adds `.dark` to `<html>` and persists the preference. The `@custom-variant dark` rule in `src/app.css` scopes all dark styles to `.dark` descendants. To change the strategy, update the effect in `src/routes/+layout.svelte`.


## Design principles

Three principles define the boundary between app responsibility and operator responsibility. Keep them in mind when adding features.

**1. Graceful degradation over required fields.**
`name` is the only frontmatter field the app enforces. Every other field — `category`, `summary`, `author`, cover image, and so on — degrades cleanly when absent. Components use `{#if}` guards; `posts.ts` normalises missing values to `null` or `[]`. Never add a hard dependency on an optional field.

**2. The build succeeds with no content.**
An empty or absent `posts/` directory is valid. The catalog renders its empty state; the search index step is skipped. This is intentional: the app is the developer's responsibility; the content is the operator's. A broken build caused by missing content is a framework bug, not a content error.

**3. Features are operator-controlled via `gorlab.config.js`.**
Nearly every UI feature is a toggle (`showCost`, `showTagCloud`, `showFilterBar`, `showSubmitForm`, per-dimension `filters`). When adding an optional feature, expose a toggle in `gorlab.config.js` and default it to the least-surprising state. Do not hardcode feature presence.


## Component conventions

- **Svelte 5 runes** everywhere: `$state`, `$derived`, `$effect`, `$props`, `$bindable`. No legacy Options API.
- Filter state lives in `+page.svelte`. Components receive values and emit changes via `bind:` props; they own no global state.
- All internal links must include the `base` import from `$app/paths` and prefix hrefs: `` href=`${base}/resource/${slug}/` ``.
- Local cover image paths need the same `base` prefix since `paths.base` is set in `svelte.config.js`.
- `FilterBar` and `TagCloud` accept a `show` prop; `+page.svelte` passes `data.config.showFilterBar` / `data.config.showTagCloud` directly — no `{#if}` wrappers at the call site.
- `FilterBar` owns the sort select. Pass `bind:sort` from `+page.svelte`.

## Adding a component test

Tests live next to the component file (`src/lib/Foo.test.ts`). The vitest config aliases `$lib` and mocks `$app/paths` (`base = ''`) so components can be imported in jsdom without the SvelteKit runtime.

```ts
import { render, screen } from '@testing-library/svelte'
import MyComponent from './MyComponent.svelte'

test('renders correctly', () => {
  render(MyComponent, { prop: 'value' })
  expect(screen.getByText('value')).toBeInTheDocument()
})
```

Run `npm run test:unit` to confirm.


## CI

Every PR to `main` triggers the `test` job in `.github/workflows/build.yml`, which runs `npm run test:unit`. Merging to `main` runs the full suite (`test:unit` + `test:e2e`), builds the site, and deploys to GitHub Pages.

PRs that add new posts with external `cover-image` URLs are processed by `.github/workflows/fetch-covers.yml`: it downloads each image to `static/covers/`, rewrites the frontmatter, and commits the result back to the PR branch before review.
