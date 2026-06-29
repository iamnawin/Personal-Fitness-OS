"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, AlertTriangle, Shield, BookOpen, Plus } from "lucide-react";
import { getExerciseById } from "@/lib/exercise-data";
import { ExerciseMediaViewer } from "@/components/fitness/ExerciseMediaViewer";
import {
  getBodyPartLabel,
  getMuscleLabel,
  getEquipmentLabel,
  getDifficulty,
  createSimpleDescription,
  createUsefulFor,
  createBeginnerNote,
  createFormFocus,
  createCommonMistake,
  createSafetyNote,
  getSimpleTargetExplanation,
  getBeginnerHowTo,
  getHomeAlternative,
} from "@/lib/exercise-enrichment";

type Tab = "overview" | "howto" | "safety";

export default function ExerciseDetailPage() {
  const params = useParams();
  const exercise = useMemo(() => getExerciseById(params.id as string), [params.id]);
  const [tab, setTab] = useState<Tab>("overview");

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
  const difficulty = getDifficulty(exercise.equipment);
  const targetExplanation = getSimpleTargetExplanation(exercise.target);
  const beginnerHowTo = getBeginnerHowTo(exercise.target, exercise.equipment);
  const homeAlt = getHomeAlternative(exercise.equipment, exercise.target);

  return (
    <div className="pb-20 space-y-4">
      {/* Nav */}
      <Link href="/exercises" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Library
      </Link>

      {/* Hero Media */}
      <ExerciseMediaViewer exercise={exercise} />

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white capitalize">{exercise.name}</h1>
        <p className="mt-1 text-sm text-white/60">{description}</p>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2">
        <Chip color="violet">{getBodyPartLabel(exercise.bodyPart)}</Chip>
        <Chip color="blue">{getMuscleLabel(exercise.target)}</Chip>
        <Chip color="default">{getEquipmentLabel(exercise.equipment)}</Chip>
        <Chip color={difficulty === "Beginner" ? "green" : difficulty === "Advanced" ? "orange" : "blue"}>{difficulty}</Chip>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
        {(["overview", "howto", "safety"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${tab === t ? "bg-brand-accent text-white" : "text-white/50 hover:text-white/80"}`}>
            {t === "overview" ? "Overview" : t === "howto" ? "How To" : "Safety"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && (
        <div className="space-y-4">
          {/* What it trains — plain English */}
          <div className="rounded-xl border border-brand-electric/20 bg-brand-electric/5 p-4">
            <h3 className="text-xs font-medium text-white/50 uppercase mb-2">What It Trains</h3>
            <p className="text-sm text-white/80 leading-relaxed">{targetExplanation}</p>
          </div>

          {/* Useful for */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <h3 className="text-xs font-medium text-white/50 uppercase mb-2">Good For</h3>
            <div className="flex flex-wrap gap-1.5">
              {usefulFor.map((t) => (
                <span key={t} className="rounded-md bg-brand-accent/20 px-2 py-0.5 text-xs text-brand-electric">{t}</span>
              ))}
            </div>
          </div>

          {/* Secondary muscles */}
          {exercise.secondaryMuscles.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <h3 className="text-xs font-medium text-white/50 uppercase mb-2">Also Works</h3>
              <p className="text-sm text-white/70">{exercise.secondaryMuscles.map(getMuscleLabel).join(", ")}</p>
            </div>
          )}

          {/* Home alternative */}
          {homeAlt && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <h3 className="text-xs font-medium text-white/50 uppercase mb-2">No Equipment?</h3>
              <p className="text-sm text-white/70">{homeAlt}</p>
            </div>
          )}
        </div>
      )}

      {tab === "howto" && (
        <div className="space-y-4">
          {/* Simple how-to in plain English */}
          <div className="rounded-xl border border-brand-electric/20 bg-brand-electric/5 p-4">
            <h3 className="text-xs font-medium text-white/50 uppercase mb-2">How To Do It</h3>
            <p className="text-sm text-white/80 leading-relaxed">{beginnerHowTo}</p>
          </div>

          {/* Instructions from dataset */}
          {exercise.instructions && exercise.instructions.length > 0 && (
            <div className="space-y-2">
              {exercise.instructions.map((step, i) => (
                <div key={i} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-electric/20 text-xs font-bold text-brand-electric">{i + 1}</span>
                  <p className="text-sm text-white/70 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          )}

          {/* Form Focus */}
          <InsightCard icon={<Sparkles className="h-4 w-4 text-violet-400" />} title="Form Focus" text={createFormFocus(exercise.target)} border="border-violet-500/20" />
        </div>
      )}

      {tab === "safety" && (
        <div className="space-y-4">
          <InsightCard icon={<BookOpen className="h-4 w-4 text-violet-400" />} title="Beginner Note" text={createBeginnerNote(exercise.equipment)} border="border-violet-500/20" />
          <InsightCard icon={<AlertTriangle className="h-4 w-4 text-amber-400" />} title="Common Mistake" text={createCommonMistake(exercise.target)} border="border-amber-500/20" />
          <InsightCard icon={<Shield className="h-4 w-4 text-emerald-400" />} title="Safety Note" text={createSafetyNote(exercise.equipment, exercise.bodyPart)} border="border-emerald-500/20" />
        </div>
      )}

      {/* Sticky CTA */}
      <div className="fixed bottom-16 left-0 right-0 z-10 mx-auto max-w-md px-4">
        <Link href="/builder" className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-accent py-3 text-sm font-medium text-white shadow-lg shadow-brand-accent/20">
          <Plus className="h-4 w-4" /> Add to Workout
        </Link>
      </div>
    </div>
  );
}

function Chip({ children, color }: { children: React.ReactNode; color: "violet" | "blue" | "default" | "green" | "orange" }) {
  const cls = {
    violet: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    blue: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    green: "bg-green-500/10 text-green-300 border-green-500/20",
    orange: "bg-orange-500/10 text-orange-300 border-orange-500/20",
    default: "bg-white/10 text-white/70 border-white/10",
  }[color];
  return <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cls}`}>{children}</span>;
}

function InsightCard({ icon, title, text, border }: { icon: React.ReactNode; title: string; text: string; border: string }) {
  return (
    <div className={`rounded-xl border ${border} bg-white/[0.03] p-4`}>
      <div className="flex items-center gap-2 mb-1.5">
        {icon}
        <h3 className="text-xs font-medium text-white/80">{title}</h3>
      </div>
      <p className="text-sm text-white/60 leading-relaxed">{text}</p>
    </div>
  );
}
