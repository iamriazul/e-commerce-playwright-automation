import { Page } from '@playwright/test';

export async function blockThirdPartyAds(page: Page) {
  await page.route(/.*(adservice|doubleclick|fundingchoices|googleads|googlesyndication|pagead2).*/, route =>
    route.abort()
  );
}
