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

// Maps target muscle → body part for excluded body part checks
const TARGET_TO_BODYPART: Record<string, string> = {
  pectorals: "chest",
  lats: "back",
  traps: "back",
  "upper back": "back",
  delts: "shoulders",
  biceps: "upper arms",
  triceps: "upper arms",
  forearms: "lower arms",
  abs: "waist",
  obliques: "waist",
  spine: "waist",
  quads: "upper legs",
  glutes: "upper legs",
  hamstrings: "upper legs",
  adductors: "upper legs",
  abductors: "upper legs",
  calves: "lower legs",
  "cardiovascular system": "cardio",
};

// Equipment safe for beginners
const BEGINNER_SAFE_EQ = new Set([
  "body weight", "dumbbell", "assisted", "band", "stability ball", "medicine ball",
]);

// Name patterns that indicate advanced/risky exercises to avoid for beginners
const ADVANCED_FRAGMENTS = [
  "one-arm", "single arm", "pistol", "nordic", "handstand", "muscle up",
  "muscle-up", "turkish", "snatch", "clean", "jerk", "plyo", "plyometric",
  "jumping", "explosive", "weighted", "loaded",
];

function filterBeginnerSafe(pool: Exercise[]): Exercise[] {
  return pool.filter((e) => {
    if (!BEGINNER_SAFE_EQ.has(e.equipment.toLowerCase())) return false;
    const n = e.name.toLowerCase();
    return !ADVANCED_FRAGMENTS.some((f) => n.includes(f));
  });
}

// Each slot specifies ordered target muscles to try (first match wins)
type MuscleSlot = { targets: string[] };

type DayTemplate = {
  focus: string;
  shortNote: string;
  slots: MuscleSlot[];
};

// ---- 3-DAY BEGINNER ----
const BEGINNER_3DAY: DayTemplate[] = [
  {
    focus: "Full Body Basics",
    shortNote: "Train your whole body with safe, simple movements. Great start to the week.",
    slots: [
      { targets: ["quads", "glutes"] },
      { targets: ["pectorals"] },
      { targets: ["lats", "traps"] },
      { targets: ["abs", "obliques"] },
      { targets: ["calves"] },
      { targets: ["delts"] },
    ],
  },
  {
    focus: "Upper Body + Core",
    shortNote: "Push and pull movements for chest, back, shoulders, and arms.",
    slots: [
      { targets: ["pectorals"] },
      { targets: ["lats"] },
      { targets: ["delts"] },
      { targets: ["biceps"] },
      { targets: ["abs"] },
      { targets: ["triceps"] },
    ],
  },
  {
    focus: "Lower Body + Mobility",
    shortNote: "Legs, glutes, and light stretching to round out your week.",
    slots: [
      { targets: ["quads"] },
      { targets: ["glutes"] },
      { targets: ["hamstrings"] },
      { targets: ["calves"] },
      { targets: ["abs", "obliques"] },
      { targets: ["adductors", "abductors"] },
    ],
  },
];

// ---- 3-DAY INTERMEDIATE / ADVANCED ----
const INTERMEDIATE_3DAY: DayTemplate[] = [
  {
    focus: "Push + Core",
    shortNote: "Chest, shoulders, triceps. Finish with a core exercise.",
    slots: [
      { targets: ["pectorals"] },
      { targets: ["pectorals"] },
      { targets: ["delts"] },
      { targets: ["triceps"] },
      { targets: ["abs", "obliques"] },
      { targets: ["delts"] },
    ],
  },
  {
    focus: "Pull + Core",
    shortNote: "Back, biceps, rear delts for a strong posterior chain.",
    slots: [
      { targets: ["lats"] },
      { targets: ["lats"] },
      { targets: ["traps", "upper back"] },
      { targets: ["biceps"] },
      { targets: ["abs"] },
      { targets: ["traps"] },
    ],
  },
  {
    focus: "Legs + Conditioning",
    shortNote: "Lower body compound movements. Balanced quad, glute, and calf work.",
    slots: [
      { targets: ["quads"] },
      { targets: ["quads"] },
      { targets: ["glutes", "hamstrings"] },
      { targets: ["hamstrings"] },
      { targets: ["calves"] },
      { targets: ["abs"] },
    ],
  },
];

