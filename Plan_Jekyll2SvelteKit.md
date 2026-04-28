# Plan: Migrate Jekyll TTRPG Catalog to SvelteKit

A static catalog app for TTRPG communities — game designers, role-playing groups, game masters, book clubs, and enthusiasts. The primary interface is a filterable tile grid of curated resources, with individual pages for each resource. Filters (category, author, genre, cost, tags, search) adjust which tiles are visible. Categories, tags, and authors are all filter dimensions — none have dedicated routes.

Replace Jekyll with SvelteKit to enable clean dynamic route generation for categories and resources, while preserving static builds for GitHub Pages and Staticman support. The migration also cleanly separates app code from content, enabling a future where site owners update the app without touching their content.

## Architecture Principles

The codebase is split into two distinct layers that should never blur:

| Layer       | Contents                                                | Who owns it |
| ----------- | ------------------------------------------------------- | ----------- |
| **App**     | `src/` — routes, components, data loading, filter logic | Developer   |
| **Content** | `posts/`, `staticman.yml`, `catalog.config.js`          | Site owner  |

`catalog.config.js` is a single, simple config file the site owner controls: site name, predefined categories, and any other deployment-specific values. The app reads from it at build time. Site owners should never need to touch anything in `src/`.

## Steps

1. **Initialize SvelteKit project** — Install SvelteKit, configure for static adapter, migrate package.json dependencies. Establish the `src/` vs. content directory boundary from the start.

2. **Define the config interface** — Create `catalog.config.js` as the replacement for Jekyll's `_config.yml`. This is the only file site owners configure. The following settings migrate from `_config.yml`:
   
   | Old (`_config.yml`)     | New (`catalog.config.js`) | Notes                                  |
   | ----------------------- | ------------------------- | -------------------------------------- |
   | `title`, `description`  | `title`, `description`    | Direct migration                       |
   | `jtc.posts_per_page`    | `postsPerPage`            | Direct migration                       |
   | `jtc.show_submit_form`  | `showSubmitForm`          | Direct migration                       |
   | `jtc.theme`             | `theme`                   | Direct migration                       |
   | `jtc.show_authors_page` | —                         | Removed; authors are filter-only       |
   | —                       | `showTagCloud`            | New; toggles pill-based filter UI      |
   | —                       | `showFilterBar`           | New; toggles dropdown filter UI        |
   | `baseurl`, `url`        | `svelte.config.js` only   | Deployment path, not site owner config |
   
   `baseurl`/`url` move to `kit.paths.base` in `svelte.config.js` because they are build-time deployment configuration, not something a site owner changes day-to-day.
   
   The file is self-documenting: required settings are active, optional settings are commented out with their default values shown inline. Uncommenting a line and changing the value overrides the default. The app always has defaults in place regardless of whether the line is present. Example shape:
   
   ```js
   export default {
     title: "My TTRPG Catalog",
     // description: "",
     // theme: "cerberus",   // cerberus | wintry | vintage | crimson | pine | modern
     // postsPerPage: 24,
     // showSubmitForm: true,
     // showTagCloud: true,   // master toggle: pill-based filter UI — suits small collections
     // showFilterBar: true,  // master toggle: dropdown menu filter UI — suits large collections
     //
     // filters: per-dimension overrides; takes precedence over master toggles above.
     // Each dimension can appear in the tag cloud, the dropdown menu, both, or neither.
     // Defaults shown below — omit the filters block to use defaults.
     // filters: {
     //   category: { cloud: true,  menu: true  },
     //   author:   { cloud: false, menu: true  },
     //   genre:    { cloud: false, menu: true  },
     //   cost:     { cloud: false, menu: true  },
     //   tags:     { cloud: false, menu: false },
     // },
     //
     // Example — tag cloud only, cost hidden everywhere:
     //   showFilterBar: false,
     //   (no filters block needed — cost is not in the cloud by default)
     //
     // Example — menus only, cost hidden:
     //   showTagCloud: false,
     //   filters: { cost: { cloud: false, menu: false } },
     //
     // Categories shown as options in the community submission form.
     // Add, remove, or rename entries to match your catalog's content structure.
     // This does NOT restrict what the app displays — posts in any category will
     // appear automatically. This list only controls what submitters can choose.
     categories: [
       "hacks",
       "monsters",
       "npcs",
       "miscellany",
     ],
   
     // customFields: define additional frontmatter fields specific to your catalog.
     // Each field is added to the resource page display and, if showSubmitForm is true,
     // to the community submission form. Fields not defined here are ignored by the app.
     //
     // key      — the frontmatter key used in markdown files
     // label    — human-readable label shown in the UI
     // type     — "text" | "date" | "url"
     //            url fields render as a clickable link on the resource page
     // multiple — true allows an array of values (e.g. multiple contributors)
     //
     // Example — credits layout used by a podcast catalog:
     // customFields: [
     //   { key: "release_date",  label: "Release Date",  type: "date",   multiple: false },
     //   { key: "writing",       label: "Writing",       type: "text",   multiple: true  },
     //   { key: "layout",        label: "Layout",        type: "text",   multiple: true  },
     //   { key: "editing",       label: "Editing",       type: "text",   multiple: true  },
     //   { key: "development",   label: "Development",   type: "text",   multiple: true  },
     //   { key: "artwork",       label: "Artwork",       type: "text",   multiple: true  },
     //   { key: "cartography",   label: "Cartography",  type: "text",   multiple: true  },
     //   { key: "publisher",     label: "Publisher",     type: "text",   multiple: false },
     //   { key: "format",        label: "Format",        type: "text",   multiple: false },
     //   { key: "game_system",   label: "Game System",   type: "text",   multiple: true  },
     // ],
   }
   ```
   
   The `categories` list controls what options the Staticman submission form presents. It does not gate what the app renders — route generation is driven by what actually exists in `posts/`. A site owner who creates a new `posts/mytopic/` directory and adds posts will see those posts appear in filters and get a `/category/mytopic/` route automatically, without touching this file. The only reason to update `categories` when adding a new category is to make it available to Staticman submitters.

