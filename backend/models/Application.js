import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
      index: true,
    },
    stage: {
      type: String,
      enum: [
        "applied",
        "screening",
        "shortlisted",
        "interview",
        "offered",
        "hired",
        "rejected",
        "withdrawn"
      ],
      default: "applied",
      index: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

applicationSchema.index(
  {
    jobId: 1,
    candidateId: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);