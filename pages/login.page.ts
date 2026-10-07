import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async verifyLoginSection() {
    await expect(this.page.getByText('Login to your account')).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.page.locator('input[data-qa="login-email"]').fill(email);
    await this.page.locator('input[data-qa="login-password"]').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async verifyLoggedIn() {
    await expect(this.page.locator('a[href="/logout"]')).toBeVisible();
    await expect(this.page.getByText(/Logged in as/i)).toBeVisible();
  }

  async verifyInvalidLogin() {
    await expect(this.page.getByText('Your email or password is incorrect!')).toBeVisible();
  }
}
