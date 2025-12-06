import { UserProfile } from "../models/UserProfile";
import { Job } from "../models/Job";
import { searchJobs } from "../services/jobService";
import { sendMatchedJobsEmail } from "../services/emailService";
import { mapProfileRoles } from "../utils/roleMapper";
import { connectDB } from "../db";

export async function runAutoApplyCron() {
  await connectDB();

  const users = await UserProfile.find();

  for (const user of users) {
    const roles = mapProfileRoles(user);

    const jobs = await searchJobs({
      role: roles[0],
      location: user.location || "remote",
    });

    const matched: any[] = [];

    for (const job of jobs) {
      if (!job.description) continue;
      if (!user.skills || user.skills.length === 0) continue;

      const jobDesc = job.description?.toLowerCase();

      const hasSkillMatch =
        user.skills.some((skill: string) => {
          if (!skill) return false;
          return jobDesc.includes(skill.toLowerCase());
        }) || false;

      if (hasSkillMatch) {
        matched.push(job);

        await Job.updateOne(
          { jobUrl: job.jobUrl },
          { ...job, isSaved: true },
          { upsert: true }
        );
      }
    }

    if (matched.length > 0) {
      await sendMatchedJobsEmail(user.email, matched);
    }
  }

  return { message: "Auto Apply Cron Completed" };
}
