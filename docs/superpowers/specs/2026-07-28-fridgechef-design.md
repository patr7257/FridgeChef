# FridgeChef v1 design (2026-07-28)

Decisions taken with Patrick via AskUserQuestion in the design session. See IDEA.md for
the original concept.

## Product

Photograph the open fridge on your phone, get three dinner suggestions you can cook right
now. Danish UI and Danish everyday cooking. Personal/household tool first (unlisted URL),
public showcase later. Installable PWA.

## Decisions

| Question | Decision |
|---|---|
| Audience | Personal first, no auth wall, unlisted URL |
| Language | Danish only, recipes lean Danish everyday cooking |
| Preferences | Full structured preferences in v1 (localStorage) |
| Shopping-list/TodoList tie-in | Later, tracked as GitHub issue |
| PWA | Yes, in v1 |
| Stack | Next.js App Router + TypeScript + Tailwind, pnpm, Vercel |
| Placement | Standalone app; portfolio wiring later from PatrickRobelWeb |

## Architecture

Two-step flow so the expensive vision call happens once per run and the user can correct
recognition mistakes before recipes are generated.

### API (Next.js route handlers, `OPENAI_API_KEY` server-side only)

1. `POST /api/ingredients`
   - Input: 1-3 client-compressed JPEG data URLs. Max ~1.5 MB per image, request body
     hard-capped at 4.5 MB. Reject anything else with a Danish error message.
   - Calls the vision model (`OPENAI_VISION_MODEL`, default `gpt-5-mini`) with a prompt
     that returns recognized food items in Danish.
   - Output (zod structured output): `{ ingredients: [{ name, confidence }] }`.
   - Photos are processed and discarded; nothing is stored. The UI says so.
2. `POST /api/recipes`
   - Input: confirmed ingredient names + preferences (diet, allergies, dislikes,
     household size).
   - Calls the text model (`OPENAI_TEXT_MODEL`, default `gpt-5-mini`).
   - Output: exactly 3 suggestions, each `{ title, description, cookMinutes,
     completeness (0-100), usedIngredients, missingItems, steps[] }`, sorted by
     completeness descending. Danish everyday cooking, respects preferences strictly
     (allergies are hard constraints).

Both routes share a best-effort in-memory per-IP rate limiter (10 runs/hour). Known
limitation: resets per serverless instance; acceptable for an unlisted personal v1.
Real budget protection is the spend cap on the OpenAI project key.

### Client (single mobile-first page)

Flow states: capture -> chips -> suggestions -> recipe detail.

- Capture: file input with `capture="environment"`, 1-3 photos, thumbnails, canvas
  compression (max 1024 px long edge, JPEG quality 0.7) before upload.
- Chips: recognized ingredients as editable chips: delete, rename, add.
- Suggestions: three cards ranked by completeness with badge, cook time, missing-items
  line. Expand to full recipe steps. Copy-missing-items button (precursor to the
  TodoList integration).
- Preferences: settings sheet, persisted in localStorage: diet (none/vegetarian/vegan),
  allergy chips, dislike chips, household size (1-8). Sent with every recipes call.

### PWA

`manifest.webmanifest`, maskable icons, minimal service worker (app shell only, all
`/api/*` network-only), Apple meta tags. No offline recipe cache in v1.

## Not in v1

TodoList shopping-list integration (GitHub issue), weekly mode, English toggle, photo
retention, Redis-backed rate limiting.

## Verification

Lint, unit tests (validation, ranking, compression sizing math), build, dev-server smoke
test with a sample food photo, one real end-to-end OpenAI run with cost noted, PWA
install check on the deployed Vercel URL.
