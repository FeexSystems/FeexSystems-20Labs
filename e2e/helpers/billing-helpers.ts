import { Page, expect } from '@playwright/test';

export class BillingHelpers {
  constructor(private page: Page) {}

  /**
   * Navigate to billing page
   */
  async navigateToBilling() {
    await this.page.click('[data-testid="nav-billing"]');
    await expect(this.page).toHaveURL(/.*billing/);
  }

  /**
   * Change subscription plan
   */
  async changePlan(planName: string) {
    await this.navigateToBilling();
    await this.page.click(`[data-testid="plan-${planName}"]`);
    await this.page.click('[data-testid="confirm-plan-change"]');
    
    // Wait for success message
    await expect(this.page.locator('[data-testid="success-message"]'))
      .toBeVisible();
  }

  /**
   * Add payment method
   */
  async addPaymentMethod({
    cardNumber,
    expiry,
    cvc,
    name
  }: {
    cardNumber: string;
    expiry: string;
    cvc: string;
    name: string;
  }) {
    await this.navigateToBilling();
    await this.page.click('[data-testid="add-payment-method"]');
    
    // Fill payment form
    const frame = this.page.frameLocator('[data-testid="stripe-card-element"]');
    await frame.locator('[placeholder="Card number"]').fill(cardNumber);
    await frame.locator('[placeholder="MM / YY"]').fill(expiry);
    await frame.locator('[placeholder="CVC"]').fill(cvc);
    await this.page.fill('[data-testid="card-holder-name"]', name);
    
    await this.page.click('[data-testid="save-card"]');
    
    // Wait for success message
    await expect(this.page.locator('[data-testid="success-message"]'))
      .toBeVisible();
  }

  /**
   * View billing history
   */
  async viewBillingHistory() {
    await this.navigateToBilling();
    await this.page.click('[data-testid="view-billing-history"]');
    
    // Verify billing history is displayed
    await expect(this.page.locator('[data-testid="billing-history-table"]'))
      .toBeVisible();
  }
}
