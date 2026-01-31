import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
    test('should complete full registration flow', async ({ page }) => {
        // Navigate to registration page
        await page.goto('/register');

        // Fill registration form
        await page.fill('input[id="firstName"]', 'John');
        await page.fill('input[id="lastName"]', 'Doe');
        await page.fill('input[id="email"]', `test${Date.now()}@example.com`);
        await page.fill('input[id="password"]', 'TestPass123!');
        await page.fill('input[id="confirmPassword"]', 'TestPass123!');

        // Submit form
        await page.click('button[type="submit"]');

        // Wait for redirect to dashboard or verification page
        await expect(page).toHaveURL(/\/(dashboard|verify-email)/);

        // Verify success message or dashboard content
        await expect(page.locator('text=/welcome|dashboard/i')).toBeVisible();
    });

    test('should show validation errors for invalid data', async ({ page }) => {
        await page.goto('/register');

        // Try to submit empty form
        await page.click('button[type="submit"]');

        // Check for validation errors
        await expect(page.locator('text=/required|invalid/i')).toBeVisible();
    });

    test('should show error for password mismatch', async ({ page }) => {
        await page.goto('/register');

        await page.fill('input[id="firstName"]', 'John');
        await page.fill('input[id="lastName"]', 'Doe');
        await page.fill('input[id="email"]', 'test@example.com');
        await page.fill('input[id="password"]', 'TestPass123!');
        await page.fill('input[id="confirmPassword"]', 'DifferentPass123!');

        await page.click('button[type="submit"]');

        // Check for password mismatch error
        await expect(page.locator('text=/match/i')).toBeVisible();
    });
});
