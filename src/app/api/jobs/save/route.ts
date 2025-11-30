import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { Job } from "../../../../../lib/models/Job";
import { log } from "../../../../../lib/utils/logger";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    log("JOB_SAVE", "Saving Job:", body);
    const saved = await Job.create(body);
    log("JOB_SAVE", `Job Saved: ${(saved as any)._id}`);
    return NextResponse.json({ message: "Job saved", job: saved }, { status: 201 });
  } catch (err: any) {
    log("JOB_SAVE", "Error saving job: " + (err.message || err), null, "red");
    return NextResponse.json({ message: "Error saving job" }, { status: 500 });
  }
}
