import { test, expect } from '@playwright/test';

test('landing page redirect to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h1')).toContainText('Login');
});

test('login flow', async ({ page }) => {
    // This requires a mock user or real credentials in env
    // Placeholder for structure
    await page.goto('/login');
    // await page.fill('input[name="email"]', 'test@example.com');
    // await page.click('button[type="submit"]');
});
