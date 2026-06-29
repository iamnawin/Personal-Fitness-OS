// TODO: Bundle optimization — exercises.json (~6.5MB) is bundled client-side (~800KB gzipped).
// Future options: code-splitting, lazy loading, indexed search (e.g. Fuse.js),
// remote dataset via API, or static generation with search index.
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
  const q = query.toLowerCase().trim();
  const terms = q ? expandSynonyms(q) : [];

  return exercises.filter((ex) => {
    if (filters.bodyPart && ex.bodyPart !== filters.bodyPart) return false;
    if (filters.target && ex.target !== filters.target) return false;
    if (filters.equipment && ex.equipment !== filters.equipment) return false;
    if (terms.length > 0) {
      const hay = `${ex.name} ${ex.bodyPart} ${ex.target} ${ex.equipment} ${ex.secondaryMuscles.join(" ")}`.toLowerCase();
      return terms.some((t) => hay.includes(t));
    }
    return true;
  });
}

const SEARCH_SYNONYMS: Record<string, string[]> = {
  belly: ["abs", "core", "waist", "abdominals"],
  stomach: ["abs", "core", "waist"],
  "six pack": ["abs", "core", "waist"],
  arms: ["biceps", "triceps", "forearms", "upper arms", "lower arms"],
  butt: ["glutes", "glute"],
  thighs: ["quads", "hamstrings", "upper legs"],
  legs: ["quads", "hamstrings", "glutes", "calves", "upper legs", "lower legs"],
  chest: ["pectorals", "push up", "bench", "chest"],
  back: ["lats", "traps", "row", "pulldown", "back"],
  home: ["body weight", "bodyweight"],
  "no equipment": ["body weight"],
  beginner: ["body weight", "assisted", "leverage machine"],
  shoulder: ["delts", "shoulders"],
  stretch: ["stretch", "mobility"],
  mobility: ["stretch", "mobility"],
  core: ["abs", "obliques", "waist"],
};

function expandSynonyms(query: string): string[] {
  const terms = [query];
  for (const [key, synonyms] of Object.entries(SEARCH_SYNONYMS)) {
    if (query.includes(key)) {
      terms.push(...synonyms);
    }
  }
  return terms;
}

export function getBeginnerExercises(): Exercise[] {
  const beginnerEquipment = ["body weight", "assisted", "leverage machine"];
  return exercises
    .filter((ex) => beginnerEquipment.includes(ex.equipment))
    .slice(0, 12);
}
