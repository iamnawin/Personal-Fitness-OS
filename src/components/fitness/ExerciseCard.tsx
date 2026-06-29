import Link from "next/link";
import { Exercise } from "@/lib/types";
import { getBodyPartLabel, getEquipmentLabel, getMuscleLabel } from "@/lib/exercise-enrichment";

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <Link
      href={`/exercises/${exercise.id}`}
      className="block rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-brand-accent/50"
    >
      <h3 className="font-medium text-white text-sm capitalize">{exercise.name}</h3>
      <div className="mt-1 flex flex-wrap gap-1.5">
        <Tag>{getBodyPartLabel(exercise.bodyPart)}</Tag>
        <Tag>{getMuscleLabel(exercise.target)}</Tag>
        <Tag>{getEquipmentLabel(exercise.equipment)}</Tag>
      </div>
    </Link>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-white/60">
      {children}
    </span>
  );
}
