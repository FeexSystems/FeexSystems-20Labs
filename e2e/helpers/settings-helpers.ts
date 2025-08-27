import { Page, expect } from '@playwright/test';

export class SettingsHelpers {
  constructor(private page: Page) {}

  /**
   * Navigate to settings page
   */
  async navigateToSettings() {
    await this.page.click('[data-testid="nav-settings"]');
    await expect(this.page).toHaveURL(/.*settings/);
  }

  /**
   * Update profile information
   */
  async updateProfile({
    firstName,
    lastName,
    company,
    phoneNumber
  }: {
    firstName?: string;
    lastName?: string;
    company?: string;
    phoneNumber?: string;
  }) {
    await this.navigateToSettings();
    
    if (firstName) {
      await this.page.fill('[data-testid="firstName-input"]', firstName);
    }
    if (lastName) {
      await this.page.fill('[data-testid="lastName-input"]', lastName);
    }
    if (company) {
      await this.page.fill('[data-testid="company-input"]', company);
    }
    if (phoneNumber) {
      await this.page.fill('[data-testid="phone-input"]', phoneNumber);
    }
    
    await this.page.click('[data-testid="save-profile"]');
    
    // Wait for success message
    await expect(this.page.locator('[data-testid="success-message"]'))
      .toBeVisible();
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string) {
    await this.navigateToSettings();
    await this.page.click('[data-testid="security-tab"]');
    
    await this.page.fill('[data-testid="current-password"]', currentPassword);
    await this.page.fill('[data-testid="new-password"]', newPassword);
    await this.page.fill('[data-testid="confirm-password"]', newPassword);
    
    await this.page.click('[data-testid="change-password"]');
    
    // Wait for success message
    await expect(this.page.locator('[data-testid="success-message"]'))
      .toBeVisible();
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(preferences: {
    email?: boolean;
    push?: boolean;
    marketing?: boolean;
  }) {
    await this.navigateToSettings();
    await this.page.click('[data-testid="notifications-tab"]');
    
    if (preferences.email !== undefined) {
      await this.page.setChecked('[data-testid="email-notifications"]', preferences.email);
    }
    if (preferences.push !== undefined) {
      await this.page.setChecked('[data-testid="push-notifications"]', preferences.push);
    }
    if (preferences.marketing !== undefined) {
      await this.page.setChecked('[data-testid="marketing-notifications"]', preferences.marketing);
    }
    
    await this.page.click('[data-testid="save-notifications"]');
    
    // Wait for success message
    await expect(this.page.locator('[data-testid="success-message"]'))
      .toBeVisible();
  }
}
