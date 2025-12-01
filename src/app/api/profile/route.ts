import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { UserProfile } from "../../../../lib/models/UserProfile";
import { log } from "../../../../lib/utils/logger";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
        log("PROFILE", "Email required", null, "WARN");
        return NextResponse.json({ message: "Email required" }, { status: 400 });
    }

    const profile = await UserProfile.findOne({ email });
    
    log("PROFILE", "Profile fetched successfully", profile, "INFO");
    return NextResponse.json({ profile }, { status: 200 });
  } catch (err) {
    log("PROFILE", "Error fetching profile", err, "ERROR");
    return NextResponse.json({ message: "Error fetching profile" }, { status: 500 });
  }
}