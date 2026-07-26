import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import DailyLog from "@/models/DailyLog";
import Habit from "@/models/Habit";

// Calculate required XP for a given level
function getXPForLevel(level: number) {
  return Math.floor(100 * Math.pow(1.2, level - 1));
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const { logId, habitId, completed } = await req.json();

    const user = await User.findOne({ name: "Thamizh" });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const dailyLog = await DailyLog.findById(logId);
    if (!dailyLog) return NextResponse.json({ error: "Log not found" }, { status: 404 });

    const habitIndex = dailyLog.habits.findIndex((h: any) => h.habit.toString() === habitId);
    if (habitIndex === -1) return NextResponse.json({ error: "Habit not in log" }, { status: 404 });

    const habitInfo = await Habit.findById(habitId);
    if (!habitInfo) return NextResponse.json({ error: "Habit info not found" }, { status: 404 });

    const wasCompleted = dailyLog.habits[habitIndex].completed;
    
    // Only update if state changes
    if (wasCompleted !== completed) {
      dailyLog.habits[habitIndex].completed = completed;
      
      const xpChange = completed ? habitInfo.xp : -habitInfo.xp;
      
      // Update Daily Log
      dailyLog.totalXP += xpChange;
      
      const totalHabits = dailyLog.habits.length;
      const completedHabits = dailyLog.habits.filter((h: any) => h.completed).length;
      dailyLog.score = Math.round((completedHabits / totalHabits) * 100);
      
      await dailyLog.save();
      
      // Update User
      user.xp += xpChange;
      
      // Check level up
      let leveledUp = false;
      let requiredXP = getXPForLevel(user.level);
      
      while (user.xp >= requiredXP) {
        user.xp -= requiredXP;
        user.level += 1;
        leveledUp = true;
        requiredXP = getXPForLevel(user.level);
      }
      
      // Prevent negative XP logic (if un-completing drops below 0)
      while (user.xp < 0 && user.level > 1) {
        user.level -= 1;
        requiredXP = getXPForLevel(user.level);
        user.xp += requiredXP;
      }
      if (user.xp < 0) user.xp = 0;
      
      await user.save();
      
      return NextResponse.json({ success: true, user, dailyLog, leveledUp });
    }

    return NextResponse.json({ success: true, message: "No changes needed" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
