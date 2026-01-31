import { test, expect } from '@playwright/test';

test.describe('Login and Password Reset Flow', () => {
    const validEmail = 'user@example.com';
    const validPassword = 'TestPass123!';

    test('should login successfully with valid credentials', async ({ page }) => {
        await page.goto('/login');

        // Fill login form
        await page.fill('input[id="email"]', validEmail);
        await page.fill('input[id="password"]', validPassword);

        // Submit
        await page.click('button[type="submit"]');

        // Should redirect to dashboard
        await expect(page).toHaveURL(/\/dashboard/);
        await expect(page.locator('text=/dashboard|welcome/i')).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[id="email"]', 'wrong@example.com');
        await page.fill('input[id="password"]', 'WrongPassword123!');

        await page.click('button[type="submit"]');

        // Should show error message
        await expect(page.locator('[role="alert"]')).toBeVisible();
    });

    test('should complete password reset flow', async ({ page }) => {
        // Navigate to forgot password
        await page.goto('/login');
        await page.click('text=Forgot password?');

        await expect(page).toHaveURL(/\/forgot-password/);

        // Enter email
        await page.fill('input[id="email"]', validEmail);
        await page.click('button[type="submit"]');

        // Should show success message
        await expect(page.locator('text=/email sent|check your email/i')).toBeVisible();
    });

    test('should navigate between login and register', async ({ page }) => {
        await page.goto('/login');

        // Click "Create account" link
        await page.click('text=/sign up|create account|register/i');

        await expect(page).toHaveURL(/\/register/);

        // Go back to login
        await page.click('text=/sign in|login|already have/i');

        await expect(page).toHaveURL(/\/login/);
    });
});
