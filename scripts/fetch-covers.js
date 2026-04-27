#!/usr/bin/env node
// Fetches external cover-image URLs from posts/, saves to static/covers/,
// and rewrites frontmatter in-place to use local paths.
// Idempotent: skips posts whose cover-image already points to a local path.

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, extname, basename } from 'node:path'
import matter from 'gray-matter'

const POSTS_DIR = 'posts'
const COVERS_DIR = 'static/covers'

function getMarkdownFiles(dir) {
  try {
    return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) return getMarkdownFiles(full)
      if (entry.isFile() && entry.name.endsWith('.md')) return [full]
      return []
    })
  } catch {
    return []
  }
}

async function main() {
  mkdirSync(COVERS_DIR, { recursive: true })
  const files = getMarkdownFiles(POSTS_DIR)
  let fetched = 0
  let rewrote = 0

  for (const filepath of files) {
    const raw = readFileSync(filepath, 'utf-8')
    const { data } = matter(raw)
    const coverUrl = data['cover-image']

    if (!coverUrl || typeof coverUrl !== 'string' || !coverUrl.startsWith('http')) continue

    const postSlug = basename(filepath, '.md').replace(/^\d{4}-\d{2}-\d{2}-/, '')
    const ext = extname(new URL(coverUrl).pathname) || '.jpg'
    const filename = `${postSlug}${ext}`
    const destPath = join(COVERS_DIR, filename)
    const localPath = `/covers/${filename}`

    if (!existsSync(destPath)) {
      process.stdout.write(`Fetching ${coverUrl} → ${destPath} … `)
      try {
        const res = await fetch(coverUrl)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        writeFileSync(destPath, Buffer.from(await res.arrayBuffer()))
        console.log('done')
        fetched++
      } catch (err) {
        console.error(`FAILED: ${err.message}`)
        continue
      }
    }

    const rewritten = raw.replace(coverUrl, localPath)
    if (rewritten !== raw) {
      writeFileSync(filepath, rewritten)
      rewrote++
    }
  }

  console.log(`\nDone. ${fetched} image(s) fetched, ${rewrote} post(s) updated.`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
