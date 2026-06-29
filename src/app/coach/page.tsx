"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FitnessGoal, ExperienceLevel, FitnessProfile } from "@/lib/types";
import { saveProfile } from "@/lib/workout-storage";
import { Zap, Dumbbell, Flame, Target, Wind } from "lucide-react";

const GOALS: { value: FitnessGoal; label: string; desc: string; icon: React.ElementType }[] = [
  { value: "strength",        label: "Strength",        desc: "Lift heavier, get stronger",  icon: Zap },
  { value: "muscle_gain",     label: "Muscle Gain",     desc: "Build size and definition",   icon: Dumbbell },
  { value: "fat_loss",        label: "Fat Loss",        desc: "Burn fat, stay active",       icon: Flame },
  { value: "general_fitness", label: "General Fitness", desc: "Stay fit and healthy",        icon: Target },
  { value: "mobility",        label: "Mobility",        desc: "Flexibility and movement",    icon: Wind },
];

const LEVELS: { value: ExperienceLevel; label: string; desc: string }[] = [
  { value: "beginner",     label: "Beginner",     desc: "Just starting out" },
  { value: "intermediate", label: "Intermediate", desc: "Training 6+ months" },
  { value: "advanced",     label: "Advanced",     desc: "3+ years" },
];

export default function CoachPage() {
  const router = useRouter();
  const [name, setName] = useState("");
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
      ...(name.trim() ? { name: name.trim() } : {}),
    };
    saveProfile(profile);
    router.push("/equipment");
  }

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div>
        <div className="flex gap-1 mb-1.5">
          <div className="h-1 flex-1 rounded-full bg-brand-accent" />
          <div className="h-1 flex-1 rounded-full bg-white/20" />
        </div>
        <p className="text-xs text-white/40">Step 1 of 2 — Your Goals</p>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-white">Your Coach</h1>
        <p className="text-sm text-white/60">Tell us about your fitness goals</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-white/80">Your name (optional)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Naveen"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-brand-accent/50"
          />
        </div>

        {/* Goal */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-white/80">What&apos;s your main goal?</legend>
          <div className="space-y-2">
            {GOALS.map((g) => {
              const Icon = g.icon;
              const active = goal === g.value;
              return (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGoal(g.value)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                    active
                      ? "border-brand-accent bg-brand-accent/10 text-white"
                      : "border-white/10 text-white/70 hover:border-white/30"
                  }`}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${active ? "text-brand-accent" : "text-white/30"}`} />
                  <div>
                    <p className="text-sm font-medium">{g.label}</p>
                    <p className="text-xs text-white/40">{g.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Level */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-white/80">Experience Level</legend>
          <div className="grid grid-cols-3 gap-2">
            {LEVELS.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setLevel(l.value)}
                className={`flex flex-col items-center rounded-xl border px-2 py-3 text-center transition-colors ${
                  level === l.value
                    ? "border-brand-accent bg-brand-accent/10 text-white"
                    : "border-white/10 text-white/60 hover:border-white/30"
                }`}
              >
                <p className="text-sm font-medium">{l.label}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{l.desc}</p>
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
          <div className="flex justify-between text-[10px] text-white/30 px-0.5">
            <span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
          </div>
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
          <div className="flex justify-between text-[10px] text-white/30 px-0.5">
            <span>20 min</span><span>45 min</span><span>90 min</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-brand-accent py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
        >
          Next: Equipment →
        </button>
      </form>
    </div>
  );
}
