# Personal Fitness OS (PFOS)

A client-side personal fitness planning app. Rule-based coach generates weekly plans, users browse 1,324 exercises, build custom workouts, execute sessions with a rest timer, and track progress — all in the browser with no backend.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript (strict)
- Tailwind CSS
- localStorage persistence
- pnpm

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
pnpm build
```

Static export compatible. Deploy to Vercel or Netlify with zero config.

## Features

- **Onboarding** — goal, level, days/week, session length, location
- **Equipment Selection** — choose available gear
- **PFOS Coach** — rule-based weekly plan generator (no AI)
- **Exercise Library** — 1,324 exercises with search, filters, GIF demos
- **Exercise Detail** — media viewer, layman explanation, tips
- **Workout Builder** — create custom workouts from the full library
- **Active Workout** — set completion, rest timer, progress bar, media preview
- **Progress** — streak tracking, workout history, plan adherence, weekly stats
- **PWA** — installable with manifest and icons

## Known Limitations

- Exercise pages bundle ~800KB (full JSON client-side); optimize with code-splitting or remote API later
- GIF demos depend on external GitHub raw URLs (may be slow/unavailable)
- Coach plan generation is rule-based with limited exercise variety
- No drag-drop reorder in workout builder yet
- No backend, no auth, no sync — localStorage only

## Dataset

Exercise data sourced from [hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset) (1,324 exercises with GIF URLs, body parts, targets, instructions).

## Branding

All product naming is controlled by `src/lib/brand.ts`. To rename the app, edit that single file. Current branding is placeholder.

## Future

- Category-first exercise browsing
- Search synonyms for common terms
- Varied coach plan logic per day
- Code-split exercise data
- Remote dataset / indexed search
- Export/import data
- Richer progress analytics
