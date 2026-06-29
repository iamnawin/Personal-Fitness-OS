# Personal Fitness OS (PFOS) — Design Spec
**Date:** 2026-06-29  
**Status:** Approved  
**Internal codename:** PFOS  
**Product name:** Personal Fitness OS  
**Tagline:** A personal workout plan built around you.

---

## Naming / Branding Correction (Critical)

The original PRD was written under the temporary name "Yutra". That name is retired.

- Do NOT use "Yutra" anywhere in the app
- Do NOT hardcode "Yutra" in any file, component, config, or comment
- Do NOT use the old Yutra logo as final branding
- All product naming must come from `src/lib/brand.ts`
- Product name: **Personal Fitness OS**
- Internal codename: **PFOS**
- Tagline: **A personal workout plan built around you.**

---

## Architecture

**Framework:** Next.js 14 App Router  
**Language:** TypeScript (strict mode)  
**Styling:** Tailwind CSS  
**Components:** shadcn/ui where useful  
**Persistence:** localStorage only — no backend, no auth  
**Hosting:** Static-export compatible (Vercel / Netlify)  

Next.js config notes:
- Use `output: "export"` only if all routes are compatible
- Use normal `<img>` / `<video>` tags for external exercise GIF/image URLs — do NOT use `next/image` for external media
- Avoid server-only logic in all components
- Guard against `window` being undefined in localStorage access

---

## Folder Structure

```
src/
  app/
    page.tsx                    # Onboarding / Welcome
    coach/page.tsx              # Fitness Profile Setup
    equipment/page.tsx          # Equipment & Preferences
    plan/page.tsx               # Generated Weekly Plan
    dashboard/page.tsx          # Dashboard
    exercises/page.tsx          # Exercise Library
    exercises/[id]/page.tsx     # Exercise Detail
    builder/page.tsx            # Workout Builder
    workout/page.tsx            # Active Workout
    progress/page.tsx           # Progress & Insights

  components/
    fitness/
      AppShell.tsx
      BrandMark.tsx
      BottomNav.tsx
      DashboardStats.tsx
      FitnessProfileForm.tsx
      EquipmentPreferencesForm.tsx
      SuggestedPlan.tsx
      WeeklyPlanCalendar.tsx
      ExerciseCard.tsx
      ExerciseFilters.tsx
      ExerciseMediaViewer.tsx
      MediaPlaceholder.tsx
      WorkoutBuilder.tsx
      ActiveWorkout.tsx
      ProgressSummary.tsx

  lib/
    brand.ts                    # Central brand config (single source of truth)
    types.ts                    # All TypeScript types
    exercise-data.ts            # Dataset loader + normalization + dynamic filters
    exercise-enrichment.ts      # Layman explanations and labels
    pfos-coach.ts               # Rule-based weekly plan generator
    workout-storage.ts          # All localStorage read/write
    fitness-utils.ts            # Shared calculation helpers
    media-utils.ts              # Media URL resolution + fallback logic

  data/
    exercises.json              # Full normalized dataset (~1,300 exercises)
```

---

## Brand Config (`src/lib/brand.ts`)

Single export. Every screen reads name, tagline, logo from here — never hardcoded.

```ts
export const brand = {
  productName: "Personal Fitness OS",
  internalName: "PFOS",
  tagline: "A personal workout plan built around you.",
  logoMode: "placeholder",     // switch to "image" when final logo exists
  logoPath: null,              // set to "/logo.svg" when ready
  appDescription: "A personal fitness planning system with exercise demos, weekly plans, workout tracking, and progress insights.",
  colors: {
    primary: "#1e1b4b",        // dark navy
    accent: "#7c3aed",         // violet
    highlight: "#6366f1",      // indigo
    electric: "#38bdf8",       // electric blue
  }
}
```

**Color rule:** `brand.ts` holds core tokens. Tailwind classes may use matching theme values. Dark navy / violet / indigo / electric blue is the visual direction.

**Logo:** Temporary placeholder — PFOS text mark, abstract dumbbell+spark SVG, or circular OS-style icon. Replaceable without touching any screen.

---

## TypeScript Data Model (`src/lib/types.ts`)

