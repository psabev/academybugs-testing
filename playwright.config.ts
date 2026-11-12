import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'https://academybugs.com',
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
  },
});
