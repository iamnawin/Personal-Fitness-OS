"use client";

import { useMemo } from "react";
import { Flame, Trophy, Calendar, TrendingUp } from "lucide-react";
import { getLogs, getStreak, getPlan } from "@/lib/workout-storage";
import { WorkoutLog } from "@/lib/types";

function WorkoutCalendar({ logs }: { logs: WorkoutLog[] }) {
  const days = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (27 - i));
      const iso = d.toISOString().slice(0, 10);
      const hasWorkout = logs.some((l) => l.date.slice(0, 10) === iso);
      const isToday = iso === new Date().toISOString().slice(0, 10);
      return { iso, hasWorkout, isToday };
    });
  }, [logs]);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-white/60">Last 4 weeks</p>
        <div className="flex items-center gap-3 text-[10px] text-white/30">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-brand-accent/70 inline-block" /> Workout</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-white/10 inline-block" /> Rest</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["M","T","W","T","F","S","S"].map((d, i) => (
          <div key={i} className="text-center text-[9px] text-white/25 pb-0.5">{d}</div>
        ))}
        {days.map(({ iso, hasWorkout, isToday }) => (
          <div
            key={iso}
            className={`h-7 rounded-md transition-colors ${
              hasWorkout ? "bg-brand-accent/70" : "bg-white/[0.05]"
            } ${isToday ? "ring-1 ring-white/50 ring-offset-1 ring-offset-[#1e1b4b]" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const logs = useMemo(() => getLogs(), []);
  const streak = useMemo(() => getStreak(), []);
  const plan = useMemo(() => getPlan(), []);

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekStartStr = weekStart.toISOString().split("T")[0];

  const thisWeekLogs = logs.filter((l) => l.date.split("T")[0] >= weekStartStr);
  const totalSetsThisWeek = thisWeekLogs.reduce(
    (sum, l) => sum + l.exercises.reduce((s, e) => s + e.setsCompleted, 0),
    0
  );
  const plannedDays = plan ? plan.days.filter((d) => !d.isRest).length : 0;
  const adherence =
    plannedDays > 0 ? Math.min(100, Math.round((thisWeekLogs.length / plannedDays) * 100)) : 0;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">Progress</h1>

      {/* Calendar heatmap */}
      <WorkoutCalendar logs={logs} />

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2">
        <StatChip icon={<Flame className="h-4 w-4 text-orange-400" />} value={streak.current} label="Streak" />
        <StatChip icon={<Trophy className="h-4 w-4 text-yellow-400" />} value={streak.longest} label="Best" />
        <StatChip icon={<Calendar className="h-4 w-4 text-brand-electric" />} value={thisWeekLogs.length} label="This week" />
        <StatChip icon={<TrendingUp className="h-4 w-4 text-green-400" />} value={totalSetsThisWeek} label="Sets" />
      </div>

      {/* Adherence */}
      {plan && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">Plan Adherence</span>
            <span className="text-sm font-bold text-brand-electric">{adherence}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-brand-electric transition-all" style={{ width: `${adherence}%` }} />
          </div>
          <p className="text-xs text-white/40">{thisWeekLogs.length} of {plannedDays} planned sessions this week</p>
        </div>
      )}

      {/* History */}
      <div>
        <h2 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-3">Recent Activity</h2>
        {logs.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center">
            <p className="text-sm text-white/40">No workouts logged yet.</p>
            <p className="text-xs text-white/25 mt-1">Complete a workout to see your history here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs
              .slice()
              .reverse()
              .slice(0, 20)
              .map((log) => {
                const totalSets = log.exercises.reduce((s, e) => s + e.setsCompleted, 0);
                return (
                  <div
                    key={log.id}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-3 border-l-2 border-l-brand-accent/50"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-white/80">
                        {new Date(log.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/40 bg-white/5 rounded px-1.5 py-0.5">{totalSets} sets</span>
                        <span className="text-[10px] text-white/40">{log.durationMinutes} min</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {log.exercises.slice(0, 4).map((e, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-white/55 capitalize"
                        >
                          {e.name}
                        </span>
                      ))}
                      {log.exercises.length > 4 && (
                        <span className="text-[10px] text-white/30">+{log.exercises.length - 4} more</span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatChip({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/[0.02] py-3">
      {icon}
      <p className="text-sm font-bold text-white">{value}</p>
      <p className="text-[9px] text-white/35">{label}</p>
    </div>
  );
}
