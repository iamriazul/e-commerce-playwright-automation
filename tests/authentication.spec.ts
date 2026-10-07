import { test } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { blockThirdPartyAds } from './helpers';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await blockThirdPartyAds(page);
  });

  test('login page is accessible', async ({ page }) => {
    const home = new HomePage(page);
    const login = new LoginPage(page);

    await home.open();
    await home.openLogin();
    await login.verifyLoginSection();
  });

  test('invalid login is rejected', async ({ page }) => {
    const home = new HomePage(page);
    const login = new LoginPage(page);

    await home.open();
    await home.openLogin();
    await login.login(`invalid-user-${Date.now()}@example.com`, 'wrong-password');
    await login.verifyInvalidLogin();
  });
});
