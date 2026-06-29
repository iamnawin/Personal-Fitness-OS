import {
  FitnessProfile,
  EquipmentPreferences,
  WeeklyPlan,
  PlanDay,
  PlanExercise,
} from "./types";

// Minimal exercise pool for Phase 1 (exercises.json will replace this in Phase 2)
const EXERCISE_POOL: { name: string; bodyPart: string; target: string; equipment: string }[] = [
  { name: "Push-ups", bodyPart: "chest", target: "pectorals", equipment: "body weight" },
  { name: "Pull-ups", bodyPart: "back", target: "lats", equipment: "body weight" },
  { name: "Squats", bodyPart: "upper legs", target: "quads", equipment: "body weight" },
  { name: "Lunges", bodyPart: "upper legs", target: "quads", equipment: "body weight" },
  { name: "Plank", bodyPart: "waist", target: "abs", equipment: "body weight" },
  { name: "Burpees", bodyPart: "cardio", target: "cardiovascular system", equipment: "body weight" },
  { name: "Mountain Climbers", bodyPart: "cardio", target: "cardiovascular system", equipment: "body weight" },
  { name: "Glute Bridge", bodyPart: "upper legs", target: "glutes", equipment: "body weight" },
  { name: "Dumbbell Rows", bodyPart: "back", target: "lats", equipment: "dumbbell" },
  { name: "Dumbbell Bench Press", bodyPart: "chest", target: "pectorals", equipment: "dumbbell" },
  { name: "Dumbbell Shoulder Press", bodyPart: "shoulders", target: "delts", equipment: "dumbbell" },
  { name: "Dumbbell Bicep Curls", bodyPart: "upper arms", target: "biceps", equipment: "dumbbell" },
  { name: "Dumbbell Lunges", bodyPart: "upper legs", target: "quads", equipment: "dumbbell" },
  { name: "Barbell Squat", bodyPart: "upper legs", target: "quads", equipment: "barbell" },
  { name: "Barbell Deadlift", bodyPart: "back", target: "spine", equipment: "barbell" },
  { name: "Barbell Bench Press", bodyPart: "chest", target: "pectorals", equipment: "barbell" },
  { name: "Lat Pulldown", bodyPart: "back", target: "lats", equipment: "cable" },
  { name: "Cable Flyes", bodyPart: "chest", target: "pectorals", equipment: "cable" },
  { name: "Leg Press", bodyPart: "upper legs", target: "quads", equipment: "leverage machine" },
  { name: "Leg Curl", bodyPart: "upper legs", target: "hamstrings", equipment: "leverage machine" },
];

const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function filterExercises(equipment: EquipmentPreferences) {
  const eqSet = new Set(equipment.available.map((e) => e.toLowerCase()));
  eqSet.add("body weight"); // always available
  return EXERCISE_POOL.filter(
    (ex) =>
      eqSet.has(ex.equipment.toLowerCase()) &&
      !equipment.excludedBodyParts.includes(ex.bodyPart) &&
      !equipment.excludedExercises.some((n) => ex.name.toLowerCase().includes(n.toLowerCase()))
  );
}

function pickExercises(
  pool: typeof EXERCISE_POOL,
  focus: string[],
  count: number
): typeof EXERCISE_POOL {
  const focused = pool.filter((e) => focus.includes(e.bodyPart));
  const others = pool.filter((e) => !focus.includes(e.bodyPart));
  const picked = [...focused.slice(0, count), ...others.slice(0, Math.max(0, count - focused.length))];
  return picked.slice(0, count);
}

function buildPlanExercise(
  ex: (typeof EXERCISE_POOL)[0],
  profile: FitnessProfile
): PlanExercise {
  const isStrength = profile.goal === "strength";
  const isFatLoss = profile.goal === "fat_loss";
  return {
    exerciseId: ex.name.toLowerCase().replace(/\s+/g, "-"),
    name: ex.name,
    sets: isStrength ? 4 : 3,
    reps: isStrength ? "5" : isFatLoss ? "12-15" : "8-12",
    restSeconds: isStrength ? 120 : isFatLoss ? 45 : 60,
    equipment: ex.equipment,
    target: ex.target,
  };
}

function getSplitFocus(profile: FitnessProfile, dayIndex: number): string[] {
  if (profile.daysPerWeek <= 3) {
    // Full body
    return ["chest", "back", "upper legs", "shoulders", "waist"];
  }
  // Upper/Lower split
  if (dayIndex % 2 === 0) return ["chest", "back", "shoulders", "upper arms"];
  return ["upper legs", "waist", "cardio"];
}

function getCoachNote(profile: FitnessProfile): string {
  const goalNotes: Record<string, string> = {
    strength: "Focus on compound movements with heavier loads and longer rest.",
    muscle_gain: "Balanced volume across muscle groups for hypertrophy.",
    fat_loss: "Higher rep ranges with shorter rest to keep heart rate elevated.",
    general_fitness: "A balanced mix for overall health and functional fitness.",
    mobility: "Emphasis on bodyweight movements and flexibility work.",
  };
  return goalNotes[profile.goal] || "Plan tailored to your preferences.";
}

export function generatePlan(
  profile: FitnessProfile,
  equipment: EquipmentPreferences
): WeeklyPlan {
  const pool = filterExercises(equipment);
  const exercisesPerDay = Math.min(pool.length, profile.sessionMinutes <= 30 ? 4 : 6);

  let workoutDayCount = 0;
  const days: PlanDay[] = DAY_LABELS.map((label, i) => {
    const isRest = workoutDayCount >= profile.daysPerWeek;
    if (isRest) {
      return { day: i + 1, label, isRest: true, exercises: [] };
    }
    workoutDayCount++;
    const focus = getSplitFocus(profile, workoutDayCount - 1);
    const picked = pickExercises(pool, focus, exercisesPerDay);
    return {
      day: i + 1,
      label,
      isRest: false,
      focus: focus.slice(0, 2).join(" & "),
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
