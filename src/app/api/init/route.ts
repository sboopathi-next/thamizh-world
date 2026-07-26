import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import Habit from "@/models/Habit";

const DEFAULT_HABITS = [
  { name: "Wake up 4:30 AM", target: 1, unit: "Daily", xp: 20 },
  { name: "Spoken English (1 hr)", target: 1, unit: "Hour", xp: 40 },
  { name: "Exercise (45 min)", target: 1, unit: "Session", xp: 30 },
  { name: "Exam Study (5 hrs)", target: 5, unit: "Hours", xp: 80 },
  { name: "Read Book (1 page)", target: 1, unit: "Page", xp: 20 },
  { name: "Sleep before 11:30 PM", target: 1, unit: "Daily", xp: 20 },
];

export async function GET() {
  try {
    await connectToDatabase();

    // Find or create the default user "Thamizh"
    let user = await User.findOne({ name: "Thamizh" });

    if (!user) {
      user = await User.create({
        name: "Thamizh",
        email: "thamizh@example.com",
        password: "password123", // Dummy password
        level: 1,
        xp: 0,
        streak: 0,
        bestStreak: 0,
      });

      // Create default habits for the user
      const habitsToInsert = DEFAULT_HABITS.map(h => ({ ...h, user: user._id }));
      await Habit.insertMany(habitsToInsert);
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
