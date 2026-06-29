"use client";

import { useState } from "react";
import { Exercise } from "@/lib/types";
import { getPrimaryMedia } from "@/lib/media-utils";
import { MediaPlaceholder } from "./MediaPlaceholder";

export function ExerciseMediaViewer({ exercise }: { exercise: Exercise }) {
  const media = getPrimaryMedia(exercise);
  const [error, setError] = useState(false);

  if (media.type === "none" || error) {
    return <MediaPlaceholder name={exercise.name} />;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f0d2e]">
      <div className="flex items-center justify-center p-4" style={{ minHeight: "200px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.url}
          alt={exercise.name}
          className="max-h-80 w-auto object-contain rounded-lg"
          onError={() => setError(true)}
          loading="lazy"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0f0d2e] to-transparent" />
    </div>
  );
}
