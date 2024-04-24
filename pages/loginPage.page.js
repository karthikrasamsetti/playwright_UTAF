const data = require("../data/data.json"); // Importing data from JSON file
require("dotenv").config(); // Loading environment variables
import { executeStep } from "../utils/action"; // Importing executeStep function from action module

// LoginPage class representing the login functionality
exports.LoginPage = class LoginPage {
    constructor(test, page) {
        this.test = test; // Playwright test object
        this.page = page; // Playwright page object
        
        // Locators for various elements on the login page
        this.usernameField = page.locator("//input[@id='user-name']");
        this.passwordFeild = page.locator("//input[@id='password']");
        this.loginButton = page.locator("//input[@id='login-button']");
        this.loginlogo = page.locator("//div[@class='login_logo']");
        this.errorLogin = page.locator("//h3[@data-test='error']");
        
    }
    
    // Method to navigate to the application URL
    async launchUrl() {
        await this.page.goto(process.env.baseUrl);
    } 

    // Method to perform login action with valid credentials
    async loginAction() {
        await executeStep(this.test, this.usernameField, "fill", "Enter the username", [data.loginDetails.username]);
        await executeStep(this.test, this.passwordFeild, "fill", "Enter the password", [data.loginDetails.password]);
        await executeStep(this.test, this.loginButton, "click", "Click on the loginButton");
    }

    // Method to perform login action with invalid credentials
    async InvalidLoginAction() {
        await executeStep(this.test, this.usernameField, "fill", "Enter the username", [data.loginDetails.invalidusername]);
        await executeStep(this.test, this.passwordFeild, "fill", "Enter the password", [data.loginDetails.invalidpassword]);
        await executeStep(this.test, this.loginButton, "click", "Click on the loginButton");
    }
}
