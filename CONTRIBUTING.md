# Contributing to gorlab

This doc is for anyone who wants to modify the app: routes, components, data loading, theming, or tests. End users adding content or changing config don't need any of this — see [README.md](README.md).


## How the app is structured

The codebase has two distinct layers that should never blur:

| Layer       | Location                                          | Who owns it |
| ----------- | ------------------------------------------------- | ----------- |
| **App**     | `src/` — routes, components, data loading, styles | Developer   |
| **Content** | `posts/`, `catalog.config.js`, `staticman.yml`    | Site owner  |

SvelteKit prebuilds every route at build time (fully static output to `_site/`). There is no server at runtime.

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
    ├── filters.ts             # applySearch(), applyFilters(), sortPosts(), paginate()
    ├── catalog.ts             # reads catalog.config.js, applies defaults
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

Playwright starts `vite preview` automatically against the built `_site/` output and runs tests in Chromium on desktop (1280px) and mobile (375px) viewports.


## Building

```bash
npm run build
```

Outputs a fully static site to `_site/`. Every route is prerendered: the catalog index, one HTML file per resource slug, the submission form, and the RSS feed.

To preview the built output locally:

```bash
npm run preview
```

Opens `http://localhost:4173`. The base path is `/gorlab/`, so the catalog is at `http://localhost:4173/gorlab/`.


## Theming

The app uses [Skeleton UI](https://skeleton.dev) v4. Themes are CSS files that set Skeleton's custom properties. Tailwind utility classes in components reference those properties, so swapping a theme reskins the entire app without touching component code.

The active theme is set via the `theme` key in `catalog.config.js`:

```js
theme: "cerberus",   // cerberus | wintry | vintage | crimson | pine | modern
```

This sets `data-theme="cerberus"` on the root element at runtime.

### Creating a custom theme

1. Open the [Skeleton Theme Generator](https://themes.skeleton.dev/)
2. Customize colors, radius, fonts, and give the theme a name.
3. Click **Code → Copy** to get the generated CSS.
4. Save it anywhere (e.g. `src/my-theme.css`) and import it in `src/app.css`:

```css
@import './my-theme.css';
```

5. Set `theme: "my-theme"` in `catalog.config.js`.

### Available preset themes

Skeleton ships many preset themes. Import what you need in `src/app.css`:

```css
@import '@skeletonlabs/skeleton/themes/wintry';
```

Included presets: `cerberus`, `wintry`, `vintage`, `crimson`, `pine`, `modern`, `mona`, `vox`, `seafoam`, `mint`, `rocket`, `concord`, `nouveau`, `legacy`, `sahara`, `hamlindigo`, `rose`, `fennec`, `nosh`, `terminus`, `reign`, `catppuccin`.

### Dark mode

Dark mode uses `localStorage` + a `$effect` in `+layout.svelte`. The header toggle flips `color-scheme: dark/light` on the root and persists it. To change the strategy, update the effect in `src/routes/+layout.svelte`.


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
