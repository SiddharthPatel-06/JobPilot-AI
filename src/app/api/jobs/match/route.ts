import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { UserProfile } from "../../../../../lib/models/UserProfile";
import { searchJobs } from "../../../../../lib/services/jobService";
import { mapProfileRoles } from "../../../../../lib/utils/roleMapper";
import { log } from "../../../../../lib/utils/logger";

function calculateMatchScore(job: any, profile: any, roles: string[]) {
  let score = 0;

  if (profile.skills?.length > 0 && job.description) {
    const jobDesc = job.description.toLowerCase();

    profile.skills.forEach((skill: string) => {
      if (jobDesc.includes(skill.toLowerCase())) {
        score += 20;
      }
    });
  }

  if (job.title) {
    const title = job.title.toLowerCase();

    roles.forEach((role) => {
      if (title.includes(role.toLowerCase())) {
        score += 25;
      }
    });
  }

  if (profile.location && job.location) {
    if (job.location.toLowerCase().includes(profile.location.toLowerCase())) {
      score += 15;
    }
  }

  if (profile.experience?.length > 0 && job.experience) {
    const userExp = profile.experience.length;
    const jobExp = job.experience.toLowerCase();

    if (jobExp.includes("fresher") && userExp <= 1) score += 10;
    if (jobExp.includes("1 year") && userExp >= 1) score += 10;
  }

  return score;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    log("JOB_MATCH", "Connected to DB");

    const body = await req.json();
    const { email, role, location } = body;

    if (!email) {
      return NextResponse.json({ message: "email required" }, { status: 400 });
    }
    if (!role || !location) {
      return NextResponse.json(
        { message: "role and location required" },
        { status: 400 }
      );
    }

    const profile = await UserProfile.findOne({ email });
    if (!profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    log("JOB_MATCH", "User profile fetched", profile, "DEBUG");

    const roleList = mapProfileRoles(profile);
    log("JOB_MATCH", "Mapped roles", roleList, "DEBUG");

    const jobs = await searchJobs({ role, location });

    const scoredJobs = jobs.map((job) => ({
      ...job,
      matchScore: calculateMatchScore(job, profile, roleList),
    }));

    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

    log("JOB_MATCH", "Job scoring completed", null, "INFO");

    return NextResponse.json(
      {
        message: "Job matching done",
        total: scoredJobs.length,
        rolesUsed: roleList,
        jobs: scoredJobs,
      },
      { status: 200 }
    );
  } catch (err: any) {
    log("JOB_MATCH", "Error in API", err, "ERROR");
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
