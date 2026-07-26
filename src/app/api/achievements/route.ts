import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Achievement from "@/models/Achievement";
import User from "@/models/User";

const DEFAULT_ACHIEVEMENTS = [
  { title: "🌅 Early Bird", description: "Wake up at 4:30 for 30 days", icon: "early-bird" },
  { title: "📚 Reader", description: "Read 100 pages total", icon: "reader" },
  { title: "💪 Strong Girl", description: "Exercise 30 days total", icon: "strong-girl" },
  { title: "🎯 Focus Queen", description: "Study for 100 hours total", icon: "focus-queen" },
  { title: "🔥 Unbreakable", description: "Maintain a 30-day streak", icon: "unbreakable" },
  { title: "👑 Discipline Master", description: "Complete every habit for 7 days straight", icon: "discipline-master" },
  { title: "⭐ First Step", description: "Complete your first habit", icon: "first-step" },
  { title: "🌟 Level 5", description: "Reach Level 5", icon: "level-5" },
];

export async function GET() {
  await connectToDatabase();
  const user = await User.findOne({ name: "Thamizh" });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Seed achievements if not present
  const count = await Achievement.countDocuments({ user: user._id });
  if (count === 0) {
    await Achievement.insertMany(
      DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a, user: user._id, unlocked: false }))
    );
  }

  const achievements = await Achievement.find({ user: user._id });
  return NextResponse.json({ success: true, achievements });
}
