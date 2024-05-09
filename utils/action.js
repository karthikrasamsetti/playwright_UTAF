import { allure } from "allure-playwright";

export async function executeStep(test, element, action, description, data) {
    await allure.step(description,async () => {
        switch (action) {
            case "click" :
                await element.click();
                break;
            case "fill" :
                await element.fill(data[0]);
                break;
            case "selectOption" :
                await element.selectOption(data[0]);
                break;
            case "navigate" :
                await element.goto(data[0]);
                break;
            case "type" :
                await element.type(data[0]);
                break;
            case "tap" :
                await element.tap();
                break;
        }
    })
}