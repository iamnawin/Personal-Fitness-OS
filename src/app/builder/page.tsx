"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, Search } from "lucide-react";
import { searchExercises } from "@/lib/exercise-data";
import { getEquipmentLabel, getMuscleLabel } from "@/lib/exercise-enrichment";
import { saveCustomWorkout } from "@/lib/workout-storage";
import { CustomWorkoutItem, Exercise } from "@/lib/types";

export default function BuilderPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [items, setItems] = useState<CustomWorkoutItem[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => (query.length > 1 ? searchExercises(query, {}).slice(0, 20) : []), [query]);

  function addExercise(ex: Exercise) {
    setItems((prev) => [...prev, { exerciseId: ex.id, name: ex.name, sets: 3, reps: "10", restSeconds: 60 }]);
    setShowSearch(false);
    setQuery("");
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateItem(idx: number, field: keyof CustomWorkoutItem, value: string | number) {
    setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  }

  function save() {
    if (!name.trim() || items.length === 0) return;
    saveCustomWorkout({ id: crypto.randomUUID(), name: name.trim(), createdAt: new Date().toISOString(), exercises: items });
    router.push("/dashboard");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Workout Builder</h1>

      {/* Name */}
      <input
        type="text"
        placeholder="Workout name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand-accent"
      />

      {/* Exercise list */}
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white capitalize">{item.name}</span>
              <button onClick={() => removeItem(idx)} className="text-red-400/60 hover:text-red-400">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-white/40">Sets</label>
                <input type="number" min={1} value={item.sets} onChange={(e) => updateItem(idx, "sets", +e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-white/40">Reps</label>
                <input type="text" value={item.reps} onChange={(e) => updateItem(idx, "reps", e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-white/40">Rest (s)</label>
                <input type="number" min={0} value={item.restSeconds} onChange={(e) => updateItem(idx, "restSeconds", +e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white outline-none" />
              </div>
            </div>
            <input type="text" placeholder="Notes (optional)" value={item.notes || ""} onChange={(e) => updateItem(idx, "notes", e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/60 placeholder:text-white/30 outline-none" />
          </div>
        ))}
      </div>

      {/* Add exercise */}
      {showSearch ? (
        <div className="space-y-2 rounded-xl border border-brand-accent/30 bg-white/[0.03] p-3">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
            <input type="text" autoFocus placeholder="Search exercises..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 py-1.5 pl-7 pr-2 text-xs text-white placeholder:text-white/40 outline-none" />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {results.map((ex) => (
              <button key={ex.id} onClick={() => addExercise(ex)} className="w-full rounded-lg px-2 py-1.5 text-left text-xs text-white/80 hover:bg-white/10 capitalize">
                {ex.name} <span className="text-white/40">· {getMuscleLabel(ex.target)} · {getEquipmentLabel(ex.equipment)}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setShowSearch(false)} className="text-xs text-white/40 hover:text-white">Cancel</button>
        </div>
      ) : (
        <button onClick={() => setShowSearch(true)} className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/20 py-3 text-sm text-white/60 hover:border-brand-electric hover:text-brand-electric">
          <Plus className="h-4 w-4" /> Add Exercise
        </button>
      )}

      {/* Save */}
      <button onClick={save} disabled={!name.trim() || items.length === 0} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-accent py-3 text-sm font-medium text-white disabled:opacity-40">
        <Save className="h-4 w-4" /> Save Workout
      </button>
    </div>
  );
}
