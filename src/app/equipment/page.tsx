"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkoutLocation, EquipmentPreferences } from "@/lib/types";
import { saveEquipment, getProfile, savePlan } from "@/lib/workout-storage";
import { generatePlan } from "@/lib/pfos-coach";

const EQUIPMENT_OPTIONS = [
  "Body weight",
  "Dumbbell",
  "Barbell",
  "Kettlebell",
  "Cable",
  "Resistance Band",
  "Pull-up Bar",
  "Bench",
  "Leverage Machine",
];

const BODY_PARTS = ["chest", "back", "shoulders", "upper arms", "upper legs", "waist", "cardio"];

const FOCUS_MUSCLES = [
  { label: "Chest", value: "pectorals" },
  { label: "Back", value: "lats" },
  { label: "Shoulders", value: "delts" },
  { label: "Biceps", value: "biceps" },
  { label: "Triceps", value: "triceps" },
  { label: "Core / Abs", value: "abs" },
  { label: "Legs", value: "quads" },
  { label: "Glutes", value: "glutes" },
];

export default function EquipmentPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(["Body weight"]);
  const [location, setLocation] = useState<WorkoutLocation>("home");
  const [excluded, setExcluded] = useState<string[]>([]);
  const [focusMuscles, setFocusMuscles] = useState<string[]>([]);

  function toggle(item: string, list: string[], setter: (v: string[]) => void) {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  }

  function handleGenerate() {
    const profile = getProfile();
    if (!profile) {
      router.push("/coach");
      return;
    }
    const eq: EquipmentPreferences = {
      available: selected,
      location,
      excludedBodyParts: excluded,
      excludedExercises: [],
      focusMuscles,
    };
    saveEquipment(eq);
    const plan = generatePlan({ ...profile, location }, eq);
    savePlan(plan);
    router.push("/plan");
  }

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div>
        <div className="flex gap-1 mb-1.5">
          <div className="h-1 flex-1 rounded-full bg-brand-accent/40" />
          <div className="h-1 flex-1 rounded-full bg-brand-accent" />
        </div>
        <p className="text-xs text-white/40">Step 2 of 2 — Equipment &amp; Focus</p>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-white">Equipment & Preferences</h1>
        <p className="text-sm text-white/60">What do you have available?</p>
      </div>

      {/* Equipment */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-white/80">Available Equipment</legend>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map((eq) => (
            <button
              key={eq}
              type="button"
              onClick={() => toggle(eq, selected, setSelected)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                selected.includes(eq)
                  ? "border-brand-electric bg-brand-electric/20 text-white"
                  : "border-white/10 text-white/60 hover:border-white/30"
              }`}
            >
              {eq}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Location */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-white/80">Workout Location</legend>
        <div className="flex gap-2">
          {(["home", "gym", "mixed"] as WorkoutLocation[]).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setLocation(loc)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm capitalize transition-colors ${
                location === loc
                  ? "border-brand-accent bg-brand-accent/20 text-white"
                  : "border-white/10 text-white/70 hover:border-white/30"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Focus muscles */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-white/80">Which muscles to focus on? <span className="text-white/40 font-normal">(optional)</span></legend>
        <p className="text-xs text-white/40">Select what you most want to train. Your plan will prioritize these.</p>
        <div className="flex flex-wrap gap-2">
          {FOCUS_MUSCLES.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => toggle(value, focusMuscles, setFocusMuscles)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                focusMuscles.includes(value)
                  ? "border-brand-accent bg-brand-accent/20 text-white"
                  : "border-white/10 text-white/60 hover:border-white/30"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Excluded body parts */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-white/80">Avoid these body parts <span className="text-white/40 font-normal">(optional)</span></legend>
        <div className="flex flex-wrap gap-2">
          {BODY_PARTS.map((bp) => (
            <button
              key={bp}
              type="button"
              onClick={() => toggle(bp, excluded, setExcluded)}
              className={`rounded-lg border px-3 py-1.5 text-sm capitalize transition-colors ${
                excluded.includes(bp)
                  ? "border-red-400 bg-red-400/20 text-red-300"
                  : "border-white/10 text-white/60 hover:border-white/30"
              }`}
            >
              {bp}
            </button>
          ))}
        </div>
      </fieldset>

      <button
        onClick={handleGenerate}
        className="w-full rounded-xl bg-brand-accent py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
      >
        Generate My Plan
      </button>
    </div>
  );
}
