import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "../../../../../lib/utils/cloudinary";
import { log } from "../../../../../lib/utils/logger";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string;

    if (!file) {
    log("UPLOAD", "No file uploaded", null, "WARN");
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result: any = await uploadToCloudinary(buffer, folder);

    log("UPLOAD", "File uploaded successfully", result.secure_url, "INFO");

    return NextResponse.json(
      {
        message: "Uploaded",
        url: result.secure_url,
      },
      { status: 200 }
    );
  } catch (err: any) {
    log("UPLOAD", "File upload failed", err, "ERROR");
    return NextResponse.json(
      { message: "Upload failed" },
      { status: 500 }
    );
  }
}