3. **Set up testing infrastructure** — Install Vitest, @testing-library/svelte, and Playwright. Add `test:unit`, `test:e2e`, and `test` scripts to package.json. Configure Playwright for Chromium at desktop (1280px) and mobile (375px) viewports. No tests are written in this step; this is scaffolding only.

4. **Extract and test the data contract** — Pull the frontmatter parsing logic out of the current `postsDevPlugin` in `vite.config.ts` into a standalone pure function (`src/lib/posts.ts`). Write Vitest unit tests against real `posts/` files as fixtures to lock down the expected data shape. The canonical fields are:
   
   | Field           | Type                                 | Notes                                                                                                                                                                                                     |
   | --------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `name`          | string                               | Required                                                                                                                                                                                                  |
   | `category`      | string[]                             | Required; always an array; multi-category is valid and common                                                                                                                                             |
   | `summary`       | string                               | Required                                                                                                                                                                                                  |
   | `slug`          | string                               | Derived from filename                                                                                                                                                                                     |
   | `author`        | string                               | Freeform                                                                                                                                                                                                  |
   | `source`        | string                               | Display label for the source platform                                                                                                                                                                     |
   | `source-url`    | string                               | External link; primary CTA on resource page                                                                                                                                                               |
   | `genre`         | string                               |                                                                                                                                                                                                           |
   | `cost`          | string                               | free / PWYW / price string                                                                                                                                                                                |
   | `license`       | string                               |                                                                                                                                                                                                           |
   | `cover-image`   | string                               | External URL or `/covers/filename.webp`                                                                                                                                                                   |
   | `tags`          | string[]                             | Freeform; drives tag cloud                                                                                                                                                                                |
   | `stats`         | string                               | Stat block line (e.g. "8 HP, 1 Armor")                                                                                                                                                                    |
   | `subtexts`      | string[]                             | Optional bullet list rendered on the resource page. Replaces the Jekyll-era `subtext1`/`subtext2` numbered fields — migrate existing posts during Step 6 cleanup.                                         |
   | `body`          | string                               | Optional markdown body below frontmatter                                                                                                                                                                  |
   | `featured`      | boolean                              | Optional; site operator only — not in Staticman form. Pins card to top of visible results. Filtering takes precedence: a featured card that doesn't match the active filter is hidden, not promoted.      |
   | `sort_priority` | number                               | Optional; site operator only — not in Staticman form. Only applies to featured items. Lower value appears earlier within the featured group. Has no effect on non-featured cards.                         |
   | `meta`          | Record\<string, string \| string[]\> | Derived field — not written in frontmatter directly. `posts.ts` collects any frontmatter keys declared in `catalog.config.js` `customFields` into this object. Keys not declared in config are discarded. |
   | `layout`        | —                                    | **Strip this field** during migration — Jekyll artifact (`layout: entry`). The key `layout` is safe to reuse as a `customFields` entry (e.g. layout designer credit) since all Jekyll values are removed. |
   
   The parsing function processes posts in `posts/incoming/` normally — they appear in the catalog under whatever `category:` values their frontmatter declares. What is excluded is the directory name `incoming` itself: it is never added to the derived category set used for route generation or filter options. No `/category/incoming/` route is created. Unit tests should confirm both behaviors: that posts in `incoming/` appear in the catalog, and that `incoming` does not appear as a category.
   
   These tests are the migration's acceptance gate — passing them confirms SvelteKit's load functions produce identical output to the old plugin.

