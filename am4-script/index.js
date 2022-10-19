import puppeteerExtra from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

(async () => {
  puppeteerExtra.use(stealthPlugin());
  const browser = await puppeteerExtra.launch({
    headless: false,
    userDataDir: "./user_data",
  });
  const page = await browser.newPage();
  await page.goto("https://www.airlinemanager.com/index.php?intro=1");

  await page.waitForSelector(
    "body > div.am4-bg-frontpage > div > div.row.justify-content-between.py-0.py-lg-0 > div.col-12.col-lg-5.align-self-center.white-bg-opacity-landingpage > div > button.py-3.py-lg-3.btn.btn-lg.btn-primary-gradient.btn-block"
  );
  const loginButton = await page.$(
    "body > div.am4-bg-frontpage > div > div.row.justify-content-between.py-0.py-lg-0 > div.col-12.col-lg-5.align-self-center.white-bg-opacity-landingpage > div > button.py-3.py-lg-3.btn.btn-lg.btn-primary-gradient.btn-block"
  );
  await loginButton.click();

  await page.waitForSelector("#lEmail");
  await page.type("#lEmail", process.env.email, { delay: 30 });
  await page.type("#lPass", process.env.password, { delay: 30 });
  await page.click("#btnLogin");

  await page
    .waitForSelector(
      "#listDepartAll > div > button.btn.w-100.btn-danger.btn-xs > span.glyphicons.glyphicons-plane",
      { visible: true, timeout: 300000 }
    )
    .then(async () => {
      await page.waitForTimeout(2000);
      await page.click(
        "#listDepartAll > div > button.btn.w-100.btn-danger.btn-xs > span.glyphicons.glyphicons-plane"
      );
      await page.waitForTimeout(2000);
      browser.close();
    })
    .catch((err) => console.log(err));
  browser.close();
})();
