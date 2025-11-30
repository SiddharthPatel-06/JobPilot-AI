import puppeteer, { Browser } from "puppeteer";
import { log } from "../utils/logger";

export async function scrapeLinkedInJobs({ role, location }: { role: string; location: string; }) {
  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    const query = encodeURIComponent(role);
    const city = encodeURIComponent(location);

    // Past 24 hours filter param used in URL (keeps logic same as your final working version)
    const latestParam = "&f_TPR=r86400";
    const url = `https://www.linkedin.com/jobs/search/?keywords=${query}&location=${city}${latestParam}`;

    log("LINKEDIN_SCRAPER", `Opening URL: ${url}`);
    await page.goto(url, { waitUntil: "networkidle2" });

    await page.waitForSelector(".base-card", { timeout: 15000 });

    // limited scroll to avoid old jobs loading
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let count = 0;
        const distance = 400;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          count++;
          if (count > 10) {
            clearInterval(timer);
            resolve();
          }
        }, 200);
      });
    });

    const jobs = await page.evaluate(() => {
      const results: any[] = [];
      document.querySelectorAll(".base-card").forEach((el) => {
        const e = el as HTMLElement;
        const title = (el.querySelector("h2 a") as HTMLElement)?.innerText?.trim() || "No Title";
        const company = (el.querySelector(".companyName") as HTMLElement)?.innerText?.trim() || "Unknown Company";
        const location = (el.querySelector(".companyLocation") as HTMLElement)?.innerText?.trim() || "Not Provided";
        const jobUrl = (e.querySelector("a.base-card__full-link") as HTMLAnchorElement | null)?.href || "";
        const posted = (e.querySelector("time")?.innerText || "").trim() || "unknown";
        results.push({ title, company, location, jobUrl, posted, platform: "linkedin" });
      });
      return results;
    });

    log("LINKEDIN_SCRAPER", `Jobs fetched (raw): ${jobs.length}`, null, "yellow");
    return jobs;
  } catch (err: any) {
    log("LINKEDIN_SCRAPER", "Error scraping jobs " + (err.message || err), null, "red");
    return [];
  } finally {
    if (browser) await browser.close();
  }
}
