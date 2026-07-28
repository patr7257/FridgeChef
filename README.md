# FridgeChef

Take a photo of your open fridge. AI vision figures out what is in there and suggests
three dinners you can actually cook tonight, with a step-by-step recipe and what (if
anything) you are missing. Danish UI, Danish everyday cooking, installable PWA.

**Status: v1 built (2026-07-28).** Design spec in
`docs/superpowers/specs/2026-07-28-fridgechef-design.md`, decisions in `PLAN.md`,
original concept in `IDEA.md`.

## How it works

1. Photograph the fridge (1-3 photos). Photos are compressed in the browser and never
   stored on the server.
2. `POST /api/ingredients` (OpenAI vision) returns recognized ingredients as editable
   chips, so you can fix mistakes before spending tokens on recipes.
3. `POST /api/recipes` (OpenAI text) returns exactly three suggestions ranked by how
   completely they can be cooked right now, honoring diet, allergies, dislikes, and
   household size from the preferences sheet (localStorage).

## Development

```
pnpm install
pnpm dev
```

Copy `.env.example` to `.env.local` and set `OPENAI_API_KEY` (or run
`.\scripts\setup-env.ps1`). `pnpm lint`, `pnpm test`, `pnpm build` before pushing.

Cost note: image tokens are the expensive part. Keep the spend cap on the OpenAI key;
the in-memory per-IP rate limit (10 runs/hour) is best-effort only.

Live at `https://fridgechef.patrickrobel.dk` (own origin because of the PWA service
worker; `https://www.patrickrobel.dk/fridgechef` redirects there). Portfolio entry lives
in `patr7257/PatrickRobelWeb` (`website/src/data/projects.ts`).