// ---- 4-DAY BEGINNER ----
const BEGINNER_4DAY: DayTemplate[] = [
  {
    focus: "Full Body Strength",
    shortNote: "Start the week with basic movements for every muscle group.",
    slots: [
      { targets: ["quads", "glutes"] },
      { targets: ["pectorals"] },
      { targets: ["lats"] },
      { targets: ["delts"] },
      { targets: ["abs"] },
      { targets: ["calves"] },
    ],
  },
  {
    focus: "Core + Mobility",
    shortNote: "Strengthen your core and improve posture and flexibility.",
    slots: [
      { targets: ["abs"] },
      { targets: ["obliques"] },
      { targets: ["abs"] },
      { targets: ["glutes"] },
      { targets: ["spine", "abs"] },
      { targets: ["adductors", "calves"] },
    ],
  },
  {
    focus: "Upper Body",
    shortNote: "Push and pull for chest, back, shoulders, and arms.",
    slots: [
      { targets: ["pectorals"] },
      { targets: ["lats", "traps"] },
      { targets: ["delts"] },
      { targets: ["biceps"] },
      { targets: ["triceps"] },
      { targets: ["traps"] },
    ],
  },
  {
    focus: "Lower Body",
    shortNote: "Legs and glutes to finish the week strong. One calf, rest is quads and glutes.",
    slots: [
      { targets: ["quads"] },
      { targets: ["glutes"] },
      { targets: ["hamstrings"] },
      { targets: ["calves"] },
      { targets: ["abs", "obliques"] },
      { targets: ["adductors", "quads"] },
    ],
  },
];

// ---- 4-DAY INTERMEDIATE / ADVANCED ----
const INTERMEDIATE_4DAY: DayTemplate[] = [
  {
    focus: "Push",
    shortNote: "Chest, shoulders, and triceps. Focus on controlled pressing strength.",
    slots: [
      { targets: ["pectorals"] },
      { targets: ["pectorals"] },
      { targets: ["delts"] },
      { targets: ["delts"] },
      { targets: ["triceps"] },
      { targets: ["abs"] },
    ],
  },
  {
    focus: "Pull",
    shortNote: "Back, biceps, and rear delts. Build pulling strength and posture.",
    slots: [
      { targets: ["lats"] },
      { targets: ["lats"] },
      { targets: ["traps", "upper back"] },
      { targets: ["biceps"] },
      { targets: ["biceps"] },
      { targets: ["abs"] },
    ],
  },
  {
    focus: "Legs",
    shortNote: "Quads, hamstrings, glutes, then calves. One calf exercise — balanced leg day.",
    slots: [
      { targets: ["quads"] },
      { targets: ["quads"] },
      { targets: ["glutes"] },
      { targets: ["hamstrings"] },
      { targets: ["calves"] },
      { targets: ["abs"] },
    ],
  },
  {
    focus: "Core + Conditioning",
    shortNote: "Abs, obliques, and light full-body conditioning to end the week.",
    slots: [
      { targets: ["abs"] },
      { targets: ["obliques"] },
      { targets: ["abs"] },
      { targets: ["glutes", "quads"] },
      { targets: ["calves"] },
      { targets: ["obliques", "abs"] },
    ],
  },
];

// ---- 5-DAY ADVANCED ----
const ADVANCED_5DAY: DayTemplate[] = [
  {
    focus: "Push Strength",
    shortNote: "Heavy chest and shoulder pressing with tricep accessories.",
    slots: [
      { targets: ["pectorals"] },
      { targets: ["pectorals"] },
      { targets: ["delts"] },
      { targets: ["delts"] },
      { targets: ["triceps"] },
      { targets: ["triceps"] },
    ],
  },
  {
    focus: "Pull Strength",
    shortNote: "Heavy vertical and horizontal pulling with bicep work.",
    slots: [
      { targets: ["lats"] },
      { targets: ["lats"] },
      { targets: ["traps"] },
      { targets: ["traps", "upper back"] },
      { targets: ["biceps"] },
      { targets: ["biceps"] },
    ],
  },
  {
    focus: "Legs",
    shortNote: "Full leg day: quads, glutes, hamstrings, then calves.",
    slots: [
      { targets: ["quads"] },
      { targets: ["quads"] },
      { targets: ["glutes", "hamstrings"] },
      { targets: ["hamstrings"] },
      { targets: ["calves"] },
      { targets: ["abs"] },
    ],
  },
  {
    focus: "Upper Hypertrophy",
    shortNote: "Volume day — chest, back, shoulders, arms for muscle growth.",
    slots: [
      { targets: ["pectorals"] },
      { targets: ["lats"] },
      { targets: ["delts"] },
      { targets: ["biceps"] },
      { targets: ["triceps"] },
      { targets: ["traps"] },
    ],
  },
  {
    focus: "Core + Conditioning",
    shortNote: "Abs, obliques, glutes, and light conditioning to finish the week.",
    slots: [
      { targets: ["abs"] },
      { targets: ["obliques"] },
      { targets: ["abs"] },
      { targets: ["glutes"] },
      { targets: ["calves", "cardiovascular system"] },
      { targets: ["obliques", "abs"] },
    ],
  },
];

