import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "sent", "accepted", "declined", "expired"],
      default: "draft",
      index: true,
    },
    sentAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Offer ||
  mongoose.model("Offer", offerSchema);