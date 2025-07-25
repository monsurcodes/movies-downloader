import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import fs from 'node:fs';
import { updateElectronApp } from 'update-electron-app';

import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import * as cheerio from 'cheerio';
import {HbLinksFromMediatorPage} from "./mediator";

const isPackaged = app.isPackaged;

const CHROMEDRIVER_PATH = isPackaged
  ? path.join(process.resourcesPath, 'chromedriver.exe')
  : path.join(__dirname, '..', '..', 'drivers', 'chromedriver.exe');

const BRAVE_PATH = "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: 'icon.png',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
};

app.whenReady().then(() => {
  updateElectronApp({
    repo: 'monsurcodes/movies-downloader'
  });
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});


// IPC logic

ipcMain.handle("is-brave-installed", () => fs.existsSync(BRAVE_PATH));

ipcMain.handle("get-movies-list", async (event, url) => {
  const options = new chrome.Options();
  options.setChromeBinaryPath(BRAVE_PATH);
  options.addArguments('--headless');

  const service = new chrome.ServiceBuilder(CHROMEDRIVER_PATH);

  let driver;
  try {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .setChromeService(service)
      .build();

    await driver.get(url);
    const html = await driver.getPageSource();

    const $ = cheerio.load(html);
    const mediaItems = [];

    $('ul.recent-movies li.thumb').each((_, element) => {
      const imgUrl = $(element).find('img').attr('src') || '';
      const pageUrl = $(element).find('a').attr('href') || '';
      const caption = $(element).find('figcaption p').text().trim() || '';

      if (imgUrl && pageUrl && caption) {
        mediaItems.push({
          img_url: imgUrl,
          page_url: pageUrl,
          caption: caption
        });
      }
    });
    await driver.quit();
    return mediaItems;
  } catch (err) {
    console.error('Error:', err);
    await driver.quit();
    return []
  }
})

ipcMain.handle("get-packs-list", async (event, url) => {
  const options = new chrome.Options();
  options.setChromeBinaryPath(BRAVE_PATH);
  options.addArguments('--headless');

  const service = new chrome.ServiceBuilder(CHROMEDRIVER_PATH);

  let driver;
  try {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .setChromeService(service)
      .build();

    await driver.get(url);
    const html = await driver.getPageSource();

    const $ = cheerio.load(html);

    const links = [];

    $('h3[data-ved="2ahUKEwi0gOTl-ozlAhWfILcAHVY0DbIQyxMoADAvegQIERAJ"], h4[data-ved="2ahUKEwi0gOTl-ozlAhWfILcAHVY0DbIQyxMoADAvegQIERAJ"]').each((i, elem) => {
      const aTag = $(elem).find('a');
      const href = aTag.attr('href');
      const text = aTag.text().trim();

      if (aTag.length && href && href.includes('taazabull24.com')) {
        links.push({ caption: text, page_url: href});
      }
    });
    await driver.quit();
    return links;
  } catch (err) {
    console.error('Error:', err);
    await driver.quit();
    return []
  }
})

ipcMain.handle("get-download-link", async (event, url) => {
  const options = new chrome.Options();
  options.setChromeBinaryPath(BRAVE_PATH);
  options.addArguments('--headless');

  const service = new chrome.ServiceBuilder(CHROMEDRIVER_PATH);

  let driver;
  try {
    driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .setChromeService(service)
        .build();

    const hbLinks = await new HbLinksFromMediatorPage(driver, url).getHubcloudDownloadLinks();
    await driver.quit()
    return hbLinks;

  } catch (err) {
    console.error('Error:', err);
    await driver.quit()
    return []
  }
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});