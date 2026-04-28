import { test, expect } from '@playwright/test'


test.describe('submission form', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept the Staticman POST and return a mock success response
    await page.route('**', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        })
      } else {
        await route.continue()
      }
    })

    await page.goto('./submit/')
  })

  test('renders required fields', async ({ page }) => {
    await expect(page.locator('[name="fields[name]"]')).toBeVisible()
    await expect(page.locator('[name="fields[summary]"]')).toBeVisible()
    await expect(page.locator('input[name="fields[category][]"]').first()).toBeVisible()
  })

  test('shows category error when submitting without a category', async ({ page }) => {
    await page.fill('[name="fields[name]"]', 'Test Resource')
    await page.fill('[name="fields[summary]"]', 'A brief description.')
    await page.click('button[type="submit"]')

    await expect(page.locator('[role="alert"]').filter({ hasText: /category/i })).toBeVisible()
    await expect(page.locator('[data-testid="form-success"]')).not.toBeVisible()
  })

  test('submits form with correct fields to the configured Staticman URL', async ({ page }) => {
    let capturedRequest: { url: string; body: string } | null = null

    await page.route('**', async (route) => {
      if (route.request().method() === 'POST') {
        capturedRequest = {
          url: route.request().url(),
          body: route.request().postData() ?? '',
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        })
      } else {
        await route.continue()
      }
    })

    await page.fill('[name="fields[name]"]', 'My TTRPG Hack')
    await page.fill('[name="fields[author]"]', 'Jane Doe')
    await page.fill('[name="fields[summary]"]', 'A short form game about exploration.')
    await page.locator('input[name="fields[category][]"]').first().check()

    await page.click('button[type="submit"]')
    await expect(page.locator('[data-testid="form-success"]')).toBeVisible()

    // Verify the POST went to the configured Staticman endpoint
    expect(capturedRequest).not.toBeNull()
    expect(capturedRequest!.url).toContain('v3/entry')
    expect(capturedRequest!.body).toContain('My TTRPG Hack')
    expect(capturedRequest!.body).toContain('Jane Doe')
  })

  test('shows success message after successful submission', async ({ page }) => {
    await page.fill('[name="fields[name]"]', 'My Game')
    await page.fill('[name="fields[summary]"]', 'Great game.')
    await page.locator('input[name="fields[category][]"]').first().check()

    await page.click('button[type="submit"]')
    await expect(page.locator('[data-testid="form-success"]')).toBeVisible()
  })

  test('shows error message when submission fails', async ({ page }) => {
    // Override the intercept to return a failure
    await page.route('**', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 500, body: 'Internal Server Error' })
      } else {
        await route.continue()
      }
    })

    await page.fill('[name="fields[name]"]', 'My Game')
    await page.fill('[name="fields[summary]"]', 'Great game.')
    await page.locator('input[name="fields[category][]"]').first().check()

    await page.click('button[type="submit"]')
    await expect(page.locator('[data-testid="form-error"]')).toBeVisible()
  })
})
