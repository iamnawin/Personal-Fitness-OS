import { Exercise } from "./types";

export function getPrimaryMedia(exercise: Exercise): { type: "gif" | "image" | "none"; url?: string } {
  if (exercise.gifUrl) return { type: "gif", url: exercise.gifUrl };
  return { type: "none" };
}

export function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}
