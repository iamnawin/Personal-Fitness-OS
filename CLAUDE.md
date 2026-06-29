# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Identity

**Product:** Personal Fitness OS (PFOS)  
**Tagline:** A personal workout plan built around you.  
**Internal codename:** PFOS  
**Status:** Pre-implementation — design spec approved, no code yet.

The original PRD used the name "Yutra". That name is **retired**. Never use it anywhere.  
All product naming must come from `src/lib/brand.ts` — never hardcoded.

---

## Stack

- **Framework:** Next.js 14 App Router (TypeScript strict mode)
- **Styling:** Tailwind CSS + shadcn/ui
- **Persistence:** localStorage only — no backend, no auth, no database
- **Package manager:** `pnpm`
- **Hosting target:** Static export compatible (Vercel / Netlify)

---

## Commands

```bash
pnpm dev          # local dev server
pnpm build        # production build
pnpm run lint     # ESLint
pnpm type-check   # tsc --noEmit (if script exists)
```

For static export: `next.config.js` must set `output: "export"` only after verifying all routes are static-compatible.

---

## Architecture

### No backend
Everything is client-side. No API routes, no server actions, no auth. All state lives in `localStorage` under `pfos:*` keys (see `src/lib/workout-storage.ts`).

### `src/lib/brand.ts` — Single source of truth for branding
Every screen reads `productName`, `tagline`, `logoMode`, `colors` from here. Never hardcode PFOS, the tagline, or brand colors in component files.

### `src/lib/types.ts` — All TypeScript types
`Exercise`, `FitnessProfile`, `WeeklyPlan`, `WorkoutLog`, `CustomWorkout`, `StreakData`, `ExerciseMedia`. All shared types live here only.

### `src/data/exercises.json` — Full exercise dataset (~1,300 exercises)
Source: https://github.com/hasaneyldrm/exercises-dataset  
The full dataset must be bundled at build time — not a sample. Filters are generated dynamically from actual dataset values, never hardcoded.

### `src/lib/pfos-coach.ts` — Plan generator
Rule-based logic — **not AI**. UI calls it "Your Coach" or "PFOS Coach", never "AI Coach". Takes `FitnessProfile` → returns `WeeklyPlan` with `coachNote`. Equipment filter applied first; excluded body parts and exercises always respected.

### `src/lib/exercise-enrichment.ts` — Layman labels
Converts raw muscle/equipment/body-part names to readable English. All enrichment functions live here; raw technical labels must never appear in the UI.

### `src/lib/media-utils.ts` — Media resolution
Priority: custom PFOS media → `gifUrl` → `imageUrl` → `MediaPlaceholder`. Never crash on missing media. Use plain `<img>` / `<video>` tags — **not** `next/image` — for external GIF/image URLs.

### `src/lib/workout-storage.ts` — localStorage access
All reads/writes guarded against `window` being undefined (SSR safety). All reads wrapped in try/catch. Components that touch storage must have `'use client'` directive.

---

## Screens (App Router routes)

| Route | Purpose |
|---|---|
| `/` | Onboarding / Welcome |
| `/coach` | Fitness Profile Setup |
| `/equipment` | Equipment & Preferences → triggers plan generation |
| `/plan` | Generated Weekly Plan |
| `/dashboard` | Personal Control Room |
| `/exercises` | Exercise Library (search + dynamic filters) |
| `/exercises/[id]` | Exercise Detail — GIF/video demo must be prominent |
| `/builder` | Workout Builder (add/remove only, no drag-drop in Phase 1) |
| `/workout` | Active Workout Session |
| `/progress` | Progress & Insights |

---

## Build Phases

1. **Phase 1 — Core Loop:** brand → types → exercise data → localStorage → onboarding → coach → equipment → plan → dashboard
2. **Phase 2 — Exercise Content:** library → filters → detail → media viewer → enrichment labels
3. **Phase 3 — Workout Execution:** builder → active session → log save
4. **Phase 4 — Progress:** history → streak → weekly summary → adherence
5. **Phase 5 — Polish:** mobile-first audit → empty states → error boundaries → PWA manifest → static export check

