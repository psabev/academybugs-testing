# Testing Summary

- Target: https://academybugs.com/find-bugs/
- Date: 2026-11-12
- Meaningful browser interactions: 3 (open product listing, add Dark Grey Jeans, open cart)
- Confirmed bugs: 1
- Suspected issues: 0
- The Playwright test was run twice through the complete flow and failed consistently at the cart-total equality assertion.

# Exploratory Test Plan

1. Open the product listing and identify the Dark Grey Jeans entry.
2. Add Dark Grey Jeans to the cart and verify the listing reflects the added item.
3. Open the cart, verify the product is present, and compare subtotal plus shipping with the grand total using integer cents.

# Scenarios Executed

| Scenario | Status | Notes |
|---|---|---|
| Open product listing and locate Dark Grey Jeans | Passed | Product entry was present at https://academybugs.com/find-bugs/. |
| Add Dark Grey Jeans to cart | Passed | The listing's action changed to “CHECKOUT NOW” after adding the item. |
| Open cart and verify Dark Grey Jeans is present | Passed | Cart showed one Dark Grey Jeans item with quantity 1 at https://academybugs.com/my-cart/. |
| Check whether subtotal plus shipping equals grand total | Failed | Subtotal $46.00 plus shipping $7.99 is $53.99; displayed grand total was $153.99. Reproduced in two runs. |
| Product detail, quantity changes, search, filters, pagination, refresh/back/forward, validation, and error handling | Not Tested | Outside this focused cart-total check. |

# Confirmed Bugs

## Cart grand total is $100 higher than subtotal plus shipping

Severity: High

### Steps to Reproduce

1. Open https://academybugs.com/find-bugs/.
2. Add Dark Grey Jeans to the cart.
3. Open https://academybugs.com/my-cart/.
4. Compare the displayed Cart Subtotal and Shipping amounts with Grand Total.

### Expected Result

Grand Total equals Cart Subtotal plus Shipping: $46.00 + $7.99 = $53.99.

### Actual Result

The cart displayed Cart Subtotal $46.00, Shipping $7.99, and Grand Total $153.99, a $100.00 discrepancy. The automated assertion compared integer cents and consistently received 5,399 instead of 15,399.

### Evidence

- Browser URL: https://academybugs.com/my-cart/
- Playwright failure screenshot: [test-failed-1.png](./test-results/cart-totals-grand-total-eq-6ba38-fter-adding-Dark-Grey-Jeans/test-failed-1.png)
- Automated test: [cart-totals.spec.ts](./tests/cart-totals.spec.ts)

### Confidence Level

High — reproduced in two complete test runs.

# Suspected Issues

None.

# Untested Areas and Limitations

- No order was submitted.
- Product detail pages, quantity updates, other cart arithmetic, search, filters, pagination, refresh/back/forward behavior, validation, and general error handling were not tested.
- The test depends on the live AcademyBugs site and may be affected by its availability or content changes.

# Recommendations

- Investigate the cart grand-total calculation; with the observed item and shipping amounts, the expected total is $53.99.
- Keep the Playwright assertion as a regression check; it is expected to fail until the site-side discrepancy is fixed.
