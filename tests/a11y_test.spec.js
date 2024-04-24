import runAccessibilityTests from '../utils/a11y';
const { test, expect } = require('@playwright/test');
const indexPage = require("../fixtures/fixture");
require("dotenv").config();
test.describe('Swaglabs', () => { // 2
    test('automatically detectable accessibility issues', async ({ page }) => {
      const loginPage = new indexPage.LoginPage(test, page);
    //   const dashboardPage=new indexPage.DashboardPage(test,page);
      await loginPage.launchUrl();
      await runAccessibilityTests("loginPage",page)
      await loginPage.loginAction();
    //   await page.waitForTimeout(parseInt(process.env.medium_timeout));
      await runAccessibilityTests("dashboardPage",page);
    });
  });