import mongoose, { Schema, Document } from "mongoose";

export interface IUserProfile extends Document {
  name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;

  profilePicUrl?: string;
  resumeUrl?: string;

  skills?: string[];

  experience?: {
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }[];

  education?: {
    school: string;
    degree: string;
    startDate: string;
    endDate?: string;
  }[];

  summary?: string;
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },

    phone: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" },

    profilePicUrl: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },

    skills: { type: [String], default: [] },

    experience: [
      {
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],

    education: [
      {
        school: String,
        degree: String,
        startDate: String,
        endDate: String,
      },
    ],

    summary: { type: String, default: "" },
  },
  { timestamps: true }
);

export const UserProfile =
  mongoose.models.UserProfile ||
  mongoose.model<IUserProfile>("UserProfile", UserProfileSchema);
