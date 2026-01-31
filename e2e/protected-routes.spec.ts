import { test, expect } from '@playwright/test';

test.describe('Protected Routes and Session Management', () => {
    test('should redirect to login when accessing protected route without auth', async ({ page }) => {
        // Try to access dashboard without logging in
        await page.goto('/dashboard');

        // Should redirect to login
        await expect(page).toHaveURL(/\/login/);
    });

    test('should access protected route after login', async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.fill('input[id="email"]', 'user@example.com');
        await page.fill('input[id="password"]', 'TestPass123!');
        await page.click('button[type="submit"]');

        // Wait for dashboard
        await expect(page).toHaveURL(/\/dashboard/);

        // Navigate to another protected route
        await page.goto('/profile');

        // Should still be authenticated
        await expect(page).toHaveURL(/\/profile/);
        await expect(page.locator('text=/profile|account/i')).toBeVisible();
    });

    test('should logout and redirect to login', async ({ page, context }) => {
        // Login
        await page.goto('/login');
        await page.fill('input[id="email"]', 'user@example.com');
        await page.fill('input[id="password"]', 'TestPass123!');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/\/dashboard/);

        // Click logout button
        await page.click('button:has-text("Logout"), button:has-text("Sign out")');

        // Should redirect to login
        await expect(page).toHaveURL(/\/login/);

        // Verify session is cleared
        const cookies = await context.cookies();
        const authCookies = cookies.filter(c => c.name.includes('auth') || c.name.includes('token'));
        expect(authCookies).toHaveLength(0);
    });

    test.skip('should auto-logout on token expiration', async ({ page }) => {
        // This test would require mocking time or using short-lived tokens
        // Skipped for now - requires backend configuration
    });
});
