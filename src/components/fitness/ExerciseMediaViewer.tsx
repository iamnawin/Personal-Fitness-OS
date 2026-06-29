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
    <div className="overflow-hidden rounded-xl bg-white/5 border border-white/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={media.url}
        alt={exercise.name}
        className="w-full object-contain"
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
}
