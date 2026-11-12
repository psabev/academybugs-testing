# academybugs-testing
Tests with AI agents for academybugs-testing

## Run the browser tests

Install dependencies and the Chromium browser, then run the test suite:

```sh
npm install
npx playwright install chromium
npm test
```

The cart totals test adds Dark Grey Jeans to a fresh browser session, opens the
cart, and verifies that the subtotal plus shipping equals the grand total. It
does not submit an order. The current live site displays a mismatched grand
total, so the test is expected to fail until that issue is fixed.
