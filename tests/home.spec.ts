import { test } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { blockThirdPartyAds } from './helpers';

test.describe('Home page smoke tests', () => {
  test.beforeEach(async ({ page }) => {
    await blockThirdPartyAds(page);
  });

  test('home page loads successfully', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await home.verifyLoaded();
  });
});
