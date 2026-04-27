# jekyll-ttrpg-catalog

A Jekyll-based content library framework for TTRPG games. Card-grid layout with live search, filtering, and dark/light mode. Deployable to GitHub Pages with no server required.

Fork of [jekyll-db](https://github.com/rypan/jekyll-db).


## Quick start

Fork or clone the repo, push to GitHub, and GitHub Actions handles the build and deploy automatically.

For most workflows, like adding content, changing config, or tweaking a theme, the loop is just edit → push → done.


## Adding content

Each resource is a Markdown file with YAML front matter in `_posts/<category>/`.

Filename format: `YYYY-MM-DD-slug.md`

```yaml
---
layout: entry
name: My Resource Title       # required
category:                     # required — drives tag cloud and filters
  - adventures
author: Author Name
source: itch.io
source-url: https://author.itch.io/my-resource
genre: horror
summary: A one-line description shown on the card.
cost: free                    # free / PWYW / $5 / etc.
license: CC BY 4.0
cover-image: https://example.com/cover.png   # external URL, or /covers/filename.webp for local files
tags:
  - investigation
  - one-shot
# Entry page extensions (all optional)
stats: 8 HP, 1 Armor, 10 STR, 12 DEX, 6 CHA
subtext1: "• First bullet point."
subtext2: "• Second bullet point."
---

Optional markdown body content rendered on the entry page.
```

Place the file in `_posts/<category>/` matching one of the values in `category:`.

### Bulk import from CSV

```bash
python csv_to_jekyll.py
# Move generated .md files into _posts/<category>/
```


## Categories

Categories are just subdirectories under `_posts/`. The tag cloud and filter dropdowns are built automatically from the `category:` values across all posts. No configuration needed.

The default categories included with jekyll-ttrpg-catalog:

| Folder        | Intended use                                    |
| ------------- | ----------------------------------------------- |
| `monsters/`   | Stat blocks and creature descriptions           |
| `npcs/`       | Named characters and factions                   |
| `hacks/`      | Games, rulebooks, and supplements               |
| `miscellany/` | Tables, generators, handouts, and anything else |

### Adding a custom category

1. Create a new folder: `_posts/mycategory/`
2. Add posts with `category: [mycategory]` in the front matter
3. Push the update and the tags and filters update automatically.

A post can belong to multiple categories:

```yaml
category:
  - monsters
  - miscellany
```

The folder name and the `category:` value are independent. Jekyll uses the front matter, not the path, for filtering. Convention is to keep them matching.


## Configuration

Edit `_config.yml`:

```yaml
title: My TTRPG Library
description: A collection of resources for my game.
baseurl: "/my-repo-name"   # leave "" for user/org GitHub Pages sites
url: "https://userid.github.io" # Use user or organization id

# jekyll-ttrpg-catalog theme settings
jtc:
  posts_per_page: 24
  show_authors_page: true
  show_submit_form: true
  theme: cerberus            # see Theming below
```


## Theming

Change `jtc.theme` in `_config.yml` to any of the bundled presets:

| Name       | Character             |
| ---------- | --------------------- |
| `cerberus` | Dark, moody (default) |
| `wintry`   | Cool blues            |
| `vintage`  | Warm, aged            |
| `crimson`  | Red, horror           |
| `pine`     | Earthy greens         |
| `modern`   | Clean, minimal        |

Push the config change and GitHub Actions deploys it.

To create a custom theme or add more presets, see [CONTRIBUTORS.md](CONTRIBUTORS.md).


## Deployment (GitHub Pages)

The included GitHub Actions workflow (`.github/workflows/build.yml`) handles deployment automatically on push, running `npm run build` then `jekyll build`.

1. Go to **Settings → Pages** in your GitHub repo
2. Set **Source** to **GitHub Actions**
3. Push to `main`. The workflow builds and deploys.

For project pages (e.g. `username.github.io/my-repo`), set `baseurl: "/my-repo"` in `_config.yml`.


## Submission form

The submit page (`/submit/`) uses [Staticman](https://staticman.net/) to accept community submissions as pull requests, with no GitHub account required for submitters.

To enable:

1. Add the [staticmanapp](https://github.com/apps/staticman-net) GitHub App to your repo
2. Update `staticman.yml` with your repo details
3. Set `show_submit_form: true` in `_config.yml`


## Hacking the app

Want to modify the Svelte UI, add custom themes, or contribute? See [CONTRIBUTORS.md](CONTRIBUTORS.md).


## License

[MIT](LICENSE)
