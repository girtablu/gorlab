import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: '_site',
      assets: '_site',
      fallback: undefined,
      precompress: false,
      strict: true,
    }),
    // Set paths.base to your GitHub Pages repo path, e.g. '/my-repo-name'.
    // Leave as '' for user/org GitHub Pages sites (username.github.io).
    paths: {
      base: '/jekyll-ttrpg-catalog',
    },
  },
}

export default config
