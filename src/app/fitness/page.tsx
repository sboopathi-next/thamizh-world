"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Dumbbell, Droplets, Flame, Weight } from "lucide-react";

export default function FitnessPage() {
  const [loading, setLoading] = useState(true);
  const [log, setLog] = useState<any>(null);
  const [form, setForm] = useState({ workoutMinutes: "", calories: "", waterLiters: "", weight: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/fitness").then((r) => r.json()).then((d) => {
      if (d.success) {
        setLog(d.log);
        setForm({
          workoutMinutes: d.log.workoutMinutes || "",
          calories: d.log.calories || "",
          waterLiters: d.log.waterLiters || "",
          weight: d.log.weight || "",
          notes: d.log.notes || "",
        });
      }
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/fitness", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) { setLog(data.log); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  const workoutPct = Math.min(((Number(form.workoutMinutes) || 0) / 45) * 100, 100);
  const waterPct = Math.min(((Number(form.waterLiters) || 0) / 3) * 100, 100);
  const caloriePct = Math.min(((Number(form.calories) || 0) / 300) * 100, 100);

  const stats = [
    { label: "Workout", icon: <Dumbbell size={24} className="text-rose-400" />, value: form.workoutMinutes, unit: "min", target: 45, pct: workoutPct, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/20" },
    { label: "Calories", icon: <Flame size={24} className="text-orange-400" />, value: form.calories, unit: "kcal", target: 300, pct: caloriePct, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/20" },
    { label: "Water", icon: <Droplets size={24} className="text-blue-400" />, value: form.waterLiters, unit: "L", target: 3, pct: waterPct, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20" },
  ];

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-1">💪 Fitness Tracker</h1>
        <p className="text-muted-foreground">Your body is your most powerful tool. Invest in it daily.</p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label} className={`glass border-0 ${s.bg}`}>
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">{s.icon}</div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value || 0}<span className="text-sm font-normal ml-1">{s.unit}</span></p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <Progress value={s.pct} className="h-1.5 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Input Form */}
      <Card className="glass shadow-sm border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Log Today's Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5 flex items-center gap-1.5"><Dumbbell size={14} className="text-rose-400" /> Workout (minutes)</label>
              <input type="number" placeholder="45" value={form.workoutMinutes} onChange={(e) => setForm({ ...form, workoutMinutes: e.target.value })}
                className="w-full glass border border-primary/20 rounded-xl px-3 py-2.5 text-sm bg-white/50" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5 flex items-center gap-1.5"><Flame size={14} className="text-orange-400" /> Calories Burned</label>
              <input type="number" placeholder="250" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })}
                className="w-full glass border border-primary/20 rounded-xl px-3 py-2.5 text-sm bg-white/50" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5 flex items-center gap-1.5"><Droplets size={14} className="text-blue-400" /> Water (Liters)</label>
              <input type="number" step="0.5" placeholder="2.5" value={form.waterLiters} onChange={(e) => setForm({ ...form, waterLiters: e.target.value })}
                className="w-full glass border border-primary/20 rounded-xl px-3 py-2.5 text-sm bg-white/50" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5 flex items-center gap-1.5"><Weight size={14} className="text-purple-400" /> Weight (kg, optional)</label>
              <input type="number" step="0.1" placeholder="55.0" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="w-full glass border border-primary/20 rounded-xl px-3 py-2.5 text-sm bg-white/50" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Notes</label>
            <textarea placeholder="e.g. 30 min run + 15 min strength" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
              className="w-full glass border border-primary/20 rounded-xl px-3 py-2.5 text-sm bg-white/50 resize-none" />
          </div>
          <button onClick={save} disabled={saving}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
            {saving ? "Saving..." : saved ? "✅ Saved!" : "Save Today's Log"}
          </button>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground mt-8 italic">
        "Take care of your body. It's the only place you have to live." 💪
      </p>
    </div>
  );
}
