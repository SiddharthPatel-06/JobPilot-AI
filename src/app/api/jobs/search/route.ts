import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { searchJobs } from "../../../../../lib/services/jobService";
import { log } from "../../../../../lib/utils/logger";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { role, location } = body;
    if (!role || !location) {
      return NextResponse.json({ message: "role and location required" }, { status: 400 });
    }

    log("JOB_SEARCH", `Incoming request: role='${role}', location='${location}'`);
    const jobs = await searchJobs(body);
    log("JOB_SEARCH", `Total jobs fetched: ${jobs.length}`);

    return NextResponse.json({ message: "Jobs fetched successfully", jobs }, { status: 200 });
  } catch (err: any) {
    log("JOB_SEARCH", "Server Error: " + (err.message || err), null, "red");
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
