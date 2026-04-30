import { test, expect } from "@playwright/test";

let firstTerm: string;
let secondTerm: string;

test.describe("search", () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto(".");
    await page.locator("article.card").first().waitFor();

    const cards = page.locator("article.card");
    const count = await cards.count();

    const firstWord = async (idx: number) => {
      const text = await cards.nth(idx).getByRole("heading").textContent();
      return text!.trim().split(/\s+/)[0].toLowerCase();
    };

    firstTerm = await firstWord(0);
    secondTerm = count > 1 ? await firstWord(count - 1) : firstTerm;

    await page.close();
  });

  test("header search input is visible on catalog page", async ({ page }) => {
    await page.goto(".");
    await expect(page.getByRole("searchbox", { name: "Search" })).toBeVisible();
  });

  test("submitting a query navigates to the search page", async ({ page }) => {
    await page.goto(".");
    await page.getByRole("searchbox", { name: "Search" }).fill(firstTerm);
    await page.getByLabel("Submit search").click();
    await expect(page).toHaveURL(
      new RegExp(`/search/\\?q=${encodeURIComponent(firstTerm)}`)
    );
  });

  test("search page shows results for a known resource", async ({ page }) => {
    await page.goto(`./search/?q=${encodeURIComponent(firstTerm)}`);
    await expect(
      page.getByRole("link", { name: new RegExp(firstTerm, "i") }).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("clicking a search result navigates to the resource page", async ({
    page,
  }) => {
    await page.goto(`./search/?q=${encodeURIComponent(firstTerm)}`);
    await page
      .getByRole("link", { name: new RegExp(firstTerm, "i") })
      .first()
      .click();
    await expect(page).toHaveURL(/\/resource\//);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("searching again from the search page updates results", async ({
    page,
  }) => {
    await page.goto(`./search/?q=${encodeURIComponent(firstTerm)}`);
    await expect(
      page.getByRole("link", { name: new RegExp(firstTerm, "i") }).first()
    ).toBeVisible({ timeout: 10000 });

    await page.getByRole("searchbox", { name: "Search" }).fill(secondTerm);
    await page.getByLabel("Submit search").click();
    await expect(page).toHaveURL(
      new RegExp(`/search/\\?q=${encodeURIComponent(secondTerm)}`)
    );
    await expect(
      page.getByRole("link", { name: new RegExp(secondTerm, "i") }).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("unknown query shows no results message", async ({ page }) => {
    await page.goto("./search/?q=xyzzy-no-match-zz99");
    await expect(page.getByText(/no results found/i)).toBeVisible({
      timeout: 10000,
    });
  });

  test("search page with no query shows prompt", async ({ page }) => {
    await page.goto("./search/");
    await expect(page.getByText(/enter a search term/i)).toBeVisible();
  });
});
