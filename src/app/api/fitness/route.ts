import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import FitnessLog from "@/models/FitnessLog";
import User from "@/models/User";
import { getTodayString } from "@/lib/utils-app";

export async function GET() {
  await connectToDatabase();
  const user = await User.findOne({ name: "Thamizh" });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const today = getTodayString();
  let log = await FitnessLog.findOne({ user: user._id, date: today });
  if (!log) {
    log = await FitnessLog.create({ user: user._id, date: today });
  }
  const history = await FitnessLog.find({ user: user._id }).sort({ date: -1 }).limit(30);
  return NextResponse.json({ success: true, log, history });
}

export async function PUT(req: Request) {
  await connectToDatabase();
  const { workoutMinutes, calories, waterLiters, weight, notes } = await req.json();
  const user = await User.findOne({ name: "Thamizh" });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const today = getTodayString();
  const log = await FitnessLog.findOneAndUpdate(
    { user: user._id, date: today },
    { workoutMinutes, calories, waterLiters, weight, notes },
    { new: true, upsert: true }
  );
  return NextResponse.json({ success: true, log });
}