```ts
type Exercise = {
  id: string
  name: string
  plainName: string
  bodyPart: string
  equipment: string
  target: string
  secondaryMuscles: string[]
  gifUrl?: string
  imageUrl?: string
  videoUrl?: string
  level: "beginner" | "intermediate" | "advanced"
  simpleDescription: string
  usefulFor: string[]
  bodyAreaExplanation: string
  beginnerNote: string
  formFocus: string
  commonMistake: string
  safetyNote: string
  tags: string[]
}

type FitnessProfile = {
  goal: "strength" | "muscle_gain" | "fat_loss" | "general_fitness" | "mobility"
  level: "beginner" | "intermediate" | "advanced"
  daysPerWeek: number
  sessionDuration: number         // minutes
  equipment: string[]
  location: "home" | "gym" | "mixed"
  excludedBodyParts: string[]
  excludedExercises: string[]
  age?: number                    // optional
  weight?: number                 // optional, kg
}

type PlanExercise = {
  exerciseId: string
  sets: number
  reps: string                   // e.g. "8-12" or "30s"
  restSeconds: number
  notes?: string
}

type PlanDay = {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"
  isRest: boolean
  focus?: string                 // e.g. "Upper Body", "Full Body"
  exercises: PlanExercise[]
}

type WeeklyPlan = {
  id: string
  createdAt: string
  profileSnapshot: FitnessProfile
  days: PlanDay[]
  coachNote: string              // why this plan fits the user's inputs
}

type CustomWorkoutItem = {
  exerciseId: string
  sets: number
  reps: string
  restSeconds: number
  notes?: string
}

type CustomWorkout = {
  id: string
  name: string
  createdAt: string
  items: CustomWorkoutItem[]
}

type WorkoutLog = {
  id: string
  date: string
  sourceType: "plan" | "custom" | "freeform"
  sourceId?: string
  completedExercises: {
    exerciseId: string
    sets: { reps: number; weight?: number; completed: boolean }[]
  }[]
  durationMinutes: number
  notes?: string
}

type StreakData = {
  currentStreak: number
  longestStreak: number
  lastWorkoutDate: string | null
}

type ExerciseMedia = {
  gifUrl?: string
  imageUrl?: string
  videoUrl?: string
  status: "gif" | "image" | "video" | "placeholder"
}
```

---

## Exercise Dataset (`src/data/exercises.json`)

**Source:** https://github.com/hasaneyldrm/exercises-dataset  
**Approach:** Bundle JSON at build time, use external image/GIF URLs (Approach A)

Requirements:
- Load ALL valid exercises from the dataset (~1,300–1,400)
- Preserve body parts, target muscles, equipment types, instructions, GIF URLs
- Normalize into clean `Exercise` type fields
- Do NOT limit to 20–50 sample exercises
- Generate filters dynamically from actual dataset values — no hardcoded filter lists
- If dataset cannot be auto-fetched, provide a data import script/instructions
- Include a small fallback sample (20–30 exercises) only for local build safety — not as final data

---

## Exercise Enrichment (`src/lib/exercise-enrichment.ts`)

Every exercise must have layman-friendly explanations. Raw technical muscle labels must be converted.

**Label mappings:**
```
pectorals     → Chest
delts         → Shoulders
lats          → Back / Lats
quads         → Front thighs
hamstrings    → Back thighs
glutes        → Glutes
body weight   → No equipment / Bodyweight
dumbbell      → Dumbbells
barbell       → Barbell
cable         → Cable machine
lever         → Machine
```

**Required helper functions:**
- `getBodyPartLabel(raw: string): string`
- `getMuscleLabel(raw: string): string`
- `getEquipmentLabel(raw: string): string`
- `createPlainName(name: string): string`
- `createSimpleDescription(exercise: RawExercise): string`
- `createUsefulFor(exercise: RawExercise): string[]`
- `createBodyAreaExplanation(bodyPart: string, target: string): string`
- `createBeginnerNote(exercise: RawExercise): string`
- `createFormFocus(exercise: RawExercise): string`
- `createCommonMistake(exercise: RawExercise): string`
- `createSafetyNote(exercise: RawExercise): string`
- `createExerciseTags(exercise: RawExercise): string[]`

---

## Media Architecture

### `ExerciseMediaViewer` component

Priority order:
1. Custom PFOS media (if available)
2. `gifUrl` — GIF animation
3. `imageUrl` — static image
4. `MediaPlaceholder` — SVG icon + exercise name

Behavior:
- Try gifUrl first; on load error fall back to imageUrl
- On imageUrl error, show `MediaPlaceholder`
- Never crash if media is missing
- Show loading state
- Use normal `<img>` / `<video>` tags (not `next/image`) for external URLs

### `MediaPlaceholder` component