5. **Extract filtering, search, pagination, and sort logic** — Move the filter, search, pagination, and sort logic currently embedded in `App.svelte` into a pure helper module (`src/lib/filters.ts`). Sort behavior:
   
   - Featured items (`featured: true`) always appear before non-featured in visible results — this cannot be overridden by user sort, as it is operator curation intent.
   - Within the featured group, items are ordered by `sort_priority` ascending. If no `sort_priority` is set, featured items fall back to date descending. User sort does not affect the order of featured items — operator curation is authoritative there.
   - Non-featured items sort purely by the user's selected option: **Newest** (default), **Oldest**, **A–Z**, **Z–A**.
   - Active filters always take precedence over featured pinning: a featured card hidden by a filter is not shown.
   
   Write Vitest unit tests covering filter combinations, search matching, empty results, page boundary math, featured pinning, sort_priority ordering within the featured group only, user sort applied to non-featured items, and the interaction between featured and active filters.

6. **Remove Jekyll artifacts and normalize paths** — Rename `_posts/` to `posts/`. Move `covers/` to `static/covers/` — SvelteKit serves static assets from `static/`; without this move every post with a local `cover-image: /covers/filename.webp` will 404. Delete the following Jekyll artifacts: `preview.html`, `src/preview.ts`, `_layouts/`, `_includes/`, `_config.yml`, `authors.html`, `index.html`, `output.json`, `Gemfile`, and `assets/`. Note: `submit.html` is not deleted here — it is replaced by a SvelteKit route in Step 10.

7. **Migrate content processing** — Replace the `postsDevPlugin` with SvelteKit `load()` functions that read and parse `posts/` markdown files using the pure function from Step 4. The existing unit tests from Step 4 verify correctness; no additional tests are needed here unless new transformation logic is introduced.

8. **Implement routes and root layout** — Create `src/routes/+layout.svelte` as the root layout replacing `_layouts/default.html`: it imports global CSS, registers Skeleton UI themes, applies the dark mode class strategy, and wraps every page. Then create the following page routes:
   
   - `/` — main catalog: full tile grid with all filter controls (category, author, genre, cost, tags, search text). Filter state is reflected in URL parameters (e.g. `/?category=hacks&tags=osr`) so any filtered view is shareable and bookmarkable. The page reads params on load and initialises filter state accordingly.
   - `/resource/[slug]/` — individual resource page; renders: cover image, name, author, source platform + `source-url` as the primary CTA button, genre, cost, license, tags, stats, `subtexts` as a bullet list, the optional markdown body below the frontmatter, and any `meta` fields defined in `catalog.config.js` `customFields` — iterated in config order, with `url` type fields rendered as links and `multiple: true` fields rendered as lists
   - `/submit/` — submission form, shown only when `showSubmitForm: true`
   
   Categories, tags, and authors are all filter dimensions — none have dedicated routes. The only prerendered routes are `/resource/[slug]/` (one per post) and `/feed.xml`.
   
   Also create `src/routes/feed.xml/+server.ts` as a prerendered RSS 2.0 endpoint listing all posts with name, summary, author, category, date, and `source-url`. This lets communities subscribe to new content in any RSS reader.

9. **Migrate Svelte components with component tests** — Move `src/lib/` components into SvelteKit's `src/lib/`. Update the main page to use SvelteKit routing and the extracted filter logic from Step 5. Add a sort control to `FilterBar` (Newest / Oldest / A–Z / Z–A) with Newest as the default. Both `TagCloud` and `FilterBar` are conditionally rendered based on `showTagCloud` and `showFilterBar` in `catalog.config.js` — both default to true. Either can be disabled independently, allowing a site owner to run a purely tag-based UI, a purely menu-based UI, or both together. Apply a subtle visual treatment to featured cards in `ResourceCard` — a mild accent background tint or border using the active Skeleton theme's palette, so the highlighting is always in-theme and never harsh. Write @testing-library/svelte component tests for: TagCloud selection state, TagCloud hidden when `showTagCloud: false`, FilterBar clear behavior including sort reset, FilterBar hidden when `showFilterBar: false`, Pagination rendering and boundary conditions, CardGrid empty state, and ResourceCard featured visual state.

10. **Integrate Staticman** — Replace `submit.html` with `src/routes/submit/+page.svelte`. The submit route renders the community submission form and is only shown when `showSubmitForm: true` in `catalog.config.js`. The category field is a **multiselect** (not a single dropdown) populated from `catalog.config.js`, allowing submitters to assign a resource to multiple categories — reflecting the reality that TTRPG supplements frequently span multiple content types. The form is the enforcement point: submitters can only choose from the approved list. Any `customFields` declared in `catalog.config.js` are also rendered as form inputs — `multiple: true` fields get a tag-style multi-input, `type: "date"` gets a date picker, `type: "url"` gets a URL input. Deployments with no `customFields` see no additional form inputs. Update `staticman.yml`: set `path: posts/incoming`, remove `layout:` from generated frontmatter. Write a Playwright test that fills and submits the form against a mocked Staticman endpoint, verifying the correct fields and target URL are used. Full live Staticman E2E is a future milestone.