function getDayTemplates(profile: FitnessProfile): DayTemplate[] {
  const { daysPerWeek, level } = profile;
  if (daysPerWeek <= 3) return level === "beginner" ? BEGINNER_3DAY : INTERMEDIATE_3DAY;
  if (daysPerWeek === 4) return level === "beginner" ? BEGINNER_4DAY : INTERMEDIATE_4DAY;
  return ADVANCED_5DAY;
}

function getAvailableEquipment(equipment: EquipmentPreferences): string[] {
  const eqSet = new Set(equipment.available.map((e) => e.toLowerCase()));
  eqSet.add("body weight");
  return Array.from(eqSet);
}

function pickSlotsForDay(
  template: DayTemplate,
  availableEq: string[],
  excludedBP: string[],
  exerciseCount: number,
  usedIds: Set<string>,
  isBeginnerPlan: boolean
): Exercise[] {
  const selected: Exercise[] = [];
  // Always try at least 4 slots even if exerciseCount < 4 (ensures variety)
  const slotsToUse = template.slots.slice(0, Math.max(exerciseCount, 4));

  for (const slot of slotsToUse) {
    if (selected.length >= exerciseCount) break;

    for (const target of slot.targets) {
      const bp = TARGET_TO_BODYPART[target];
      if (bp && excludedBP.includes(bp)) break; // this slot's body part is excluded

      let pool = getExercisesByFilter({ target, equipment: availableEq });

      // For beginners: prefer safe exercises, fall back to full pool if < 3 results
      if (isBeginnerPlan) {
        const safe = filterBeginnerSafe(pool);
        if (safe.length >= 3) pool = safe;
      }

      // Prefer exercises not used in other days this week
      const unused = pool.filter((e) => !usedIds.has(e.id));
      const candidates = unused.length > 0 ? unused : pool;

      if (candidates.length > 0) {
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        selected.push(pick);
        usedIds.add(pick.id);
        break; // slot filled, move to next slot
      }
    }
  }

  return selected;
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
  const levelLabel =
    profile.level === "beginner" ? "beginners"
    : profile.level === "intermediate" ? "intermediate athletes"
    : "advanced athletes";
  const goalNote: Record<string, string> = {
    strength: "Compound movements with heavier loads and longer rest periods.",
    muscle_gain: "Balanced volume with moderate rest to support muscle growth.",
    fat_loss: "Higher rep ranges with shorter rest to keep your heart rate elevated.",
    general_fitness: "A balanced mix of movements for overall health and fitness.",
    mobility: "Bodyweight movements with a focus on mobility and flexibility.",
  };
  return `${profile.daysPerWeek}-day plan for ${levelLabel}. ${goalNote[profile.goal] || "Plan tailored to your preferences and goals."}`;
}

// Returns true if every workout day has at least one exercise
export function isValidPlan(plan: WeeklyPlan): boolean {
  const workoutDays = plan.days.filter((d) => !d.isRest);
  if (workoutDays.length === 0) return false;
  return workoutDays.every((d) => d.exercises.length > 0);
}

export function generatePlan(profile: FitnessProfile, equipment: EquipmentPreferences): WeeklyPlan {
  const templates = getDayTemplates(profile);
  const availableEq = getAvailableEquipment(equipment);
  const exercisesPerDay = profile.sessionMinutes <= 30 ? 4 : profile.sessionMinutes <= 45 ? 5 : 6;
  const isBeginnerPlan = profile.level === "beginner";
  const usedIds = new Set<string>();

  const workoutSlots = getWorkoutSlots(profile.daysPerWeek);

  const days: PlanDay[] = DAY_LABELS.map((label, i) => {
    const templateIdx = workoutSlots.indexOf(i);
    if (templateIdx === -1) {
      return { day: i + 1, label, isRest: true, exercises: [] };
    }
    const template = templates[templateIdx % templates.length];
    const picked = pickSlotsForDay(
      template, availableEq, equipment.excludedBodyParts,
      exercisesPerDay, usedIds, isBeginnerPlan
    );
    return {
      day: i + 1,
      label,
      isRest: false,
      focus: template.focus,
      shortNote: template.shortNote,
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
