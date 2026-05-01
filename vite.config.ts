import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    watch: {
      ignored: [
        '**/build/**',
        '**/.svelte-kit/**',
        (path: string) => path.endsWith('.md') && !path.includes('/posts/'),
      ],
    },
  },
})