---

## Key Constraints

- No payment, subscription, or pricing UI
- No social feed or public sharing
- No nutrition engine or calorie tracking
- No medical diagnosis or injury treatment
- No trainer marketplace
- No fake AI labels (the coach is rule-based)
- No Yutra branding anywhere

---

## Design Direction

Dark navy (`#1e1b4b`) background, violet/indigo/electric-blue accents. Rounded cards. Mobile-first (375px baseline). Premium feel — not generic SaaS.

Full design spec: `docs/superpowers/specs/2026-06-29-pfos-design.md`
# CLAUDE.md — Personal Fitness OS / PFOS

## Project Identity

You are working on **Personal Fitness OS**, internal codename **PFOS**.

This app was previously documented under the temporary name **Yutra**, but that name and logo are no longer valid.

### Current product name

* Product name: **Personal Fitness OS**
* Internal codename: **PFOS**
* Temporary user-facing name: **Personal Fitness OS**
* Tagline: **A personal workout plan built around you.**

### Critical branding rule

Do **not** use or hardcode:

* Yutra
* Yutra logo
* old logo from mockups as final branding

The old Yutra document and mockups are only references for:

* UX flow
* screen structure
* dark premium UI style
* layout inspiration
* fitness app feature direction

They are **not** final naming or branding.

All app name, tagline, logo behavior, and brand colors must come from:

```ts
src/lib/brand.ts
```

No component should hardcode the product name.

---

## Product Vision

Personal Fitness OS is a personal workout planning and tracking app.

It helps the user:

1. Set their fitness goal.
2. Choose experience level.
3. Select available equipment.
4. Generate a weekly workout plan.
5. Browse exercise demos.
6. Learn how each exercise works in simple English.
7. Build custom workouts.
8. Start and complete workouts.
9. Track progress and consistency.

This is not a generic fitness tracker.

This is a **personal fitness control room**.

---

## Non-Negotiables

Do not add:

* payment
* social feed
* nutrition tracking
* medical advice
* trainer marketplace
* fake AI claims
* backend/auth in Phase 1
* unnecessary complexity

Do not call anything “AI Coach” unless actual AI integration exists.

Use:

```text
PFOS Coach
Your Coach
Suggested Plan
```

For Phase 1, the coach is **rule-based**, not AI.

---

## Stack

Use:

* Next.js 14 App Router
* TypeScript strict
* Tailwind CSS
* shadcn/ui if helpful
* localStorage only
* static-export-friendly architecture
* bundled exercise JSON data
* external image/GIF URLs from dataset where available

Avoid server-only logic.

Use normal `<img>` / `<video>` for external exercise media if `next/image` causes static export issues.

---

## Target Folder Structure

```text
src/
  app/
    page.tsx
    coach/page.tsx
    equipment/page.tsx
    plan/page.tsx
    dashboard/page.tsx
    exercises/page.tsx
    exercises/[id]/page.tsx
    builder/page.tsx
    workout/page.tsx
    progress/page.tsx

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
    brand.ts
    types.ts
    exercise-data.ts
    exercise-enrichment.ts
    pfos-coach.ts
    workout-storage.ts
    fitness-utils.ts
    media-utils.ts

  data/
    exercises.json
```

---

## Brand Config

Create or maintain:

```ts
// src/lib/brand.ts

export const brand = {
  productName: "Personal Fitness OS",
  internalName: "PFOS",
  tagline: "A personal workout plan built around you.",
  logoMode: "placeholder",
  logoPath: null,
  appDescription:
    "A personal fitness planning system with exercise demos, weekly plans, workout tracking, and progress insights.",
  colors: {
    primary: "#1e1b4b",
    accent: "#7c3aed",
    highlight: "#6366f1",
    electric: "#38bdf8",
  },
};
```

