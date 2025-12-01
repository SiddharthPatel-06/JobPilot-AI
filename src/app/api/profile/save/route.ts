import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { UserProfile } from "../../../../../lib/models/UserProfile";
import { log } from "../../../../../lib/utils/logger";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const saved = await UserProfile.findOneAndUpdate(
      { email: body.email },
      { ...body },
      { upsert: true, new: true }
    );

    log("PROFILE", "Profile saved successfully", saved, "INFO");

    return NextResponse.json(
      { message: "Profile saved", profile: saved },
      { status: 200 }
    );

  } catch (err) {
    log("PROFILE", "Error saving profile", err, "ERROR");
    return NextResponse.json(
      { message: "Error saving profile" },
      { status: 500 }
    );
  }
}
