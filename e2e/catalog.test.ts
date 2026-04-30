import { test, expect } from '@playwright/test'

test.describe('catalog page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('.')
  })

  test('loads with cards visible', async ({ page }) => {
    const cards = page.locator('article.card')
    await expect(cards.first()).toBeVisible()
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('tag cloud category filter narrows results', async ({ page }) => {
    const cards = page.locator('article.card')
    const total = await cards.count()

    const tagCloud = page.getByRole('group', { name: 'Filter by category' })
    await tagCloud.getByRole('button').filter({ hasNotText: 'All' }).first().click()
    const filtered = await cards.count()
    expect(filtered).toBeGreaterThan(0)
    expect(filtered).toBeLessThan(total)

    await tagCloud.getByRole('button', { name: 'All' }).click()
    await expect(cards).toHaveCount(total)
  })

  test('sort A–Z orders cards alphabetically ascending', async ({ page }) => {
    await page.selectOption('#sort-select', 'az')
    await page.locator('article.card').first().waitFor()
    const headings = await page.locator('article.card').getByRole('heading').allTextContents()
    expect(headings.length).toBeGreaterThan(1)
    const sorted = [...headings].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    expect(headings).toEqual(sorted)
  })

  test('sort Z–A orders cards alphabetically descending', async ({ page }) => {
    await page.selectOption('#sort-select', 'za')
    await page.locator('article.card').first().waitFor()
    const headings = await page.locator('article.card').getByRole('heading').allTextContents()
    expect(headings.length).toBeGreaterThan(1)
    const sorted = [...headings].sort((a, b) => b.toLowerCase().localeCompare(a.toLowerCase()))
    expect(headings).toEqual(sorted)
  })

  test('pagination is hidden when all posts fit on one page', async ({ page }) => {
    // Pagination renders only when post count exceeds postsPerPage (default 24)
    await expect(page.locator('nav[aria-label*="pagination"]')).not.toBeVisible()
  })

  test('category URL param pre-filters results', async ({ page }) => {
    // Pick the first available category from the tag cloud rather than hardcoding one
    const tagCloud = page.getByRole('group', { name: 'Filter by category' })
    const categoryButton = tagCloud.getByRole('button').filter({ hasNotText: 'All' }).first()
    const category = (await categoryButton.textContent())!.trim()

    await page.goto(`./?category=${encodeURIComponent(category)}`)
    await expect(page.locator('article.card').first()).toBeVisible()

    for (const card of await page.locator('article.card').all()) {
      const chipTexts = await card.locator('.chip').allTextContents()
      expect(chipTexts.some(t => t.trim().toLowerCase() === category.toLowerCase())).toBe(true)
    }
  })
})
