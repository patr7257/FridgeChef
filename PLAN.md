# PLAN.md

Filled in from the 2026-07-28 design session. Full spec:
`docs/superpowers/specs/2026-07-28-fridgechef-design.md`.

## Goals

- Photo of the open fridge in, three ranked dinner suggestions out, each with recipe,
  cook time, and missing items.
- Danish UI and Danish everyday cooking. Mobile-first, installable PWA.
- Personal/household tool first (unlisted URL); public showcase later.

## Decisions (settled with Patrick)

- Audience: personal first, no auth wall. Size caps + best-effort rate limit; real budget
  guard is the spend cap on the OpenAI key.
- Language: Danish only.
- Preferences: full structured preferences in v1 (diet, allergies, dislikes, household
  size) in localStorage.
- TodoList shopping-list tie-in: later (tracked as a GitHub issue).
- Stack: Next.js App Router + TypeScript + Tailwind, pnpm, Vercel. Two-step flow: vision
  call extracts ingredients (editable chips), text call generates recipes. Models default
  to gpt-5-mini, overridable via env.
- Standalone Vercel app; portfolio wiring later from PatrickRobelWeb.

## Milestones

1. DONE 2026-07-28: design session (spec + this plan).
2. DONE 2026-07-28: MVP built: capture/compress, /api/ingredients, chips editing,
   /api/recipes, three ranked suggestions, preferences, PWA, tests.
3. DONE 2026-07-28: deployed to Vercel with OPENAI_API_KEY, live at
   `https://fridgechef.patrickrobel.dk` (also `fridgechef-seven.vercel.app`), verified
   end-to-end with a real fridge photo (16 ingredients, 3 ranked Danish recipes).
4. DONE 2026-07-28: portfolio entry on patrickrobel.dk (PatrickRobelWeb PR #148,
   /fridgechef redirect, featured rank 12).
5. Later: TodoList shopping-list integration (issue #1), weekly mode, phone camera test
   by Patrick.
