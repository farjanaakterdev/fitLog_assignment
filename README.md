# FitLog

A dark, gym-first workout library built with the Next.js App Router. Browse
twelve lifts from the FitLog API, read full exercise details, and assemble
today's training plan — saved locally so a reload never loses your work.

## Description

FitLog is the front-end for the FitLog workout API. The home page renders a
hero and a sortable exercise library, every workout has a full details page
with a specs table and step-by-step instructions, and the My Plan board tracks
the five lifts you committed to for today plus everything you saved for later.

## Tech Stack

- **Next.js 16** (App Router, Server Components, Turbopack)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS v4** (CSS-first `@theme` design tokens)
- **ESLint 9** (`eslint-config-next`)
- **next/font** (Oswald + Inter, self-hosted at build time)
- **FitLog API** — `https://api.abcz.workers.dev/api/fitlog`

## Features

1. **Sticky navbar** with logo, active-link highlighting, and live Plan / Saved
   count badges — with a compact two-row layout on mobile.
2. **Workout library** (home page) with a loading skeleton while the API
   fetches, then a responsive 3/2/1-column card grid.
3. **Sort By control** on both the library and the My Plan list (duration,
   calories, rating).
4. **Full details page** per workout: hero image, muscle-group tags, specs
   table, numbered instructions, "Add to today's plan" and "Save for later".
5. **My Plan board** with live metrics (exercises / minutes / calories),
   Today's Plan and Saved tabs, Mark as Done, remove actions, and an empty
   state with a CTA back to the library.
6. **Persistence**: plan, saved items, and completed lifts are written to
   `localStorage` (`fitlog.v1`) and restored on reload; the plan is capped at
   five lifts.
7. **Toast feedback** for every action (added, saved, done, removed, errors).
8. **Custom 404 page** with a real `404` HTTP status for unknown routes and
   invalid workout IDs.

## Getting Started

```bash
npm install
npm run dev       # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

## Project Structure

```
app/
  layout.tsx            # fonts, providers, navbar/footer/toasts shell
  page.tsx              # hero + workout library
  not-found.tsx         # custom 404
  workout/[id]/page.tsx # workout details (server-rendered, notFound on bad id)
  my-plan/page.tsx      # metrics, tabs, plan/saved lists, empty state
components/
  Navbar.tsx, Footer.tsx, Toasts.tsx, WorkoutCard.tsx,
  SortSelect.tsx, WorkoutDetails.tsx, Icons.tsx
lib/
  api.ts                # fetchWorkouts / fetchWorkout + NotFoundError
  store.tsx             # plan/saved/done state via useSyncExternalStore
  types.ts              # Workout model
docs/
  assignment.md         # original assignment brief (reference)
```

## API

| Endpoint                      | Description                    |
| ----------------------------- | ------------------------------ |
| `GET /api/fitlog`             | all 12 workouts                |
| `GET /api/fitlog/:id`         | single workout (404 if unknown)|

## Notes

- The original assignment brief is preserved at `docs/assignment.md`.
- Design tokens (colors, type, radii) mirror the provided Figma/Penpot source
  in `UI/` and live in `app/globals.css`.
