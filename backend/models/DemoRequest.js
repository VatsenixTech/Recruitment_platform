import mongoose from "mongoose";

const demoRequestSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required."],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    workEmail: {
      type: String,
      required: [true, "Work email is required."],
      trim: true,
      lowercase: true,
      maxlength: 160,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address."],
    },

    phoneNumber: {
      type: String,
      trim: true,
      maxlength: 25,
      default: "",
    },

    companyName: {
      type: String,
      required: [true, "Company name is required."],
      trim: true,
      minlength: 2,
      maxlength: 160,
    },

    companySize: {
      type: String,
      required: [true, "Company size is required."],
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
    },

    source: {
      type: String,
      trim: true,
      default: "recruiter-landing-page",
    },

    status: {
      type: String,
      enum: ["new", "contacted", "scheduled", "completed", "closed"],
      default: "new",
    },

    ipAddress: {
      type: String,
      trim: true,
      default: "",
    },

    userAgent: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

demoRequestSchema.index({ workEmail: 1, createdAt: -1 });

const DemoRequest = mongoose.model("DemoRequest", demoRequestSchema);

export default DemoRequest;