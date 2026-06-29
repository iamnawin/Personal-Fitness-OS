"use client";

import { useMemo } from "react";
import { Flame, Trophy, Calendar, TrendingUp } from "lucide-react";
import { getLogs, getStreak, getPlan } from "@/lib/workout-storage";

export default function ProgressPage() {
  const logs = useMemo(() => getLogs(), []);
  const streak = useMemo(() => getStreak(), []);
  const plan = useMemo(() => getPlan(), []);

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekStartStr = weekStart.toISOString().split("T")[0];

  const thisWeekLogs = logs.filter((l) => l.date.split("T")[0] >= weekStartStr);
  const totalSetsThisWeek = thisWeekLogs.reduce((sum, l) => sum + l.exercises.reduce((s, e) => s + e.setsCompleted, 0), 0);
  const plannedDays = plan ? plan.days.filter((d) => !d.isRest).length : 0;
  const adherence = plannedDays > 0 ? Math.min(100, Math.round((thisWeekLogs.length / plannedDays) * 100)) : 0;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">Progress</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <Stat icon={<Flame className="h-5 w-5 text-orange-400" />} label="Current Streak" value={`${streak.current} day${streak.current !== 1 ? "s" : ""}`} />
        <Stat icon={<Trophy className="h-5 w-5 text-yellow-400" />} label="Longest Streak" value={`${streak.longest} day${streak.longest !== 1 ? "s" : ""}`} />
        <Stat icon={<Calendar className="h-5 w-5 text-brand-electric" />} label="This Week" value={`${thisWeekLogs.length} workout${thisWeekLogs.length !== 1 ? "s" : ""}`} />
        <Stat icon={<TrendingUp className="h-5 w-5 text-green-400" />} label="Weekly Sets" value={`${totalSetsThisWeek}`} />
      </div>

      {/* Adherence */}
      {plan && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">Plan Adherence</span>
            <span className="text-sm font-bold text-brand-electric">{adherence}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-brand-electric transition-all" style={{ width: `${adherence}%` }} />
          </div>
          <p className="text-xs text-white/40">{thisWeekLogs.length} of {plannedDays} planned sessions completed</p>
        </div>
      )}

      {/* History */}
      <div>
        <h2 className="text-sm font-medium text-white/50 uppercase mb-3">Recent Activity</h2>
        {logs.length === 0 ? (
          <p className="text-sm text-white/40">No workouts logged yet. Complete a workout to see your history.</p>
        ) : (
          <div className="space-y-2">
            {logs.slice().reverse().slice(0, 20).map((log) => (
              <div key={log.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">{new Date(log.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</span>
                  <span className="text-xs text-white/40">{log.durationMinutes} min</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {log.exercises.slice(0, 4).map((e, i) => (
                    <span key={i} className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-white/60 capitalize">{e.name}</span>
                  ))}
                  {log.exercises.length > 4 && <span className="text-[10px] text-white/40">+{log.exercises.length - 4} more</span>}
                </div>
                <p className="mt-1 text-xs text-white/40">{log.exercises.reduce((s, e) => s + e.setsCompleted, 0)} sets total</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 flex items-center gap-3">
      {icon}
      <div>
        <p className="text-xs text-white/40">{label}</p>
        <p className="text-sm font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
