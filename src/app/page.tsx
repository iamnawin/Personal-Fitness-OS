"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/fitness/BrandMark";
import { brand } from "@/lib/brand";
import { getProfile } from "@/lib/workout-storage";

const GOAL_LABEL: Record<string, string> = {
  strength: "build strength",
  muscle_gain: "gain muscle",
  fat_loss: "lose fat",
  general_fitness: "stay fit",
  mobility: "improve mobility",
};

export default function HomePage() {
  const [hasProfile, setHasProfile] = useState(false);
  const [goalLabel, setGoalLabel] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const profile = getProfile();
    if (profile) {
      setHasProfile(true);
      setGoalLabel(GOAL_LABEL[profile.goal] || "train");
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (hasProfile) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 text-center">
        <BrandMark size="lg" />
        <div>
          <h1 className="text-2xl font-bold text-white">Ready to train?</h1>
          <p className="mt-1 text-sm text-white/50">Your goal: {goalLabel}</p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link
            href="/dashboard"
            className="rounded-xl bg-brand-accent px-6 py-3 text-center font-semibold text-white transition-transform hover:scale-105"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/coach"
            className="rounded-xl border border-white/20 px-6 py-3 text-center text-sm font-medium text-white/60 transition-colors hover:border-brand-electric hover:text-white/80"
          >
            Start fresh
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-8 text-center">
      <BrandMark size="lg" />
      <p className="text-lg text-white/70">{brand.tagline}</p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/coach"
          className="rounded-xl bg-brand-accent px-6 py-3 text-center font-semibold text-white transition-transform hover:scale-105"
        >
          Start My Plan
        </Link>
        <Link
          href="/dashboard"
          className="rounded-xl border border-white/20 px-6 py-3 text-center font-medium text-white/80 transition-colors hover:border-brand-electric"
        >
          Go to Dashboard
        </Link>
      </div>
      <div className="flex items-center gap-2 text-xs text-white/30">
        <span>Smart weekly plan</span>
        <span>·</span>
        <span>1,300+ exercises</span>
        <span>·</span>
        <span>Track progress</span>
      </div>
    </div>
  );
}
