import mongoose, { Document, Model } from "mongoose";
import { JobPayload } from "../../types/job";

export interface JobDocument extends JobPayload, Document {}

const JobSchema = new mongoose.Schema<JobDocument>(
  {
    title: String,
    company: String,
    location: String,
    salary: String,
    description: String,
    jobUrl: String,
    platform: String,
    experience: String,
    skills: [String],
    jobType: String,
    isSaved: { type: Boolean, default: false },
    isApplied: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Job: Model<JobDocument> = (mongoose.models.Job as Model<JobDocument>) || mongoose.model<JobDocument>("Job", JobSchema);
