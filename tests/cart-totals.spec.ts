import { expect, test, type Page } from '@playwright/test';

async function readCartAmountInCents(page: Page, label: string): Promise<number> {
  const amountText = await page.locator('body').evaluate((body, targetLabel) => {
    const normalize = (text: string) => text.trim().replace(/:$/, '').toLowerCase();
    const labelElement = Array.from(body.querySelectorAll<HTMLElement>('*')).find(
      (element) =>
        element.children.length === 0 &&
        normalize(element.innerText) === targetLabel.toLowerCase() &&
        element.getClientRects().length > 0,
    );

    if (!labelElement) {
      throw new Error(`Could not find the visible "${targetLabel}" amount label.`);
    }

    let ancestor: HTMLElement | null = labelElement;
    while (ancestor && ancestor !== body) {
      const amounts = ancestor.innerText.match(/\$[\d,]+\.\d{2}/g);
      if (amounts?.length === 1) {
        return amounts[0];
      }
      ancestor = ancestor.parentElement;
    }

    throw new Error(`Could not find a single currency amount for "${targetLabel}".`);
  }, label);

  return Math.round(Number(amountText.replace(/[$,]/g, '')) * 100);
}

test('grand total equals subtotal plus shipping after adding Dark Grey Jeans', async ({ page }) => {
  await page.goto('/find-bugs/');

  const functionalCookiesButton = page.getByRole('button', { name: 'Functional only' });
  if (await functionalCookiesButton.isVisible()) {
    await functionalCookiesButton.click();
  }

  const darkGreyJeans = page.locator('#ec_product_li_4281370');
  await expect(darkGreyJeans).toContainText('Dark Grey Jeans');
  await darkGreyJeans.locator('a[href*="model_number=4281370"]:visible').first().click();
  await expect(darkGreyJeans.getByRole('link', { name: 'CHECKOUT NOW' })).toBeVisible();

  await page.goto('/my-cart/');
  await expect(page.getByRole('row').filter({ hasText: 'Dark Grey Jeans' })).toBeVisible();

  const subtotal = await readCartAmountInCents(page, 'Cart Subtotal');
  const shipping = await readCartAmountInCents(page, 'Shipping');
  const grandTotal = await readCartAmountInCents(page, 'Grand Total');

  expect(subtotal + shipping).toBe(grandTotal);
});
