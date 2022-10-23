import puppeteerExtra from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import dotenv from "dotenv";
import cron from "node-cron";
import { exec } from "child_process";

dotenv.config({
  path: "/home/facu/Documents/Dev/automation-scripts/todoist-notifier/.env",
});

cron.schedule("*/30 * * * *", async () => {
  puppeteerExtra.use(stealthPlugin());
  const browser = await puppeteerExtra.launch();
  const page = await browser.newPage();
  await page.goto("https://todoist.com/app/project/2296994175");

  await page.waitForSelector("#element-0");
  await page.type("#element-0", process.env.email, { delay: 30 });
  await page.type("#element-3", process.env.password, { delay: 30 });
  await page.click("[data-gtm-id='start-email-login']");

  await page.waitForSelector("ul.items");
  if ((await page.$("[data-selection-id]")) !== null) {
    exec("notify-send 'Todoist' 'There is a pending task'");
    await browser.close();
  } else {
    await browser.close();
  }
});
