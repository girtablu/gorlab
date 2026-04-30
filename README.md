# Girtablu's Gorlab

A curious and unusual brick-a-brac, for curious and unusual folk.

Gorlab is a static content library framework for gamers. 

## Quick start

Fork or clone the repo, push to GitHub, and GitHub Actions handles the build and deploy automatically.

For most workflows — adding content, changing config, tweaking a theme — the loop is just edit → push → done.


## Adding content

Each resource is a Markdown file with YAML front matter in `posts/<category>/`.

Filename format: `YYYY-MM-DD-slug.md`

```yaml
---
name: My Resource Title       # required
category:                     # required — drives tag cloud and filters
  - systems
author: Author Name
source: itch.io
source-url: https://author.itch.io/my-resource
genre: horror
summary: A one-line description shown on the card.
cost: free                    # free / PWYW / $5 / etc.
license: CC BY 4.0
cover-image: https://example.com/cover.png   # external URL, or /covers/filename.webp for local
tags:
  - investigation
  - one-shot
# Entry page extensions (all optional)
stats: 8 HP, 1 Armor, 10 STR, 12 DEX, 6 CHA
subtexts:
  - "First bullet point."
  - "Second bullet point."
---

Optional markdown body content rendered on the resource page.
```

Place the file in `posts/<category>/` matching one of the values in `category:`.

### Cover images

If `cover-image` is an external URL, the CI workflow downloads it to `static/covers/` and rewrites the frontmatter to the local path automatically when you open a PR. No manual step needed.

To add a cover image locally, place the file in `static/covers/` and set:

```yaml
cover-image: /covers/filename.webp
```

### Bulk import from CSV

```bash
python csv_to_posts.py
# Move generated .md files into posts/<category>/
```


## Categories

Categories are YAML values in the `category:` frontmatter field. The tag cloud and filter dropdowns are built automatically from all values present in `posts/`. No configuration needed to add a new one — just use it in a post.

The default categories included with gorlab:

| Folder        | Intended use                                    |
| ------------- | ----------------------------------------------- |
| `monsters/`   | Stat blocks and creature descriptions           |
| `npcs/`       | Named characters and factions                   |
| `systems/`      | Games, rulebooks, and supplements             |
| `miscellany/` | Tables, generators, handouts, and anything else |

### Adding a custom category

1. Create a new folder: `posts/mycategory/`
2. Add posts with `category: [mycategory]` in the front matter
3. Push — the tags and filters update automatically

A post can belong to multiple categories:

```yaml
category:
  - monsters
  - miscellany
```

To make a new category available in the community submission form, also add it to `categories` in `catalog.config.js`.


## Configuration

Edit `catalog.config.js`:

```js
export default {
  title: "Meet Gorlab",
  // description: "",
  // theme: "cerberus",   // cerberus | wintry | vintage | crimson | pine | modern
  // postsPerPage: 24,
  // showSubmitForm: true,
  // showTagCloud: true,
  // showFilterBar: true,

  // basePath: '/my-repo-name',   // for GitHub Pages project sites (userid.github.io/my-repo)
                                  // leave commented out for root deployments

  categories: ["systems", "monsters", "npcs", "miscellany"],
}
```

All settings except `title` and `categories` are optional — the app has working defaults for everything.


## Theming

### Preset themes

Change `theme` in `catalog.config.js` to any of the bundled presets:

| Name       | Character          |
| ---------- | ------------------ |
| `cerberus` | Dark, moody        |
| `wintry`   | Cool blues         |
| `vintage`  | Warm, aged         |
| `crimson`  | Red, horror        |
| `pine`     | Earthy greens      |
| `modern`   | Clean, minimal     |

The default is `vintage`. Push the config change and GitHub Actions deploys it.

### Custom themes

You can create a fully custom theme using the [Skeleton UI Theme Generator](https://themes.skeleton.dev/). Customize colors, fonts, and border radius, then export the generated CSS.

1. Save the exported CSS file to `static/` in your repo — e.g. `static/my-theme.css`
2. In `catalog.config.js`, set both `theme` and `customCss`:

```js
theme: "my-theme",        // must match the theme name inside the CSS file
customCss: "/my-theme.css",
```

3. Push — the theme loads automatically alongside the app styles.

### Custom CSS

To add your own styles on top of the active theme without replacing it — custom fonts, card tweaks, spacing adjustments — create a CSS file in `static/` and point to it:

```js
// catalog.config.js
customCss: "/my-styles.css",
```

The file is loaded after the app styles so your rules take precedence. The `theme` setting is independent — you can use both together.


## Deployment (GitHub Pages)

The included GitHub Actions workflow (`.github/workflows/build.yml`) handles deployment automatically on push.

1. Go to **Settings → Pages** in your GitHub repo
2. Set **Source** to **GitHub Actions**
3. Push to `main` — the workflow builds and deploys

For project pages (e.g. `username.github.io/my-repo`), uncomment `basePath` in `catalog.config.js` and set it to `'/my-repo'`.


## Submission form

The submit page (`/submit/`) uses [Staticman](https://staticman.net/) to accept community submissions as pull requests, with no GitHub account required for submitters. Submissions go to `posts/incoming/` as a PR for your review before anything goes live.

To enable:

1. Add the [staticmanapp](https://github.com/apps/staticman-net) GitHub App to your repo
2. Update `staticmanUrl` in `catalog.config.js` with your repo details
3. Set `showSubmitForm: true` in `catalog.config.js`


## Reviewing submissions

When a community member submits a resource, Staticman opens a pull request against your repo. The PR adds a new markdown file to `posts/incoming/` and, if the submission included an external cover image URL, the fetch-covers workflow downloads and commits the image automatically before you review.

To review and publish a submission:

1. Go to the **Pull requests** tab in your GitHub repo
2. Open the PR — it will be titled something like "Add resource: My Resource Title"
3. Click the **Files changed** tab to see the new markdown file and any downloaded cover image
4. If everything looks good, click **Merge pull request**
5. The build-and-deploy workflow runs automatically — the resource is live within a minute or two

To reject a submission, close the PR without merging. You can leave a comment explaining why if you'd like to give the submitter feedback.

If you want to edit the submission before merging (fix a typo, adjust a category, add missing fields), click the three-dot menu on the file in Files changed and select **Edit file**, or check out the branch locally.


## Hacking the app

Want to modify the Svelte UI, add custom themes, or contribute? See [CONTRIBUTING.md](CONTRIBUTING.md).


## License

[MIT](LICENSE)
