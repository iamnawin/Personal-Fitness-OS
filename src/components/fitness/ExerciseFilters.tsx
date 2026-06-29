"use client";

import { getBodyPartLabel, getMuscleLabel, getEquipmentLabel } from "@/lib/exercise-enrichment";

type Props = {
  options: { bodyParts: string[]; targets: string[]; equipment: string[] };
  filters: { bodyPart?: string; target?: string; equipment?: string };
  onChange: (filters: { bodyPart?: string; target?: string; equipment?: string }) => void;
};

export function ExerciseFilters({ options, filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <FilterSelect
        label="Body Part"
        value={filters.bodyPart || ""}
        options={options.bodyParts}
        labelFn={getBodyPartLabel}
        onSelect={(v) => onChange({ ...filters, bodyPart: v || undefined })}
      />
      <FilterSelect
        label="Target"
        value={filters.target || ""}
        options={options.targets}
        labelFn={getMuscleLabel}
        onSelect={(v) => onChange({ ...filters, target: v || undefined })}
      />
      <FilterSelect
        label="Equipment"
        value={filters.equipment || ""}
        options={options.equipment}
        labelFn={getEquipmentLabel}
        onSelect={(v) => onChange({ ...filters, equipment: v || undefined })}
      />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  labelFn,
  onSelect,
}: {
  label: string;
  value: string;
  options: string[];
  labelFn: (s: string) => string;
  onSelect: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onSelect(e.target.value)}
      className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white/80 outline-none"
      aria-label={label}
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {labelFn(o)}
        </option>
      ))}
    </select>
  );
}
