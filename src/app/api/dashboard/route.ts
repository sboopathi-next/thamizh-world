import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import Habit from "@/models/Habit";
import DailyLog from "@/models/DailyLog";

export async function GET() {
  try {
    await connectToDatabase();

    const user = await User.findOne({ name: "Thamizh" });
    if (!user) {
      return NextResponse.json({ error: "User not initialized" }, { status: 404 });
    }

    const habits = await Habit.find({ user: user._id, active: true });
    
    // Get today's date in YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    
    let dailyLog = await DailyLog.findOne({ user: user._id, date: today }).populate("habits.habit");
    
    if (!dailyLog) {
      // Create new daily log
      dailyLog = await DailyLog.create({
        user: user._id,
        date: today,
        habits: habits.map(h => ({ habit: h._id, completed: false, progress: 0 })),
        score: 0,
        totalXP: 0
      });
      // Populate it immediately
      dailyLog = await DailyLog.findById(dailyLog._id).populate("habits.habit");
    }

    return NextResponse.json({ success: true, user, habits, dailyLog });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
