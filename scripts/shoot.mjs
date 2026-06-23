import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "C:/Users/koish/AppData/Local/Temp/janjurek-shots2";
const [, , url, name, fullPage] = process.argv;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1"],
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

// Scroll through to trigger whileInView reveals, then back to top.
await page.evaluate(async () => {
  await new Promise((resolve) => {
    let y = 0;
    const step = 400;
    const timer = setInterval(() => {
      window.scrollTo(0, y);
      y += step;
      if (y > document.body.scrollHeight) {
        clearInterval(timer);
        setTimeout(resolve, 400);
      }
    }, 120);
  });
});
await new Promise((r) => setTimeout(r, 700));

const selector = process.argv[5];
if (selector) {
  await page.evaluate((sel) => {
    document.querySelector(sel)?.scrollIntoView({ block: "start" });
  }, selector);
  await new Promise((r) => setTimeout(r, 600));
}

await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: fullPage === "full" });
console.log(`${name}: done`);
await browser.close();
