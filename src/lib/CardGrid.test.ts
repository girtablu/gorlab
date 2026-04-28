import { render, screen } from '@testing-library/svelte'
import CardGrid from './CardGrid.svelte'
import type { Post } from './posts.js'

function makePost(overrides: Partial<Post> = {}): Post {
  return {
    slug: 'test-post',
    date: '2024-01-01',
    name: 'Test Post',
    category: [],
    summary: null,
    author: null,
    source: null,
    'source-url': null,
    genre: null,
    cost: null,
    license: null,
    'cover-image': null,
    tags: [],
    stats: null,
    subtexts: [],
    body: '',
    featured: false,
    sort_priority: null,
    meta: {},
    ...overrides,
  }
}

test('shows empty state message when posts array is empty', () => {
  render(CardGrid, { posts: [] })
  expect(screen.getByText('No resources match your filters.')).toBeInTheDocument()
})

test('renders a list item for each post', () => {
  const posts = [
    makePost({ slug: 'post-1', name: 'Post One' }),
    makePost({ slug: 'post-2', name: 'Post Two' }),
    makePost({ slug: 'post-3', name: 'Post Three' }),
  ]
  render(CardGrid, { posts })
  expect(screen.getByText('Post One')).toBeInTheDocument()
  expect(screen.getByText('Post Two')).toBeInTheDocument()
  expect(screen.getByText('Post Three')).toBeInTheDocument()
})

test('does not show empty state when posts are present', () => {
  render(CardGrid, { posts: [makePost()] })
  expect(screen.queryByText('No resources match your filters.')).not.toBeInTheDocument()
})
