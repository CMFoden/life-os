# Life OS — Phase 2.2 Update
**Date:** 20 April 2026
**Scope:** Weekly rollover logic + meals Sun–Sat reorder
**Files changed:** `components/LifeOS.js`
**Database changes:** New Supabase key `week_anchor` (auto-created on first open, no manual setup)

---

## Problem solved

Two linked issues with how the app handled the passage of time:

1. **No auto-rollover.** Schedules (Boys, Exercise, Social, Kids, Meals) didn't advance when a new week started. Today tab correctly showed new dates via `computeWeekDates`, but the content sitting against those dates was still last week's stored data. "Next week" never became "This week" — it just sat there going stale.

2. **Meals week ran Mon–Sun, not Sun–Sat.** The dinner plan grouped Sunday at the *end* of the week alongside Saturday. Chloë wanted Sunday at the *start*, representing the Sunday *before* Monday (i.e. the Sunday that kicks off the week's dinner rhythm).

---

## What changed

### 1. Week rollover on open

New helper `applyWeekRollover()` runs right after data loads in the main `LifeOS` component's `useEffect`.

- Stores a `week_anchor` in Supabase: the ISO date of the Monday of "this week" at last open
- On each open, compares stored anchor to today's real Monday
- Rolls schedules forward by the number of whole weeks elapsed:
  - **1 week advance:** `thisWeek ← nextWeek`, `nextWeek ← blank`
  - **2+ weeks advance:** both weeks blank (handles "opened app after a fortnight")
  - **Same or earlier week:** no change
- Applied to all five rolling datasets: `exercise_schedule`, `social_schedule`, `kid_logistics`, `meals`, `custody`
- Anchor saved with `toIsoDate()` for reliable cross-timezone comparisons (avoids DST drift)

### 2. First-deploy migration

On the very first load after this code ships (no `week_anchor` row exists yet), the function auto-rolls forward by **1 week**. This was a one-shot fix for the state Chloë was in on 20 April: stored "this week" content was actually last week's, so shifting once lands it in the right place. Subsequent opens fall back to normal anchor-diff logic.

### 3. Meals Sun–Sat reorder

- **Storage unchanged** — `meals.thisWeek` / `meals.nextWeek` still store entries keyed by day name (`Sunday`...`Saturday`)
- **Lists tab display reordered** to `[Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]`
- **New semantic: `meals.thisWeek.Sunday` = the Sunday BEFORE this week's Monday** (not the one at the end)
- Meal row labels now show day + date (e.g. "Sun 19", "Mon 20") so you can see exactly which date you're planning for
- Row label column widened from 32px to 56px to fit the date

### 4. Today tab `buildWeekView` update

Because of the new meals semantic, the Today tab's Sunday (which renders at the end of a Mon–Sun week) now pulls its meal from `meals.nextWeek.Sunday` — which represents "the Sunday before next Monday", i.e. the correct Sunday.

- Mon–Sat: pulls from current week's meals
- Sun: pulls from next week's Sunday entry
- Falls back gracefully if `meals.nextWeek` doesn't exist (e.g. old data shape)

---

## Code map (additions to `LifeOS.js`)

```
// Week rollover helpers section — inserted before buildWeekView
├─ getMondayOfWeek(date)              — Monday 00:00 local of containing week
├─ toIsoDate(d)                       — YYYY-MM-DD string
├─ BLANK_EXERCISE_WEEK()              — 7-day empty template
├─ BLANK_SOCIAL_WEEK()                — 7-day empty template
├─ BLANK_KID_LOGISTICS_WEEK()         — 5-day (Mon–Fri) empty template
├─ BLANK_MEALS_WEEK()                 — 7-day empty template, Sun–Sat names
├─ BLANK_CUSTODY_WEEK()               — 7-day default (all Newlands)
├─ rollWeeks(obj, weeks, blankFn)     — pure shift function
└─ applyWeekRollover({...})           — orchestrator, reads/writes week_anchor
```

```
// ListsTab — new pieces inside the component
├─ WEEK_ORDER_SUN_FIRST               — reorder constant
├─ currentMeals                       — reordered view of rawCurrentMeals
└─ mealDateLabels                     — computed {Sunday: 19, Monday: 20, ...}
```

```
// buildWeekView — meal block rewritten
├─ Mon–Sat → meals[weekKey]
└─ Sun     → meals.nextWeek (with fallback)
```

```
// Main LifeOS useEffect — rollover wired in
└─ applyWeekRollover() called after Promise.all load, before setState
```

---

## Edge cases handled

- **First-ever deploy:** no anchor → assumed 1 week of staleness, rolls forward once
- **Same-day re-opens:** diffWeeks = 0, no rollover
- **DST transitions:** uses date-level math, not raw millisecond division, via `Math.round(diffMs / weekMs)`
- **Multi-week absence:** both weeks blanked, no "ghost" content leaking through
- **Old meals shape (flat array from pre-Phase-2.1):** existing migration in `loadData` still runs first, so rollover always operates on `{thisWeek, nextWeek}` shape
- **Sunday-precedes-Monday on Today tab:** next-week fallback means the last day of a rendered Mon–Sun week correctly pulls next week's leading Sunday

---

## What to test weekly

A quick sanity check for future Mondays:

1. Open app on Mon morning — previous "Next week" content should now be "This week", and "Next week" should be blank ready to plan
2. Lists tab → Meals → order should be Sun → Sat with dates matching this week's Mon–Sat and the prior Sunday
3. Today tab → Sunday row should pull its meal from what was planned as "next week's Sunday" in the previous open

If rollover ever misfires, the `week_anchor` row in Supabase can be manually edited or deleted to trigger a fresh first-run migration.

---

## Not yet done (carry-forward to Phase 3)

- Google Sheets custody sync (`CUSTODY_SHEET_URL` env var still needs setting)
- Populate with real data
- Replace Apple Notes shopping list with in-app list
- Consider: soft archive of rolled-off weeks rather than hard blank (would let you look back at "what did we do last week")
