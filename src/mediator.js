// version 1.0.0

import { By, until } from "selenium-webdriver";

export class HbLinksFromMediatorPage {
    constructor(driver, pageUrl) {
        this.driver = driver;
        this.pageUrl = pageUrl;
        this.maxAttempts = 10;
        this.targetUrlPart = "https://hblinks.pro/archives";
    }

    __checkValidUrl() {
        return ['taazabull24.com'].some(keyword => this.pageUrl.includes(keyword));
    }

    async __getHblinks() {
        if (!this.__checkValidUrl()) return null;

        try {
            await this.driver.get(this.pageUrl);
            const wait = this.driver.wait.bind(this.driver, until.elementLocated(By.id("verify_btn")), 30000);
            const mainWindow = await this.driver.getWindowHandle();

            // STEP 1: Click "Click to Continue"
            let verifyBtn = await wait();
            await verifyBtn.click();

            // STEP 2: Close ad tab if opened
            await this._sleep(2000);
            const allHandles = await this.driver.getAllWindowHandles();
            for (const handle of allHandles) {
                if (handle !== mainWindow) {
                    await this.driver.switchTo().window(handle);
                    await this.driver.close();
                }
            }
            await this.driver.switchTo().window(mainWindow);

            // STEP 3: Wait before clicking Get Links
            await this._sleep(11000);

            // STEP 4: Try clicking until we get correct redirect
            for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
                try {
                    verifyBtn = await this.driver.findElement(By.id("verify_btn"));
                    const text = (await verifyBtn.getText()).trim().toLowerCase();

                    if (text === "get links") {
                        await verifyBtn.click();
                        await this._sleep(3000);

                        const handles = await this.driver.getAllWindowHandles();
                        for (const handle of handles) {
                            if (handle !== mainWindow) {
                                await this.driver.switchTo().window(handle);
                                const url = await this.driver.getCurrentUrl();

                                if (url.includes(this.targetUrlPart)) {
                                    return url;
                                } else {
                                    await this.driver.close();
                                }
                                await this.driver.switchTo().window(mainWindow);
                                break;
                            }
                        }
                    }
                } catch (err) {
                    console.error("Error during click or tab check:", err);
                    break;
                }

                await this._sleep(2000);
            }

            console.error("Failed to get correct redirect after max attempts.");
            return null;

        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async __getHubcloudLinksFromHblinks() {
        try {
            const hblinksUrl = await this.__getHblinks();
            if (!hblinksUrl) return null;

            await this.driver.get(hblinksUrl);
            const entryDiv = await this.driver.wait(until.elementLocated(By.className("entry-content")), 30000);
            const links = await entryDiv.findElements(By.tagName("a"));

            for (const link of links) {
                const href = await link.getAttribute("href");
                if (href.includes("hubcloud")) {
                    await this.driver.get(href);
                    const downloadBtn = await this.driver.wait(until.elementLocated(By.id("download")), 30000);
                    const finalUrl = await downloadBtn.getAttribute("href");
                    return finalUrl;
                }
            }
            return "";
        } catch (err) {
            console.error(err);
            return "";
        }
    }

    async getHubcloudDownloadLinks() {
        try {
            const url = await this.__getHubcloudLinksFromHblinks();
            if (!url) return null;

            await this.driver.get(url);
            await this._sleep(2000);

            const aTags = await this.driver.findElements(By.tagName("a"));
            const links = [];

            for (const a of aTags) {
                const href = await a.getAttribute("href");
                const text = (await a.getText()).trim();

                if (href && text) {
                    if (['pixeldrain.dev', 'storage.googleapis.com', 'pub'].some(j => href.includes(j))) {
                        links.push({text, href});
                    }
                }
            }

            return links;
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    async __getHubdriveLinksFromHblinks() {
        try {
            const hblinksUrl = await this.__getHblinks();
            if (!hblinksUrl) return null;

            await this.driver.get(hblinksUrl);
            const entryDiv = await this.driver.wait(until.elementLocated(By.className("entry-content")), 30000);
            const links = await entryDiv.findElements(By.tagName("a"));

            for (const link of links) {
                const href = await link.getAttribute("href");
                if (href.includes("hubdrive")) {
                    return href;
                }
            }

            return "";
        } catch (err) {
            console.error(err);
            return "";
        }
    }

    async getHubdriveDownloadLinks() {
        try {
            const url = await this.__getHubdriveLinksFromHblinks();
            return url || null;
        } catch (err) {
            console.error(err);
            return "";
        }
    }

    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}