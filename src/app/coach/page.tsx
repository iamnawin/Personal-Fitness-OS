"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FitnessGoal, ExperienceLevel, FitnessProfile } from "@/lib/types";
import { saveProfile } from "@/lib/workout-storage";

const GOALS: { value: FitnessGoal; label: string }[] = [
  { value: "strength", label: "Build Strength" },
  { value: "muscle_gain", label: "Gain Muscle" },
  { value: "fat_loss", label: "Lose Fat" },
  { value: "general_fitness", label: "General Fitness" },
  { value: "mobility", label: "Improve Mobility" },
];

const LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function CoachPage() {
  const router = useRouter();
  const [goal, setGoal] = useState<FitnessGoal>("general_fitness");
  const [level, setLevel] = useState<ExperienceLevel>("beginner");
  const [days, setDays] = useState(3);
  const [duration, setDuration] = useState(45);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const profile: FitnessProfile = {
      goal,
      level,
      daysPerWeek: days,
      sessionMinutes: duration,
      location: "mixed",
    };
    saveProfile(profile);
    router.push("/equipment");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Your Coach</h1>
        <p className="text-sm text-white/60">Tell us about your fitness goals</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Goal */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-white/80">Goal</legend>
          <div className="grid grid-cols-2 gap-2">
            {GOALS.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setGoal(g.value)}
                className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                  goal === g.value
                    ? "border-brand-accent bg-brand-accent/20 text-white"
                    : "border-white/10 text-white/70 hover:border-white/30"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Level */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-white/80">Experience Level</legend>
          <div className="flex gap-2">
            {LEVELS.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setLevel(l.value)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  level === l.value
                    ? "border-brand-accent bg-brand-accent/20 text-white"
                    : "border-white/10 text-white/70 hover:border-white/30"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Days per week */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">
            Days per week: <span className="text-brand-electric">{days}</span>
          </label>
          <input
            type="range"
            min={2}
            max={6}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full accent-brand-accent"
          />
        </div>

        {/* Session duration */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">
            Session duration: <span className="text-brand-electric">{duration} min</span>
          </label>
          <input
            type="range"
            min={20}
            max={90}
            step={5}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full accent-brand-accent"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-brand-accent py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
        >
          Next: Equipment
        </button>
      </form>
    </div>
  );
}