11. **Configure CI gates and automated cover image archiving** — Update `.github/workflows/build.yml` to run `npm run test:unit` on every PR as a required check. Add `npm run test:e2e` to the build job before the deploy step. Remove the Ruby/Jekyll build steps; they are no longer needed.
    
    Add a second workflow `.github/workflows/fetch-covers.yml` that triggers on `pull_request: opened`. It checks out the PR branch, runs `scripts/fetch-covers.js`, which scans any new or modified posts for external `cover-image` URLs, fetches each image, saves it to `static/covers/<slug>.<ext>`, and rewrites the frontmatter to the local path `/covers/<slug>.<ext>` in-place. If any images were downloaded, the workflow commits them back to the PR branch. By the time the site owner opens the PR to review, it already contains both the markdown file and the archived cover image — no external URLs remain, and no manual intervention is needed. The script is also runnable locally for operators adding posts by hand.

12. **Update build pipeline** — Reconfigure for SvelteKit's static adapter output. Update the `upload-pages-artifact` path from Jekyll's `_site/` to SvelteKit's `build/`. Confirm assets are served correctly under the GitHub Pages base path.

13. **Full E2E validation** — Write Playwright tests covering the full user journey: load the catalog, apply filters, search by keyword, paginate through results, navigate to a category page, navigate to a resource page. Run against desktop (1280px) and mobile (375px) viewports. Use the live Jekyll deploy as a behavioral reference for expected filter values, route shapes, and content counts.

