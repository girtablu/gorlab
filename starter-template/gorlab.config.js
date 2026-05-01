/**
 * Gorlab configuration — the only file you need to edit to customise your catalog.
 *
 * Commented-out options show the default value. The catalog behaves as if that
 * line were present. To override a setting: uncomment it, then change the value.
 */

export default {
  // ── Identity ──────────────────────────────────────────────────────────────
  // Required. The catalog title shown in the header and browser tab.
  title: "My Catalog",

  // description: shown in the header subtitle and page meta tags.
  // description: "",

  // siteUrl: your deployed GitHub Pages URL. When set, the title links here.
  // Set this after your first deploy.
  // siteUrl: "https://username.github.io/my-catalog",

  // basePath: uncomment only for GitHub Pages *project* sites
  // (username.github.io/my-catalog). Leave commented for root sites.
  // basePath: '/my-catalog',

  // ── Appearance ────────────────────────────────────────────────────────────
  // theme: one of the bundled presets below. Default: vintage.
  // cerberus | wintry | vintage | crimson | pine | modern
  // theme: "vintage",

  // customCss: path to an extra CSS file in static/ loaded after theme styles.
  // Use this to add custom fonts or override specific styles.
  // customCss: "/my-styles.css",

  // ── Content display ───────────────────────────────────────────────────────
  // postsPerPage: 24,

  // showCost: set to false to hide price info everywhere (cards, filters, pages).
  // showCost: false,

  // ── Navigation & filters ──────────────────────────────────────────────────
  // showTagCloud: true,   // pill buttons for category filtering
  // showFilterBar: true,  // dropdown menus for category / author / genre / cost

  // filters: fine-grained control over where each dimension appears.
  // Omit this block entirely to use the defaults shown below.
  // filters: {
  //   category: { cloud: true,  menu: true  },
  //   author:   { cloud: false, menu: true  },
  //   genre:    { cloud: false, menu: true  },
  //   cost:     { cloud: false, menu: true  },
  //   tags:     { cloud: false, menu: false },
  // },

  // ── Custom fields ─────────────────────────────────────────────────────────
  // Add extra fields specific to your catalog. They appear on resource pages.
  // Fields not listed here are ignored by the app.
  //
  // key      — the frontmatter key in your markdown files
  // label    — human-readable label shown in the UI
  // type     — "text" | "date" | "url"  (url renders as a clickable link)
  // multiple — true allows an array of values
  //
  // customFields: [
  //   { key: "page_count", label: "Pages",       type: "text", multiple: false },
  //   { key: "publisher",  label: "Publisher",   type: "text", multiple: false },
  //   { key: "system",     label: "Game System", type: "text", multiple: true  },
  // ],

  // ── Community submissions (Staticman) ─────────────────────────────────────
  // Disabled by default. Requires a self-hosted Staticman instance.
  // See the gorlab README for setup details.
  // showSubmitForm: false,
  // staticmanUrl: "https://your-staticman-instance/v3/entry/github/USERNAME/REPO/BRANCH/submissions",
  // categories: ["adventures", "systems", "zines"],
};
