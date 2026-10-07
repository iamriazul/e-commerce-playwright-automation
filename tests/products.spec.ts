import { test } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { blockThirdPartyAds } from './helpers';

const blueTop = {
  id: 1,
  name: 'Blue Top',
  price: 'Rs. 500'
};

test.describe('Products', () => {
  test.beforeEach(async ({ page }) => {
    await blockThirdPartyAds(page);
  });

  test('products page displays products', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);

    await home.open();
    await home.openProducts();
    await products.verifyLoaded();
    await products.verifyProductVisible(blueTop);
  });

  test('search returns products', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);

    await home.open();
    await home.openProducts();
    await products.verifyLoaded();
    await products.search('top');
    await products.verifySearchResultContains('Blue Top');
  });

  test('product details page can be opened', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);

    await home.open();
    await home.openProducts();
    await products.openProductDetails(blueTop.id);
    await products.verifyProductDetails(blueTop);
  });
});
