import mongoose from "mongoose";

const FitnessLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    workoutMinutes: { type: Number, default: 0 },
    calories: { type: Number, default: 0 },
    waterLiters: { type: Number, default: 0 },
    weight: { type: Number }, // optional
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.FitnessLog ||
  mongoose.model("FitnessLog", FitnessLogSchema);
