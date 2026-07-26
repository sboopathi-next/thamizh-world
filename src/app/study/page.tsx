"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Clock } from "lucide-react";

const SUBJECTS = [
  { name: "Spoken English", target: 60, color: "bg-blue-400", textColor: "text-blue-600" },
  { name: "Exam Study", target: 300, color: "bg-amber-400", textColor: "text-amber-600" },
  { name: "Math", target: 60, color: "bg-purple-400", textColor: "text-purple-600" },
  { name: "General Knowledge", target: 30, color: "bg-emerald-400", textColor: "text-emerald-600" },
];

export default function StudyPage() {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ subject: "Spoken English", duration: "", targetHours: "1" });

  useEffect(() => {
    fetch("/api/study").then((r) => r.json()).then((d) => {
      if (d.success) { setSessions(d.sessions); setTodayMinutes(d.todayMinutes); }
      setLoading(false);
    });
  }, []);

  const logSession = async () => {
    if (!form.duration) return;
    const res = await fetch("/api/study", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      setSessions((prev) => [data.session, ...prev]);
      setTodayMinutes((prev) => prev + Number(form.duration));
      setForm({ subject: "Spoken English", duration: "", targetHours: "1" });
      setShowAdd(false);
    }
  };

  // Compute today's minutes per subject
  const today = new Date().toISOString().split("T")[0];
  const todaySessions = sessions.filter((s) => s.date === today);

  function getSubjectMinutes(name: string) {
    return todaySessions.filter((s) => s.subject === name).reduce((a, s) => a + s.duration, 0);
  }

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
                className="w-full glass border border-primary/20 rounded-xl px-3 py-2.5 text-sm bg-white/50"
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
                className="w-full glass border border-primary/20 rounded-xl px-3 py-2.5 text-sm bg-white/50"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={logSession} className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90">Save Session</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2.5 glass border border-primary/20 rounded-xl text-sm">Cancel</button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Summary */}
      <Card className="glass mb-6 border-primary/20">
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold">Today's Total Study</span>
            <Badge className="bg-primary/20 text-primary">{Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m</Badge>
          </div>
          <Progress value={Math.min((todayMinutes / 300) * 100, 100)} className="h-3 mt-3" />
          <p className="text-xs text-muted-foreground mt-2">Goal: 5 hours (300 min)</p>
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
                  <Badge variant="outline" className={`${subj.textColor} border-current`}>{pct}%</Badge>
                </div>
                <Progress value={pct} className="h-2.5 mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{minutes} min done</span>
                  <span>Target: {subj.target} min</span>
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
                  <span className="text-muted-foreground">{s.date}</span>
                  <Badge variant="secondary">{s.duration} min</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
