"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { searchExercises, getBeginnerExercises, getAllExercises } from "@/lib/exercise-data";
import { ExerciseCard } from "@/components/fitness/ExerciseCard";

const PAGE_SIZE = 24;

const QUICK_CHIPS = ["Beginner", "Home", "Bodyweight", "Dumbbells", "Chest", "Core", "Legs", "Back", "Mobility"];

const BODY_AREAS = [
  { label: "Chest", filter: { bodyPart: "chest" } },
  { label: "Back", filter: { bodyPart: "back" } },
  { label: "Shoulders", filter: { bodyPart: "shoulders" } },
  { label: "Arms", filter: { bodyPart: "upper arms" } },
  { label: "Core / Abs", filter: { bodyPart: "waist" } },
  { label: "Legs", filter: { bodyPart: "upper legs" } },
  { label: "Glutes", filter: { target: "glutes" } },
  { label: "Calves", filter: { bodyPart: "lower legs" } },
];

const EQUIPMENT = [
  { label: "Bodyweight", filter: { equipment: "body weight" } },
  { label: "Dumbbells", filter: { equipment: "dumbbell" } },
  { label: "Barbell", filter: { equipment: "barbell" } },
  { label: "Cable", filter: { equipment: "cable" } },
  { label: "Machine", filter: { equipment: "leverage machine" } },
  { label: "Band", filter: { equipment: "band" } },
  { label: "Kettlebell", filter: { equipment: "kettlebell" } },
  { label: "Assisted", filter: { equipment: "assisted" } },
];

type FilterState = { bodyPart?: string; target?: string; equipment?: string };

export default function ExercisesPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterState>({});
  const [activeLabel, setActiveLabel] = useState("");
  const [shown, setShown] = useState(PAGE_SIZE);

  const isFiltering = query.length > 0 || Object.keys(activeFilter).length > 0;

  const results = useMemo(() => {
    if (isFiltering) return searchExercises(query, activeFilter);
    return [];
  }, [query, activeFilter, isFiltering]);

  const beginnerExercises = useMemo(() => getBeginnerExercises(), []);
  const previewExercises = useMemo(() => getAllExercises().slice(0, 12), []);

  function handleChip(chip: string) {
    setShown(PAGE_SIZE);
    setActiveLabel(chip);
    const lower = chip.toLowerCase();
    if (["beginner", "home", "mobility"].includes(lower)) {
      setQuery(lower);
      setActiveFilter({});
    } else if (lower === "bodyweight") {
      setQuery("");
      setActiveFilter({ equipment: "body weight" });
    } else if (lower === "dumbbells") {
      setQuery("");
      setActiveFilter({ equipment: "dumbbell" });
    } else if (lower === "chest") {
      setQuery("");
      setActiveFilter({ bodyPart: "chest" });
    } else if (lower === "core") {
      setQuery("core");
      setActiveFilter({});
    } else if (lower === "legs") {
      setQuery("");
      setActiveFilter({ bodyPart: "upper legs" });
    } else if (lower === "back") {
      setQuery("");
      setActiveFilter({ bodyPart: "back" });
    }
  }

  function handleTile(label: string, filter: FilterState) {
    setShown(PAGE_SIZE);
    setActiveLabel(label);
    setQuery("");
    setActiveFilter(filter);
  }

  function clearFilter() {
    setQuery("");
    setActiveFilter({});
    setActiveLabel("");
    setShown(PAGE_SIZE);
  }

  // Filtered results mode
  if (isFiltering) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">{activeLabel || "Results"}</h1>
          <button onClick={clearFilter} className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-xs text-white/60 hover:text-white">
            <X className="h-3 w-3" /> Clear
          </button>
        </div>

        {/* Search in filtered mode */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Refine search..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShown(PAGE_SIZE); }}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand-accent"
          />
        </div>

        <p className="text-xs text-white/40">{results.length} exercises found</p>

        <div className="space-y-2">
          {results.slice(0, shown).map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>

        {shown < results.length && (
          <button onClick={() => setShown((s) => s + PAGE_SIZE)} className="w-full rounded-xl border border-white/10 py-2.5 text-sm text-white/60 hover:border-brand-electric hover:text-brand-electric">
            Load more ({results.length - shown} remaining)
          </button>
        )}
      </div>
    );
  }

  // Default discovery mode
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Exercise Library</h1>
        <p className="text-sm text-white/50">
          {getAllExercises().length.toLocaleString()} exercises in library · Beginner-friendly shown first
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          placeholder="Search chest, abs, dumbbell, home, beginner..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveLabel(e.target.value); setShown(PAGE_SIZE); }}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-9 pr-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand-accent"
        />
      </div>

      {/* Quick chips */}
      <div className="flex flex-wrap gap-2">
        {QUICK_CHIPS.map((chip) => (
          <button key={chip} onClick={() => handleChip(chip)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:border-brand-electric hover:text-brand-electric transition-colors">
            {chip}
          </button>
        ))}
      </div>

      {/* Browse by Body Area */}
      <section>
        <h2 className="mb-3 text-sm font-medium text-white/50 uppercase tracking-wide">Browse by Body Area</h2>
        <div className="grid grid-cols-2 gap-2">
          {BODY_AREAS.map((area) => (
            <button key={area.label} onClick={() => handleTile(area.label, area.filter)} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left text-sm font-medium text-white/80 hover:border-brand-accent/50 hover:bg-white/[0.06] transition-colors">
              {area.label}
            </button>
          ))}
        </div>
      </section>

      {/* Browse by Equipment */}
      <section>
        <h2 className="mb-3 text-sm font-medium text-white/50 uppercase tracking-wide">Browse by Equipment</h2>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT.map((eq) => (
            <button key={eq.label} onClick={() => handleTile(eq.label, eq.filter)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:border-brand-electric hover:text-brand-electric transition-colors">
              {eq.label}
            </button>
          ))}
        </div>
      </section>

      {/* Beginner Recommended */}
      <section>
        <h2 className="mb-3 text-sm font-medium text-white/50 uppercase tracking-wide">Beginner Friendly</h2>
        <div className="space-y-2">
          {beginnerExercises.slice(0, 8).map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
      </section>

      {/* Preview All */}
      <section>
        <h2 className="mb-3 text-sm font-medium text-white/50 uppercase tracking-wide">All Exercises</h2>
        <div className="space-y-2">
          {previewExercises.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
        <button onClick={() => { setActiveLabel("All Exercises"); setActiveFilter({}); setQuery(" "); }} className="mt-3 w-full rounded-xl border border-white/10 py-2.5 text-sm text-white/60 hover:border-brand-electric hover:text-brand-electric">
          View All 1,324 Exercises →
        </button>
      </section>
    </div>
  );
}
