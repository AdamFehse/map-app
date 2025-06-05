import puppeteer from "puppeteer";
import fs from "fs";

// Daniel Martinez
// Robin Reineke
// Alejandro Macias
// Wanda Alarcon
// Colin Deeds
// Sama Alshaibi
// Linda Choi
// Linfei Yi
const searchName = "Linfei Yi";
const searchUrl = `https://confluencenter.arizona.edu/search/node?keys=${encodeURIComponent(
  searchName
)}`;
const searhNameTok = searchName.toLowerCase().split(" ");

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

  // Parse search results
  // 1. Get the search results
  const results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".list-group-item")).map(
      (item) => {
        const titleEl = item.querySelector("h3 a");
        const descEl = item.querySelector("p");
        return {
          title: titleEl?.innerText.trim() || "",
          url: titleEl?.href || "",
          description: descEl?.innerText.trim() || "",
        };
      }
    );
  });

  let result = results.find(
    (r) =>
      /\/(person|people)\//i.test(r.url) &&
      searhNameTok.every((part) => r.url.toLowerCase().includes(part))
  );

  // 3. If not, crawl each result page looking for /person/ or /people/
  if (!result) {
    console.log(
      "🔁 No direct person link — checking each result for nested links..."
    );
    for (const r of results) {
      try {
        console.log(`🔎 Visiting: ${r.url}`);
        await page.goto(r.url, { waitUntil: "domcontentloaded" });

        // Wait for any links to load
        await page.waitForSelector("a[href]", { timeout: 5000 });

        const profileLink = await page.$$eval(
          "a[href]",
          (links, nameParts) => {
            function fuzzyNameMatch(href, nameParts) {
              const url = href.toLowerCase();
              const first = nameParts[0];
              const last = nameParts[1];

              return (
                url.includes(first) &&
                (url.includes(last) || // full last name
                  url.includes(last?.slice(0, 4)) || // partial last name
                  url.includes(`${first}-${last?.charAt(0)}`)) // e.g. wanda-a
              );
            }

            return links
              .map((a) => a.href)
              .find(
                (href) =>
                  /\/(person|people|people\/[^\/]+|[^\/]*faculty[^\/]*)/i.test(
                    href
                  ) && fuzzyNameMatch(href, nameParts)
              );
          },
          searhNameTok
        );

        if (profileLink) {
          console.log(`➡️ Found profile link: ${profileLink}`);
          result = { url: profileLink };
          break;
        }
      } catch (e) {
        console.warn(`⚠️ Failed to check ${r.url}`);
      }
    }
  }

  if (!result) {
    console.log("❌ No person profile link found.");
    await browser.close();
    return;
  }

  console.log(`✅ Final person page: ${result.url}`);
  await page.goto(result.url, { waitUntil: "networkidle2" });

  // 🧠 Extract title
  let titleText = "";
  try {
    await page.waitForSelector(".field--name-field-az-titles .field__item", {
      timeout: 10000,
    });
    titleText = await page.$eval(
      ".field--name-field-az-titles .field__item",
      (el) => el.innerText.trim()
    );
    console.log(`🎓 Title Found: ${titleText}`);
  } catch {
    console.warn("⚠️ No title found.");
  }

  // 📄 Extract bio
  let bioText = "";
  try {
    await page.waitForSelector(".field--name-field-az-body.field__item", {
      timeout: 10000,
    });
    bioText = await page.$$eval(
      ".field--name-field-az-body.field__item p",
      (paragraphs) => paragraphs.map((p) => p.innerText.trim()).join("\n\n")
    );
    console.log(`📄 Bio Found:\n${bioText.substring(0, 200)}...`);
  } catch {
    console.warn("⚠️ No bio found.");
  }

  // 🖼️ Extract profile image URL
  let imageUrl = "";
  try {
    await page.waitForSelector("img.image-style-az-medium", { timeout: 5000 });
    imageUrl = await page.$eval("img.image-style-az-medium", (img) =>
      img.src.startsWith("http")
        ? img.src
        : `https://confluencenter.arizona.edu${img.getAttribute("src")}`
    );
    console.log(`🖼️ Image Found: ${imageUrl}`);
  } catch {
    console.warn("⚠️ No profile image found.");
  }

  // ✅ Save to file
  const output = {
    name: searchName,
    title: titleText,
    bio: bioText,
    image: imageUrl,
    source: page.url(),
  };

  fs.writeFileSync("bio-profiles.json", JSON.stringify(output, null, 2));
  console.log("✅ Data saved to bio-profiles.json");

  await browser.close();
}

run();