Rules:

* All UI uses this config for product naming.
* Do not hardcode product name in screens.
* Do not hardcode old Yutra branding.
* Placeholder logo is acceptable until final brand is decided.

Placeholder logo options:

* PFOS text mark
* circular OS-style fitness icon
* dumbbell + spark icon
* simple SVG/CSS mark

---

## Design Direction

Use the old mockups only for UX/style inspiration.

Visual style:

* dark navy / black background
* violet accents
* indigo accents
* electric blue highlights
* premium dashboard feel
* rounded cards
* mobile-first
* calm and focused
* not gym-bro
* not noisy
* not generic SaaS landing page

The app should feel like:

```text
Private fitness control room.
```

Not:

```text
Random workout tracker.
```

---

## Main Routes

### 1. `/`

Welcome / onboarding screen.

Must include:

* PFOS placeholder logo
* product name from `brand.ts`
* tagline from `brand.ts`
* CTA: Start My Plan
* optional CTA: Explore Exercises

---

### 2. `/coach`

Fitness profile setup.

Collect:

* goal
* level
* workout days/week
* session duration
* optional age/weight only if simple and clearly optional

---

### 3. `/equipment`

Equipment and preferences.

Collect:

* available equipment
* workout location: home / gym / mixed
* avoid body parts
* avoid exercises/notes if simple

CTA:

```text
Generate My Plan
```

---

### 4. `/plan`

Generated weekly plan.

Must show:

* PFOS Coach suggested weekly plan
* 7 days including rest/recovery days
* why the plan fits user inputs
* regenerate option
* save plan option
* start selected workout option

---

### 5. `/dashboard`

Personal control room.

Show:

* today’s workout / next suggested workout
* current goal
* weekly progress
* streak
* saved workouts count
* completed workouts this week
* quick links to Coach, Exercises, Builder, Progress

---

### 6. `/exercises`

Exercise library.

Must include:

* search
* dynamic filters from actual data
* body part filter
* target muscle filter
* equipment filter
* level filter
* media available filter
* exercise cards
* useful-for short text
* media preview when available

---

### 7. `/exercises/[id]`

Exercise detail.

This is a critical screen.

Must show:

* prominent GIF/video/image demo
* exercise name/plain name
* target muscle
* body part
* equipment
* secondary muscles
* simple description
* useful for
* body area explanation
* beginner note
* form focus
* common mistake
* safety note
* instructions if available
* Add to Workout button

The experience should feel like:

```text
Watch. Understand. Then perform.
```

---

### 8. `/builder`

Custom workout builder.

Must include:

* workout name
* add exercises from library
* sets
* reps
* rest seconds
* notes
* remove exercise
* save workout

Drag/drop is optional. Do not block Phase 1 on drag/drop.

---

### 9. `/workout`

Active workout session.

Must include:

* selected plan/custom workout
* current exercise
* set/rep/rest display
* media preview if available
* complete set/exercise
* simple rest timer
* finish workout
* save workout log
* update streak/progress

---

### 10. `/progress`

Progress and insights.

Must show:

* workout history
* completed workouts this week
* weekly volume or total sets
* current streak
* longest streak
* plan adherence if plan exists
* recent activity list

---

## Exercise Dataset

Use this repo as reference/source:

```text
https://github.com/hasaneyldrm/exercises-dataset
```

Rules:

* Load all valid exercises available.
* Do not use only sample data unless fallback is needed for local build safety.
* Do not manually create only 20 or 50 exercises.
* Preserve categories, body parts, target muscles, equipment, instructions, images, and GIF paths where available.
* Normalize data into app-friendly fields.
* Generate filters dynamically from the actual dataset.

If full dataset import cannot be automated immediately:

1. Add clear import instructions.
2. Add a small fallback sample only so app builds.
3. Clearly mark fallback data as temporary.
4. Do not pretend fallback sample is final.

