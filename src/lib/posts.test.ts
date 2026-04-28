import { describe, it, expect } from 'vitest'
import { join } from 'node:path'
import { parsePosts, getCategories } from './posts.js'

const FIXTURES = join(import.meta.dirname, '../test/fixtures/posts')
const REAL_POSTS = join(import.meta.dirname, '../../posts')

describe('parsePosts — real _posts/', () => {
  const posts = parsePosts(REAL_POSTS)

  it('returns at least one post per sample category', () => {
    const cats = posts.flatMap(p => p.category)
    expect(cats).toContain('hacks')
    expect(cats).toContain('monsters')
    expect(cats).toContain('npcs')
    expect(cats).toContain('miscellany')
  })

  it('every post has a non-empty name', () => {
    expect(posts.every(p => typeof p.name === 'string' && p.name.length > 0)).toBe(true)
  })

  it('category is always an array', () => {
    expect(posts.every(p => Array.isArray(p.category))).toBe(true)
  })

  it('tags is always an array', () => {
    expect(posts.every(p => Array.isArray(p.tags))).toBe(true)
  })

  it('subtexts is always an array', () => {
    expect(posts.every(p => Array.isArray(p.subtexts))).toBe(true)
  })

  it('slug is derived from filename without date prefix', () => {
    const slugs = posts.map(p => p.slug)
    expect(slugs).toContain('basilisk')
    expect(slugs).toContain('black-sword-hack')
    slugs.forEach(s => expect(s).not.toMatch(/^\d{4}-\d{2}-\d{2}-/))
  })

  it('layout field is stripped from output', () => {
    posts.forEach(p => expect(p).not.toHaveProperty('layout'))
  })

  it('featured defaults to false', () => {
    posts.forEach(p => expect(typeof p.featured).toBe('boolean'))
  })

  it('sort_priority defaults to null when not set', () => {
    const nonFeatured = posts.filter(p => !p.featured)
    nonFeatured.forEach(p => expect(p.sort_priority).toBeNull())
  })

  it('meta is empty object when no customFields declared', () => {
    posts.forEach(p => expect(p.meta).toEqual({}))
  })
})

describe('parsePosts — subtext normalization', () => {
  const posts = parsePosts(FIXTURES)

  it('coalesces legacy subtext1/subtext2 into subtexts array', () => {
    const post = posts.find(p => p.slug === 'legacy-subtexts')
    expect(post).toBeDefined()
    expect(post!.subtexts).toEqual([
      '• First bullet point.',
      '• Second bullet point.',
    ])
  })

  it('passes through subtexts array directly', () => {
    const post = posts.find(p => p.slug === 'modern-subtexts')
    expect(post).toBeDefined()
    expect(post!.subtexts).toEqual([
      '• First point.',
      '• Second point.',
      '• Third point.',
    ])
  })
})

describe('parsePosts — featured and sort_priority', () => {
  const posts = parsePosts(FIXTURES)

  it('featured: true is parsed correctly', () => {
    const post = posts.find(p => p.slug === 'modern-subtexts')
    expect(post!.featured).toBe(true)
  })

  it('sort_priority is parsed as a number', () => {
    const post = posts.find(p => p.slug === 'modern-subtexts')
    expect(post!.sort_priority).toBe(2)
  })
})

describe('parsePosts — incoming/ directory', () => {
  const posts = parsePosts(FIXTURES)

  it('posts inside incoming/ appear in results', () => {
    const post = posts.find(p => p.slug === 'submitted-resource')
    expect(post).toBeDefined()
    expect(post!.name).toBe('Community Submission')
  })

  it('posts in incoming/ are indexed under their frontmatter category, not incoming', () => {
    const post = posts.find(p => p.slug === 'submitted-resource')
    expect(post!.category).toContain('hacks')
    expect(post!.category).not.toContain('incoming')
  })
})

describe('getCategories', () => {
  const posts = parsePosts(FIXTURES)

  it('returns sorted unique categories from posts', () => {
    expect(getCategories(posts)).toEqual(['hacks'])
  })

  it('excludes "incoming" from the derived category set', () => {
    expect(getCategories(posts)).not.toContain('incoming')
  })

  it('returns sorted unique categories from real posts', () => {
    const real = parsePosts(REAL_POSTS)
    const cats = getCategories(real)
    expect(cats).toEqual([...cats].sort())
    expect(cats).toContain('hacks')
    expect(cats).not.toContain('incoming')
  })
})

describe('parsePosts — body content', () => {
  const posts = parsePosts(FIXTURES)

  it('captures markdown body below frontmatter', () => {
    const post = posts.find(p => p.slug === 'legacy-subtexts')
    expect(post!.body).toBe('Optional body content.')
  })

  it('body is empty string when no content below frontmatter', () => {
    const post = posts.find(p => p.slug === 'submitted-resource')
    expect(post!.body).toBe('')
  })
})

describe('parsePosts — customFields / meta', () => {
  it('collects declared customFields into meta', () => {
    const posts = parsePosts(FIXTURES, [
      { key: 'license', label: 'License', type: 'text', multiple: false },
      { key: 'tags', label: 'Tags', type: 'text', multiple: true },
    ])
    const post = posts.find(p => p.slug === 'legacy-subtexts')
    expect(post!.meta.license).toBe('CC BY 4.0')
    expect(post!.meta.tags).toEqual(['osr', 'one-shot'])
  })

  it('discards undeclared keys from meta', () => {
    const posts = parsePosts(FIXTURES, [])
    const post = posts.find(p => p.slug === 'legacy-subtexts')
    expect(post!.meta).toEqual({})
  })

  it('missing declared keys are absent from meta, not null', () => {
    const posts = parsePosts(FIXTURES, [
      { key: 'nonexistent_field', label: 'Nonexistent', type: 'text', multiple: false },
    ])
    const post = posts.find(p => p.slug === 'legacy-subtexts')
    expect('nonexistent_field' in post!.meta).toBe(false)
  })
})
