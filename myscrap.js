import puppeteer from "puppeteer";
import fs from "fs";

// Change this to any name you're searching for
const searchName = "Daniel Martinez"; // e.g., "Robin Reineke", "Alejandro Macias"
const slug = searchName.toLowerCase().replace(/\s+/g, "-");
const searchUrl = `https://confluencenter.arizona.edu/search/node?keys=${encodeURIComponent(searchName)}`;

async function run() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  console.log(`🔍 Navigating to: ${searchUrl}`);
  await page.goto(searchUrl, { waitUntil: "networkidle2" });

  try {
    console.log("⏳ Waiting for results...");
    await page.waitForSelector(".list-group-item", { timeout: 10000 });
  } catch {
    console.error("❌ Search results did not appear.");
    await browser.close();
    return;
  }

  const results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".list-group-item")).map((item) => {
      const titleEl = item.querySelector("h3 a");
      const descEl = item.querySelector("p");
      return {
        title: titleEl?.innerText.trim() || "",
        url: titleEl?.href || "",
        description: descEl?.innerText.trim() || "",
      };
    });
  });

  // Step 1: Try to find direct /person/ link
  let result = results.find((r) => r.url.includes("/person/"));

  // Step 2: Try to find a faculty fellows page
  if (!result) {
    const fellowsRegex = /faculty-fellows-20(2[1-3])/;
    result = results.find((r) => fellowsRegex.test(r.url));
  }

  // Step 3: Crawl each linked result to try to find a person profile
  if (!result) {
    console.log("🔁 No direct match — checking linked pages for nested /person/ links...");
    result = await tryCrawlingLinkedPages(page, results, slug);
  }

  if (!result) {
    console.error("❌ Could not find any valid profile link.");
    await browser.close();
    return;
  }

  console.log(`➡️ Navigating to profile page: ${result.url}`);
  await page.goto(result.url, { waitUntil: "networkidle2" });

  // TODO: Scrape bio info as you already had before...
  // You can drop in your titleText and bioText extraction code here

  await browser.close();
}

// Fallback: crawl each result's page to find a nested /person/ link
async function tryCrawlingLinkedPages(page, results, slug) {
  for (const r of results) {
    try {
      console.log(`🔎 Visiting: ${r.url}`);
      await page.goto(r.url, { waitUntil: "networkidle2" });

      // Wait for any /person/ links
      await page.waitForSelector('a[href*="/person/"]', { timeout: 5000 });

      const nestedLink = await page.$$eval(
        'a[href*="/person/"]',
        (links, slug) => {
          const match = links.find((link) =>
            link.href.toLowerCase().includes("/person/") &&
            link.href.toLowerCase().includes(slug)
          );
          return match?.href || null;
        },
        slug
      );

      if (nestedLink) {
        console.log(`✅ Found nested person link: ${nestedLink}`);
        return { title: "", url: nestedLink, description: "" };
      }
    } catch (e) {
      console.warn(`⚠️ No nested /person/ link found on ${r.url}`);
    }
  }
  return null;
}

run();
