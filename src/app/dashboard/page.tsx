"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { getPlan, getLogs, getStreak, getCustomWorkouts } from "@/lib/workout-storage";
import { WeeklyPlan, StreakData } from "@/lib/types";
import { Flame, CalendarDays, Dumbbell, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [streak, setStreak] = useState<StreakData>({ current: 0, longest: 0, lastWorkoutDate: null });
  const [logsCount, setLogsCount] = useState(0);
  const [customCount, setCustomCount] = useState(0);

  useEffect(() => {
    setPlan(getPlan());
    setStreak(getStreak());
    setLogsCount(getLogs().length);
    setCustomCount(getCustomWorkouts().length);
  }, []);

  const todayIndex = new Date().getDay(); // 0=Sun
  const dayIndex = todayIndex === 0 ? 6 : todayIndex - 1; // convert to Mon=0
  const todayPlan = plan?.days[dayIndex];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{brand.productName}</h1>
        <p className="text-sm text-white/60">Your personal control room</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={<Flame className="h-5 w-5 text-orange-400" />} label="Streak" value={`${streak.current} days`} />
        <StatCard icon={<TrendingUp className="h-5 w-5 text-green-400" />} label="Workouts" value={String(logsCount)} />
        <StatCard icon={<CalendarDays className="h-5 w-5 text-brand-electric" />} label="Longest Streak" value={`${streak.longest} days`} />
        <StatCard icon={<Dumbbell className="h-5 w-5 text-brand-accent" />} label="Saved Workouts" value={String(customCount)} />
      </div>

      {/* Today's workout */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="mb-2 font-medium text-white">Today&apos;s Workout</h2>
        {todayPlan && !todayPlan.isRest ? (
          <div>
            <p className="text-sm text-brand-electric">{todayPlan.focus}</p>
            <ul className="mt-2 space-y-1">
              {todayPlan.exercises.slice(0, 3).map((ex, i) => (
                <li key={i} className="text-sm text-white/70">{ex.name}</li>
              ))}
              {todayPlan.exercises.length > 3 && (
                <li className="text-sm text-white/40">+{todayPlan.exercises.length - 3} more</li>
              )}
            </ul>
          </div>
        ) : todayPlan?.isRest ? (
          <p className="text-sm text-white/50">Rest day — recover and hydrate 💧</p>
        ) : (
          <p className="text-sm text-white/50">No plan yet. Set up your profile to get started.</p>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        <QuickLink href="/plan" label="View Plan" />
        <QuickLink href="/coach" label="Update Profile" />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      {icon}
      <div>
        <p className="text-xs text-white/50">{label}</p>
        <p className="font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-medium text-white/80 transition-colors hover:border-brand-electric"
    >
      {label}
    </Link>
  );
}
