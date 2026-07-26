"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Target, BookOpen, Dumbbell, Moon, Loader2, Flame, Sparkles } from "lucide-react";
import { getXPForLevel, getTodayQuote } from "@/lib/utils-app";

function getIconForHabit(name: string) {
  const n = name.toLowerCase();
  if (n.includes("wake") || n.includes("sleep")) return <Moon size={16} className="text-indigo-400" />;
  if (n.includes("english") || n.includes("read")) return <BookOpen size={16} className="text-blue-400" />;
  if (n.includes("exercise")) return <Dumbbell size={16} className="text-rose-400" />;
  if (n.includes("study")) return <Target size={16} className="text-amber-400" />;
  return <Sparkles size={16} className="text-primary" />;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [dailyLog, setDailyLog] = useState<any>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    async function load() {
      await fetch("/api/init");
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      if (data.success) { setUser(data.user); setDailyLog(data.dailyLog); }
      setLoading(false);
    }
    load();
  }, []);

  const toggleHabit = async (habitId: string, currentStatus: boolean) => {
    if (!dailyLog || !user) return;
    const newStatus = !currentStatus;
    // Optimistic update
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
    if (data.success) {
      setUser(data.user);
      setDailyLog(data.dailyLog);
      if (data.leveledUp) { setShowLevelUp(true); setTimeout(() => setShowLevelUp(false), 4000); }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin text-primary w-12 h-12 mx-auto mb-4" />
        <p className="text-muted-foreground">Loading your world...</p>
      </div>
    </div>
  );

  if (!user) return <div className="p-12">Failed to connect. Check MongoDB.</div>;

  const targetXP = getXPForLevel(user.level);
  const progressPercent = Math.min((user.xp / targetXP) * 100, 100);
  const completedHabits = dailyLog?.habits.filter((h: any) => h.completed).length || 0;
  const totalHabits = dailyLog?.habits.length || 1;

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-5xl mx-auto">
      {/* Level Up Celebration */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: -30 }}
              className="bg-white/90 dark:bg-gray-900/90 p-10 rounded-3xl text-center shadow-2xl glass max-w-sm mx-4"
            >
              <motion.div className="text-6xl mb-4" animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 1 }}>🌸</motion.div>
              <h2 className="text-4xl font-bold text-primary mb-2">LEVEL UP!</h2>
              <p className="text-2xl font-semibold mb-2">Level {user.level} reached!</p>
              <p className="text-muted-foreground">You're unstoppable, Thamizh! 🔥</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="mb-8">
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Good Morning 🌸</h1>
        <p className="text-muted-foreground text-lg mt-1">Ready to conquer the day, <span className="text-primary font-semibold">Thamizh</span>?</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Level", value: user.level, sub: "Scholar", color: "text-primary", bg: "bg-primary/10" },
          { label: "🔥 Streak", value: `${user.streak}d`, sub: `Best: ${user.bestStreak}d`, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/20" },
          { label: "Today's Score", value: `${dailyLog?.score || 0}%`, sub: `${completedHabits}/${totalHabits} done`, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
          { label: "Total XP", value: Math.floor(user.xp), sub: `/${targetXP} this level`, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/20" },
        ].map((stat) => (
          <Card key={stat.label} className={`glass shadow-sm ${stat.bg} border-0`}>
            <CardContent className="p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* XP Progress */}
      <Card className="glass shadow-sm mb-8 border-primary/20">
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-sm">Level {user.level} → {user.level + 1}</span>
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30">{Math.floor(user.xp)} / {targetXP} XP</Badge>
          </div>
          <Progress value={progressPercent} className="h-3 bg-primary/15" />
          <p className="text-xs text-muted-foreground mt-2">{Math.ceil(targetXP - user.xp)} XP needed to level up!</p>
        </CardContent>
      </Card>

      {/* Quote */}
      <div className="glass rounded-2xl p-5 text-center italic text-primary/80 text-base mb-8 border-primary/10">
        ✨ "{getTodayQuote()}"
      </div>

      {/* Today's Mission */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="text-primary" size={22} /> Today's Mission
          </h2>
          <div className="flex gap-2">
            <Badge variant="outline" className="border-primary/30 text-primary">
              {completedHabits}/{totalHabits} done
            </Badge>
          </div>
        </div>
        <div className="grid gap-3">
          {dailyLog?.habits.map((logItem: any) => {
            const habit = logItem.habit;
            const isDone = logItem.completed;
            return (
              <motion.div
                key={habit._id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => toggleHabit(habit._id, isDone)}
                className={`glass p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all border ${
                  isDone ? "border-primary/40 bg-primary/5" : "border-white/30 hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isDone ? "bg-primary border-primary" : "border-muted-foreground/30"}`}>
                    {isDone && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <div className="flex items-center gap-2">
                    {getIconForHabit(habit.name)}
                    <span className={`font-medium text-sm ${isDone ? "line-through text-muted-foreground" : ""}`}>{habit.name}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">+{habit.xp} XP</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
