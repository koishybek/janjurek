import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "C:/Users/koish/AppData/Local/Temp/janjurek-shots2";
const BASE = "http://localhost:3000";
const log = (...a) => console.log(...a);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--hide-scrollbars"],
  defaultViewport: { width: 1440, height: 900 },
});

async function clickByText(page, sel, text) {
  const h = await page.evaluateHandle(
    (s, t) => [...document.querySelectorAll(s)].find((e) => e.textContent.trim().includes(t)),
    sel,
    text
  );
  const el = h.asElement();
  if (el) {
    await el.click();
    return true;
  }
  return false;
}

/* ───────── TEST 1: YouTube embeds on memory page ───────── */
{
  const page = await browser.newPage();
  await page.goto(`${BASE}/memory/akan-nurgali-akhmetpekuly`, { waitUntil: "networkidle0" });
  await clickByText(page, "button", "Медиа");
  await new Promise((r) => setTimeout(r, 900));
  const iframes = await page.$$eval("iframe", (els) => els.map((e) => e.src));
  log("\n[1] YOUTUBE EMBEDS");
  log("   iframes found:", iframes.length);
  iframes.forEach((s) => log("   -", s));
  log("   verdict:", iframes.length >= 1 && iframes.every((s) => s.includes("youtube")) ? "PASS" : "FAIL");
  await page.screenshot({ path: `${OUT}/qa_video.png` });
  await page.close();
}

/* ───────── TEST 2: Leave a note (tribute) ───────── */
{
  const page = await browser.newPage();
  await page.goto(`${BASE}/memory/akan-nurgali-akhmetpekuly`, { waitUntil: "networkidle0" });
  const before = await page.$$eval("article", (els) => els.length);
  await clickByText(page, "button", "Оставить заметку");
  await new Promise((r) => setTimeout(r, 700));
  await page.type('input[placeholder*="Айгерим"]', "QA Тест");
  await page.type('input[placeholder*="дочь"]', "тестировщик");
  await page.type('textarea[placeholder*="тёплую"]', "Проверочная заметка от QA-бота.");
  await clickByText(page, "button", "Отправить");
  await new Promise((r) => setTimeout(r, 1200));
  const after = await page.$$eval("article", (els) => els.length);
  const notice = await page.$eval("body", (b) => b.textContent.includes("на модерац") || b.textContent.includes("модерацию"));
  const pendingBadge = await page.evaluate(() => document.body.textContent.includes("на модерации"));
  log("\n[2] LEAVE A NOTE");
  log("   notes before:", before, "after:", after);
  log("   moderation notice shown:", notice);
  log("   'на модерации' badge:", pendingBadge);
  log("   verdict:", after > before && pendingBadge ? "PASS (optimistic)" : "CHECK");
  await page.screenshot({ path: `${OUT}/qa_note.png` });
  await page.close();
}

/* ───────── TEST 3: Заявка → WhatsApp link ───────── */
{
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    window.__opened = [];
    const orig = window.open;
    window.open = (u) => {
      window.__opened.push(u);
      return null;
    };
    void orig;
  });
  await page.goto(`${BASE}/create`, { waitUntil: "networkidle0" });
  await page.type('input[placeholder*="Айгерим"]', "Ануар QA");
  await page.type('input[placeholder*="+7"]', "+7 777 629 16 38");
  await page.type('input[placeholder*="Сейітов"]', "Тестов Тест Тестович");
  await page.type('input[placeholder*="1948"]', "1940 — 2010");
  await page.type('input[placeholder*="youtu"]', "https://youtu.be/ScMzIvxBSi4");
  await page.click('input[type="checkbox"]');
  await clickByText(page, "button", "Отправить заявку");
  await new Promise((r) => setTimeout(r, 1200));
  const opened = await page.evaluate(() => window.__opened || []);
  log("\n[3] ЗАЯВКА → WHATSAPP");
  log("   window.open calls:", opened.length);
  if (opened[0]) {
    const url = opened[0];
    log("   number correct (77776291638):", url.includes("wa.me/77776291638"));
    const text = decodeURIComponent((url.split("text=")[1] || ""));
    log("   message preview:\n   " + text.replace(/\n/g, "\n   "));
  }
  const successShown = await page.evaluate(() => document.body.textContent.includes("Заявка отправлена"));
  log("   success screen:", successShown);
  log("   verdict:", opened[0]?.includes("wa.me/77776291638") && successShown ? "PASS" : "FAIL");
  await page.screenshot({ path: `${OUT}/qa_lead.png` });
  await page.close();
}

/* ───────── TEST 4: Unknown slug → not-found handling ───────── */
{
  const page = await browser.newPage();
  await page.goto(`${BASE}/memory/does-not-exist-xyz`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 800));
  const notFound = await page.evaluate(() => document.body.textContent.includes("не найдена"));
  log("\n[4] UNKNOWN PROFILE");
  log("   shows 'не найдена':", notFound, "->", notFound ? "PASS" : "CHECK");
  await page.close();
}

await browser.close();
log("\nQA RUN COMPLETE");
