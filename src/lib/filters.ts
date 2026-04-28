import type { Post } from './posts.js'

export type SortOption = 'newest' | 'oldest' | 'az' | 'za'

export interface FilterState {
  category: string
  author: string
  genre: string
  cost: string
  sort: SortOption
}

export const DEFAULT_FILTER_STATE: FilterState = {
  category: 'all',
  author: 'all',
  genre: 'all',
  cost: 'all',
  sort: 'newest',
}

function normalize(s: string | null | undefined): string {
  return (s ?? '').toLowerCase().trim()
}

export function applyFilters(
  posts: Post[],
  state: Pick<FilterState, 'category' | 'author' | 'genre' | 'cost'>
): Post[] {
  return posts.filter(post => {
    if (state.category !== 'all' && !post.category.some(c => normalize(c) === normalize(state.category))) return false
    if (state.author !== 'all' && normalize(post.author) !== normalize(state.author)) return false
    if (state.genre !== 'all' && normalize(post.genre) !== normalize(state.genre)) return false
    if (state.cost !== 'all' && normalize(post.cost) !== normalize(state.cost)) return false
    return true
  })
}

export function sortPosts(posts: Post[], sort: SortOption): Post[] {
  const featured = [...posts.filter(p => p.featured)].sort((a, b) => {
    const pa = a.sort_priority ?? Infinity
    const pb = b.sort_priority ?? Infinity
    if (pa !== pb) return pa - pb
    return b.date.localeCompare(a.date)
  })

  const rest = [...posts.filter(p => !p.featured)].sort((a, b) => {
    switch (sort) {
      case 'newest': return b.date.localeCompare(a.date)
      case 'oldest': return a.date.localeCompare(b.date)
      case 'az':     return normalize(a.name).localeCompare(normalize(b.name))
      case 'za':     return normalize(b.name).localeCompare(normalize(a.name))
    }
  })

  return [...featured, ...rest]
}

export function paginate(
  posts: Post[],
  page: number,
  perPage: number
): { items: Post[]; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const items = posts.slice((safePage - 1) * perPage, safePage * perPage)
  return { items, totalPages }
}

export function getAuthors(posts: Post[]): string[] {
  return [...new Set(posts.map(p => p.author).filter((a): a is string => !!a))].sort()
}

export function getGenres(posts: Post[]): string[] {
  return [...new Set(posts.map(p => p.genre).filter((g): g is string => !!g))].sort()
}

export function getCosts(posts: Post[]): string[] {
  return [...new Set(posts.map(p => p.cost).filter((c): c is string => !!c))].sort()
}
