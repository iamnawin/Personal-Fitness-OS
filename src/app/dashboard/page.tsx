"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPlan, getLogs, getStreak, getProfile } from "@/lib/workout-storage";
import { WeeklyPlan, StreakData, FitnessProfile } from "@/lib/types";
import { Flame, ChevronRight, Dumbbell, Layers } from "lucide-react";
import { ExerciseThumb } from "@/components/fitness/ExerciseThumb";
import { getExerciseById } from "@/lib/exercise-data";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function focusBadgeClass(focus?: string) {
  if (!focus) return { border: "border-white/10", badge: "bg-white/10 text-white/40", leftBorder: "border-l-white/10" };
  const f = focus.toLowerCase();
  if (f.includes("push") || f.includes("chest"))
    return { border: "border-violet-500/30", badge: "bg-violet-500/10 text-violet-300", leftBorder: "border-l-violet-500" };
  if (f.includes("pull") || f.includes("back"))
    return { border: "border-cyan-400/30", badge: "bg-cyan-500/10 text-cyan-300", leftBorder: "border-l-cyan-400" };
  if (f.includes("leg") || f.includes("lower"))
    return { border: "border-green-400/30", badge: "bg-green-500/10 text-green-300", leftBorder: "border-l-green-400" };
  if (f.includes("core") || f.includes("mobility") || f.includes("full body"))
    return { border: "border-amber-400/30", badge: "bg-amber-500/10 text-amber-300", leftBorder: "border-l-amber-400" };
  return { border: "border-brand-electric/30", badge: "bg-brand-electric/10 text-brand-electric", leftBorder: "border-l-brand-electric" };
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function DashboardPage() {
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [streak, setStreak] = useState<StreakData>({ current: 0, longest: 0, lastWorkoutDate: null });
  const [logsCount, setLogsCount] = useState(0);
  const [profile, setProfile] = useState<FitnessProfile | null>(null);

  useEffect(() => {
    setPlan(getPlan());
    setStreak(getStreak());
    setLogsCount(getLogs().length);
    setProfile(getProfile());
  }, []);

  const todayJsDay = new Date().getDay(); // 0=Sun
  const dayIndex = todayJsDay === 0 ? 6 : todayJsDay - 1; // Mon=0
  const todayPlan = plan?.days[dayIndex];
  const todayName = DAY_NAMES[todayJsDay];

  const isRestDay = todayPlan?.isRest;
  const { border, badge } = focusBadgeClass(isRestDay ? undefined : todayPlan?.focus);

  const nameStr = profile?.name ? `, ${profile.name}` : "";
  const greeting = isRestDay ? `Rest day${nameStr}` : `${getGreeting()}${nameStr}`;
  const subText = isRestDay
    ? "Recovery and hydration today."
    : plan
    ? "Ready to train?"
    : "Set up your profile to get started.";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{greeting}</h1>
        <p className="text-sm text-white/50">{subText}</p>
      </div>

      {/* Today's workout — hero card */}
      <div className={`rounded-xl border ${border} bg-white/[0.03] p-4`}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] text-white/40 uppercase tracking-wide">Today · {todayName}</p>
          {todayPlan && !isRestDay && todayPlan.focus && (
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${badge}`}>
              {todayPlan.focus}
            </span>
          )}
        </div>

        {todayPlan && !isRestDay ? (
          <>
            <p className="font-semibold text-white text-base mb-0.5">{todayPlan.label}</p>
            <p className="text-xs text-white/40 mb-4">
              {todayPlan.exercises.length} exercises · ~{profile?.sessionMinutes ?? 45} min
            </p>
            <div className="flex gap-2 mb-4">
              {todayPlan.exercises.slice(0, 4).map((ex, i) => {
                const full = getExerciseById(ex.exerciseId);
                return <ExerciseThumb key={i} gifUrl={full?.gifUrl} name={ex.name} size="md" />;
              })}
              {todayPlan.exercises.length > 4 && (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs text-white/50">
                  +{todayPlan.exercises.length - 4}
                </div>
              )}
            </div>
            <Link
              href={`/workout?source=plan:${dayIndex}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-accent py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Start Workout →
            </Link>
          </>
        ) : isRestDay ? (
          <div className="py-4 text-center">
            <p className="text-4xl mb-2">💧</p>
            <p className="text-sm text-white/50">Rest and hydrate</p>
            <p className="text-xs text-white/30 mt-1">Light walking or stretching is fine</p>
          </div>
        ) : (
          <div className="py-1">
            <p className="text-sm text-white/50 mb-4">No plan yet. Set up your profile to generate a weekly plan.</p>
            <Link
              href="/coach"
              className="flex w-full items-center justify-center rounded-xl bg-brand-accent py-2.5 text-sm font-semibold text-white"
            >
              Create My Plan
            </Link>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-around rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Flame className="h-4 w-4 text-orange-400" />
            <span className="font-bold text-white">{streak.current}</span>
          </div>
          <p className="text-[10px] text-white/40">Streak</p>
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div className="text-center">
          <p className="font-bold text-white mb-0.5">{logsCount}</p>
          <p className="text-[10px] text-white/40">Workouts</p>
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div className="text-center">
          <p className="font-bold text-white mb-0.5">{streak.longest}</p>
          <p className="text-[10px] text-white/40">Best streak</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/exercises"
          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-brand-electric/50"
        >
          <div className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-brand-electric" />
            <span className="text-sm font-medium text-white/80">Exercises</span>
          </div>
          <ChevronRight className="h-4 w-4 text-white/30" />
        </Link>
        <Link
          href="/builder"
          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-brand-accent/50"
        >
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-brand-accent" />
            <span className="text-sm font-medium text-white/80">Builder</span>
          </div>
          <ChevronRight className="h-4 w-4 text-white/30" />
        </Link>
      </div>
    </div>
  );
}
