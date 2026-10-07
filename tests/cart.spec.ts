import { test } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { CartPage } from '../pages/cart.page';
import { ProductsPage } from '../pages/products.page';
import { LoginPage } from '../pages/login.page';
import { blockThirdPartyAds } from './helpers';

const user = {
  email: 'mriazul623@gmail.com',
  password: 'Austcse'
};

const blueTop = {
  id: 1,
  name: 'Blue Top',
  price: 'Rs. 500',
  quantity: '1',
  total: 'Rs. 500'
};

const menTshirt = {
  id: 2,
  name: 'Men Tshirt',
  price: 'Rs. 400',
  quantity: '1',
  total: 'Rs. 400'
};

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    await blockThirdPartyAds(page);
  });

  test('cart page can be opened', async ({ page }) => {
    const home = new HomePage(page);
    const cart = new CartPage(page);

    await home.open();
    await home.openCart();
    await cart.verifyLoaded();
  });

  test('empty cart displays empty state', async ({ page }) => {
    const home = new HomePage(page);
    const cart = new CartPage(page);

    await home.open();
    await home.openCart();
    await cart.verifyLoaded();
    await cart.verifyEmptyCart();
  });

  test('single product can be added and verified in cart', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);

    await home.open();
    await home.openProducts();
    await products.addProductToCart(blueTop.id);
    await products.viewCartFromModal();

    await cart.verifyLoaded();
    await cart.verifyTableHeaders();
    await cart.verifyProductCount(1);
    await cart.verifyProduct(blueTop);
  });

  test('logged in user can proceed from cart to checkout page', async ({ page }) => {
    const home = new HomePage(page);
    const login = new LoginPage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);

    await home.open();
    await home.openLogin();
    await login.login(user.email, user.password);
    await login.verifyLoggedIn();

    await home.openCart();
    await cart.clearCart();
    await home.openProducts();
    await products.addProductToCart(blueTop.id);
    await products.viewCartFromModal();

    await cart.verifyLoaded();
    await cart.verifyProduct(blueTop);
    await cart.proceedToCheckout();
    await cart.verifyCheckoutPage(blueTop);
  });

  test('multiple products can be added and verified in cart', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);

    await home.open();
    await home.openProducts();
    await products.addProductToCart(blueTop.id);
    await products.continueShopping();
    await products.addProductToCart(menTshirt.id);
    await products.viewCartFromModal();

    await cart.verifyLoaded();
    await cart.verifyProductCount(2);
    await cart.verifyProduct(blueTop);
    await cart.verifyProduct(menTshirt);
  });

  test('product can be removed from cart', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);

    await home.open();
    await home.openProducts();
    await products.addProductToCart(blueTop.id);
    await products.viewCartFromModal();

    await cart.verifyProduct(blueTop);
    await cart.removeProduct(blueTop.id);
    await cart.verifyEmptyCart();
  });
});
