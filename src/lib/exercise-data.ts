import rawExercises from "@/data/exercises.json";
import { Exercise } from "./types";

interface RawExercise {
  id: string;
  name: string;
  category?: string;
  body_part: string;
  equipment: string;
  instructions?: { en?: string };
  instruction_steps?: { en?: string[] };
  muscle_group?: string;
  secondary_muscles?: string[];
  target: string;
  image?: string;
  gif_url?: string;
}

const GITHUB_BASE = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/";

function resolveMediaUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return GITHUB_BASE + path;
}

const exercises: Exercise[] = (rawExercises as RawExercise[]).map((raw) => ({
  id: raw.id,
  name: raw.name,
  bodyPart: raw.body_part,
  equipment: raw.equipment,
  target: raw.target,
  secondaryMuscles: raw.secondary_muscles || [],
  gifUrl: resolveMediaUrl(raw.gif_url),
  instructions: raw.instruction_steps?.en,
}));

export function getAllExercises(): Exercise[] {
  return exercises;
}

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}

export function getFilterOptions() {
  const bodyParts = new Set<string>();
  const targets = new Set<string>();
  const equipment = new Set<string>();

  for (const ex of exercises) {
    bodyParts.add(ex.bodyPart);
    targets.add(ex.target);
    equipment.add(ex.equipment);
  }

  return {
    bodyParts: Array.from(bodyParts).sort(),
    targets: Array.from(targets).sort(),
    equipment: Array.from(equipment).sort(),
  };
}

export function searchExercises(
  query: string,
  filters: { bodyPart?: string; target?: string; equipment?: string }
): Exercise[] {
  const q = query.toLowerCase();
  return exercises.filter((ex) => {
    if (filters.bodyPart && ex.bodyPart !== filters.bodyPart) return false;
    if (filters.target && ex.target !== filters.target) return false;
    if (filters.equipment && ex.equipment !== filters.equipment) return false;
    if (q && !ex.name.toLowerCase().includes(q) && !ex.target.toLowerCase().includes(q) && !ex.bodyPart.toLowerCase().includes(q) && !ex.equipment.toLowerCase().includes(q)) return false;
    return true;
  });
}
