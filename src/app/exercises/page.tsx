"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { searchExercises, getFilterOptions } from "@/lib/exercise-data";
import { ExerciseCard } from "@/components/fitness/ExerciseCard";
import { ExerciseFilters } from "@/components/fitness/ExerciseFilters";

const PAGE_SIZE = 30;

export default function ExercisesPage() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<{ bodyPart?: string; target?: string; equipment?: string }>({});
  const [shown, setShown] = useState(PAGE_SIZE);

  const options = useMemo(() => getFilterOptions(), []);
  const results = useMemo(() => searchExercises(query, filters), [query, filters]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Exercise Library</h1>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          placeholder="Search exercises..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShown(PAGE_SIZE); }}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand-accent"
        />
      </div>

      {/* Filters */}
      <ExerciseFilters options={options} filters={filters} onChange={(f) => { setFilters(f); setShown(PAGE_SIZE); }} />

      {/* Results count */}
      <p className="text-xs text-white/40">{results.length} exercises found</p>

      {/* Exercise list */}
      <div className="space-y-2">
        {results.slice(0, shown).map((ex) => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}
      </div>

      {shown < results.length && (
        <button
          onClick={() => setShown((s) => s + PAGE_SIZE)}
          className="w-full rounded-xl border border-white/10 py-2 text-sm text-white/60 hover:border-brand-electric"
        >
          Load more ({results.length - shown} remaining)
        </button>
      )}
    </div>
  );
}