- SVG icon + exercise name
- Styled consistently with dark theme
- Used anywhere media is unavailable

### `src/lib/media-utils.ts`

Required functions:
- `resolveMediaUrl(exercise: Exercise): string | null`
- `getPrimaryExerciseMedia(exercise: Exercise): ExerciseMedia`
- `isExternalUrl(url: string): boolean`
- `getExerciseImage(exercise: Exercise): string | null`
- `getExerciseAnimation(exercise: Exercise): string | null`
- `getExerciseMediaStatus(exercise: Exercise): ExerciseMedia["status"]`

---

## PFOS Coach (`src/lib/pfos-coach.ts`)

**Rule-based — NOT AI. UI calls it "Your Coach" or "PFOS Coach", never "AI Coach".**

**Inputs (from FitnessProfile):**
- goal, level, daysPerWeek, sessionDuration
- equipment[], location
- excludedBodyParts[], excludedExercises[]
- optional: age, weight

**Output:** `WeeklyPlan` — 7 days with workout/rest days and a `coachNote`

**Rules:**
- Beginner → compound/bodyweight movements, 3 days/week default, lower volume
- Intermediate → upper/lower or push/pull/legs splits
- Advanced → more focused splits (keep Phase 1 simple)
- No consecutive same-muscle-group days where avoidable
- Equipment filter applied first — never suggest exercises requiring unavailable equipment
- Excluded body parts and exercises always respected
- Goal weighting:
  - `strength` → compound bias, longer rest (90–120s)
  - `muscle_gain` → moderate volume, balanced split
  - `fat_loss` → full-body/circuit bias, shorter rest (30–45s)
  - `general_fitness` → balanced weekly coverage
  - `mobility` → mobility/stretching/bodyweight bias

---

## localStorage Schema (`src/lib/workout-storage.ts`)

```
pfos:profile          → FitnessProfile
pfos:plan             → WeeklyPlan
pfos:logs             → WorkoutLog[]
pfos:custom-workouts  → CustomWorkout[]
pfos:streak           → StreakData
```

Rules:
- All access guarded against `window` being undefined (SSR safety)
- All reads wrapped in try/catch
- Use `'use client'` directive on all components that touch storage

---

## Screens

### 1. `/` — Onboarding / Welcome
- Placeholder PFOS logo (from `BrandMark`)
- `brand.productName` and `brand.tagline` (read from brand.ts)
- CTA: "Start My Plan" → `/coach`
- Secondary CTA: "Explore Exercises" → `/exercises`

### 2. `/coach` — Fitness Profile Setup
- Collect: goal, level, daysPerWeek, sessionDuration
- Optional: age, weight (clearly marked optional, skip-friendly)
- Continue → `/equipment`
- Persist to `pfos:profile`

### 3. `/equipment` — Equipment & Preferences
- Equipment multi-select (Bodyweight, Dumbbells, Barbell, Cable machine, etc.)
- Location: Home / Gym / Mixed
- Exclude body parts (multi-select, optional)
- CTA: "Generate My Plan" → triggers PFOS Coach, navigates to `/plan`

### 4. `/plan` — Generated Weekly Plan
- Show 7-day plan with workout/rest days
- Show `coachNote` explaining why this plan fits the user
- Buttons: Regenerate, Save Plan, Start Today's Workout
- Persist to `pfos:plan`

### 5. `/dashboard` — Personal Control Room
- Today's workout / next suggested workout
- Current goal badge
- Weekly progress (X of N days done)
- Current streak
- Saved workouts count
- Quick nav links: Coach, Exercises, Builder, Progress

### 6. `/exercises` — Exercise Library
- Search by name
- Dynamic filters: body part, target muscle, equipment, level, media available
- All filter options generated from actual dataset values
- Card grid with media preview if available
- Short `usefulFor` text on each card
- Link to `/exercises/[id]`

### 7. `/exercises/[id]` — Exercise Detail
- **Prominent GIF/video/image demo at top** (ExerciseMediaViewer, full-width)
- Exercise name + plainName
- Target muscle, body part, equipment, secondary muscles
- simpleDescription, usefulFor, bodyAreaExplanation
- beginnerNote, formFocus, commonMistake, safetyNote
- Instructions if available from dataset
- "Add to Workout" button → `/builder`

### 8. `/builder` — Workout Builder
- Create workout name
- Add exercises (browse/search from library)
- Configure sets, reps, rest seconds, notes per exercise
- Remove exercise
- Save custom workout → `pfos:custom-workouts`
- **No drag-and-drop in Phase 1** — add/remove only

