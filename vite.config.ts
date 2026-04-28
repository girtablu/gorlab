import { execSync } from 'child_process'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

const commitSha = execSync('git rev-parse --short HEAD').toString().trim()

function getCommitUrl(sha: string): string {
  try {
    const remote = execSync('git remote get-url origin').toString().trim()
    const match = remote.match(/github\.com[:/](.+?)(?:\.git)?$/)
    if (match) return `https://github.com/${match[1]}/commit/${sha}`
  } catch {}
  return ''
}

const commitUrl = getCommitUrl(commitSha)

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  define: {
    __COMMIT_SHA__: JSON.stringify(commitSha),
    __COMMIT_URL__: JSON.stringify(commitUrl),
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
