import Link from "next/link";
import { Exercise } from "@/lib/types";
import { getBodyPartLabel, getEquipmentLabel, getMuscleLabel, getDifficulty, getShortUsefulFor } from "@/lib/exercise-enrichment";
import { ExerciseThumb } from "./ExerciseThumb";

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const difficulty = getDifficulty(exercise.equipment);
  const useful = getShortUsefulFor(exercise.target, exercise.equipment);

  return (
    <Link
      href={`/exercises/${exercise.id}`}
      className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-brand-accent/50"
    >
      <ExerciseThumb gifUrl={exercise.gifUrl} name={exercise.name} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-white text-sm capitalize leading-tight">{exercise.name}</h3>
          <DifficultyBadge level={difficulty} />
        </div>
        <p className="mt-0.5 text-[11px] text-white/40">{useful}</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          <Tag color="violet">{getBodyPartLabel(exercise.bodyPart)}</Tag>
          <Tag color="blue">{getMuscleLabel(exercise.target)}</Tag>
          <Tag color="default">{getEquipmentLabel(exercise.equipment)}</Tag>
        </div>
      </div>
    </Link>
  );
}

function DifficultyBadge({ level }: { level: "Beginner" | "Intermediate" | "Advanced" }) {
  const cls =
    level === "Beginner"
      ? "text-green-400 bg-green-400/10"
      : level === "Advanced"
      ? "text-orange-400 bg-orange-400/10"
      : "text-blue-400 bg-blue-400/10";
  return <span className={`shrink-0 rounded px-1 py-0.5 text-[9px] font-medium ${cls}`}>{level}</span>;
}

function Tag({ children, color }: { children: React.ReactNode; color: "violet" | "blue" | "default" }) {
  const cls =
    color === "violet"
      ? "bg-violet-500/10 text-violet-300"
      : color === "blue"
      ? "bg-blue-500/10 text-blue-300"
      : "bg-white/10 text-white/60";
  return <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${cls}`}>{children}</span>;
}
