import puppeteerExtra from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import dotenv from "dotenv";
import { exec } from "child_process";

dotenv.config({ path: "~/Documents/Dev/puppeteer/todoist-notifier/.env" });

const checkTasks = async (page, browser) => {
  await page.waitForSelector("ul.items");
  if ((await page.$("[data-selection-id]")) !== null) {
    exec("notify-send 'Todoist' 'There is a pending task'");
    await browser.close();
  } else {
    await browser.close();
  }
};

(async () => {
  puppeteerExtra.use(stealthPlugin());
  const browser = await puppeteerExtra.launch({
    headless: false,
    userDataDir: "./user_data",
  });
  const page = await browser.newPage();
  await page.goto("https://todoist.com/app/project/2296994175");

  await page.waitForNavigation({ waitUntil: "networkidle0" });
  if ((await page.$("#element-0")) !== null) {
    console.log("here");
    await page.type("#element-0", process.env.email, { delay: 30 });
    await page.type("#element-3", process.env.password, { delay: 30 });
    await page.click("[data-gtm-id='start-email-login']");
    // checkTasks(page, browser);
  }
  console.log("not login");
  checkTasks(page, browser);
})();
