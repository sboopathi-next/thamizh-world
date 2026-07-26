import mongoose from "mongoose";

const DailyLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    habits: [
      {
        habit: { type: mongoose.Schema.Types.ObjectId, ref: "Habit" },
        progress: { type: Number, default: 0 },
        completed: { type: Boolean, default: false },
      }
    ],
    score: { type: Number, default: 0 }, // Percentage or points
    totalXP: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.DailyLog || mongoose.model("DailyLog", DailyLogSchema);
