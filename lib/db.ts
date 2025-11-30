import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL || "";

if (!MONGODB_URL) {
  throw new Error("Please set MONGODB_URL in your environment");
}

let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = {
  conn: null,
  promise: null,
};

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
