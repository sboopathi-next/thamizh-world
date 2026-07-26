"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

function getColor(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-400";
  if (score > 0) return "bg-rose-400";
  return "bg-muted";
}

function getLabel(score: number) {
  if (score >= 80) return "🟩 Completed";
  if (score >= 50) return "🟨 Partial";
  if (score > 0) return "🟥 Missed";
  return "No Data";
}

export default function CalendarPage() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/calendar").then((r) => r.json()).then((d) => {
      if (d.success) setLogs(d.logs);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  // Build a map of date → log
  const logMap: Record<string, any> = {};
  logs.forEach((l) => { logMap[l.date] = l; });

  // Generate last 91 days (13 weeks)
  const days: string[] = [];
  const now = new Date();
  for (let i = 90; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }

  // Group by week
  const weeks: string[][] = [];
  let week: string[] = [];
  const firstDay = new Date(days[0]);
  // Pad start of first week
  for (let i = 0; i < firstDay.getDay(); i++) week.push("");
  days.forEach((d) => {
    week.push(d);
    if (week.length === 7) { weeks.push(week); week = []; }
  });
  if (week.length > 0) {
    while (week.length < 7) week.push("");
    weeks.push(week);
  }

  const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-1">📅 Activity Calendar</h1>
        <p className="text-muted-foreground">Your consistency visualized. Every green square is a win.</p>
      </header>

      {/* Legend */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {[
          { color: "bg-emerald-500", label: "≥80% Complete" },
          { color: "bg-amber-400", label: "50–79%" },
          { color: "bg-rose-400", label: "1–49%" },
          { color: "bg-muted", label: "No data" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={`w-3.5 h-3.5 rounded-sm ${l.color}`} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <Card className="glass shadow-sm border-primary/20 mb-6 overflow-x-auto">
        <CardContent className="p-6">
          {/* Day Labels */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEK_DAYS.map((d) => (
              <div key={d} className="text-center text-xs text-muted-foreground font-medium pb-1">{d}</div>
            ))}
          </div>
          {/* Weeks */}
          {weeks.map((wk, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
              {wk.map((date, di) => {
                if (!date) return <div key={di} className="aspect-square" />;
                const log = logMap[date];
                const score = log?.score || 0;
                const isToday = date === now.toISOString().split("T")[0];
                return (
                  <button
                    key={date}
                    onClick={() => setSelected(selected?.date === date ? null : { date, ...log })}
                    className={`aspect-square rounded-sm transition-all hover:scale-110 hover:ring-2 hover:ring-primary/40 ${getColor(score)} ${isToday ? "ring-2 ring-primary" : ""}`}
                    title={`${date}: ${score}%`}
                  />
                );
              })}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Selected Day Detail */}
      {selected && (
        <Card className="glass shadow-sm border-primary/30">
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-lg">{new Date(selected.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{getLabel(selected.score || 0)}</p>
              </div>
              <Badge className={`text-white ${getColor(selected.score || 0)}`}>Score: {selected.score || 0}%</Badge>
            </div>
            {selected.totalXP > 0 && (
              <p className="text-sm text-muted-foreground">XP Earned: <span className="font-semibold text-primary">+{selected.totalXP}</span></p>
            )}
            {!selected.score && (
              <p className="text-sm text-muted-foreground italic">No data recorded for this day.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