---

## Exercise Type

Use strong TypeScript types.

```ts
export type Exercise = {
  id: string;
  name: string;
  plainName: string;
  bodyPart: string;
  equipment: string;
  target: string;
  secondaryMuscles: string[];
  gifUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  level: "beginner" | "intermediate" | "advanced";
  simpleDescription: string;
  usefulFor: string[];
  bodyAreaExplanation: string;
  beginnerNote: string;
  formFocus: string;
  commonMistake: string;
  safetyNote: string;
  tags: string[];
};
```

Also define:

* FitnessProfile
* WeeklyPlan
* PlanDay
* PlanExercise
* CustomWorkout
* CustomWorkoutItem
* WorkoutLog
* StreakData
* ExerciseMedia

---

## Exercise Enrichment

Create:

```text
src/lib/exercise-enrichment.ts
```

Each exercise must have simple layman-friendly explanations.

Fields:

* what this exercise is
* why it is useful
* what body part it trains
* equipment needed
* beginner note
* form focus
* common mistake
* simple safety note
* tags

Do not expose raw technical labels when user-friendly labels are better.

Examples:

```text
pectorals → Chest
delts → Shoulders
lats → Back / Lats
quads → Front thighs
hamstrings → Back thighs
glutes → Glutes
body weight → No equipment / bodyweight
dumbbell → Dumbbells
barbell → Barbell
cable → Cable machine
lever → Machine
```

Helpers:

```ts
getBodyPartLabel()
getMuscleLabel()
getEquipmentLabel()
createPlainName()
createSimpleDescription()
createUsefulFor()
createBodyAreaExplanation()
createBeginnerNote()
createFormFocus()
createCommonMistake()
createSafetyNote()
createExerciseTags()
```

---

## Media Architecture

Create:

```text
src/components/fitness/ExerciseMediaViewer.tsx
src/components/fitness/MediaPlaceholder.tsx
src/lib/media-utils.ts
```

Exercise GIF/video/demo is a prime feature.

When a user opens an exercise, show demo media prominently.

Media priority:

1. Custom PFOS media if available
2. Reference/local GIF animation if available
3. Reference/local video if available
4. Reference/local image if available
5. PFOS placeholder if no media exists

`ExerciseMediaViewer` behavior:

* try GIF/animation first
* if broken, fallback to image
* if image broken, show placeholder
* do not crash when URL is missing
* show loading/fallback state
* use normal `<img>` / `<video>` if needed for static export compatibility

`media-utils.ts` should include:

```ts
resolveMediaUrl()
getPrimaryExerciseMedia()
isExternalUrl()
getExerciseImage()
getExerciseAnimation()
getExerciseMediaStatus()
```

---

## PFOS Coach

Create:

```text
src/lib/pfos-coach.ts
```

This is rule-based, not AI.

Inputs:

* goal
* experience level
* days per week
* session duration
* equipment list
* excluded body parts
* excluded exercises
* location: home/gym/mixed

Output:

```text
WeeklyPlan
```

The weekly plan must include 7 days, with workout and rest/recovery days.

Rules:

* Beginner: simple compound/bodyweight movements, 3 days/week default, lower volume.
* Intermediate: upper/lower or push/pull/legs style splits.
* Advanced: focused splits, still safe and simple for Phase 1.
* Avoid same target muscle on consecutive workout days.
* Apply equipment filter first.
* Never suggest exercises requiring equipment user did not select.
* Apply excluded body parts/exercises.
* Strength goal: compound bias, longer rest.
* Muscle gain: moderate volume, balanced split.
* Fat loss: full-body/circuit bias, shorter rest.
* General fitness: balanced weekly coverage.
* Mobility: mobility/stretching/bodyweight bias.

Do not label this as AI.

Use:

```text
PFOS Coach
Your Coach
Suggested Plan
```

---

