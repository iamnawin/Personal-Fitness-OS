import {
  FitnessProfile,
  EquipmentPreferences,
  WeeklyPlan,
  PlanDay,
  PlanExercise,
} from "./types";
import { getExercisesByFilter } from "./exercise-data";
import { Exercise } from "./types";

const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type DayTemplate = { focus: string; bodyParts: string[]; targets?: string[] };

function getDayTemplates(profile: FitnessProfile): DayTemplate[] {
  const { daysPerWeek, level } = profile;

  if (daysPerWeek <= 3) {
    if (level === "beginner") {
      return [
        { focus: "Full Body Basics", bodyParts: ["chest", "back", "upper legs", "waist"] },
        { focus: "Upper Body + Core", bodyParts: ["chest", "shoulders", "upper arms", "waist"] },
        { focus: "Lower Body + Mobility", bodyParts: ["upper legs", "lower legs", "waist"] },
      ];
    }
    return [
      { focus: "Push + Core", bodyParts: ["chest", "shoulders", "upper arms"], targets: ["pectorals", "delts", "triceps"] },
      { focus: "Pull + Core", bodyParts: ["back", "upper arms", "waist"], targets: ["lats", "biceps", "abs"] },
      { focus: "Legs + Conditioning", bodyParts: ["upper legs", "lower legs", "waist"] },
    ];
  }

  if (daysPerWeek === 4) {
    return [
      { focus: "Push Strength", bodyParts: ["chest", "shoulders"], targets: ["pectorals", "delts", "triceps"] },
      { focus: "Pull Strength", bodyParts: ["back", "upper arms"], targets: ["lats", "biceps", "traps"] },
      { focus: "Legs", bodyParts: ["upper legs", "lower legs"], targets: ["quads", "glutes", "hamstrings"] },
      { focus: "Core + Conditioning", bodyParts: ["waist", "cardio"], targets: ["abs", "obliques"] },
    ];
  }

  // 5+ days
  return [
    { focus: "Chest + Triceps", bodyParts: ["chest", "upper arms"], targets: ["pectorals", "triceps"] },
    { focus: "Back + Biceps", bodyParts: ["back", "upper arms"], targets: ["lats", "biceps", "traps"] },
    { focus: "Legs + Glutes", bodyParts: ["upper legs", "lower legs"], targets: ["quads", "glutes", "hamstrings", "calves"] },
    { focus: "Shoulders + Core", bodyParts: ["shoulders", "waist"], targets: ["delts", "abs"] },
    { focus: "Full Body + Conditioning", bodyParts: ["chest", "back", "upper legs", "waist"] },
  ];
}

function getAvailableEquipment(equipment: EquipmentPreferences): string[] {
  const eqSet = new Set(equipment.available.map((e) => e.toLowerCase()));
  eqSet.add("body weight");
  return Array.from(eqSet);
}

function pickForDay(template: DayTemplate, availableEq: string[], excludedBP: string[], count: number, usedIds: Set<string>): Exercise[] {
  const pool: Exercise[] = [];
  for (const bp of template.bodyParts) {
    if (excludedBP.includes(bp)) continue;
    const found = getExercisesByFilter({ bodyPart: bp, equipment: availableEq });
    pool.push(...found);
  }
  // Prefer exercises not yet used in other days
  const unused = pool.filter((e) => !usedIds.has(e.id));
  const source = unused.length >= count ? unused : pool;
  // Shuffle and pick
  const shuffled = source.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function buildPlanExercise(ex: Exercise, profile: FitnessProfile): PlanExercise {
  const isStrength = profile.goal === "strength";
  const isFatLoss = profile.goal === "fat_loss";
  return {
    exerciseId: ex.id,
    name: ex.name,
    sets: isStrength ? 4 : 3,
    reps: isStrength ? "5" : isFatLoss ? "12-15" : "8-12",
    restSeconds: isStrength ? 120 : isFatLoss ? 45 : 60,
    equipment: ex.equipment,
    target: ex.target,
  };
}

function getCoachNote(profile: FitnessProfile): string {
  const notes: Record<string, string> = {
    strength: "Focus on compound movements with heavier loads and longer rest.",
    muscle_gain: "Balanced volume across muscle groups for hypertrophy.",
    fat_loss: "Higher rep ranges with shorter rest to keep heart rate elevated.",
    general_fitness: "A balanced mix for overall health and functional fitness.",
    mobility: "Emphasis on bodyweight movements and flexibility work.",
  };
  return notes[profile.goal] || "Plan tailored to your preferences.";
}

export function generatePlan(profile: FitnessProfile, equipment: EquipmentPreferences): WeeklyPlan {
  const templates = getDayTemplates(profile);
  const availableEq = getAvailableEquipment(equipment);
  const exercisesPerDay = profile.sessionMinutes <= 30 ? 4 : profile.sessionMinutes <= 45 ? 5 : 6;
  const usedIds = new Set<string>();

  // Distribute workout days across the week
  const workoutSlots = getWorkoutSlots(profile.daysPerWeek);

  const days: PlanDay[] = DAY_LABELS.map((label, i) => {
    const templateIdx = workoutSlots.indexOf(i);
    if (templateIdx === -1) {
      return { day: i + 1, label, isRest: true, exercises: [] };
    }
    const template = templates[templateIdx % templates.length];
    const picked = pickForDay(template, availableEq, equipment.excludedBodyParts, exercisesPerDay, usedIds);
    picked.forEach((e) => usedIds.add(e.id));
    return {
      day: i + 1,
      label,
      isRest: false,
      focus: template.focus,
      exercises: picked.map((ex) => buildPlanExercise(ex, profile)),
    };
  });

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    profile,
    equipment,
    days,
    coachNote: getCoachNote(profile),
  };
}

function getWorkoutSlots(daysPerWeek: number): number[] {
  switch (daysPerWeek) {
    case 1: return [0];
    case 2: return [0, 3];
    case 3: return [0, 2, 4];
    case 4: return [0, 1, 3, 5];
    case 5: return [0, 1, 2, 4, 5];
    case 6: return [0, 1, 2, 3, 4, 5];
    default: return [0, 2, 4];
  }
}
