import { render, screen, fireEvent } from '@testing-library/svelte'
import FilterBar from './FilterBar.svelte'

const baseProps = {
  categories: ['hacks', 'supplements'],
  authors: ['Author A', 'Author B'],
  genres: ['horror', 'fantasy'],
  costs: ['free', 'paid'],
  category: 'all',
  author: 'all',
  genre: 'all',
  cost: 'all',
  sort: 'newest' as const,
  show: true,
}

test('renders nothing when show is false', () => {
  render(FilterBar, { ...baseProps, show: false })
  expect(screen.queryByText('All Categories')).not.toBeInTheDocument()
})

test('renders all four filter selects and sort select when show is true', () => {
  render(FilterBar, baseProps)
  expect(screen.getByText('All Categories')).toBeInTheDocument()
  expect(screen.getByText('All Authors')).toBeInTheDocument()
  expect(screen.getByText('All Genres')).toBeInTheDocument()
  expect(screen.getByText('All Costs')).toBeInTheDocument()
  expect(screen.getByLabelText('Sort by')).toBeInTheDocument()
})

test('Clear filters button hidden when nothing is dirty', () => {
  render(FilterBar, baseProps)
  expect(screen.queryByText('Clear filters')).not.toBeInTheDocument()
})

test('Clear filters button shown when a filter is non-default', () => {
  render(FilterBar, { ...baseProps, category: 'hacks' })
  expect(screen.getByText('Clear filters')).toBeInTheDocument()
})

test('Clear filters button shown when sort is non-default', () => {
  render(FilterBar, { ...baseProps, sort: 'az' as const })
  expect(screen.getByText('Clear filters')).toBeInTheDocument()
})

test('clicking Clear filters resets selects to default values', async () => {
  render(FilterBar, { ...baseProps, category: 'hacks', sort: 'az' as const })
  await fireEvent.click(screen.getByText('Clear filters'))
  expect(screen.queryByText('Clear filters')).not.toBeInTheDocument()
})

test('sort select has all four options', () => {
  render(FilterBar, baseProps)
  const sortSelect = screen.getByLabelText('Sort by')
  expect(sortSelect).toContainElement(screen.getByText('Newest'))
  expect(sortSelect).toContainElement(screen.getByText('Oldest'))
  expect(sortSelect).toContainElement(screen.getByText('A–Z'))
  expect(sortSelect).toContainElement(screen.getByText('Z–A'))
})