## localStorage Schema

Create:

```text
src/lib/workout-storage.ts
```

Keys:

```text
pfos:profile
pfos:plan
pfos:logs
pfos:custom-workouts
pfos:streak
```

Rules:

* All localStorage access must be client-safe.
* Guard against `window` being undefined.
* Never crash during SSR/build.
* Validate fallbacks for missing/corrupt localStorage data.

---

## Build Phases

Work phase by phase. Do not attempt the entire app in one massive response.

### Phase 1 — Core Loop

Implement:

* brand config
* types
* localStorage helper
* app shell/navigation
* onboarding
* coach setup
* equipment setup
* plan generation
* dashboard

Stop after Phase 1. Run build/lint if possible. Summarize shortly.

### Phase 2 — Exercise Content

Implement:

* exercise data loader
* exercise normalization
* exercise enrichment
* media utils
* ExerciseMediaViewer
* MediaPlaceholder
* exercise library
* exercise detail

Stop after Phase 2. Run build/lint if possible. Summarize shortly.

### Phase 3 — Workout Execution

Implement:

* workout builder
* active workout session
* set/exercise completion
* finish workout
* save workout log

Do not add drag/drop yet.

Stop after Phase 3. Run build/lint if possible. Summarize shortly.

### Phase 4 — Progress

Implement:

* progress screen
* history
* streak
* weekly summary
* adherence

Run build/lint. Fix errors. Summarize shortly.

### Phase 5 — Polish

Implement only after core works:

* mobile-first audit
* empty states
* error states
* PWA manifest if easy
* static export check

---

## Claude Code Behavior Rules

Very important: avoid token overflow.

Do:

* make changes directly in files
* work one phase at a time
* keep reports short
* summarize changed files
* run lint/build after each phase if possible
* fix TypeScript errors directly

Do not:

* print full file contents
* paste huge code blocks
* generate massive reports
* build all phases at once
* rewrite working code unnecessarily
* create duplicate components
* over-engineer

After each phase, report only:

```text
Phase completed:
Files changed:
What works:
Commands run:
Known issues:
Next phase:
```

Keep each report under 1000 words.

---

## Acceptance Criteria

The final app must satisfy:

* App runs locally.
* Next.js 14 App Router is used.
* TypeScript strict passes.
* No visible Yutra name remains.
* Old Yutra logo is not used as final logo.
* Product name comes from `src/lib/brand.ts`.
* Placeholder PFOS logo is used.
* UI follows attached mockup layout and premium dark visual direction.
* Onboarding works.
* User can create a fitness profile.
* Equipment/preferences flow works.
* PFOS Coach generates a weekly plan.
* User can save/regenerate plan.
* User can browse/search/filter exercises.
* Filters are generated from actual dataset values.
* Exercise detail shows GIF/video/image demo when available.
* Exercise detail falls back cleanly when media is missing/broken.
* Exercise detail has layman explanation and usefulness.
* User can create and save custom workout.
* User can start a workout.
* User can complete sets/exercises.
* User can finish a workout.
* Completed workout appears in Progress.
* localStorage persists profile, plan, custom workouts, logs, and streak.
* Build passes.
* Static-export compatibility is checked.
* No fake medical claims.
* No payment/social/nutrition/trainer marketplace added.
* No fake AI wording.

---

## Final Audit

At the end, audit:

* No Yutra text remains.
* No Yutra logo remains as final logo.
* Brand config controls naming.
* App can be renamed from one config file.
* Mockups were used only for UX/style reference.
* PFOS placeholder logo is used.
* Exercise GIF/video demo works.
* All valid exercises are loaded or clear import path exists.
* Exercise explanations are simple and useful.
* PFOS Coach weekly plan works.
* Workout tracking works.
* Progress updates after workout completion.
* localStorage persists profile, plan, custom workouts, logs, and streak.
* Build passes.
* Static export remains viable.

Fix issues directly.
