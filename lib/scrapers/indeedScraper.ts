import puppeteer, { Browser } from "puppeteer";

export async function scrapeIndeedJobs({ role, location }: { role: string; location: string; }) {
  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
    );

    const query = role.split(" ").join("+");
    const city = location.split(" ").join("+");

    const url = `https://in.indeed.com/jobs?q=${query}&l=${city}`;

    await page.goto(url, { waitUntil: "networkidle2" });

    // scroll to load jobs
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 300;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= document.body.scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 300);
      });
    });

    // Wait for job cards
    await page.waitForSelector(".job_seen_beacon", { timeout: 15000 });

    const jobs = await page.evaluate(() => {
      const results: any[] = [];
      document.querySelectorAll(".job_seen_beacon").forEach((card) => {
        const el = card as HTMLElement;
        const title = (el.querySelector("h2 a") as HTMLElement)?.innerText?.trim() || "No Title";
        const company = (el.querySelector(".companyName") as HTMLElement)?.innerText?.trim() || "Unknown Company";
        const location = (el.querySelector(".companyLocation") as HTMLElement)?.innerText?.trim() || "Not Provided";
        const salary = (el.querySelector(".salary-snippet") as HTMLElement)?.innerText?.trim() || "Not Mentioned";
        const href = (el.querySelector("h2 a") as HTMLAnchorElement | null)?.getAttribute("href") || "";
        const jobUrl = href ? "https://in.indeed.com" + href : "";

        results.push({ title, company, location, salary, jobUrl, platform: "indeed" });
      });
      return results;
    });

    return jobs;
  } catch (err: any) {
    console.log("❌ Scraper Error:", err.message || err);
    return [];
  } finally {
    if (browser) await browser.close();
  }
}
