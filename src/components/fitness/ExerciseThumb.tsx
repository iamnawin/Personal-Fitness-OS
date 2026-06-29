"use client";

import { useState } from "react";
import { Dumbbell } from "lucide-react";

export function ExerciseThumb({ gifUrl, name, size = "sm" }: { gifUrl?: string; name: string; size?: "sm" | "md" }) {
  const [error, setError] = useState(false);
  const cls = size === "md" ? "h-12 w-12" : "h-9 w-9";

  if (!gifUrl || error) {
    return (
      <div className={`${cls} flex shrink-0 items-center justify-center rounded-lg bg-white/10`}>
        <Dumbbell className="h-4 w-4 text-white/30" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={gifUrl}
      alt={name}
      className={`${cls} shrink-0 rounded-lg object-cover bg-[#0f0d2e]`}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
