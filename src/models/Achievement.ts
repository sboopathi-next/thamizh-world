import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    unlocked: { type: Boolean, default: false },
    unlockedDate: { type: Date },
    icon: { type: String }, // e.g., 'early-bird', 'reader'
  },
  { timestamps: true }
);

export default mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema);
