const { AxeBuilder } = require("@axe-core/playwright");
const { createHtmlReport } = require("axe-html-reporter");
const { test, expect } = require('@playwright/test');

async function runAccessibilityTests(pageName,page) {
 
  const url = await page.url();
  console.log(url, "<<<<<<<<<<<<<<<<<<<<<<<");
  await page.waitForTimeout(parseInt(5000));
  const accessibilityScanResults = await new AxeBuilder( {page} ).analyze();

  const reportPath = `a11y_${pageName}.html`;

  createHtmlReport({
    results: 
      accessibilityScanResults
    ,
    options: {
      projectKey: "Corsair",
      reportFileName:reportPath,
      outputDir:"reports/a11y/"
    },
  });
  // expect(accessibilityScanResults.violations.length).toBe(0);

  
   
  
};

module.exports = runAccessibilityTests;