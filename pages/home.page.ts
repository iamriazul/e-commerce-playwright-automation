import { Page, expect } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  async verifyLoaded() {
    await expect(this.page).toHaveTitle(/Automation Exercise/i);
    await expect(this.page.locator('a[href="/"]').first()).toBeVisible();
  }

  async openLogin() {
    await this.page.goto('/login', { waitUntil: 'domcontentloaded' });
  }

  async openProducts() {
    await this.page.goto('/products', { waitUntil: 'domcontentloaded' });
  }

  async openCart() {
    await this.page.goto('/view_cart', { waitUntil: 'domcontentloaded' });
  }
}
