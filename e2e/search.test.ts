import { test, expect } from '@playwright/test'

test.describe('search', () => {
  test('header search input is visible on catalog page', async ({ page }) => {
    await page.goto('.')
    await expect(page.getByLabel('Search resources')).toBeVisible()
  })

  test('submitting a query from the header navigates to the search page', async ({ page }) => {
    await page.goto('.')
    await page.getByLabel('Search resources').fill('basilisk')
    await page.getByLabel('Submit search').click()
    await expect(page).toHaveURL(/\/search\/\?q=basilisk/)
  })

  test('search page shows results for a known resource', async ({ page }) => {
    await page.goto('./search/?q=basilisk')
    await expect(page.getByRole('link', { name: /basilisk/i }).first()).toBeVisible({ timeout: 10000 })
  })

  test('clicking a search result navigates to the resource page', async ({ page }) => {
    await page.goto('./search/?q=basilisk')
    await page.getByRole('link', { name: /basilisk/i }).first().click()
    await expect(page).toHaveURL(/\/resource\/basilisk\//)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Basilisk')
  })

  test('searching again from the search page updates results', async ({ page }) => {
    await page.goto('./search/?q=basilisk')
    await expect(page.getByRole('link', { name: /basilisk/i }).first()).toBeVisible({ timeout: 10000 })

    await page.getByLabel('Search resources').fill('vaarn')
    await page.getByLabel('Submit search').click()
    await expect(page).toHaveURL(/\/search\/\?q=vaarn/)
    await expect(page.getByRole('link', { name: /vaarn/i }).first()).toBeVisible({ timeout: 10000 })
  })

  test('unknown query shows no results message', async ({ page }) => {
    await page.goto('./search/?q=xyzzy-no-match-zz99')
    await expect(page.getByText(/no results found/i)).toBeVisible({ timeout: 10000 })
  })

  test('search page with no query shows prompt', async ({ page }) => {
    await page.goto('./search/')
    await expect(page.getByText(/enter a search term/i)).toBeVisible()
  })
})
