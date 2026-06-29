export type FitnessGoal = "strength" | "muscle_gain" | "fat_loss" | "general_fitness" | "mobility";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type WorkoutLocation = "home" | "gym" | "mixed";

export type FitnessProfile = {
  goal: FitnessGoal;
  level: ExperienceLevel;
  daysPerWeek: number;
  sessionMinutes: number;
  location: WorkoutLocation;
  age?: number;
  weight?: number;
};

export type EquipmentPreferences = {
  available: string[];
  location: WorkoutLocation;
  excludedBodyParts: string[];
  excludedExercises: string[];
};

export type Exercise = {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  target: string;
  secondaryMuscles: string[];
  gifUrl?: string;
  instructions?: string[];
};

export type PlanExercise = {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  equipment: string;
  target: string;
};

export type PlanDay = {
  day: number;
  label: string;
  isRest: boolean;
  focus?: string;
  shortNote?: string;
  exercises: PlanExercise[];
};

export type WeeklyPlan = {
  id: string;
  createdAt: string;
  profile: FitnessProfile;
  equipment: EquipmentPreferences;
  days: PlanDay[];
  coachNote: string;
};

export type CustomWorkoutItem = {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes?: string;
};

export type CustomWorkout = {
  id: string;
  name: string;
  createdAt: string;
  exercises: CustomWorkoutItem[];
};

export type WorkoutLog = {
  id: string;
  date: string;
  planDayIndex?: number;
  customWorkoutId?: string;
  exercises: {
    exerciseId: string;
    name: string;
    setsCompleted: number;
    repsPerSet: number[];
  }[];
  durationMinutes: number;
};

export type StreakData = {
  current: number;
  longest: number;
  lastWorkoutDate: string | null;
};
