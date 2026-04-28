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
    // Set paths.base if deploying to a sub-path, e.g. '/my-repo-name' for
    // GitHub Pages project sites. Leave unset (default '') for root deployments.
  },
}

export default config
