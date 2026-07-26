import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import DailyLog from "@/models/DailyLog";
import User from "@/models/User";

export async function GET() {
  await connectToDatabase();
  const user = await User.findOne({ name: "Thamizh" });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  // Last 90 days
  const logs = await DailyLog.find({ user: user._id })
    .sort({ date: -1 })
    .limit(90)
    .select("date score totalXP habits");
  return NextResponse.json({ success: true, logs });
}
