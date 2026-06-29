const BODY_PART_LABELS: Record<string, string> = {
  waist: "Core / Abs",
  "upper legs": "Legs",
  back: "Back",
  chest: "Chest",
  "lower legs": "Calves",
  shoulders: "Shoulders",
  "upper arms": "Arms",
  "lower arms": "Forearms",
  cardio: "Cardio",
  neck: "Neck",
};

const MUSCLE_LABELS: Record<string, string> = {
  abs: "Abs",
  quads: "Front Thighs",
  hamstrings: "Back Thighs",
  glutes: "Glutes",
  pectorals: "Chest",
  lats: "Back / Lats",
  delts: "Shoulders",
  biceps: "Biceps",
  triceps: "Triceps",
  traps: "Traps",
  calves: "Calves",
  forearms: "Forearms",
  obliques: "Obliques",
  spine: "Lower Back",
  serratus_anterior: "Serratus",
  adductors: "Inner Thighs",
  abductors: "Outer Thighs",
  "hip flexors": "Hip Flexors",
  "cardiovascular system": "Cardio",
  "upper back": "Upper Back",
  levator_scapulae: "Neck / Traps",
};

const EQUIPMENT_LABELS: Record<string, string> = {
  "body weight": "Bodyweight",
  dumbbell: "Dumbbells",
  barbell: "Barbell",
  cable: "Cable Machine",
  "leverage machine": "Machine",
  band: "Resistance Band",
  kettlebell: "Kettlebell",
  "medicine ball": "Medicine Ball",
  "stability ball": "Stability Ball",
  "olympic barbell": "Olympic Barbell",
  "ez barbell": "EZ Barbell",
  rope: "Rope",
  roller: "Foam Roller",
  "bosu ball": "Bosu Ball",
  assisted: "Assisted",
  weighted: "Weighted",
  "smith machine": "Smith Machine",
  tire: "Tire",
  trap_bar: "Trap Bar",
  sled_machine: "Sled Machine",
  "upper body ergometer": "Ergometer",
  elliptical_machine: "Elliptical",
  stationary_bike: "Stationary Bike",
  stepmill_machine: "Stepmill",
  skierg_machine: "SkiErg",
  hammer: "Hammer",
  wheel_roller: "Ab Wheel",
};

export function getBodyPartLabel(raw: string): string {
  return BODY_PART_LABELS[raw.toLowerCase()] || capitalize(raw);
}

export function getMuscleLabel(raw: string): string {
  return MUSCLE_LABELS[raw.toLowerCase()] || capitalize(raw);
}

export function getEquipmentLabel(raw: string): string {
  return EQUIPMENT_LABELS[raw.toLowerCase()] || capitalize(raw);
}

export function createSimpleDescription(name: string, target: string, bodyPart: string): string {
  return `${capitalize(name)} targets your ${getMuscleLabel(target).toLowerCase()} in the ${getBodyPartLabel(bodyPart).toLowerCase()} area.`;
}

export function createUsefulFor(target: string, bodyPart: string): string[] {
  const tags: string[] = [];
  const t = target.toLowerCase();
  if (["quads", "glutes", "hamstrings"].includes(t)) tags.push("Lower body strength");
  if (["pectorals", "delts", "triceps"].includes(t)) tags.push("Upper body pushing");
  if (["lats", "biceps", "traps"].includes(t)) tags.push("Upper body pulling");
  if (["abs", "obliques"].includes(t)) tags.push("Core stability");
  if (t === "cardiovascular system") tags.push("Cardio endurance");
  tags.push(`${getBodyPartLabel(bodyPart)} development`);
  return tags;
}

export function createBeginnerNote(equipment: string): string {
  const eq = equipment.toLowerCase();
  if (eq === "body weight") return "Great for beginners — no equipment needed.";
  if (eq === "dumbbell") return "Start with light dumbbells to learn proper form.";
  if (eq === "barbell") return "Practice the movement with an empty bar first.";
  if (["cable", "leverage machine"].includes(eq)) return "Machine guides the movement — good for learning.";
  return "Start light and focus on form before adding weight.";
}

export function createFormFocus(target: string): string {
  const t = target.toLowerCase();
  if (["abs", "obliques"].includes(t)) return "Keep your core engaged throughout. Avoid using momentum.";
  if (["quads", "glutes"].includes(t)) return "Keep your knees tracking over your toes. Drive through your heels.";
  if (t === "pectorals") return "Keep shoulders back and down. Control the movement.";
  if (t === "lats") return "Initiate the pull with your back, not your arms.";
  if (t === "delts") return "Avoid swinging. Keep controlled through full range.";
  return "Move with control. Full range of motion over heavy weight.";
}

export function createCommonMistake(target: string): string {
  const t = target.toLowerCase();
  if (["abs", "obliques"].includes(t)) return "Using neck to pull up instead of engaging abs.";
  if (["quads", "glutes"].includes(t)) return "Letting knees cave inward or rounding the lower back.";
  if (t === "pectorals") return "Flaring elbows too wide, which stresses the shoulders.";
  if (t === "lats") return "Using biceps to pull instead of engaging the back first.";
  if (t === "delts") return "Using too much weight and swinging for momentum.";
  return "Rushing reps and sacrificing form for speed.";
}

export function createSafetyNote(equipment: string, bodyPart: string): string {
  if (equipment.toLowerCase() === "barbell") return "Use a spotter for heavy sets. Secure collars on the bar.";
  if (bodyPart.toLowerCase() === "back") return "Keep a neutral spine. Stop if you feel sharp pain.";
  return "Stop if you feel pain (not normal muscle burn). Warm up first.";
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
