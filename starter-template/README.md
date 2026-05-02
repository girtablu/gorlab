# My Catalog

A filterable card catalog built with [Gorlab](https://github.com/girtablu/gorlab).

> **Not a site owner?** If you're looking to contribute to the gorlab framework itself, see the [gorlab repo](https://github.com/girtablu/gorlab) instead.

---

## Quick start

**GitHub UI (no local tools needed):**

1. Click **Use this template** → create your repo
2. Go to **Settings → Pages**, set Source to **GitHub Actions**
3. Edit `gorlab.config.js` — set your `title` — commit → site deploys automatically
4. Add posts to `posts/` — commit → site rebuilds

**Local:**

```bash
git clone your-repo
npm install
npm run dev       # preview at http://localhost:5173
```

---

## Adding content

Each resource is a Markdown file with YAML frontmatter in `posts/`.

**Filename format:** `YYYY-MM-DD-slug.md`

```yaml
---
name: My Resource Title       # required — the only mandatory field
category:                     # recommended — drives tag cloud and filters
  - systems
author: Author Name
source: itch.io               # platform name
source-url: https://example.itch.io/my-resource
genre: horror
summary: A one-line description shown on the card.
cost: free                    # free / PWYW / $5.00 / etc.
license: CC BY 4.0
cover-image: https://example.com/cover.png
tags:
  - one-shot
  - investigation
# Optional extended fields
stats: 8 HP, 1 Armor, 10 STR
subtexts:
  - "First bullet point on the entry page."
  - "Second bullet point."
featured: true                # featured posts get a highlighted card accent
---

Optional markdown body rendered on the resource page. Delete this if unused.
```

Only `name` is required. Every other field degrades gracefully when absent.

### Cover images

External `cover-image` URLs are downloaded automatically to `static/covers/` by the CI workflow when you open a PR. No manual step needed.

To add a cover image locally, place the file in `static/covers/` and set:

```yaml
cover-image: /covers/filename.webp
```

---

## Posts structure

Posts can live directly in `posts/` or in any subdirectory:

```
posts/
  2024-01-01-my-adventure.md        ← flat
  2024-01-02-my-system.md           ← flat
  zines/
    2024-01-03-my-zine.md           ← in a subdir
```

Subdirectory names have no effect on categories. Categories come only from the `category:` field in each post's frontmatter. Organize subdirectories however makes sense for you — the catalog ignores the folder structure.

---

## Configuration

Edit `gorlab.config.js`. Every option is documented inline. Common settings:

```js
export default {
  title: "My Catalog",
  // description: "",
  // siteUrl: "https://username.github.io/my-catalog",
  // theme: "vintage",   // cerberus | wintry | vintage | crimson | pine | modern
  // postsPerPage: 24,
  // showCost: false,
}
```

---

## Theming

### Preset themes

Set `theme` in `gorlab.config.js`:

| Name       | Character      |
| ---------- | -------------- |
| `cerberus` | Dark, moody    |
| `wintry`   | Cool blues     |
| `vintage`  | Warm, aged     |
| `crimson`  | Red, horror    |
| `pine`     | Earthy greens  |
| `modern`   | Clean, minimal |

The default is `cerberus`. Commit the config change and the site redeploys.

### Custom themes

1. Create a theme CSS file at the [Skeleton UI Theme Generator](https://themes.skeleton.dev/)
2. Save it to `static/my-theme.css`
3. In `gorlab.config.js`:

```js
theme: "my-theme",
customCss: "/my-theme.css",
```

### Custom CSS

To tweak styles without replacing the whole theme, point `customCss` at a file in `static/`:

```js
customCss: "/my-styles.css",
```

---

## Deployment (GitHub Pages)

1. Go to **Settings → Pages** in your GitHub repo
2. Set **Source** to **GitHub Actions**
3. Push to `main` — the workflow builds and deploys automatically

For project sites (`username.github.io/my-catalog`), uncomment `basePath` in `gorlab.config.js`:

```js
basePath: '/my-catalog',
```

---

## Upgrading

```bash
npm update @gulluth/gorlab
```

Then push — GitHub Actions rebuilds with the new version.

**GitHub UI:** Edit `package.json`, bump the version number in `"@gulluth/gorlab": "^x.y.z"`, commit. The CI workflow runs `npm install` which resolves the new version automatically.

---

## Custom fields

If your catalog needs fields beyond the standard set, declare them in `gorlab.config.js`:

```js
customFields: [
  { key: "page_count", label: "Pages",     type: "text", multiple: false },
  { key: "publisher",  label: "Publisher", type: "text", multiple: false },
  { key: "system",     label: "System",    type: "text", multiple: true  },
],
```

Then add the corresponding keys to your post frontmatter. Fields not declared here are ignored.

---

## Community submissions

Gorlab includes a `/submit/` page where visitors can propose resources. The form UI is built in — you enable it with a config toggle. The backend that receives and processes those submissions is **not** included; it is a separate add-on package you install alongside gorlab.

```js
// gorlab.config.js
showSubmitForm: true,
submitUrl: "https://your-backend-endpoint/submit",
```

When `showSubmitForm` is `true`, a **Submit** link appears in the nav and the `/submit/` route is active. When `false` (the default), the route is inaccessible and the link is hidden.

Backend add-on packages (e.g. `@gulluth/gorlab-submit-netlify`) will be published separately. Until then, this feature requires you to wire up your own endpoint.

---

## Bulk import from CSV

If you have existing data in a spreadsheet, the included `csv_to_posts.py` script (in the gorlab repo) can generate markdown files. See the script header for column format details.

---

## Support and contributing

- **Issues and questions:** [github.com/girtablu/gorlab/issues](https://github.com/girtablu/gorlab/issues)
- **Contributing to the framework:** [CONTRIBUTING.md](https://github.com/girtablu/gorlab/blob/main/CONTRIBUTING.md)
