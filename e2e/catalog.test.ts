import { test, expect } from '@playwright/test'

const BASE = '/jekyll-ttrpg-catalog'

test.describe('catalog page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/`)
  })

  test('loads with cards visible', async ({ page }) => {
    const cards = page.locator('article.card')
    await expect(cards.first()).toBeVisible()
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('search narrows results and clearing restores them', async ({ page }) => {
    const cards = page.locator('article.card')
    const total = await cards.count()

    await page.getByLabel('Search resources').fill('basilisk')
    await expect(cards).toHaveCount(1)
    await expect(cards.first().getByRole('heading')).toContainText('Basilisk')

    await page.getByLabel('Search resources').fill('')
    await expect(cards).toHaveCount(total)
  })

  test('tag cloud category filter narrows results', async ({ page }) => {
    const cards = page.locator('article.card')
    const total = await cards.count()

    const tagCloud = page.getByRole('group', { name: 'Filter by category' })
    await tagCloud.getByRole('button', { name: 'monsters' }).click()
    const filtered = await cards.count()
    expect(filtered).toBeGreaterThan(0)
    expect(filtered).toBeLessThan(total)

    await tagCloud.getByRole('button', { name: 'All' }).click()
    await expect(cards).toHaveCount(total)
  })

  test('filter dropdown narrows results and Clear button resets', async ({ page }) => {
    const cards = page.locator('article.card')
    const total = await cards.count()

    await page.selectOption('select:has(option[value="all"]:has-text("All Categories"))', 'hacks')
    const filtered = await cards.count()
    expect(filtered).toBeGreaterThan(0)
    expect(filtered).toBeLessThan(total)

    await page.getByRole('button', { name: 'Clear filters' }).click()
    await expect(cards).toHaveCount(total)
  })

  test('sort A–Z puts alphabetically first title first', async ({ page }) => {
    await page.selectOption('#sort-select', 'az')
    const firstHeading = page.locator('article.card').first().getByRole('heading')
    await expect(firstHeading).toContainText('Basilisk')
  })

  test('sort Z–A puts alphabetically last title first', async ({ page }) => {
    await page.selectOption('#sort-select', 'za')
    const firstHeading = page.locator('article.card').first().getByRole('heading')
    await expect(firstHeading).toContainText('Vaults of Vaarn')
  })

  test('pagination is hidden when all posts fit on one page', async ({ page }) => {
    // Default postsPerPage is 24; only 8 posts exist, so pagination should not render
    await expect(page.locator('nav[aria-label*="pagination"]')).not.toBeVisible()
  })

  test('category URL param pre-filters results', async ({ page }) => {
    await page.goto(`${BASE}/?category=monsters`)
    const cards = page.locator('article.card')
    const total = await cards.count()
    expect(total).toBeGreaterThan(0)

    // All visible cards must belong to the monsters category
    const chips = page.locator('article.card .chip')
    const count = await chips.count()
    for (let i = 0; i < count; i++) {
      const text = await chips.nth(i).textContent()
      expect(text?.toLowerCase()).toContain('monsters')
    }
  })
})
