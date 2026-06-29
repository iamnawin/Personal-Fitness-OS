"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getExerciseById } from "@/lib/exercise-data";
import { ExerciseMediaViewer } from "@/components/fitness/ExerciseMediaViewer";
import {
  getBodyPartLabel,
  getMuscleLabel,
  getEquipmentLabel,
  createSimpleDescription,
  createUsefulFor,
  createBeginnerNote,
  createFormFocus,
  createCommonMistake,
  createSafetyNote,
} from "@/lib/exercise-enrichment";

export default function ExerciseDetailPage() {
  const params = useParams();
  const exercise = useMemo(() => getExerciseById(params.id as string), [params.id]);

  if (!exercise) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-white/60">Exercise not found.</p>
        <Link href="/exercises" className="text-sm text-brand-electric">← Back to library</Link>
      </div>
    );
  }

  const description = createSimpleDescription(exercise.name, exercise.target, exercise.bodyPart);
  const usefulFor = createUsefulFor(exercise.target, exercise.bodyPart);
  const beginnerNote = createBeginnerNote(exercise.equipment);
  const formFocus = createFormFocus(exercise.target);
  const commonMistake = createCommonMistake(exercise.target);
  const safetyNote = createSafetyNote(exercise.equipment, exercise.bodyPart);

  return (
    <div className="space-y-5">
      {/* Back */}
      <Link href="/exercises" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Library
      </Link>

      {/* Media */}
      <ExerciseMediaViewer exercise={exercise} />

      {/* Title */}
      <h1 className="text-xl font-bold text-white capitalize">{exercise.name}</h1>
      <p className="text-sm text-white/70">{description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <Badge label="Body Part" value={getBodyPartLabel(exercise.bodyPart)} />
        <Badge label="Target" value={getMuscleLabel(exercise.target)} />
        <Badge label="Equipment" value={getEquipmentLabel(exercise.equipment)} />
      </div>

      {/* Secondary muscles */}
      {exercise.secondaryMuscles.length > 0 && (
        <div>
          <h2 className="text-xs font-medium text-white/50 uppercase">Secondary Muscles</h2>
          <p className="text-sm text-white/70">{exercise.secondaryMuscles.map(getMuscleLabel).join(", ")}</p>
        </div>
      )}

      {/* Useful for */}
      <div>
        <h2 className="text-xs font-medium text-white/50 uppercase">Useful For</h2>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {usefulFor.map((t) => (
            <span key={t} className="rounded-md bg-brand-accent/20 px-2 py-0.5 text-xs text-brand-electric">{t}</span>
          ))}
        </div>
      </div>

      {/* Tips section */}
      <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <Tip title="Beginner Note" text={beginnerNote} />
        <Tip title="Form Focus" text={formFocus} />
        <Tip title="Common Mistake" text={commonMistake} />
        <Tip title="Safety" text={safetyNote} />
      </div>

      {/* Instructions */}
      {exercise.instructions && exercise.instructions.length > 0 && (
        <div>
          <h2 className="text-xs font-medium text-white/50 uppercase mb-2">Instructions</h2>
          <ol className="space-y-2 text-sm text-white/70 list-decimal list-inside">
            {exercise.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 px-2.5 py-1">
      <span className="text-[10px] text-white/40 block">{label}</span>
      <span className="text-xs text-white/80">{value}</span>
    </div>
  );
}

function Tip({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 className="text-xs font-medium text-brand-electric">{title}</h3>
      <p className="text-sm text-white/70">{text}</p>
    </div>
  );
}
