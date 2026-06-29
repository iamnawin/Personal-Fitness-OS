import {
  FitnessProfile,
  EquipmentPreferences,
  WeeklyPlan,
  WorkoutLog,
  CustomWorkout,
  StreakData,
  WeightEntry,
} from "./types";

const KEYS = {
  profile: "pfos:profile",
  equipment: "pfos:equipment",
  plan: "pfos:plan",
  logs: "pfos:logs",
  customWorkouts: "pfos:custom-workouts",
  streak: "pfos:streak",
  weightLog: "pfos:weight-log",
} as const;

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

// Profile
export function getProfile(): FitnessProfile | null {
  return getItem<FitnessProfile | null>(KEYS.profile, null);
}
export function saveProfile(p: FitnessProfile) {
  setItem(KEYS.profile, p);
}

// Equipment
export function getEquipment(): EquipmentPreferences | null {
  return getItem<EquipmentPreferences | null>(KEYS.equipment, null);
}
export function saveEquipment(e: EquipmentPreferences) {
  setItem(KEYS.equipment, e);
}

// Plan
export function getPlan(): WeeklyPlan | null {
  return getItem<WeeklyPlan | null>(KEYS.plan, null);
}
export function savePlan(p: WeeklyPlan) {
  setItem(KEYS.plan, p);
}

// Logs
export function getLogs(): WorkoutLog[] {
  return getItem<WorkoutLog[]>(KEYS.logs, []);
}
export function saveLog(log: WorkoutLog) {
  const logs = getLogs();
  logs.push(log);
  setItem(KEYS.logs, logs);
}

// Custom Workouts
export function getCustomWorkouts(): CustomWorkout[] {
  return getItem<CustomWorkout[]>(KEYS.customWorkouts, []);
}
export function saveCustomWorkout(w: CustomWorkout) {
  const all = getCustomWorkouts();
  all.push(w);
  setItem(KEYS.customWorkouts, all);
}

// Streak
export function getStreak(): StreakData {
  return getItem<StreakData>(KEYS.streak, { current: 0, longest: 0, lastWorkoutDate: null });
}
export function updateStreak() {
  const streak = getStreak();
  const today = new Date().toISOString().split("T")[0];
  if (streak.lastWorkoutDate === today) return;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (streak.lastWorkoutDate === yesterday) {
    streak.current += 1;
  } else {
    streak.current = 1;
  }
  streak.longest = Math.max(streak.longest, streak.current);
  streak.lastWorkoutDate = today;
  setItem(KEYS.streak, streak);
}

// Weight log
export function getWeightLog(): WeightEntry[] {
  return getItem<WeightEntry[]>(KEYS.weightLog, []);
}
export function saveWeightEntry(entry: WeightEntry) {
  const log = getWeightLog();
  log.push(entry);
  setItem(KEYS.weightLog, log);
}

// Clear all data
export function clearAllData() {
  if (typeof window === "undefined") return;
  Object.values(KEYS).forEach((key) => {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  });
}
