"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WeeklyPlan } from "@/lib/types";
import { getPlan, getProfile, getEquipment, savePlan } from "@/lib/workout-storage";
import { generatePlan, isValidPlan } from "@/lib/pfos-coach";
import { getExerciseById } from "@/lib/exercise-data";
import { ExerciseThumb } from "@/components/fitness/ExerciseThumb";
import { getBodyPartLabel, getEquipmentLabel } from "@/lib/exercise-enrichment";
import { CalendarDays, RefreshCw, Play } from "lucide-react";

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

export default function PlanPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [autoFixed, setAutoFixed] = useState(false);

  useEffect(() => {
    const saved = getPlan();
    if (!saved) {
      setPlan(null);
      return;
    }
    // Auto-fix broken plans (workout days with no exercises)
    if (!isValidPlan(saved)) {
      const profile = getProfile();
      const equipment = getEquipment();
      if (profile && equipment) {
        const fresh = generatePlan(profile, equipment);
        savePlan(fresh);
        setPlan(fresh);
        setAutoFixed(true);
        return;
      }
    }
    setPlan(saved);
  }, []);

  function handleRegenerate() {
    const profile = getProfile();
    const equipment = getEquipment();
    if (!profile || !equipment) { router.push("/coach"); return; }
    const newPlan = generatePlan(profile, equipment);
    savePlan(newPlan);
    setPlan(newPlan);
    setAutoFixed(false);
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

  const workoutDays = plan.days.filter((d) => !d.isRest).length;
  const levelLabel = LEVEL_LABELS[plan.profile?.level] || "";
  const goalLabel = GOAL_LABELS[plan.profile?.goal] || "";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Weekly Plan</h1>
          <p className="text-xs text-white/50 mt-0.5">
            {workoutDays} workout days · {7 - workoutDays} recovery
          </p>
          {(levelLabel || goalLabel) && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {levelLabel && (
                <span className="rounded-full bg-brand-accent/20 px-2.5 py-0.5 text-[11px] font-medium text-brand-electric">
                  {levelLabel}
                </span>
              )}
              {goalLabel && (
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/60">
                  {goalLabel}
                </span>
              )}
            </div>
          )}
        </div>
        <button
          onClick={handleRegenerate}
          className="flex shrink-0 items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:border-brand-electric"
        >
          <RefreshCw className="h-3.5 w-3.5" /> New Plan
        </button>
      </div>

      {/* Auto-fixed banner */}
      {autoFixed && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3">
          <p className="text-xs text-green-300">
            Your previous plan had empty workout days — we fixed it automatically.
          </p>
        </div>
      )}

      {/* Coach note */}
      <div className="rounded-xl border border-brand-accent/30 bg-brand-accent/10 p-3">
        <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Your Coach</p>
        <p className="text-sm text-white/80">{plan.coachNote}</p>
      </div>

      {/* Days */}
      <div className="space-y-3">
        {plan.days.map((day) => (
          <div
            key={day.day}
            className={`rounded-xl border p-4 ${
              day.isRest
                ? "border-white/5 bg-white/[0.02]"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-white">{day.label}</h3>
              {day.isRest ? (
                <span className="text-xs text-white/30">Rest</span>
              ) : (
                <span className="text-xs font-medium text-brand-electric">{day.focus}</span>
              )}
            </div>

            {day.isRest ? (
              <p className="mt-1 text-xs text-white/30">
                Recover. Light walking or stretching is fine.
              </p>
            ) : (
              <>
                {day.shortNote && (
                  <p className="mt-1 text-xs text-white/40">{day.shortNote}</p>
                )}

                <div className="mt-3 space-y-2">
                  {day.exercises.length === 0 ? (
                    <p className="text-xs text-white/30 italic">
                      No exercises found for this day — tap New Plan to regenerate.
                    </p>
                  ) : (
                    day.exercises.map((ex, i) => {
                      const full = getExerciseById(ex.exerciseId);
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <ExerciseThumb gifUrl={full?.gifUrl} name={ex.name} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white/90 capitalize truncate">{ex.name}</p>
                            <p className="text-[11px] text-white/40">
                              {getBodyPartLabel(full?.bodyPart || "")} · {getEquipmentLabel(ex.equipment)}
                            </p>
                          </div>
                          <span className="shrink-0 text-xs text-white/50">
                            {ex.sets}×{ex.reps}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                {day.exercises.length > 0 && (
                  <button
                    onClick={() => router.push(`/workout?source=plan:${day.day - 1}`)}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-electric/10 py-2 text-xs font-medium text-brand-electric hover:bg-brand-electric/20"
                  >
                    <Play className="h-3 w-3" /> Start Workout
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
