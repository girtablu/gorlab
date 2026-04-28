import { readdirSync, readFileSync } from 'node:fs'
import { join, basename } from 'node:path'
import matter from 'gray-matter'
import type { CustomField } from './config.js'

export interface Post {
  slug: string
  date: string
  name: string | null
  category: string[]
  summary: string | null
  author: string | null
  source: string | null
  'source-url': string | null
  genre: string | null
  cost: string | null
  license: string | null
  'cover-image': string | null
  tags: string[]
  stats: string | null
  subtexts: string[]
  body: string
  featured: boolean
  sort_priority: number | null
  meta: Record<string, string | string[]>
}

const RESERVED_CATEGORY_NAMES = new Set(['incoming'])

function getMarkdownFiles(dir: string): string[] {
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

function toArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.filter((v): v is string => typeof v === 'string')
  if (typeof val === 'string') return [val]
  return []
}

function normalizeSubtexts(data: Record<string, unknown>): string[] {
  if (data.subtexts !== undefined) return toArray(data.subtexts)
  // Coalesce legacy Jekyll numbered fields into array form
  return ['subtext1', 'subtext2', 'subtext3', 'subtext4']
    .map(k => data[k])
    .filter((v): v is string => typeof v === 'string')
}

export function parsePosts(dir = 'posts', customFields: CustomField[] = []): Post[] {
  return getMarkdownFiles(dir).flatMap(filepath => {
    try {
      const { data, content } = matter(readFileSync(filepath, 'utf-8'))
      const slug = basename(filepath, '.md').replace(/^\d{4}-\d{2}-\d{2}-/, '')

      const meta: Record<string, string | string[]> = {}
      for (const field of customFields) {
        if (data[field.key] !== undefined) {
          meta[field.key] = field.multiple
            ? toArray(data[field.key])
            : String(data[field.key])
        }
      }

      const dateMatch = basename(filepath, '.md').match(/^(\d{4}-\d{2}-\d{2})-/)
      const date = dateMatch ? dateMatch[1] : '1970-01-01'

      return [{
        slug,
        date,
        name: typeof data.name === 'string' ? data.name : null,
        category: toArray(data.category),
        summary: typeof data.summary === 'string' ? data.summary : null,
        author: typeof data.author === 'string' ? data.author : null,
        source: typeof data.source === 'string' ? data.source : null,
        'source-url': typeof data['source-url'] === 'string' ? data['source-url'] : null,
        genre: typeof data.genre === 'string' ? data.genre : null,
        cost: typeof data.cost === 'string' ? data.cost : null,
        license: typeof data.license === 'string' ? data.license : null,
        'cover-image': typeof data['cover-image'] === 'string' ? data['cover-image'] : null,
        tags: toArray(data.tags),
        stats: typeof data.stats === 'string' ? data.stats : null,
        subtexts: normalizeSubtexts(data as Record<string, unknown>),
        body: content.trim(),
        featured: data.featured === true,
        sort_priority: typeof data.sort_priority === 'number' ? data.sort_priority : null,
        meta,
      }]
    } catch (e) {
      console.warn(`[posts] skipping ${filepath}:`, e)
      return []
    }
  })
}

export function getCategories(posts: Post[]): string[] {
  const cats = new Set<string>()
  for (const post of posts) {
    for (const cat of post.category) {
      if (!RESERVED_CATEGORY_NAMES.has(cat)) cats.add(cat)
    }
  }
  return [...cats].sort()
}
