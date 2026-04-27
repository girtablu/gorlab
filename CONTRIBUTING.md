# Contributing to jekyll-ttrpg-catalog

This doc is for anyone who wants to modify the frontend: themes, CSS, or Svelte components. End users adding content or changing config don't need any of this; see [README.md](README.md).


## How the app is structured

Jekyll generates `_posts/` into a flat JSON array at `output.json` using a Liquid template. The Svelte app (`src/`) mounts into `<div id="jekyll-ttrpg-catalog-app">` on the page, fetches `output.json` at runtime, and renders the card grid, search, filters, and pagination.

The build output (`assets/app.js` and `assets/app.css`) is committed to the repo so that end users don't need a Node.js environment. Just fork and push.

```
src/
├── main.ts              # mounts App.svelte into #jekyll-ttrpg-catalog-app
├── App.svelte           # fetches output.json, owns all filter/search/page state
├── app.css              # Tailwind + Skeleton imports + theme registrations
└── lib/
    ├── CardGrid.svelte      # responsive grid, empty state
    ├── ResourceCard.svelte  # card with cover image / gradient placeholder
    ├── FilterBar.svelte     # native <select> dropdowns (category, author, genre, cost)
    ├── TagCloud.svelte      # category pill buttons
    ├── SearchInput.svelte   # text search input
    └── Pagination.svelte    # Skeleton Pagination component
```


## Prerequisites

- Node.js ≥ 20
- npm


## Dev setup

```bash
npm install
npm run dev
```

Opens `http://localhost:5173/preview.html`, a full theme preview that renders the card grid, search, filters, and pagination against your actual `_posts/` content.

The preview includes a live theme switcher (all bundled presets) and a dark mode toggle so you can validate your theme before pushing.

**Auto-updating:** a Vite plugin watches `_posts/**/*.md` for changes. Adding, editing, or deleting a post triggers an automatic page reload.

When you're done with UI changes:

```bash
npm run build    # writes assets/app.js and assets/app.css
git add assets/
git commit -m "rebuild assets"
git push
```

GitHub Actions will pick up the committed assets and run `jekyll build` on top of them.

### Watch mode

If you need to test against the real Jekyll output (Liquid templates, entry pages, etc.):

```bash
npm run watch    # rebuilds assets/ on every save
# in a separate terminal:
bundle exec jekyll serve
```


## Theming

The app uses [Skeleton UI](https://skeleton.dev) v4 for theming. Themes are plain CSS files that override Skeleton's CSS custom properties. Tailwind utility classes in the components reference those properties, so swapping a theme reskins the entire app.

### Creating a custom theme

1. Open the [Skeleton Theme Generator](https://themes.skeleton.dev/)
2. Customize colors, radius, fonts, etc. Give the theme a unique name.
3. Click **Code** → **Copy** to get the generated CSS.
4. Save it as a `.css` file in the project root, e.g. `my-theme.css`.
5. Add an import in `src/app.css`:

```css
/* after the existing preset imports */
@import '../my-theme';
```

6. Set `jtc.theme: my-theme` in `_config.yml`.
7. Run `npm run build` and commit `assets/app.css`.

### Adding a Skeleton preset theme to the bundle

Skeleton ships with many preset themes. To make one available without a custom build, add its import to `src/app.css`:

```css
@import '@skeletonlabs/skeleton/themes/catppuccin';
```

Available presets (in `node_modules/@skeletonlabs/skeleton/src/themes/`):
`cerberus`, `wintry`, `vintage`, `crimson`, `pine`, `modern`, `mona`, `vox`,
`seafoam`, `mint`, `rocket`, `concord`, `nouveau`, `legacy`, `sahara`,
`hamlindigo`, `rose`, `fennec`, `nosh`, `terminus`, `reign`, `catppuccin`

Then rebuild and commit `assets/app.css`.

### Dark mode

Dark mode is class-based. The JS in `_includes/head.html` adds `.dark` to `<html>` based on `localStorage` / `prefers-color-scheme`. The toggle button in the header flips it. If you want to change the dark mode strategy, update the `@custom-variant dark` rule in `src/app.css` and the toggle script.


## Svelte component notes

- **Svelte 5** with runes (`$state`, `$derived`, `$props`, `$bindable`, `$effect`).
- All filter logic lives in `App.svelte`. Components receive data and emit changes via `bind:` props.
- `FilterBar.svelte` uses native `<select class="select">` elements; Skeleton's `@tailwindcss/forms` plugin normalizes their appearance across browsers.
- `TagCloud.svelte` uses `chip preset-tonal/preset-filled`; these classes respond to the active Skeleton theme automatically.
- `Pagination.svelte` wraps Skeleton's `Pagination` component from `@skeletonlabs/skeleton-svelte`. The parent uses `bind:page` and the component handles the `onPageChange` → `$bindable` wiring internally.


## Build output

`vite build` writes two files:

| File             | Contents                                         |
| ---------------- | ------------------------------------------------ |
| `assets/app.js`  | Svelte app bundle                                |
| `assets/app.css` | Tailwind + Skeleton core + all bundled theme CSS |

Both are loaded by `_layouts/default.html` and `_includes/head.html`. Committing them means GitHub Pages serves a fully functional site without running `npm` in CI; the Actions workflow still runs `npm run build` to keep the committed artifacts in sync.
