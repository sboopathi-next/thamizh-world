"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lock } from "lucide-react";

export default function AchievementsPage() {
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/achievements").then((r) => r.json()).then((d) => {
      if (d.success) setAchievements(d.achievements);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-1">🏆 Achievements</h1>
        <p className="text-muted-foreground">Every badge is proof of your discipline and hard work.</p>
      </header>

      {/* Stats */}
      <div className="glass rounded-2xl p-5 mb-8 flex items-center justify-between border-primary/20">
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">{unlocked.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Unlocked</p>
        </div>
        <div className="h-12 w-px bg-border" />
        <div className="text-center">
          <p className="text-3xl font-bold text-muted-foreground">{locked.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Locked</p>
        </div>
        <div className="h-12 w-px bg-border" />
        <div className="text-center">
          <p className="text-3xl font-bold text-foreground">{achievements.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Total</p>
        </div>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">✨ Unlocked Badges</h2>
          <div className="grid gap-4">
            {unlocked.map((a) => (
              <Card key={a._id} className="glass shadow-sm border-primary/20 bg-primary/5">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="text-4xl">{a.title.split(" ")[0]}</div>
                  <div className="flex-1">
                    <h3 className="font-bold">{a.title.slice(a.title.indexOf(" ") + 1)}</h3>
                    <p className="text-sm text-muted-foreground">{a.description}</p>
                    {a.unlockedDate && (
                      <p className="text-xs text-primary mt-1">Unlocked: {new Date(a.unlockedDate).toLocaleDateString()}</p>
                    )}
                  </div>
                  <Badge className="bg-emerald-500 text-white">✅ Done</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Lock size={18} className="text-muted-foreground" /> Upcoming Achievements</h2>
        <div className="grid gap-4">
          {locked.map((a) => (
            <Card key={a._id} className="glass shadow-sm border-border/50 opacity-75">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="text-4xl grayscale">{a.title.split(" ")[0]}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-muted-foreground">{a.title.slice(a.title.indexOf(" ") + 1)}</h3>
                  <p className="text-sm text-muted-foreground">{a.description}</p>
                </div>
                <Lock size={18} className="text-muted-foreground/50 flex-shrink-0" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {unlocked.length === 0 && (
        <p className="text-center text-muted-foreground italic mt-4">
          Complete your first habit to start unlocking achievements! 🌸
        </p>
      )}
    </div>
  );
}
