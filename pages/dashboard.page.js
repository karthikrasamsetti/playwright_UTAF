const { expect } = require("@playwright/test");
const data = require("../data/data.json");
require("dotenv").config();
import { executeStep } from "../utils/action";

// DashboardPage class representing the dashboard functionality
exports.DashboardPage = class DashboardPage {
  constructor(test, page) {
    this.test = test; // Playwright test object
    this.page = page; // Playwright page object

    // Locators for various elements on the dashboard page
    this.logo = page.locator("//div[@class='app_logo']");
    this.menuBar = page.locator("//button[@id='react-burger-menu-btn']");
    this.logoutButton = page.locator("//a[@id='logout_sidebar_link']");
    this.addbackbag = page.locator(
      "//button[@id='add-to-cart-sauce-labs-backpack']"
    );
    this.addbikeLight = page.locator(
      "//button[@id='add-to-cart-sauce-labs-bike-light']"
    );
    this.addredHoodie = page.locator(
      "//button[@id='add-to-cart-test.allthethings()-t-shirt-(red)']"
    );
    this.filterDropDown = page.locator(
      "//select[@class='product_sort_container']"
    );
    this.fleeceJacket = page.locator(
      "//button[@id='add-to-cart-sauce-labs-fleece-jacket']"
    );
    this.cartLink = page.locator(
      "//div[@id='shopping_cart_container']//a[@class='shopping_cart_link']"
    );
    this.removebikeLight = page.locator(
      "//button[@id='remove-sauce-labs-bike-light']"
    );
    this.checkoutBtn = page.locator("//button[@id='checkout']");
    this.firstnameFeild = page.locator("//input[@id='first-name']");
    this.lastnameFeild = page.locator("//input[@id='last-name']");
    this.zipFeild = page.locator("//input[@id='postal-code']");
    this.continueBtn = page.locator("//input[@id='continue']");
    this.finishBtn = page.locator("//button[@id='finish']");
    this.thankYou = page.locator("//h2[text()='Thank you for your order!']");
    this.backHomeBtn = page.locator("//button[@id='back-to-products']");

    // Function to locate navigation bar items
    this.navBar = (content) => page.locator(`(//a[text()='${content}'])`);

    // Function to locate items on the dashboard
    this.items = (i) =>
      this.page.locator(
        `((//div[@id='inventory_container']// descendant::div)[3]/child::div)[${i}]/child::div[@class='inventory_item_img']`
      );
  }

  // Method to perform logout action
  async logoutAction() {
    await executeStep(this.test, this.menuBar, "click", "Click on menu bar");
    await executeStep(this.test, this.logoutButton, "click", "Click on logout");
  }

  // Method to perform adding items to the cart action
  async addToCartAction() {
    // Adding items to the cart
    await executeStep(
      this.test,
      this.addbackbag,
      "click",
      "Add backpack to cart"
    );
    await executeStep(
      this.test,
      this.addbikeLight,
      "click",
      "Add bike light to cart"
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.page.evaluate(() => {
      window.scrollBy(0, 260);
    });
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(
      this.test,
      this.addredHoodie,
      "click",
      "Add red hoodie to cart"
    );

    // Filtering and adding more items to the cart
    await executeStep(
      this.test,
      this.filterDropDown,
      "click",
      "Click on filter dropdown"
    );
    await executeStep(
      this.test,
      this.filterDropDown,
      "selectOption",
      "Select required filter",
      [data.filter.priceHtoL]
    );
    await executeStep(
      this.test,
      this.fleeceJacket,
      "click",
      "Add fleece jacket to cart"
    );
    await executeStep(
      this.test,
      this.cartLink,
      "click",
      "Click on cart button"
    );
    const cartCount = await this.page
      .locator("//span[@class='shopping_cart_badge']")
      .textContent();
    console.log("cart count is", cartCount);
    await expect(cartCount).toBe("4");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(
      this.test,
      this.removebikeLight,
      "click",
      "Remove bike light from cart"
    );
    await this.page.evaluate(() => {
      window.scrollBy(0, 250);
    });
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));

    // Proceeding with checkout process
    const isEnabled = await this.checkoutBtn.isEnabled();
    expect(isEnabled).toBe(true); // Ensure the checkout button is enabled
    await executeStep(
      this.test,
      this.checkoutBtn,
      "click",
      "Click on checkout button"
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(
      this.test,
      this.firstnameFeild,
      "fill",
      "Enter firstname",
      [data.personalDetails.firstname]
    );
    const firstNameValue = await this.firstnameFeild.inputValue();
    expect(firstNameValue).toBe(data.personalDetails.firstname);
    await executeStep(this.test, this.lastnameFeild, "fill", "Enter lastname", [
      data.personalDetails.lastname,
    ]);
    const lastNameValue = await this.lastnameFeild.inputValue();
    expect(lastNameValue).toBe(data.personalDetails.lastname);
    await executeStep(this.test, this.zipFeild, "fill", "Enter zip code", [
      data.personalDetails.zipcode,
    ]);
    const zipCodeValue = await this.zipFeild.inputValue();
    expect(zipCodeValue).toBe(data.personalDetails.zipcode);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(
      this.test,
      this.continueBtn,
      "click",
      "Click the continue button"
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    // await this.page.evaluate(() => {
    //     window.scrollBy(0, 260);
    // });
    // await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(
      this.test,
      this.finishBtn,
      "click",
      "Click the finish button"
    );
    console.log("finish button clicked");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    // Verify order success message
    await expect(this.thankYou).toBeVisible();

    // Navigate back to home and perform logout
    await executeStep(
      this.test,
      this.backHomeBtn,
      "click",
      "Click on BackHome Button"
    );
    await this.logoutAction();
  }

  // Method to perform menu bar action
  async menuBarAction() {
    await executeStep(this.test, this.menuBar, "click", "Click on menu bar");
  }

  // Method to perform logout click
  async logoutClick() {
    await executeStep(this.test, this.logoutButton, "click", "Click on logout");
  }
};
