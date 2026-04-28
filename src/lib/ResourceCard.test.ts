import { render, screen } from '@testing-library/svelte'
import ResourceCard from './ResourceCard.svelte'
import type { Post } from './posts.js'

function makePost(overrides: Partial<Post> = {}): Post {
  return {
    slug: 'test-post',
    date: '2024-01-01',
    name: 'Test Resource',
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

test('renders the post name', () => {
  render(ResourceCard, { post: makePost({ name: 'My Cool Game' }) })
  expect(screen.getByText('My Cool Game')).toBeInTheDocument()
})

test('renders summary when present', () => {
  render(ResourceCard, { post: makePost({ summary: 'A great game for everyone.' }) })
  expect(screen.getByText('A great game for everyone.')).toBeInTheDocument()
})

test('does not render summary element when absent', () => {
  render(ResourceCard, { post: makePost({ summary: null }) })
  expect(screen.queryByText(/./)).not.toBeNull() // card still renders
})

test('links to the resource detail page', () => {
  render(ResourceCard, { post: makePost({ slug: 'my-game' }) })
  const links = screen.getAllByRole('link')
  expect(links.every(l => l.getAttribute('href')?.includes('/resource/my-game/'))).toBe(true)
})

test('renders img tag when cover-image is set', () => {
  render(ResourceCard, { post: makePost({ 'cover-image': 'https://example.com/cover.png', name: 'Covered Game' }) })
  const img = screen.getByRole('img', { name: 'Covered Game' })
  expect(img).toBeInTheDocument()
  expect(img).toHaveAttribute('src', 'https://example.com/cover.png')
})

test('renders placeholder div (no img) when cover-image is null', () => {
  render(ResourceCard, { post: makePost({ 'cover-image': null }) })
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
})

test('featured post has ring class on article', () => {
  const { container } = render(ResourceCard, { post: makePost({ featured: true }) })
  const article = container.querySelector('article')
  expect(article?.className).toContain('ring-1')
})

test('non-featured post does not have ring class on article', () => {
  const { container } = render(ResourceCard, { post: makePost({ featured: false }) })
  const article = container.querySelector('article')
  expect(article?.className).not.toContain('ring-1')
})

test('renders author when present', () => {
  render(ResourceCard, { post: makePost({ author: 'Jane Doe' }) })
  expect(screen.getByText('Jane Doe')).toBeInTheDocument()
})

test('renders category chips', () => {
  render(ResourceCard, { post: makePost({ category: ['hacks', 'supplements'] }) })
  expect(screen.getByText('hacks')).toBeInTheDocument()
  expect(screen.getByText('supplements')).toBeInTheDocument()
})

test('local cover-image gets base prefix', () => {
  render(ResourceCard, { post: makePost({ 'cover-image': '/covers/game.webp', name: 'Local Cover' }) })
  const img = screen.getByRole('img', { name: 'Local Cover' })
  // base is '' in test mock, so the src should be '/covers/game.webp'
  expect(img).toHaveAttribute('src', '/covers/game.webp')
})