### 9. `/workout` — Active Workout Session
- Load from plan day or custom workout
- Show current exercise with media preview
- Show sets/reps/rest
- Mark sets complete, advance to next
- Simple rest timer display
- Finish workout → saves `WorkoutLog`, updates `pfos:streak`

### 10. `/progress` — Progress & Insights
- Recent workout history list
- Completed workouts this week
- Weekly volume (total sets or exercises)
- Current streak / longest streak
- Plan adherence % (if plan exists)
- Recent activity timeline

---

## Visual Direction

- Dark navy background (`#1e1b4b`)
- Violet / indigo / electric blue accents
- Rounded card system
- Mobile-first layout
- Premium feel — reference the mockup layouts from the original PRD document
- No fake AI labels, no social feed UI, no payment UI

---

## Build Phases

### Phase 1 — Core Loop
brand config → types → exercise data → localStorage → onboarding → coach setup → equipment → plan → dashboard

### Phase 2 — Exercise Content
exercise library → search + dynamic filters → exercise detail → ExerciseMediaViewer → enrichment labels

### Phase 3 — Workout Execution
workout builder (add/remove, no drag-drop) → active workout session → log save

### Phase 4 — Progress
progress screen → history → streak → weekly summary → adherence

### Phase 5 — Polish
mobile-first audit → empty states → error boundaries → PWA manifest → static export check

---

## Implementation Steps

1. Inspect current project structure
2. Identify framework / package manager
3. Create `src/lib/brand.ts`
4. Remove / avoid all Yutra references
5. Set up App Router routes and global layout
6. Add `BrandMark` placeholder logo component
7. Add Tailwind theme aligned to brand colors
8. Implement all TypeScript types (`src/lib/types.ts`)
9. Implement exercise data loader and normalization (`src/lib/exercise-data.ts`)
10. Implement exercise enrichment (`src/lib/exercise-enrichment.ts`)
11. Implement media utilities (`src/lib/media-utils.ts`)
12. Implement localStorage helpers (`src/lib/workout-storage.ts`)
13. Implement onboarding screen (`/`)
14. Implement fitness profile setup (`/coach`)
15. Implement equipment/preferences (`/equipment`)
16. Implement PFOS Coach plan generator (`src/lib/pfos-coach.ts`)
17. Implement weekly plan screen (`/plan`)
18. Implement dashboard (`/dashboard`)
19. Implement exercise library (`/exercises`)
20. Implement exercise detail with media (`/exercises/[id]`)
21. Implement workout builder (`/builder`)
22. Implement active workout session (`/workout`)
23. Implement progress screen (`/progress`)
24. Run `pnpm run lint` + `pnpm run build`
25. Fix all TypeScript / build / UI issues
26. Run post-build audit (see below)
27. Provide final implementation report

---

## Non-Goals (Hard Constraints)

- No payment, subscription, or pricing UI
- No social feed or public sharing
- No nutrition engine or calorie tracking
- No medical diagnosis or injury treatment advice
- No trainer marketplace
- No fake AI labels (logic is rule-based — label it accordingly)
- No Yutra branding

---

## Post-Build Audit Checklist

- [ ] All Yutra references removed
- [ ] Product name sourced from `brand.ts` everywhere
- [ ] PFOS placeholder logo in use
- [ ] Mockup UX direction followed (dark, rounded, premium)
- [ ] Exercise GIF/video/image demo prominent on detail screen
- [ ] All ~1,300 exercises loaded (not sample only)
- [ ] Exercise explanations are layman-friendly
- [ ] PFOS Coach generates valid weekly plans
- [ ] User can save and regenerate plan
- [ ] User can browse, search, and filter exercise library
- [ ] Filters generated from actual dataset values
- [ ] Workout builder works (add/remove exercises, save)
- [ ] Active workout session works (complete sets, finish)
- [ ] Completed workout appears in Progress
- [ ] localStorage persists profile, plan, custom workouts, logs, streak
- [ ] Build passes with no TypeScript errors
- [ ] Static export compatibility verified
- [ ] No fake AI, medical, payment, nutrition, social, or trainer features added

---

## Acceptance Criteria

All items in the post-build audit checklist must pass. Additionally:
- App runs locally with `pnpm dev`
- No visible Yutra name or old logo anywhere in the UI
- Mobile-first layout works on 375px viewport
- All 10 screens are navigable
- localStorage persistence survives page refresh
