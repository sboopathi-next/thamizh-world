import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import StudySession from "@/models/StudySession";
import User from "@/models/User";
import { getTodayString } from "@/lib/utils-app";

export async function GET() {
  await connectToDatabase();
  const user = await User.findOne({ name: "Thamizh" });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const today = getTodayString();
  // Last 30 days sessions
  const sessions = await StudySession.find({ user: user._id }).sort({ date: -1 }).limit(60);
  const todaySessions = sessions.filter((s) => s.date === today);
  const todayMinutes = todaySessions.reduce((a, s) => a + s.duration, 0);
  return NextResponse.json({ success: true, sessions, todayMinutes });
}

export async function POST(req: Request) {
  await connectToDatabase();
  const { subject, duration, targetHours } = await req.json();
  const user = await User.findOne({ name: "Thamizh" });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const today = getTodayString();
  const session = await StudySession.create({
    user: user._id,
    subject,
    duration: Number(duration),
    targetHours: Number(targetHours),
    date: today,
  });
  return NextResponse.json({ success: true, session });
}
