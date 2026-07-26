"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Loader2, Settings } from "lucide-react";

export default function HabitsPage() {
  const [loading, setLoading] = useState(true);
  const [dailyLog, setDailyLog] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => { if (d.success) { setDailyLog(d.dailyLog); setUser(d.user); } setLoading(false); });
  }, []);

  const toggleHabit = async (habitId: string, isDone: boolean) => {
    const newStatus = !isDone;
    setDailyLog((prev: any) => ({
      ...prev,
      habits: prev.habits.map((h: any) =>
        h.habit._id === habitId ? { ...h, completed: newStatus } : h
      ),
    }));
    const res = await fetch("/api/habits/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logId: dailyLog._id, habitId, completed: newStatus }),
    });
    const data = await res.json();
    if (data.success) { setUser(data.user); setDailyLog(data.dailyLog); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  const completed = dailyLog?.habits.filter((h: any) => h.completed).length || 0;
  const total = dailyLog?.habits.length || 1;
  const scorePercent = Math.round((completed / total) * 100);

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-1">🌸 Habit Tracker</h1>
        <p className="text-muted-foreground">Your daily disciplines that build your future.</p>
      </header>

      {/* Progress Overview */}
      <Card className="glass mb-8 border-primary/20">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-lg">Today's Progress</h2>
            <Badge className="bg-primary/20 text-primary text-base px-3 py-1">{scorePercent}%</Badge>
          </div>
          <Progress value={scorePercent} className="h-4 mb-2" />
          <p className="text-sm text-muted-foreground">{completed} of {total} habits completed today</p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Completed", value: completed, color: "text-emerald-500" },
          { label: "Remaining", value: total - completed, color: "text-amber-500" },
          { label: "Total XP Today", value: `${dailyLog?.totalXP || 0}`, color: "text-primary" },
        ].map((s) => (
          <Card key={s.label} className="glass border-0 text-center">
            <CardContent className="p-4">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Habit List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="text-primary" size={20} /> Today's Habits
        </h2>
        {dailyLog?.habits.map((logItem: any) => {
          const habit = logItem.habit;
          const isDone = logItem.completed;
          return (
            <div
              key={habit._id}
              onClick={() => toggleHabit(habit._id, isDone)}
              className={`glass p-5 rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] border ${
                isDone ? "border-primary/40 bg-primary/5" : "border-white/30 hover:border-primary/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isDone ? "bg-primary border-primary" : "border-muted-foreground/30"}`}>
                  {isDone ? <CheckCircle2 size={16} className="text-white" /> : <Circle size={16} className="text-muted-foreground/30" />}
                </div>
                <div>
                  <p className={`font-semibold ${isDone ? "line-through text-muted-foreground" : ""}`}>{habit.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Target: {habit.target} {habit.unit}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full block">+{habit.xp} XP</span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8 italic">
        "Small disciplines repeated with consistency every day lead to great achievements gained slowly over time." 🌸
      </p>
    </div>
  );
}
