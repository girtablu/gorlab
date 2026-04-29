/**
 * @type {import('./src/lib/config.js').CatalogConfig}
 *
 * Commented-out options show the default value — the system behaves as if
 * that line were present. To override a setting: uncomment it, then change
 * the value. Leaving a line commented keeps the documented default in effect.
 */

export default {
  // ── Identity ──────────────────────────────────────────────────────────────
  title: "Girtablu's Gorlab",
  description:
    "A curious and unusual brick-a-brac, for curious and unusual folk.",

  // siteUrl: public URL of your deployed site. When set, the site title in
  // the footer links here. Leave commented out if not yet deployed.
  siteUrl: "https://gulluth.github.io/jekyll-ttrpg-catalog",

  // basePath: sub-path for GitHub Pages project sites (userid.github.io/repo).
  // Leave commented out for root deployments (userid.github.io or custom domain).
  // basePath: '/gorlab',

  // ── Appearance ────────────────────────────────────────────────────────────
  // theme: "vintage",   // cerberus | wintry | vintage | crimson | pine | modern

  // ── Content display ───────────────────────────────────────────────────────
  // postsPerPage: 24,

  // showCost: set to false to hide the price field on resource pages and in
  // filters, even when posts have cost metadata.
  // showCost: false,

  // ── Navigation & filters ──────────────────────────────────────────────────
  // showTagCloud: true,   // pill-based filter UI — suits small collections
  // showFilterBar: true,  // dropdown menu filter UI — suits large collections

  // filters: per-dimension overrides; takes precedence over master toggles.
  // Each dimension can appear in the tag cloud, the dropdown menu, both, or neither.
  // Defaults shown below — omit the filters block entirely to use defaults.
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
  //   (no filters block needed — cost is hidden from the cloud by default)
  //
  // Example — dropdowns only, cost hidden:
  //   showTagCloud: false,
  //   filters: { cost: { cloud: false, menu: false } },

  // ── Custom fields ─────────────────────────────────────────────────────────
  // Extend the data schema with fields specific to your catalog. Each field
  // is shown on resource pages and added to the submission form when enabled.
  // Fields not defined here are ignored by the app.
  //
  // key      — the frontmatter key in markdown files
  // label    — human-readable label shown in the UI
  // type     — "text" | "date" | "url"  (url renders as a clickable link)
  // multiple — true allows an array of values (e.g. multiple contributors)
  //
  // Example — credits layout for a podcast catalog:
  // customFields: [
  //   { key: "release_date",  label: "Release Date",  type: "date",   multiple: false },
  //   { key: "writing",       label: "Writing",       type: "text",   multiple: true  },
  //   { key: "layout",        label: "Layout",        type: "text",   multiple: true  },
  //   { key: "editing",       label: "Editing",       type: "text",   multiple: true  },
  //   { key: "development",   label: "Development",   type: "text",   multiple: true  },
  //   { key: "artwork",       label: "Artwork",       type: "text",   multiple: true  },
  //   { key: "cartography",   label: "Cartography",   type: "text",   multiple: true  },
  //   { key: "publisher",     label: "Publisher",     type: "text",   multiple: false },
  //   { key: "format",        label: "Format",        type: "text",   multiple: false },
  //   { key: "game_system",   label: "Game System",   type: "text",   multiple: true  },
  // ],

  // ── Community submissions (Staticman) ─────────────────────────────────────
  // Requires a self-hosted or managed Staticman instance — see issue #30.
  // Disabled by default; set showSubmitForm: true to enable.

  // showSubmitForm: false,

  // staticmanUrl: your Staticman API endpoint.
  // Replace USERNAME, REPO, and BRANCH with your own values.
  // staticmanUrl: "https://your-staticman-instance/v3/entry/github/USERNAME/REPO/BRANCH/submissions",

  // categories: options presented to submitters in the submission form.
  // This does NOT restrict what the app displays — posts in any category appear
  // automatically. This list only controls what submitters can choose from.
  categories: ["hacks", "monsters", "npcs", "miscellany"],
};
