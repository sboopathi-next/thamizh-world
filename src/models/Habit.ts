import mongoose from "mongoose";

const HabitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    target: { type: Number, required: true },
    unit: { type: String, required: true },
    xp: { type: Number, required: true }, // XP awarded per completion
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Habit || mongoose.model("Habit", HabitSchema);
