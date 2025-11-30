import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { Job } from "../../../../../lib/models/Job";
import { log } from "../../../../../lib/utils/logger";

export async function GET() {
  try {
    await connectDB();
    const jobs = await Job.find().sort({ createdAt: -1 }).lean();
    log("JOB_LIST", `Saved Jobs: ${jobs.length}`, null, "green");
    return NextResponse.json(jobs);
  } catch (err: any) {
    log("JOB_LIST", "Error fetching saved jobs: " + (err.message || err), null, "red");
    return NextResponse.json({ message: "Error fetching saved jobs" }, { status: 500 });
  }
}
