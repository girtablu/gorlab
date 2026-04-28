import { test, expect } from '@playwright/test'

test.describe('resource detail page', () => {
  test('renders the resource title and author', async ({ page }) => {
    await page.goto('/resource/basilisk/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Basilisk')
    await expect(page.getByText('Necrotic Gnome')).toBeVisible()
  })

  test('renders the source CTA link with correct href', async ({ page }) => {
    await page.goto('/resource/into-the-odd/')
    const cta = page.getByRole('link', { name: /freeleague|source|get it/i })
    await expect(cta).toBeVisible()
    const href = await cta.getAttribute('href')
    expect(href).toContain('freeleague')
  })

  test('back link returns to catalog', async ({ page }) => {
    await page.goto('/resource/basilisk/')
    const backLink = page.getByRole('link', { name: /back|catalog|← /i })
    await expect(backLink).toBeVisible()
    await backLink.click()
    await expect(page).toHaveURL(/\/$|\/\?/)
    await expect(page.locator('article.card').first()).toBeVisible()
  })

  test('renders cover image when cover-image is set', async ({ page }) => {
    await page.goto('/resource/basilisk/')
    const img = page.getByRole('img', { name: /basilisk/i })
    await expect(img).toBeVisible()
  })

  test('renders local cover image correctly for into-the-odd', async ({ page }) => {
    await page.goto('/resource/into-the-odd/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Into the ODD')
    const img = page.getByRole('img')
    const src = await img.getAttribute('src')
    expect(src).toContain('/covers/into-the-odd')
  })

  test('clicking a catalog card navigates to its resource page', async ({ page }) => {
    await page.goto('/')
    const firstCardLink = page.locator('article.card').first().getByRole('link').first()
    await firstCardLink.click()
    await expect(page).toHaveURL(/\/resource\//)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
