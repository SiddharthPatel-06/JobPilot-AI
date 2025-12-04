import { scrapeIndeedJobs } from "../scrapers/indeedScraper";
import { scrapeLinkedInJobs } from "../scrapers/linkedInScraper";

export type SearchInput = {
  role: string;
  location: string;
  platform?: "indeed" | "linkedin" | "all";
  experience?: string;
  jobType?: string;
  skills?: string[];
  latest?: "24h" | "week" | "all";
};

export async function searchJobs(input: SearchInput) {
  const {
    role,
    location,
    platform = "all",
    experience,
    jobType,
    skills,
  } = input;
  let jobs: any[] = [];

  if (platform === "indeed" || platform === "all") {
    const indeedJobs = await scrapeIndeedJobs({ role, location });
    jobs = jobs.concat(indeedJobs);
  }

  if (platform === "linkedin" || platform === "all") {
    const linkedJobs = await scrapeLinkedInJobs({ role, location });
    jobs = jobs.concat(linkedJobs);
  }

  // filters (kept same behavior)
  if (experience) {
    jobs = jobs.filter((j) =>
      j.experience?.toLowerCase().includes(experience.toLowerCase())
    );
  }

  if (jobType) {
    jobs = jobs.filter(
      (j) => j.jobType?.toLowerCase() === jobType.toLowerCase()
    );
  }

  if (skills && skills.length > 0) {
    jobs = jobs.filter((j) =>
      skills.some((skill) =>
        j.description?.toLowerCase().includes(skill.toLowerCase())
      )
    );
  }

  return jobs;
}
