"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FitnessProfile, StreakData } from "@/lib/types";
import { getProfile, getStreak, getLogs, clearAllData } from "@/lib/workout-storage";
import { Flame, Trophy, Dumbbell, Target, User, ChevronRight, Trash2 } from "lucide-react";

const GOAL_LABELS: Record<string, string> = {
  strength: "Strength",
  muscle_gain: "Muscle Gain",
  fat_loss: "Fat Loss",
  general_fitness: "General Fitness",
  mobility: "Mobility",
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const LEVEL_COLORS: Record<string, string> = {
  beginner: "text-green-400 bg-green-400/10",
  intermediate: "text-blue-400 bg-blue-400/10",
  advanced: "text-orange-400 bg-orange-400/10",
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<FitnessProfile | null>(null);
  const [streak, setStreak] = useState<StreakData>({ current: 0, longest: 0, lastWorkoutDate: null });
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
    setStreak(getStreak());
    setTotalWorkouts(getLogs().length);
  }, []);

  function handleClearData() {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clearAllData();
    router.push("/");
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <User className="h-12 w-12 text-white/30" />
        <p className="text-white/60">No profile set up yet.</p>
        <button
          onClick={() => router.push("/coach")}
          className="rounded-xl bg-brand-accent px-6 py-2 text-sm font-semibold text-white"
        >
          Set Up Profile
        </button>
      </div>
    );
  }

  const memberSince = (() => {
    const logs = getLogs();
    if (logs.length === 0) return "Today";
    const first = logs[0].date;
    return new Date(first).toLocaleDateString(undefined, { month: "short", year: "numeric" });
  })();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-accent/20">
          <User className="h-8 w-8 text-brand-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {profile.name || "My Profile"}
          </h1>
          <p className="text-xs text-white/40">Member since {memberSince}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/[0.02] py-3">
          <Flame className="h-4 w-4 text-orange-400" />
          <p className="text-sm font-bold text-white">{streak.current}</p>
          <p className="text-[9px] text-white/35">Streak</p>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/[0.02] py-3">
          <Trophy className="h-4 w-4 text-yellow-400" />
          <p className="text-sm font-bold text-white">{streak.longest}</p>
          <p className="text-[9px] text-white/35">Best</p>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/[0.02] py-3">
          <Dumbbell className="h-4 w-4 text-brand-electric" />
          <p className="text-sm font-bold text-white">{totalWorkouts}</p>
          <p className="text-[9px] text-white/35">Workouts</p>
        </div>
      </div>

      {/* Profile details */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] divide-y divide-white/5">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-white/30" />
            <span className="text-sm text-white/60">Goal</span>
          </div>
          <span className="text-sm font-medium text-white">{GOAL_LABELS[profile.goal] || profile.goal}</span>
        </div>
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-white/30" />
            <span className="text-sm text-white/60">Level</span>
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${LEVEL_COLORS[profile.level] || "text-white/60 bg-white/10"}`}>
            {LEVEL_LABELS[profile.level] || profile.level}
          </span>
        </div>
        <div className="flex items-center justify-between p-3">
          <span className="text-sm text-white/60">Days / week</span>
          <span className="text-sm font-medium text-white">{profile.daysPerWeek} days</span>
        </div>
        <div className="flex items-center justify-between p-3">
          <span className="text-sm text-white/60">Session length</span>
          <span className="text-sm font-medium text-white">{profile.sessionMinutes} min</span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={() => router.push("/coach")}
          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-brand-accent/40"
        >
          <span className="text-sm text-white/80">Edit Goals</span>
          <ChevronRight className="h-4 w-4 text-white/30" />
        </button>
        <button
          onClick={() => router.push("/equipment")}
          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-brand-electric/40"
        >
          <span className="text-sm text-white/80">Update Equipment</span>
          <ChevronRight className="h-4 w-4 text-white/30" />
        </button>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 space-y-2">
        <p className="text-xs font-medium text-red-400/70 uppercase tracking-wide">Danger Zone</p>
        <p className="text-xs text-white/40">This will erase all your workouts, plan, and profile data permanently.</p>
        <button
          onClick={handleClearData}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            confirmClear
              ? "bg-red-500 text-white"
              : "border border-red-500/30 text-red-400 hover:bg-red-500/10"
          }`}
        >
          <Trash2 className="h-4 w-4" />
          {confirmClear ? "Tap again to confirm" : "Clear All Data"}
        </button>
      </div>
    </div>
  );
}
