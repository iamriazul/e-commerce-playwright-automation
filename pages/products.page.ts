import { Page, expect } from '@playwright/test';

type ProductData = {
  id: number;
  name: string;
  price: string;
};

export class ProductsPage {
  constructor(private readonly page: Page) {}

  async verifyLoaded() {
    await expect(this.page).toHaveURL(/\/products/);
    await expect(this.page.getByText('All Products')).toBeVisible();
    await expect(this.page.locator('.features_items .product-image-wrapper').first()).toBeVisible();
  }

  async search(product: string) {
    await this.page.locator('#search_product').fill(product);
    await this.page.locator('#submit_search').click({ noWaitAfter: true });
  }

  async verifySearchResults() {
    await expect(this.page.getByText('Searched Products')).toBeVisible();
    await expect(this.page.locator('.features_items .product-image-wrapper').first()).toBeVisible();
  }

  async verifySearchResultContains(productName: string) {
    await this.verifySearchResults();
    await expect(this.page.locator('.features_items')).toContainText(productName);
  }

  async verifyProductVisible(product: ProductData) {
    const productCard = this.productCard(product.id);

    await expect(productCard).toContainText(product.name);
    await expect(productCard).toContainText(product.price);
    await expect(productCard.locator('img')).toBeVisible();
    await expect(this.page.locator(`a[href="/product_details/${product.id}"]`)).toBeVisible();
  }

  async openProductDetails(productId: number) {
    await this.page.locator(`a[href="/product_details/${productId}"]`).click();
  }

  async verifyProductDetails(product: ProductData) {
    const details = this.page.locator('.product-information');

    await expect(this.page).toHaveURL(new RegExp(`/product_details/${product.id}`));
    await expect(details).toBeVisible();
    await expect(details.locator('h2')).toHaveText(product.name);
    await expect(details).toContainText(product.price);
    await expect(details).toContainText('Category:');
    await expect(details).toContainText('Availability:');
    await expect(details).toContainText('Condition:');
    await expect(details).toContainText('Brand:');
    await expect(this.page.locator('.view-product img, .product-details img').first()).toBeVisible();
  }

  async addProductToCart(productId: number) {
    await this.productCard(productId).locator(`a.add-to-cart[data-product-id="${productId}"]`).first().click({
      force: true,
      noWaitAfter: true
    });
    await this.page.waitForTimeout(500);
  }

  async continueShopping() {
    const modal = this.page.locator('#cartModal');

    if (await modal.isVisible()) {
      await modal.locator('button.close-modal').click();
      await expect(modal).toBeHidden();
    }
  }

  async viewCartFromModal() {
    const modal = this.page.locator('#cartModal');

    if (await modal.isVisible()) {
      await modal.locator('a[href="/view_cart"]').click();
      return;
    }

    await this.page.goto('/view_cart', { waitUntil: 'domcontentloaded' });
  }

  private productCard(productId: number) {
    return this.page.locator(`.features_items .product-image-wrapper:has(a[data-product-id="${productId}"])`).first();
  }
}
