import { Page, expect } from '@playwright/test';

type CartProduct = {
  id: number;
  name: string;
  price: string;
  quantity?: string;
  total?: string;
};

export class CartPage {
  constructor(private readonly page: Page) {}

  async verifyLoaded() {
    await expect(this.page).toHaveURL(/view_cart/);
    await expect(this.page.getByText('Shopping Cart')).toBeVisible();
  }

  async verifyProductRow(productName: string) {
    await expect(this.page.locator('#cart_info_table')).toContainText(productName);
  }

  async verifyTableHeaders() {
    const table = this.page.locator('#cart_info_table');

    await expect(table).toContainText('Item');
    await expect(table).toContainText('Description');
    await expect(table).toContainText('Price');
    await expect(table).toContainText('Quantity');
    await expect(table).toContainText('Total');
  }

  async verifyProduct(product: CartProduct) {
    const row = this.productRow(product.id);

    await expect(row).toBeVisible();
    await expect(row.locator('.cart_description')).toContainText(product.name);
    await expect(row.locator('.cart_price')).toContainText(product.price);

    if (product.quantity) {
      await expect(row.locator('.cart_quantity')).toContainText(product.quantity);
    }

    if (product.total) {
      await expect(row.locator('.cart_total')).toContainText(product.total);
    }
  }

  async verifyProductCount(count: number) {
    await expect(this.page.locator('#cart_info_table tbody tr[id^="product-"]')).toHaveCount(count);
  }

  async removeProduct(productId: number) {
    await this.productRow(productId).locator('.cart_quantity_delete').click();
    await expect(this.productRow(productId)).toHaveCount(0);
  }

  async clearCart() {
    const rows = this.page.locator('#cart_info_table tbody tr[id^="product-"]');

    for (let attempt = 0; attempt < 10 && (await rows.count()) > 0; attempt++) {
      const countBeforeDelete = await rows.count();

      await rows.first().locator('.cart_quantity_delete').click();
      await expect(rows).toHaveCount(countBeforeDelete - 1);
    }
  }

  async proceedToCheckout() {
    await this.page.locator('.check_out').click();
  }

  async verifyCheckoutPage(product: CartProduct) {
    const orderTable = this.page.locator('table').filter({ hasText: 'Item' }).first();

    await expect(this.page).toHaveURL(/\/checkout/);
    await expect(this.page.getByText('Address Details')).toBeVisible();
    await expect(this.page.getByText('Review Your Order')).toBeVisible();
    await expect(orderTable).toContainText(product.name);
    await expect(orderTable).toContainText(product.price);
    await expect(this.page.locator('textarea[name="message"]')).toBeVisible();
    await expect(this.page.locator('a[href="/payment"]')).toBeVisible();
  }

  async verifyEmptyCart() {
    await expect(this.page.locator('#empty_cart')).toBeVisible();
    await expect(this.page.locator('#empty_cart')).toContainText('Cart is empty');
  }

  private productRow(productId: number) {
    return this.page.locator(`#product-${productId}`);
  }
}
