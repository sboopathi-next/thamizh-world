"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Flame, CheckCircle2, Target, BookOpen, Dumbbell, Moon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function getXPForLevel(level: number) {
  return Math.floor(100 * Math.pow(1.2, level - 1));
}

function getIconForHabit(name: string) {
  if (name.toLowerCase().includes("wake") || name.toLowerCase().includes("sleep")) return <Moon size={18} className="text-indigo-400"/>;
  if (name.toLowerCase().includes("english") || name.toLowerCase().includes("read")) return <BookOpen size={18} className="text-blue-400"/>;
  if (name.toLowerCase().includes("exercise")) return <Dumbbell size={18} className="text-rose-400"/>;
  if (name.toLowerCase().includes("study")) return <Target size={18} className="text-amber-400"/>;
  return <CheckCircle2 size={18} className="text-primary"/>;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [dailyLog, setDailyLog] = useState<any>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // Init DB if needed
        await fetch("/api/init");
        // Fetch dashboard data
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setDailyLog(data.dailyLog);
        }
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleHabit = async (habitId: string, currentStatus: boolean) => {
    if (!dailyLog || !user) return;
    
    // Optimistic UI update
    const newStatus = !currentStatus;
    const updatedHabits = dailyLog.habits.map((h: any) => 
      h.habit._id === habitId ? { ...h, completed: newStatus } : h
    );
    
    setDailyLog({ ...dailyLog, habits: updatedHabits });

    try {
      const res = await fetch("/api/habits/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logId: dailyLog._id,
          habitId: habitId,
          completed: newStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setDailyLog(data.dailyLog);
        if (data.leveledUp) {
          setShowLevelUp(true);
          setTimeout(() => setShowLevelUp(false), 4000);
        }
      }
    } catch (e) {
      console.error(e);
      // Revert on error (could be implemented for robustness)
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-primary w-12 h-12" />
    </div>;
  }

  if (!user) return <div className="p-12">Failed to load user. Check MongoDB connection.</div>;

  const targetXP = getXPForLevel(user.level);
  const progressPercent = Math.min((user.xp / targetXP) * 100, 100);

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      
      {/* Level Up Celebration Modal */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <div className="bg-white/90 p-10 rounded-3xl text-center shadow-2xl glass">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                <span className="text-6xl">🌸</span>
              </motion.div>
              <h2 className="text-4xl font-bold text-primary mt-4 mb-2">LEVEL UP!</h2>
              <p className="text-2xl font-semibold text-foreground">You reached Level {user.level}</p>
              <p className="text-muted-foreground mt-2">Keep going, Thamizh!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside className="w-64 glass hidden md:flex flex-col border-r p-6 shrink-0 z-10 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10">
          <div className="text-3xl">🌸</div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Thamizh World
          </h1>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          {["Dashboard", "Calendar", "Study", "Fitness", "Habits", "Achievements"].map((item) => (
            <button key={item} className={`text-left px-4 py-3 rounded-xl transition-colors ${item === "Dashboard" ? "bg-primary/20 text-primary font-semibold" : "hover:bg-primary/10 text-foreground/80 hover:text-foreground"}`}>
              {item}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <Card className="glass border-primary/20 bg-primary/5">
            <CardContent className="p-4 text-center">
              <Avatar className="w-16 h-16 mx-auto mb-2 border-2 border-primary/50">
                <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=Thamizh&backgroundColor=ffb6c1" />
                <AvatarFallback>TH</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-foreground">{user.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">Level {user.level} Scholar</p>
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-5xl mx-auto z-10">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Good Morning 🌸</h2>
            <p className="text-muted-foreground text-lg">Ready to conquer the day, {user.name}?</p>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-muted-foreground mb-1">Today's Date</p>
            <p className="font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </header>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="glass shadow-sm md:col-span-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target size={100} />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex justify-between items-center relative z-10">
                <span>Level {user.level}</span>
                <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30">
                  {Math.floor(user.xp)} / {targetXP} XP
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <Progress value={progressPercent} className="h-4 mb-2 bg-primary/20 transition-all duration-1000" />
              <p className="text-xs text-muted-foreground">
                {Math.floor(targetXP - user.xp)} XP away from Level {user.level + 1}! Keep going!
              </p>
            </CardContent>
          </Card>

          <Card className="glass shadow-sm flex flex-col justify-center items-center text-center p-6 bg-gradient-to-br from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20 border-orange-200 dark:border-orange-900/50">
            <Flame className="text-orange-500 mb-2" size={40} />
            <h3 className="text-3xl font-bold text-orange-600 dark:text-orange-400">{user.streak} Days</h3>
            <p className="text-sm font-medium text-orange-600/80 dark:text-orange-400/80 uppercase tracking-wider">Day Streak</p>
          </Card>
        </div>

        {/* Motivational Quote */}
        <div className="glass rounded-2xl p-6 text-center italic text-lg text-primary/80 mb-10 shadow-sm">
          "Discipline is stronger than motivation."
        </div>

        {/* Today's Mission & Trackers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Today's Mission */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="text-primary" /> Today's Mission
              </h3>
              <Badge variant="outline" className="text-primary border-primary bg-primary/5">
                Score: {dailyLog?.score || 0}%
              </Badge>
            </div>
            
            <div className="space-y-3">
              {dailyLog?.habits.map((logItem: any, i: number) => {
                const habit = logItem.habit;
                const isDone = logItem.completed;
                return (
                  <div 
                    key={habit._id} 
                    onClick={() => toggleHabit(habit._id, isDone)}
                    className={`glass p-4 rounded-xl flex items-center justify-between transition-all cursor-pointer hover:scale-[1.02] ${isDone ? 'opacity-70 border-primary/40' : 'border-primary/30 hover:shadow-md'}`}
                  >
                    <div className="flex items-center gap-4">
                      <button className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isDone ? 'bg-primary border-primary' : 'border-muted-foreground/30'}`}>
                        {isDone && <CheckCircle2 size={14} className="text-white" />}
                      </button>
                      <div className="flex items-center gap-2">
                        {getIconForHabit(habit.name)}
                        <span className={`font-medium ${isDone ? 'line-through text-muted-foreground' : ''}`}>{habit.name}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">+{habit.xp} XP</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats / Modules Placeholder */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <CalendarDays className="text-secondary" /> Activity
            </h3>
            
            <Card className="glass shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Study Progress (Exam)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm mb-2">
                  <span>3.5 Hours Completed</span>
                  <span className="font-semibold">70%</span>
                </div>
                <Progress value={70} className="h-3 bg-secondary/30 [&>div]:bg-secondary" />
                <p className="text-xs text-muted-foreground mt-2 text-right">Target: 5 Hours</p>
              </CardContent>
            </Card>

            <Card className="glass shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Book Tracker (Spoken English)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm mb-2">
                  <span>Page 45</span>
                  <span className="font-semibold text-primary">12%</span>
                </div>
                <Progress value={12} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2 text-right">350 Pages Total</p>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
