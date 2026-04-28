import { parsePosts, getCategories } from '$lib/posts.js'
import { getAuthors, getGenres, getCosts } from '$lib/filters.js'
import { config } from '$lib/catalog.js'

export const prerender = true

export function load() {
  const posts = parsePosts('posts', config.customFields)
  return {
    posts,
    categories: getCategories(posts),
    authors: getAuthors(posts),
    genres: getGenres(posts),
    costs: getCosts(posts),
    config,
  }
}
