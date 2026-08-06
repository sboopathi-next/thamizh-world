"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Clock, Target, Edit2, Check } from "lucide-react";

const SUBJECTS = [
  { name: "Spoken English", target: 60, color: "bg-blue-400", textColor: "text-blue-600" },
  { name: "Exam Study", target: 60, color: "bg-amber-400", textColor: "text-amber-600" },
  { name: "Math", target: 60, color: "bg-purple-400", textColor: "text-purple-600" },
  { name: "General Knowledge", target: 30, color: "bg-emerald-400", textColor: "text-emerald-600" },
];

export default function StudyPage() {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: "Spoken English", duration: "" });
  
  // Customizable daily study goal in hours (default 1 hour = 60 min)
  const [targetHours, setTargetHours] = useState<number>(1);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [customTargetInput, setCustomTargetInput] = useState("1");

  useEffect(() => {
    // Load saved custom study goal if any
    const savedGoal = localStorage.getItem("thamizh_study_goal_hours");
    if (savedGoal) {
      const parsed = parseFloat(savedGoal);
      if (!isNaN(parsed) && parsed > 0) {
        setTargetHours(parsed);
        setCustomTargetInput(savedGoal);
      }
    }

    fetch("/api/study").then((r) => r.json()).then((d) => {
      if (d.success) { setSessions(d.sessions); setTodayMinutes(d.todayMinutes); }
      setLoading(false);
    });
  }, []);

  const saveTargetHours = (hours: number) => {
    if (hours <= 0) return;
    setTargetHours(hours);
    localStorage.setItem("thamizh_study_goal_hours", hours.toString());
    setIsEditingTarget(false);
  };

  const logSession = async () => {
    if (isSubmitting || !form.duration || Number(form.duration) <= 0) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, targetHours: targetHours.toString() }),
      });
      const data = await res.json();
      if (data.success) {
        setSessions((prev) => [data.session, ...prev]);
        setTodayMinutes((prev) => prev + Number(form.duration));
        setForm({ subject: "Spoken English", duration: "" });
        setShowAdd(false);
      }
    } catch (err) {
      console.error("Error logging study session:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute today's minutes per subject
  const today = new Date().toISOString().split("T")[0];
  const todaySessions = sessions.filter((s) => s.date === today);

  function getSubjectMinutes(name: string) {
    return todaySessions.filter((s) => s.subject === name).reduce((a, s) => a + s.duration, 0);
  }

  const targetMinutes = targetHours * 60;
  const overallProgressPct = Math.min(Math.round((todayMinutes / targetMinutes) * 100), 100);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-3xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-1">📚 Study Tracker</h1>
          <p className="text-muted-foreground">Track your study sessions and own every subject.</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} /> Log Session
        </button>
      </header>

      {/* Add Session Form */}
      {showAdd && (
        <Card className="glass mb-6 border-primary/30">
          <CardHeader><CardTitle className="text-lg">Log Study Session</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Subject</label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full glass border border-primary/20 rounded-xl px-3 py-2.5 text-sm bg-white/50 dark:bg-gray-800/50"
              >
                {SUBJECTS.map((s) => <option key={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Duration (minutes)</label>
              <input
                type="number"
                placeholder="e.g. 60"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full glass border border-primary/20 rounded-xl px-3 py-2.5 text-sm bg-white/50 dark:bg-gray-800/50 mb-2"
              />
              {/* Quick preset duration buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { label: "15m", val: "15" },
                  { label: "30m", val: "30" },
                  { label: "45m", val: "45" },
                  { label: "1 hr", val: "60" },
                  { label: "1.5 hrs", val: "90" },
                  { label: "2 hrs", val: "120" },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setForm({ ...form, duration: preset.val })}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      form.duration === preset.val
                        ? "bg-primary text-primary-foreground border-primary"
                        : "glass border-primary/20 hover:bg-primary/10 text-foreground"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={logSession}
                disabled={isSubmitting || !form.duration}
                className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save Session"}
              </button>
              <button
                onClick={() => setShowAdd(false)}
                disabled={isSubmitting}
                className="px-4 py-2.5 glass border border-primary/20 rounded-xl text-sm"
              >
                Cancel
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Summary & Target Customization */}
      <Card className="glass mb-6 border-primary/20">
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Today's Total Study</span>
              <button
                onClick={() => setIsEditingTarget(!isEditingTarget)}
                title="Change Study Target"
                className="text-primary hover:text-primary/80 p-1 text-xs flex items-center gap-1 font-medium underline"
              >
                <Edit2 size={13} /> Edit Goal
              </button>
            </div>
            <Badge className="bg-primary/20 text-primary text-sm px-3 py-1 font-bold">
              {Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m
            </Badge>
          </div>

          <Progress value={overallProgressPct} className="h-3.5 mt-3 mb-2" />

          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Progress: {overallProgressPct}%</span>
            <span>Goal Target: <span className="font-semibold text-foreground">{targetHours} hr{targetHours > 1 ? "s" : ""} ({targetMinutes} min)</span></span>
          </div>

          {/* Edit Target Form */}
          {isEditingTarget && (
            <div className="mt-4 p-4 glass rounded-2xl border border-primary/20 bg-primary/5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-primary" />
                <span className="text-xs font-semibold">Set Daily Study Target:</span>
              </div>
              <div className="flex items-center gap-2">
                {[0.5, 1, 1.5, 2, 3].map((hrs) => (
                  <button
                    key={hrs}
                    onClick={() => saveTargetHours(hrs)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      targetHours === hrs
                        ? "bg-primary text-white"
                        : "glass border border-primary/30 hover:bg-primary/10"
                    }`}
                  >
                    {hrs}h
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subject Breakdown */}
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold">Subject Progress Today</h2>
        {SUBJECTS.map((subj) => {
          const minutes = getSubjectMinutes(subj.name);
          const pct = Math.min(Math.round((minutes / subj.target) * 100), 100);
          return (
            <Card key={subj.name} className="glass border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold">{subj.name}</span>
                  <Badge variant="outline" className={`${subj.textColor} border-current font-bold`}>{pct}%</Badge>
                </div>
                <Progress value={pct} className="h-2.5 mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{minutes} min done</span>
                  <span>Target: {subj.target} min (1 hr)</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Clock size={18} className="text-primary" /> Recent Sessions</h2>
          <div className="space-y-2">
            {sessions.slice(0, 8).map((s, i) => (
              <div key={i} className="glass rounded-xl px-4 py-3 flex justify-between items-center text-sm">
                <span className="font-medium">{s.subject}</span>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-xs">{s.date}</span>
                  <Badge variant="secondary" className="font-semibold">{s.duration} min</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

