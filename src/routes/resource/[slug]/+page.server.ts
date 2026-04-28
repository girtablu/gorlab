import { parsePosts } from '$lib/posts.js'
import { config } from '$lib/catalog.js'
import { error } from '@sveltejs/kit'
import { marked } from 'marked'

export const prerender = true

export function entries() {
  return parsePosts('posts', config.customFields).map(p => ({ slug: p.slug }))
}

export function load({ params }) {
  const post = parsePosts('posts', config.customFields).find(p => p.slug === params.slug)
  if (!post) error(404, `Post not found: ${params.slug}`)
  const bodyHtml = post.body ? String(marked(post.body)) : ''
  return { post, config, bodyHtml }
}
