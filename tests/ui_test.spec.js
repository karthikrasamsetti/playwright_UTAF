const data = require("../data/data.json")
const { test, expect } = require("@playwright/test");
const indexPage = require("../fixtures/fixture");

// Global declarations for pages
let loginPage, dashboardPage;
test.describe.configure({ mode: 'parallel' });
test.beforeEach('Open start URL', async ({page}) => {
    // Initialize pages before each test
    loginPage = new indexPage.LoginPage(test, page);
    dashboardPage=new indexPage.DashboardPage(test,page);
    await loginPage.launchUrl();
});

// Test to login user
test("Login user", async ({page}) => {
    /*
    Test to verify successful login of a user.
    */
    await loginPage.loginAction();
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await expect(dashboardPage.logo).toBeVisible();
    const title=await page.title();
    await expect(title).toStrictEqual("Swag Labs");
    await dashboardPage.logoutAction();
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await expect(loginPage.loginlogo).toBeVisible();
});

// Test to login with invalid user
test("Login with invalid user", async ({page}) => {
    /*
    Test to verify error message display when attempting login with invalid credentials.
    */
    await loginPage.InvalidLoginAction();
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await expect(loginPage.errorLogin).toBeVisible();
});

// Test to add item to cart
test("Add to cart", async ({page}) => {
    /*
    Test to verify successful addition of an item to the cart.
    */
    await loginPage.loginAction();
    await dashboardPage.addToCartAction();
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await expect(loginPage.loginlogo).toBeVisible();
});

// Test validations on Dashboard page
test("Validations on Dashboard page", async ({page}) => {
    /*
    Test to validate various elements on the Dashboard page.
    */
    await loginPage.loginAction();
    for (let i = 1; i < 7; i++) {
        var info = dashboardPage.items(i);
        await expect(info).toBeVisible();
        await page.waitForTimeout(parseInt(process.env.small_timeout));
    }
});

// Test validations on Sidebar navigation
test("Validations on Sidebar navigation", async ({ page }) => {
    /*
    Test to validate elements on the Sidebar navigation and logout.
    */
    await loginPage.loginAction();
    await dashboardPage.menuBarAction();
    for(const content of data.navBarText) {
       await expect(dashboardPage.navBar(content)).toBeVisible();
       await page.waitForTimeout(parseInt(process.env.small_timeout));
    }
    await dashboardPage.logoutClick();
});
