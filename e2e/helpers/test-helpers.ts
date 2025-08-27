import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Login as a user
   */
  async login(email: string, password: string) {
    await this.page.goto('/login');
    await this.page.fill('[data-testid="email-input"]', email);
    await this.page.fill('[data-testid="password-input"]', password);
    await this.page.click('[data-testid="login-button"]');
    
    // Wait for navigation and verify successful login
    await expect(this.page).toHaveURL(/.*dashboard/);
  }

  /**
   * Register a new user
   */
  async register(email: string, password: string, firstName: string, lastName: string) {
    await this.page.goto('/register');
    await this.page.fill('[data-testid="email-input"]', email);
    await this.page.fill('[data-testid="password-input"]', password);
    await this.page.fill('[data-testid="firstName-input"]', firstName);
    await this.page.fill('[data-testid="lastName-input"]', lastName);
    await this.page.click('[data-testid="register-button"]');
    
    // Wait for navigation and verify successful registration
    await expect(this.page).toHaveURL(/.*dashboard/);
  }

  /**
   * Logout the current user
   */
  async logout() {
    await this.page.click('[data-testid="user-menu"]');
    await this.page.click('[data-testid="logout-button"]');
    await expect(this.page).toHaveURL('/');
  }

  /**
   * Navigate to a specific section
   */
  async navigateTo(section: string) {
    await this.page.click(`[data-testid="nav-${section}"]`);
    await expect(this.page).toHaveURL(new RegExp(`.*${section}`));
  }

  /**
   * Generate a unique email for testing
   */
  generateTestEmail() {
    return `test-${Date.now()}@example.com`;
  }

  /**
   * Clean up test data (to be called after tests)
   */
  async cleanupTestData() {
    // Add cleanup logic here if needed
    // This could involve API calls to remove test data
  }
}
