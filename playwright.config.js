// @ts-check
const { defineConfig, devices } = require('@playwright/test');
import { testPlanFilter } from "allure-playwright/dist/testplan";
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();
const RPconfig = {
  apiKey: 'playwright-UTAF_OIpI8zAsSpuY18JD1116YEwyTK_kQfC60SksI8UOFohgKQYii7HhXgNhXeXdmbwu',
  endpoint: 'http://10.10.90.97:8080/api/v1',
  project: 'playwright_utaf',
  launch: 'Regression',
  attributes: [
    {
      key: 'agent',
      value: 'playwright',
    },
    {
      value: 'example',
    },
  ],
  description: 'This is an example launch with playwright tests',
  restClientConfig: {
    timeout: 0,
  },
  includeTestSteps: true,
  skippedIssue: false,
};
 
/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  timeout: 1000 * 60 * 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  grep: testPlanFilter(),
  reporter: [["line"], ["allure-playwright",
  {
    detail: true,
    outputFolder: "allure-results",
    suiteTitle: true,
    categories: [
      {
        name: "Outdated tests",
        messageRegex: ".*FileNotFound.*",
      },
    ],
    environmentInfo: {
      framework: "playwright",
    },
  },
],['@reportportal/agent-js-playwright', RPconfig]],
  // reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on" /* Collect trace always. See https://playwright.dev/docs/trace-viewer */,
    video: "on" /* Record Video */,
    screenshot: "only-on-failure",
    headless: true,
    viewport: { width: 1900, height: 940 },
    launchOptions: {
      slowMo: 500,
    },
  },
  // reporter: [['@reportportal/agent-js-playwright', RPconfig],['html']],
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

 

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

