import { Dumbbell } from "lucide-react";

export function MediaPlaceholder({ name }: { name?: string }) {
  return (
    <div className="flex aspect-square w-full flex-col items-center justify-center rounded-xl bg-white/5 border border-white/10">
      <Dumbbell className="h-12 w-12 text-white/20" />
      {name && <p className="mt-2 text-xs text-white/30 text-center px-4">{name}</p>}
    </div>
  );
}
