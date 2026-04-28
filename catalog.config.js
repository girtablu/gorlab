/** @type {import('./src/lib/config.js').CatalogConfig} */
export default {
  // basePath: the sub-path https://gulluth.github.io/jekyll-ttrpg-catalog/resource/black-sword-hack/where your site is deployed.
  // Set this to '/your-repo-name' for GitHub Pages project sites
  // (userid.github.io/repo-name). Leave commented out for root deployments
  // (userid.github.io or a custom domain at the root).
  // basePath: '/jekyll-ttrpg-catalog',

  title: "Jekyll TTRPG Catalog",
  // description: "",
  // theme: "cerberus",   // cerberus | wintry | vintage | crimson | pine | modern
  // postsPerPage: 24,
  // showSubmitForm: true,
  // showTagCloud: true,   // master toggle: pill-based filter UI — suits small collections
  // showFilterBar: true,  // master toggle: dropdown menu filter UI — suits large collections

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
  categories: ["hacks", "monsters", "npcs", "miscellany"],

  // staticmanUrl: the Staticman API endpoint for community submissions.
  // Replace USERNAME, REPO, and BRANCH with your own values.
  staticmanUrl:
    "https://staticman3.herokuapp.com/v3/entry/github/USERNAME/REPO/BRANCH/submissions",

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
  //   { key: "cartography",   label: "Cartography",   type: "text",   multiple: true  },
  //   { key: "publisher",     label: "Publisher",     type: "text",   multiple: false },
  //   { key: "format",        label: "Format",        type: "text",   multiple: false },
  //   { key: "game_system",   label: "Game System",   type: "text",   multiple: true  },
  // ],
};
