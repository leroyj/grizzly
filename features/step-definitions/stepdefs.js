//const assert = require('assert');
const { Given, When, Then, After, AfterAll, Status} = require('@cucumber/cucumber');

const { Builder, By, Capabilities, Key } = require('selenium-webdriver');
const { expect } = require('chai');

require("chromedriver");

// driver setup
const capabilities = Capabilities.chrome();
capabilities.set('chromeOptions', { "w3c": false });
const driver = new Builder().withCapabilities(capabilities).build();


Given('I go to the page {string}', async function (url) {
    await driver.get(url);
});

When('I do nothing', function () {
    // Write code here that turns the phrase above into concrete actions
    return true;
});

Then('I should see the homepage with the copyright {string} at the footer', async function (copyright) {
    // Write code here that turns the phrase above into concrete actions
    const element = await driver.findElement(By.id('footer'));
    const elementText = await element.getText();
    console.log ("Copyright: " + elementText);
    await expect(elementText).contains(copyright);
});

Then('I shouldn\'t see the homepage with the copyright {string} at the footer', async function (copyright) {
    // Write code here that turns the phrase above into concrete actions
    const element = await driver.findElement(By.id('footer'));
    const elementText = await element.getText();
    console.log ("Copyright: " + elementText);
    await expect(elementText).not.contains(copyright);
});

After(function (scenario) {
    if (scenario.result.status === Status.FAILED) {
        var world = this;
        return driver.takeScreenshot().then(function(screenShot, error) {
            if (!error) {
                world.attach(screenShot, "base64:image/png");
            }
        });
    }
});

AfterAll(async function(){
    await driver.quit();
});