// Minimal Playwright smoke test placeholder
// Visit the homepage and assert a basic title/text exists.
// Note: Requires @playwright/test to run.
import { test, expect } from '@playwright/test';

// Adjust baseURL via Playwright config if needed; default to http://localhost:3000

test('loads homepage without errors', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/EmmanuelOS|Next\.js|Home/i);
});
