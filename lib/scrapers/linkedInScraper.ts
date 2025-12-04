import puppeteer, { Browser } from "puppeteer";
import { log } from "../utils/logger";

export async function scrapeLinkedInJobs({
  role,
  location,
}: {
  role: string;
  location: string;
}) {
  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    const query = encodeURIComponent(role);
    const city = encodeURIComponent(location);

    const latestParam = "&f_TPR=r86400";
    const url = `https://www.linkedin.com/jobs/search/?keywords=${query}&location=${city}${latestParam}`;

    log("LINKEDIN_SCRAPER", `Opening URL: ${url}`, null, "INFO");

    await page.goto(url, { waitUntil: "networkidle2" });

    await page.waitForSelector(".base-card", { timeout: 15000 });

    // scroll small
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

    // CLICK FIRST JOB AND SCRAPE DESCRIPTION
    async function getDescription(jobUrl: string) {
      try {
        const jobPage = await page.browser().newPage();
        await jobPage.goto(jobUrl, {
          waitUntil: "networkidle2",
          timeout: 15000,
        });

        await jobPage.waitForSelector(".description__text", { timeout: 10000 });

        const desc = await jobPage.evaluate(() => {
          const el = document.querySelector(
            ".description__text"
          ) as HTMLElement | null;
          return el?.innerText || "";
        });

        await jobPage.close();
        return desc;
      } catch {
        return "";
      }
    }

    const jobs = await page.evaluate(() => {
      const results: any[] = [];

      document.querySelectorAll(".base-card").forEach((el) => {
        const e = el as HTMLElement;

        const title =
          (el.querySelector("h2 a") as HTMLElement)?.innerText?.trim() ||
          "No Title";

        const company =
          (
            el.querySelector(".companyName") as HTMLElement
          )?.innerText?.trim() || "Unknown Company";

        const location =
          (
            el.querySelector(".companyLocation") as HTMLElement
          )?.innerText?.trim() || "Not Provided";

        const jobUrl =
          (
            e.querySelector(
              "a.base-card__full-link"
            ) as HTMLAnchorElement | null
          )?.href || "";

        const posted =
          (e.querySelector("time")?.innerText || "").trim() || "unknown";

        results.push({
          title,
          company,
          location,
          jobUrl,
          posted,
          platform: "linkedin",
        });
      });

      return results;
    });

    // Add descriptions so matchScore can work
    for (let j of jobs) {
      j.description = await getDescription(j.jobUrl);
    }

    log("LINKEDIN_SCRAPER", `Jobs fetched: ${jobs.length}`, null, "INFO");

    return jobs;
  } catch (err: any) {
    log("LINKEDIN_SCRAPER", "Error scraping jobs", err, "ERROR");
    return [];
  } finally {
    if (browser) await browser.close();
  }
}
