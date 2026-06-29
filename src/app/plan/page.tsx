"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WeeklyPlan } from "@/lib/types";
import { getPlan, getProfile, getEquipment, savePlan } from "@/lib/workout-storage";
import { generatePlan } from "@/lib/pfos-coach";
import { CalendarDays, RefreshCw } from "lucide-react";

export default function PlanPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);

  useEffect(() => {
    setPlan(getPlan());
  }, []);

  function handleRegenerate() {
    const profile = getProfile();
    const equipment = getEquipment();
    if (!profile || !equipment) {
      router.push("/coach");
      return;
    }
    const newPlan = generatePlan(profile, equipment);
    savePlan(newPlan);
    setPlan(newPlan);
  }

  if (!plan) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <CalendarDays className="h-12 w-12 text-white/30" />
        <p className="text-white/60">No plan generated yet.</p>
        <button
          onClick={() => router.push("/coach")}
          className="rounded-xl bg-brand-accent px-6 py-2 text-sm font-semibold text-white"
        >
          Set Up Profile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Weekly Plan</h1>
          <p className="text-sm text-white/60">PFOS Coach</p>
        </div>
        <button
          onClick={handleRegenerate}
          className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/70 hover:border-brand-electric"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Regenerate
        </button>
      </div>

      {/* Coach note */}
      <div className="rounded-xl border border-brand-accent/30 bg-brand-accent/10 p-4">
        <p className="text-sm text-white/80">{plan.coachNote}</p>
      </div>

      {/* Days */}
      <div className="space-y-3">
        {plan.days.map((day) => (
          <div
            key={day.day}
            className={`rounded-xl border p-4 ${
              day.isRest
                ? "border-white/5 bg-white/5"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-white">{day.label}</h3>
              {day.isRest ? (
                <span className="text-xs text-white/40">Rest Day</span>
              ) : (
                <span className="text-xs text-brand-electric">{day.focus}</span>
              )}
            </div>
            {!day.isRest && (
              <ul className="mt-2 space-y-1">
                {day.exercises.map((ex, i) => (
                  <li key={i} className="flex justify-between text-sm text-white/70">
                    <span>{ex.name}</span>
                    <span className="text-white/40">
                      {ex.sets}×{ex.reps}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="w-full rounded-xl bg-brand-accent py-3 font-semibold text-white"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
