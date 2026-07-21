import mongoose from "mongoose";

const trialSignupSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    workEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 160,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    passwordHashRequired: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["pending-registration", "registered", "expired"],
      default: "pending-registration",
    },
    trialEndsAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.TrialSignup ||
  mongoose.model("TrialSignup", trialSignupSchema);