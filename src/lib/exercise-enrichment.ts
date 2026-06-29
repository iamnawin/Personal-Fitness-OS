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

// Plain-English explanation of what the target muscle does (Indian-friendly)
export function getSimpleTargetExplanation(target: string): string {
  const t = target.toLowerCase();
  const map: Record<string, string> = {
    quads: "Front of your thighs. Helps you stand, walk, climb stairs, and squat.",
    glutes: "Your backside muscles. Very important for strong legs and a stable lower body.",
    hamstrings: "Back of your thighs. Helps with bending your knees and lifting from the floor.",
    calves: "Back of your lower legs. Helps you walk, run, and stand on your toes.",
    pectorals: "Your chest muscles. Used in all pushing movements like push-ups and pressing.",
    lats: "The big muscles on the sides of your back. Makes your back wider and stronger.",
    traps: "Upper back and neck area. Keeps your shoulders stable and helps with posture.",
    "upper back": "Middle and upper back muscles. Very important for good upright posture.",
    delts: "Your shoulder muscles. Needed for lifting your arms up and to the sides.",
    biceps: "Front of your upper arm. Used in pulling and curling movements.",
    triceps: "Back of your upper arm. Used in pushing and pressing movements.",
    abs: "Your stomach muscles. Protects your spine and keeps your core stable.",
    obliques: "Side stomach muscles. Helps you twist, turn, and bend sideways.",
    spine: "Muscles along your lower back. Very important for posture and back health.",
    forearms: "Lower arm and wrist muscles. Improves grip strength for everyday tasks.",
    adductors: "Inner thigh muscles. Keeps your legs stable during squats and walking.",
    abductors: "Outer hip muscles. Helps with side movements and hip stability.",
    "cardiovascular system": "Your heart and lungs. Improves stamina, endurance, and overall fitness.",
    "hip flexors": "Front of your hip. Helps you lift your legs and stay mobile.",
    serratus_anterior: "Side chest muscles. Helps with shoulder stability and pressing.",
  };
  return map[t] || `${getMuscleLabel(t)} muscles — trains this area for strength and stability.`;
}

// Simple step-by-step "how to" in plain Indian English
export function getBeginnerHowTo(target: string, equipment: string): string {
  const t = target.toLowerCase();
  const eq = equipment.toLowerCase();
  if (t === "quads" && eq === "body weight")
    return "Stand with feet shoulder-width apart. Slowly bend your knees and sit back like you are sitting on a chair. Keep your back straight and chest open. Push through your heels to stand back up.";
  if (t === "pectorals" && eq === "body weight")
    return "Get into push-up position with hands slightly wider than shoulders. Lower your chest slowly to the floor. Push back up. Keep your body in a straight line from head to heel.";
  if (t === "pectorals" && eq === "dumbbell")
    return "Lie on your back. Hold dumbbells above your chest with arms slightly bent. Lower them out to the sides slowly. Press back up. Keep movements controlled.";
  if (t === "lats" && eq === "dumbbell")
    return "Hold a dumbbell and lean slightly forward at the hips. Pull the dumbbell up towards your waist while squeezing your back muscles. Lower it slowly. Keep your elbow close to your body.";
  if (t === "abs")
    return "Lie on your back with knees bent and feet flat. Tighten your stomach. Slowly lift your shoulders off the ground using your stomach muscles — not your neck. Hold for a moment, then lower slowly.";
  if (t === "glutes")
    return "Lie on your back with knees bent and feet flat on the floor. Push your hips up until your body forms a straight line from knees to shoulders. Squeeze your glutes at the top. Lower slowly.";
  if (t === "hamstrings")
    return "Keep your back straight throughout. Hinge at the hips — not the waist. Feel a stretch in the back of your thighs. Move slowly and do not round your lower back.";
  if (t === "calves")
    return "Stand near a wall for balance. Rise up onto your toes slowly, pause for one second, then lower your heels back down with control. Do not rush.";
  if (t === "delts")
    return "Hold dumbbells at your sides. Raise your arms out to the side up to shoulder height. Keep a slight bend in your elbows. Lower slowly. Do not shrug your shoulders.";
  if (t === "biceps")
    return "Stand or sit holding dumbbells. Keep your elbows tucked in to your sides. Curl the dumbbells up towards your shoulders. Lower them slowly. Do not swing your body.";
  if (t === "triceps")
    return "Hold a dumbbell overhead with both hands. Keep your upper arm still and close to your head. Slowly lower the weight behind your head by bending your elbows. Press back up.";
  if (t === "obliques")
    return "Lie on your side or do a side plank. Engage your side stomach muscles. Move slowly and with control. Focus on the muscles on the sides of your waist, not your hip.";
  return "Start with a light weight or bodyweight. Move slowly and with full control. Breathe out on the hard part, breathe in on the way back. Stop if you feel sharp pain.";
}

// Home alternative for gym exercises
export function getHomeAlternative(equipment: string, target: string): string | null {
  const eq = equipment.toLowerCase();
  const t = target.toLowerCase();
  if (eq === "body weight") return null;
  if (eq === "dumbbell") {
    if (t === "quads") return "At home: Bodyweight squat or Bulgarian split squat";
    if (t === "pectorals") return "At home: Push-ups or incline push-ups on a chair";
    if (t === "lats") return "At home: Table rows — lie under a table, grab the edge, pull up";
    if (t === "glutes") return "At home: Glute bridge or donkey kicks";
    if (t === "hamstrings") return "At home: Glute bridge or single-leg deadlift without weight";
    if (t === "biceps") return "At home: Use a filled water bottle or resistance band";
    return "At home: Use a resistance band or filled bag for similar movement";
  }
  if (["barbell", "olympic barbell"].includes(eq)) {
    if (t === "quads") return "At home: Dumbbell squat or bodyweight squat";
    if (t === "pectorals") return "At home: Push-ups or dumbbell floor press";
    if (t === "hamstrings") return "At home: Dumbbell Romanian deadlift or glute bridge";
    if (t === "lats") return "At home: Table rows or dumbbell bent-over row";
    return "At home: Use dumbbells or bodyweight for a similar movement";
  }
  if (["cable", "leverage machine"].includes(eq)) {
    return "At home: Use a resistance band attached to a door for a similar pull or push";
  }
  return null;
}

export function getDifficulty(equipment: string): "Beginner" | "Intermediate" | "Advanced" {
  const eq = equipment.toLowerCase();
  if (["body weight", "assisted", "band"].includes(eq)) return "Beginner";
  if (["barbell", "olympic barbell", "trap_bar"].includes(eq)) return "Advanced";
  return "Intermediate";
}

export function getShortUsefulFor(target: string, equipment: string): string {
  const t = target.toLowerCase();
  if (["quads", "glutes", "hamstrings"].includes(t)) return "Lower body strength";
  if (["pectorals"].includes(t)) return "Chest development";
  if (["lats", "traps", "upper back"].includes(t)) return "Back strength";
  if (["delts"].includes(t)) return "Shoulder definition";
  if (["biceps", "triceps", "forearms"].includes(t)) return "Arm strength";
  if (["abs", "obliques"].includes(t)) return "Core stability";
  if (t === "cardiovascular system") return "Cardio endurance";
  if (["calves"].includes(t)) return "Calf development";
  if (equipment.toLowerCase() === "body weight") return "Functional fitness";
  return "General fitness";
}
