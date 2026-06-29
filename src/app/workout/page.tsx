"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Timer, Trophy, SkipForward } from "lucide-react";
import { getPlan, getCustomWorkouts, saveLog, updateStreak } from "@/lib/workout-storage";
import { getExerciseById } from "@/lib/exercise-data";
import { ExerciseMediaViewer } from "@/components/fitness/ExerciseMediaViewer";
import { ExerciseThumb } from "@/components/fitness/ExerciseThumb";
import { getBodyPartLabel, createFormFocus } from "@/lib/exercise-enrichment";
import { WorkoutLog } from "@/lib/types";

type SessionExercise = { exerciseId: string; name: string; sets: number; reps: string; restSeconds: number };

export default function WorkoutPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center text-white/40">Loading...</div>}>
      <WorkoutContent />
    </Suspense>
  );
}

function WorkoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams.get("source"); // "plan:dayIndex" or "custom:workoutId"

  const exercises = useMemo<SessionExercise[]>(() => {
    if (!source) return [];
    if (source.startsWith("plan:")) {
      const dayIdx = parseInt(source.split(":")[1]);
      const plan = getPlan();
      if (!plan) return [];
      const day = plan.days[dayIdx];
      if (!day || day.isRest) return [];
      return day.exercises.map((e) => ({ exerciseId: e.exerciseId, name: e.name, sets: e.sets, reps: e.reps, restSeconds: e.restSeconds }));
    }
    if (source.startsWith("custom:")) {
      const id = source.split(":")[1];
      const custom = getCustomWorkouts().find((w) => w.id === id);
      if (!custom) return [];
      return custom.exercises.map((e) => ({ exerciseId: e.exerciseId, name: e.name, sets: e.sets, reps: e.reps, restSeconds: e.restSeconds }));
    }
    return [];
  }, [source]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [completedSets, setCompletedSets] = useState<number[][]>(() => exercises.map(() => []));
  const [resting, setResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [startTime] = useState(Date.now());
  const [finished, setFinished] = useState(false);
  const [workoutNotes, setWorkoutNotes] = useState("");

  // Rest timer
  useEffect(() => {
    if (!resting || restTime <= 0) return;
    const t = setTimeout(() => setRestTime((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resting, restTime]);

  useEffect(() => {
    if (resting && restTime <= 0) setResting(false);
  }, [resting, restTime]);

  if (exercises.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-white/60">No workout loaded.</p>
        <button onClick={() => router.push("/plan")} className="text-sm text-brand-electric">Go to Plan</button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center px-4">
        <Trophy className="h-14 w-14 text-brand-electric" />
        <h1 className="text-2xl font-bold text-white">Workout Complete!</h1>
        <p className="text-sm text-white/60">{Math.round((Date.now() - startTime) / 60000)} min · {exercises.length} exercises</p>
        <button onClick={() => router.push("/dashboard")} className="rounded-xl bg-brand-accent px-6 py-2.5 text-sm font-medium text-white">Back to Dashboard</button>
      </div>
    );
  }

  const current = exercises[currentIdx];
  const exercise = getExerciseById(current.exerciseId);
  const setsCompleted = completedSets[currentIdx]?.length || 0;

  function completeSet() {
    const reps = parseInt(current.reps) || 0;
    setCompletedSets((prev) => prev.map((s, i) => (i === currentIdx ? [...s, reps] : s)));
    if (setsCompleted + 1 < current.sets) {
      setResting(true);
      setRestTime(current.restSeconds);
    }
  }

  function nextExercise() {
    if (currentIdx < exercises.length - 1) {
      setCurrentIdx((i) => i + 1);
    }
  }

  function finishWorkout() {
    const log: WorkoutLog = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      planDayIndex: source?.startsWith("plan:") ? parseInt(source.split(":")[1]) : undefined,
      customWorkoutId: source?.startsWith("custom:") ? source.split(":")[1] : undefined,
      exercises: exercises.map((e, i) => ({ exerciseId: e.exerciseId, name: e.name, setsCompleted: completedSets[i]?.length || 0, repsPerSet: completedSets[i] || [] })),
      durationMinutes: Math.round((Date.now() - startTime) / 60000),
      ...(workoutNotes.trim() ? { notes: workoutNotes.trim() } : {}),
    };
    saveLog(log);
    updateStreak();
    setFinished(true);
  }

  const allDone = setsCompleted >= current.sets;
  const isLast = currentIdx === exercises.length - 1;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-brand-electric transition-all" style={{ width: `${((currentIdx + (allDone ? 1 : 0)) / exercises.length) * 100}%` }} />
        </div>
        <span className="text-xs text-white/40">{currentIdx + 1}/{exercises.length}</span>
      </div>

      {/* Media */}
      {exercise && <ExerciseMediaViewer exercise={exercise} />}

      {/* Exercise info */}
      <h2 className="text-lg font-bold text-white capitalize">{current.name}</h2>
      <p className="text-sm text-white/50">{current.sets} sets × {current.reps} reps · {current.restSeconds}s rest</p>

      {/* Coach tip */}
      {exercise && (
        <div className="rounded-xl border border-brand-accent/20 bg-brand-accent/5 px-3 py-2">
          <p className="text-[11px] text-white/40 uppercase tracking-wide mb-0.5">Coach tip</p>
          <p className="text-xs text-white/70 leading-relaxed">{createFormFocus(exercise.target)}</p>
        </div>
      )}

      {/* Sets progress */}
      <div className="flex gap-1.5">
        {Array.from({ length: current.sets }).map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full ${i < setsCompleted ? "bg-brand-electric" : "bg-white/10"}`} />
        ))}
      </div>

      {/* Rest timer */}
      {resting && (
        <div className="flex items-center gap-4 rounded-xl border border-brand-electric/30 bg-brand-electric/5 p-4">
          <div className="flex flex-col items-center gap-1">
            <Timer className="h-5 w-5 text-brand-electric" />
            <span className="text-2xl font-bold text-white">{restTime}s</span>
          </div>
          <div className="flex-1">
            <p className="text-xs text-white/50">Rest between sets</p>
            <button onClick={() => { setResting(false); setRestTime(0); }} className="mt-1 flex items-center gap-1 text-xs text-brand-electric">
              <SkipForward className="h-3 w-3" /> Skip
            </button>
          </div>
        </div>
      )}

      {/* Next exercise preview */}
      {allDone && !isLast && (() => {
        const next = exercises[currentIdx + 1];
        const nextFull = getExerciseById(next.exerciseId);
        return (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[10px] text-white/40 uppercase mb-2">Up Next</p>
            <div className="flex items-center gap-3">
              <ExerciseThumb gifUrl={nextFull?.gifUrl} name={next.name} size="md" />
              <div>
                <p className="text-sm text-white/90 capitalize">{next.name}</p>
                <p className="text-[11px] text-white/40">{getBodyPartLabel(nextFull?.bodyPart || "")} · {next.sets}×{next.reps}</p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Actions */}
      {!resting && !allDone && (
        <button onClick={completeSet} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-accent py-3 text-sm font-medium text-white">
          <Check className="h-4 w-4" /> Complete Set {setsCompleted + 1}
        </button>
      )}

      {allDone && !isLast && (
        <button onClick={nextExercise} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-electric py-3 text-sm font-medium text-white">
          Next Exercise →
        </button>
      )}

      {allDone && isLast && (
        <div className="space-y-3">
          <textarea
            value={workoutNotes}
            onChange={(e) => setWorkoutNotes(e.target.value)}
            placeholder="Add a note about today's workout (optional)"
            rows={2}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-brand-accent/50 resize-none"
          />
          <button onClick={finishWorkout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-medium text-white">
            <Trophy className="h-4 w-4" /> Finish Workout
          </button>
        </div>
      )}
    </div>
  );
}
