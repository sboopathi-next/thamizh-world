import mongoose from "mongoose";

const StudySessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    targetHours: { type: Number, default: 1 },
    duration: { type: Number, default: 0 }, // in minutes
    date: { type: String, required: true }, // YYYY-MM-DD
  },
  { timestamps: true }
);

export default mongoose.models.StudySession ||
  mongoose.model("StudySession", StudySessionSchema);
