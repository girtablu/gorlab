import { execSync } from 'child_process'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

const commitSha = execSync('git rev-parse --short HEAD').toString().trim()

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  define: {
    __COMMIT_SHA__: JSON.stringify(commitSha),
  },
  server: {
    watch: {
      ignored: [
        '**/_site/**',
        '**/.svelte-kit/**',
        (path: string) => path.endsWith('.md') && !path.includes('/posts/'),
      ],
    },
  },
})