14. **Rewrite CONTRIBUTING.md** — The existing file is fully obsolete after migration: it references Jekyll, `preview.html`, committing build artifacts, `bundle exec jekyll serve`, and `output.json`. Rewrite it to document the SvelteKit-based developer workflow: dev setup, how the app is structured, how theming works, component conventions, and how to run tests. README.md is rewritten as follow-on work as part of the documentation milestone (Further Consideration #4).

## Progress

`Impl.` = code written and committed | `Tests` = automated tests passing | `Verified` = human confirmed in browser or build output

| #                               | Task                                                                                                                                                                                                            | Impl. | Tests | Verified |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ----- | -------- |
| **SvelteKit Setup**             |                                                                                                                                                                                                                 |       |       |          |
| 1.1                             | Install SvelteKit, static adapter, update `package.json`                                                                                                                                                        | ✅    |       | ✅       |
| 1.2                             | Create `svelte.config.js` with static adapter and `kit.paths.base`                                                                                                                                              | ✅    |       | ✅       |
| 1.3                             | Dev server starts and app loads                                                                                                                                                                                 | ✅    |       | ✅       |
| **Config Interface**            |                                                                                                                                                                                                                 |       |       |          |
| 2.1                             | Create `catalog.config.js` with documented defaults (title, postsPerPage, showSubmitForm, theme, categories)                                                                                                    | ✅    |       | ✅       |
| 2.2                             | Remove `_config.yml`                                                                                                                                                                                            | ✅    |       | ✅       |
| **Testing Infrastructure**      |                                                                                                                                                                                                                 |       |       |          |
| 3.1                             | Install Vitest and @testing-library/svelte                                                                                                                                                                      | ✅    |       | ✅       |
| 3.2                             | Install and configure Playwright — Chromium, 1280px desktop and 375px mobile viewports                                                                                                                          | ✅    |       | ✅       |
| 3.3                             | Add `test:unit`, `test:e2e`, and `test` scripts to `package.json`                                                                                                                                               | ✅    |       | ✅       |
| **Data Contract**               |                                                                                                                                                                                                                 |       |       |          |
| 4.1                             | Extract frontmatter parsing into `src/lib/posts.ts` as a pure function                                                                                                                                          | ✅    | ✅    | ✅       |
| 4.2                             | Unit tests: required fields present, slug derived from filename, `category` always an array, `layout` field absent, `subtexts` is always an array                                                               | ✅    | ✅    | ✅       |
| 4.3                             | Unit tests: posts in `posts/incoming/` appear in output; `incoming` absent from derived category set                                                                                                            | ✅    | ✅    | ✅       |
| 4.4                             | Unit tests: `body` captured from markdown content below frontmatter                                                                                                                                             | ✅    | ✅    | ✅       |
| 4.5                             | `posts.ts` collects declared `customFields` keys from frontmatter into `meta`; undeclared keys discarded                                                                                                        | ✅    | ✅    | ✅       |
| 4.6                             | Unit tests: `meta` populated from declared keys; undeclared keys absent; missing declared keys absent from `meta` (not null)                                                                                    | ✅    | ✅    | ✅       |
| **Filter and Pagination Logic** |                                                                                                                                                                                                                 |       |       |          |
| 5.1                             | Extract filter, search, pagination, and sort logic from `App.svelte` into `src/lib/filters.ts`                                                                                                                  | ✅    | ✅    | ✅       |
| 5.2                             | Unit tests: filter combinations, search matching, empty results, page boundary math                                                                                                                             | ✅    | ✅    | ✅       |
| 5.3                             | Unit tests: featured pins appear before non-featured; featured hidden when filter excludes them; sort_priority orders featured group only; user sort (Newest / Oldest / A–Z / Z–A) applies to non-featured only | ✅    | ✅    | ✅       |
| **Cleanup**                     |                                                                                                                                                                                                                 |       |       |          |
| 6.1                             | Rename `_posts/` → `posts/`; migrate `subtext1`/`subtext2` fields to `subtexts` array in all existing posts                                                                                                     | ✅    |       | ✅       |
| 6.2                             | Move `covers/` → `static/covers/`; confirm local cover images resolve correctly                                                                                                                                 | ✅    |       | ✅       |
| 6.3                             | Remove `_layouts/`, `_includes/`, `_config.yml`, `authors.html`, `index.html`, `output.json`, `Gemfile`, `assets/`, `preview.html`, `src/preview.ts`                                                            | ✅    |       | ✅       |
| 6.4                             | Rename `csv_to_jekyll.py` → `csv_to_posts.py`, remove `layout:` from output, read categories from `catalog.config.js`                                                                                           | ✅    |       | ✅       |
| 6.5                             | Clean up `.gitignore` — remove Jekyll/Ruby entries (`.sass-cache/`, `.jekyll-cache/`, `.jekyll-metadata`, `vendor/`, `.bundle/`, `Gemfile.lock`, stale output paths); keep SvelteKit entries                    | ✅    |       | ✅       |
| **Content Processing**          |                                                                                                                                                                                                                 |       |       |          |
| 7.1                             | Replace `postsDevPlugin` in `vite.config.ts` with SvelteKit `load()` functions using `src/lib/posts.ts`                                                                                                         | ✅    |       | ✅       |
| 7.2                             | Existing unit tests from 4.1–4.4 pass against new implementation                                                                                                                                                | ✅    | ✅    | ✅       |
| **Routes**                      |                                                                                                                                                                                                                 |       |       |          |
| 8.1                             | Create `src/routes/+layout.svelte` — global CSS, Skeleton UI theme registration, dark mode strategy                                                                                                             | ✅    |       | ✅       |
| 8.2                             | Main catalog route `/` — filter controls wired to `src/lib/filters.ts`, filter state synced to URL params                                                                                                       | ✅    |       | ✅       |
| 8.3                             | Resource routes `/resource/[slug]/` prerendered — all frontmatter fields rendered, `source-url` as primary CTA                                                                                                  | ✅    |       | ✅       |
| 8.4                             | Resource page renders `meta` fields from `customFields` config — `url` type as links, `multiple: true` as lists, in config order                                                                                | ✅    |       | ✅       |
| 8.5                             | Submit route `/submit/` gated on `showSubmitForm` config value                                                                                                                                                  | ✅    |       | ✅       |
| 8.6                             | RSS feed at `/feed.xml` — prerendered RSS 2.0 listing all posts                                                                                                                                                 | ✅    |       | ✅       |
| 8.7                             | Confirm `incoming` does not appear as a category filter option                                                                                                                                                  | ✅    |       | ✅       |
| **Component Migration**         |                                                                                                                                                                                                                 |       |       |          |
| 9.1                             | Migrate all `src/lib/` components to SvelteKit's `src/lib/`                                                                                                                                                     | ✅    |       | ✅       |
| 9.2                             | Update main page to use SvelteKit routing and `src/lib/filters.ts`                                                                                                                                              | ✅    |       | ✅       |
| 9.3                             | Add sort control to `FilterBar` (Newest / Oldest / A–Z / Z–A); Newest is the default selection                                                                                                                  | ✅    |       | ✅       |
| 9.4                             | Apply subtle featured card visual treatment in `ResourceCard` using active Skeleton theme palette                                                                                                               | ✅    |       | ✅       |
| 9.5                             | Component tests: TagCloud selection state; hidden when `showTagCloud: false`                                                                                                                                    | ✅    |       | ✅       |
| 9.6                             | Component tests: FilterBar clear behavior including sort reset; hidden when `showFilterBar: false`                                                                                                              | ✅    |       | ✅       |
| 9.7                             | Component tests: Pagination rendering and boundary conditions                                                                                                                                                   | ✅    |       | ✅       |
| 9.8                             | Component tests: CardGrid empty state                                                                                                                                                                           | ✅    |       | ✅       |
| 9.9                             | Component tests: ResourceCard featured visual state (featured class/style applied when `featured: true`)                                                                                                        | ✅    |       | ✅       |
| **Staticman Integration**       |                                                                                                                                                                                                                 |       |       |          |
| 10.1                            | Replace `submit.html` with `src/routes/submit/+page.svelte`; gate render on `showSubmitForm` config value                                                                                                       | ✅    |       | ✅       |
| 10.2                            | Update `staticman.yml` — set `path: posts/incoming`, remove `layout:` from generated frontmatter                                                                                                                | ✅    |       | ✅       |
| 10.3                            | Build submission form with multiselect category field populated from `catalog.config.js`                                                                                                                        | ✅    |       | ✅       |
| 10.4                            | Submission form renders `customFields` inputs dynamically — tag input for `multiple: true`, date picker for `type: date`, URL input for `type: url`                                                             | ✅    |       | ✅       |
| 10.5                            | Playwright test: form fills and submits to mocked Staticman endpoint with correct fields and target URL                                                                                                         | ✅    | ✅    | ✅       |
| **CI Gates**                    |                                                                                                                                                                                                                 |       |       |          |
| 11.1                            | Add `test:unit` as required check on pull requests in `.github/workflows/build.yml`                                                                                                                             | ✅    |       | ✅       |
| 11.2                            | Add `test:e2e` before deploy step; remove Ruby and Jekyll build steps from workflow                                                                                                                             | ✅    |       | ✅       |
| 11.3                            | Create `scripts/fetch-covers.js` — scans posts for external `cover-image` URLs, fetches and saves to `static/covers/`, rewrites frontmatter in-place, idempotent                                                | ✅    |       | ✅       |
| 11.4                            | Create `.github/workflows/fetch-covers.yml` — triggers on PR open, runs fetch-covers script, commits downloaded images back to PR branch                                                                        | ✅    |       | ✅       |
| 11.5                            | Verify end-to-end: open a test PR with an external cover URL; confirm image is committed and frontmatter is rewritten before review                                                                             |       |       |          |
| **Build Pipeline**              |                                                                                                                                                                                                                 |       |       |          |
| 12.1                            | Configure static adapter output directory; update `upload-pages-artifact` path to `_site/`                                                                                                                      | ✅    |       | ✅       |
| 12.2                            | Deploy to GitHub Pages — confirm static site serves correctly including base path                                                                                                                               | ✅    |       | ✅       |
| **E2E Validation**              |                                                                                                                                                                                                                 |       |       |          |
| 13.1                            | E2E: load catalog, apply filters, search, paginate — desktop (1280px)                                                                                                                                           | ✅    | ✅    | ✅       |
| 13.2                            | E2E: load catalog, apply filters, search, paginate — mobile (375px)                                                                                                                                             | ✅    | ✅    | ✅       |
| 13.3                            | E2E: navigate to category page, confirm filtered tiles                                                                                                                                                          | ✅    | ✅    | ✅       |
| 13.4                            | E2E: navigate to resource page, confirm all fields and CTA link                                                                                                                                                 | ✅    | ✅    | ✅       |
| 13.5                            | Parity check: route shapes and content counts match live Jekyll deploy                                                                                                                                          | ✅    |       | ✅       |
| **Documentation**               |                                                                                                                                                                                                                 |       |       |          |
| 14.1                            | Rewrite `CONTRIBUTING.md` for SvelteKit workflow — dev setup, app structure, theming, component conventions, running tests                                                                                      | ✅    |       | ✅       |

## Relevant files

- `package.json` — Add SvelteKit, testing dependencies, and new scripts.
- `catalog.config.js` — New file; site name, predefined categories. The only file site owners configure.
- `vite.config.ts` — Remove `postsDevPlugin`; SvelteKit's Vite config replaces it.
- `svelte.config.js` — New file; configures static adapter and prerender entries.
- `src/lib/posts.ts` — New file; pure frontmatter parsing function.
- `src/lib/filters.ts` — New file; pure filter, search, and pagination logic.
- `src/routes/` — New directory; all SvelteKit page and layout routes.
- `src/lib/` — Existing components migrated here for SvelteKit.
- `posts/` — Renamed from `_posts/`; contents unchanged; source of truth for all content.
- `static/covers/` — Moved from `covers/`; SvelteKit serves static assets from `static/`.
- `staticman.yml` — Path set to `posts/incoming`; `layout:` removed from generated frontmatter.
- `src/routes/+layout.svelte` — New file; root layout replacing `_layouts/default.html`: global CSS, theme registration, dark mode.
- `src/routes/submit/+page.svelte` — New file; submission form replacing `submit.html`.
- `src/routes/feed.xml/+server.ts` — New file; prerendered RSS 2.0 feed of all posts.
- `scripts/fetch-covers.js` — New file; fetches external cover image URLs, saves to `static/covers/`, rewrites frontmatter in-place. Run by CI on Staticman PRs and available locally for operators.
- `.github/workflows/fetch-covers.yml` — New workflow; triggers on PR open, runs `scripts/fetch-covers.js`, commits downloaded images back to the PR branch.
- `CONTRIBUTING.md` — Full rewrite for the SvelteKit workflow; Jekyll-era content removed.
- `csv_to_jekyll.py` — Rename to `csv_to_posts.py`; remove `layout:` from generated output.
- `.github/workflows/build.yml` — Updated to add test gates and remove Jekyll steps.
- `vitest.config.ts` — New file; configures Vitest.
- `playwright.config.ts` — New file; configures Playwright for Chromium, desktop and mobile.
- `_layouts/`, `_includes/` — Removed. Replaced by SvelteKit routes, layouts, and components.
- `authors.html`, `index.html`, `submit.html`, `preview.html`, `src/preview.ts` — Removed. Replaced by SvelteKit routes.
- `output.json`, `assets/` — Removed. Committed build artifacts eliminated; CI generates the full site.
- `Gemfile` — Removed. Ruby/Jekyll dependency no longer needed.
- `_config.yml` — Removed. Replaced by `catalog.config.js`.

## Testing Infrastructure

| Layer     | Tool                             | Scope                                         |
| --------- | -------------------------------- | --------------------------------------------- |
| Unit      | Vitest                           | `src/lib/posts.ts`, `src/lib/filters.ts`      |
| Component | Vitest + @testing-library/svelte | All `src/lib/*.svelte` components             |
| E2E       | Playwright (Chromium)            | Full user journeys, desktop + mobile viewport |

Scripts:

- `test:unit` — Runs Vitest unit and component tests
- `test:e2e` — Runs Playwright E2E tests (requires running dev server or built output)
- `test` — Runs `test:unit` then `test:e2e`

## CI Gates

- **Pull requests** — `test:unit` must pass. PRs with failing tests are blocked from merge.
- **Merge to main** — Full `test` suite (unit + E2E) must pass before the deploy job runs.
- **Deploy** — Only executes if build and tests succeed. A broken build cannot overwrite a working deploy.

## Verification

1. Run `npm run test:unit` — all data contract and filter logic tests pass against real `posts/` fixtures.
2. Run `npm run dev` — SvelteKit dev server loads the catalog with live reloading.
3. Run `npm run build` — static output includes a prerendered route for every resource slug and the RSS feed.
4. Run `npm run test:e2e` — Playwright confirms filtering, search, pagination, category pages, and resource pages work on desktop and mobile viewports.
5. Compare route shapes and content counts against the live Jekyll deploy to confirm parity.
6. Submit a test Staticman entry (mocked in tests) and verify the form targets the correct endpoint with the correct fields.
7. Deploy to GitHub Pages and confirm the static site serves correctly.

## Decisions

- Choose SvelteKit over Astro for tighter Svelte integration and full app control.
- Maintain static prerendering for GitHub Pages compatibility; avoid SSR unless needed later.
- Staticman does not influence the framework choice, as it works with any static site.
- Categories, tags, and authors are all filter dimensions — none have dedicated routes. Shareable filtered views are handled by URL parameters on the main catalog page (e.g. `/?category=hacks`), which works for any filter combination.
- All filter logic and data parsing lives in pure functions (`src/lib/`), not in component state, so it can be unit tested without a browser.
- No legacy code from the Vite plugin or `App.svelte` needs to be preserved; only the behavior and ability to process the original markdown files must carry over.
- `catalog.config.js` is the single file site owners touch to configure their deployment. It is self-documenting: required settings are active, optional settings are commented out with defaults shown inline. The app always has working defaults regardless of which lines are present.
- There are no category routes. `catalog.config.js` governs what categories the Staticman submission form offers. Category filter options on the main page are derived from the `category` frontmatter values present across all posts.
- Multi-category posts are valid. The `category` field is always an array. The Staticman form uses a multiselect, not a single dropdown, because TTRPG supplements frequently span multiple content types.
- `csv_to_jekyll.py` is kept for now to maintain continuity with the inherited project. A JS/TS replacement bulk loader is a future milestone. The Python script should be updated to read `catalog.config.js` for its category list rather than hardcoding values.
- Delivery mechanism: v1 ships as a **GitHub Template Repository**. Site owners click "Use this template" on GitHub — no Node.js knowledge required for initial setup. This is the lowest-friction path for a non-developer audience.
- Staticman live E2E is deferred as a future milestone; mocked form submission is sufficient for initial validation.
- Playwright targets Chromium only for now; mobile viewport (375px) is included from the start.
- Remove `preview.html` and `src/preview.ts`; SvelteKit's dev server replaces them.
- Remove `_config.yml`; all site owner settings migrate to `catalog.config.js`. Deployment path (`baseurl`) moves to `svelte.config.js`.
- Remove `_layouts/` and `_includes/`; Jekyll HTML templates and partials are replaced by SvelteKit's routing and component system.
- Rename `posts/` to `posts/`. All other underscore-prefixed Jekyll directories are removed rather than renamed. Underscore prefixes were a Jekyll convention with no meaning in SvelteKit; eliminating them prevents confusion about whether they carry special significance.
- `layout: entry` is a Jekyll artifact. Strip it from all existing posts during migration, remove it from `staticman.yml` generated output, and never include it in new content.
- The build-artifacts-committed workflow (committing `assets/app.js` and `assets/app.css` to the repo) is eliminated. SvelteKit's static adapter produces the full site in CI; nothing is committed as a build artifact.
- Author pages (`show_authors_page`) are removed. Authors are a filter dimension on the main catalog page only.
- Filter UI uses two master toggles (`showTagCloud`, `showFilterBar`, both default `true`) plus an optional `filters` object for per-dimension overrides. Master toggles control whether the pill cloud or dropdown menu UI is shown at all; the `filters` object lets site owners show/hide individual dimensions independently (e.g. author in the menu but cost hidden everywhere). Per-dimension settings take precedence over master toggles. Tag cloud suits small collections, dropdown menus suit large ones; both together is the default full experience. The two built-in scenarios (`showFilterBar: false` for cloud-only; `showTagCloud: false` + `filters: { cost: { cloud: false, menu: false } }` for menus-only with cost hidden) are documented in the `catalog.config.js` comments.
- `featured` and `sort_priority` are site-operator curation fields only — not exposed in the Staticman submission form. `sort_priority` applies only within the featured group; non-featured cards sort by user selection. Filtering takes precedence over featured pinning: a featured card that doesn't match the active filter is not shown.
- Custom fields are declared in `catalog.config.js` under `customFields` (key, label, type, multiple). `posts.ts` collects declared keys from frontmatter into a `meta` object; undeclared keys are discarded. The resource page and submission form render custom fields dynamically from config — deployments without `customFields` are unaffected. The `layout` frontmatter key is safe to use as a custom field (e.g. layout designer credit) since all Jekyll `layout: entry` values are stripped during migration.

## Further Considerations

1. **Staticman content submission cycle** — The submission form presents categories from `catalog.config.js`; submitters cannot invent new ones. Staticman opens a PR against `main` placing the new `.md` file at `posts/incoming/`. Tags are freeform; the author field is freeform text (the creator of the cataloged resource, not the submitter). Staticman's `moderation: true` means every submission requires manual PR approval — this is also the spam gate. When the PR opens, the `fetch-covers` CI workflow runs automatically: it fetches any external `cover-image` URL, commits the image to `static/covers/` on the PR branch, and rewrites the frontmatter to the local path — so the PR the site owner reviews is already self-contained with no external image dependencies. The site owner reviews and merges via GitHub's web UI; no git knowledge required. After merge the build-and-deploy workflow runs; content is live after that deploy. The submission form should communicate this in plain language.

2. **`staticman.yml` path** — Set `path: posts/incoming`. All Staticman submissions land here regardless of which categories are selected. The frontmatter `category:` array is what drives filtering; the directory is irrelevant to the app. During PR review the site owner can move the file to a more organised subdirectory, or merge it in place — either way the app categorises it correctly by frontmatter. `incoming/` is a reserved directory name: posts inside it are fully processed and appear in the catalog under their frontmatter categories, but `incoming` is excluded from the derived category filter options so it never appears as a selectable filter.

3. **npm package milestone** — v1 ships as a GitHub Template. The follow-on milestone is to extract all app code (`src/`) into a published npm package. The template's `package.json` then declares it as a dependency. Site owners run `npm update` to receive app improvements without touching their content or dealing with merge conflicts. Designing `catalog.config.js` as the clean interface between app and content now makes this extraction straightforward later.

4. **Documentation (follow-on work)** — Three documents, each written for its audience: (1) **Contributor guide** — how to submit content via the form, what happens after submission, plain language only; (2) **Site owner guide** — how to use the template, configure categories, review and approve submissions via GitHub's web UI; (3) **Advanced guide** — GitHub Actions, static adapter, Staticman internals, branch workflows. This plan is a developer artifact; none of these documents are part of the migration itself.

5. **App user vs. maintainer distinction** — Communities deploy their own instances from the template. The maintainer of this repository cannot enforce any workflow on downstream deployments — only describe best practices. The site owner guide should be prescriptive but acknowledge that each community runs their own instance independently.

6. **Potential for future dynamic features** — SvelteKit supports search indexing, user accounts, and server-side filtering if the project outgrows static prerendering. No SSR work is needed now, but the architecture does not foreclose it.

7. **Playwright live Staticman E2E** — Deferred milestone. When a staging Staticman instance is available, add a Playwright test that submits a real entry and verifies a PR is created in the repository.

8. **JS/TS bulk content loader** — Deferred milestone. Replace `csv_to_jekyll.py` with a Node.js script that reads `catalog.config.js` as its single source of truth for categories and outputs correctly formatted markdown files into `posts/`. Eliminates the Python dependency and keeps the toolchain in one language.

9. **Cover image processing** — Deferred milestone. Extend `scripts/fetch-covers.js` to process downloaded images: resize to a consistent max dimension, convert to WebP for smaller file sizes, and strip unnecessary metadata. This keeps `static/covers/` lean as the catalog grows without affecting the fetch-and-commit workflow already in place.
