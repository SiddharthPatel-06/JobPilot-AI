import { NextResponse } from "next/server";
import { runAutoApplyCron } from "../../../../../lib/cron/autoApply";

export async function GET() {
  const result = await runAutoApplyCron();
  return NextResponse.json(result);
}
