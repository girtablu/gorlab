import { render, screen } from '@testing-library/svelte'
import Pagination from './Pagination.svelte'

test('renders prev and next trigger buttons', () => {
  render(Pagination, { count: 50, pageSize: 10, page: 1 })
  // Skeleton Pagination renders prev/next as buttons
  const buttons = screen.getAllByRole('button')
  expect(buttons.length).toBeGreaterThan(0)
})

test('renders without error when count equals pageSize (single page)', () => {
  expect(() => render(Pagination, { count: 10, pageSize: 10, page: 1 })).not.toThrow()
})

test('renders without error when count is zero', () => {
  expect(() => render(Pagination, { count: 0, pageSize: 10, page: 1 })).not.toThrow()
})
