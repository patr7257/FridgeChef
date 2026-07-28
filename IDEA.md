# Idea: Fridge Chef

From the 2026-07-27 brainstorm (idea #5 of 30). Tag: practical (daily-life).

## Concept

Open the app on your phone at 17:30, photograph the open fridge (and optionally the
pantry shelf), and get three concrete dinner ideas ranked by "you can make this right
now". Each suggestion shows the recognized ingredients it uses, a short recipe, cook time,
and a missing-items line ("works better with cream, you appear to have none"). Vision
model does ingredient recognition and recipe generation in one flow.

## Why

Answers the single most-asked household question with the least possible input effort.
Also a flashy vision-API showcase for the portfolio.

## Feature sketch

- Phone camera capture (or upload), 1-3 photos per run.
- Recognized-ingredients list shown as editable chips (fix the model's mistakes: "that is
  leverpostej, not chocolate spread") before generating recipes.
- Three suggestions ranked by completeness; each expands to a full recipe.
- Preference memory (localStorage): vegetarian, allergies, dislikes, household size.
- "Missing items" doubles as a shopping list; possible tie-in to the TodoList API later
  (same pattern as the Activity Tinder integration in BoredAPIActivityWheel).
- Stretch: weekly mode (photo Sunday, plan 3 dinners), Danish staples awareness.

## API and cost facts

- OpenAI vision model; image tokens cost more than text, so per-run cost is the highest
  in this idea batch. Resize/compress client-side before upload to control it.
- Two-step flow (1: vision extracts ingredient list, 2: text model generates recipes)
  makes the chips-editing step natural and keeps the expensive vision call to once per run.
- Public endpoint needs the usual rate limit + budget cap, plus upload size caps.
- No photo retention in v1: process and discard, say so in the UI.

## Questions for Patrick (ask via AskUserQuestion in the design session, before coding)

1. Personal/household tool first, or public showcase from day one? (Cost exposure differs
   a lot with image calls.)
2. UI language: Danish, English, or toggle? Should recipes lean Danish everyday cooking?
3. Are dietary preferences/allergies needed in v1, or is that stretch?
4. Shopping-list tie-in to your TodoList API: wanted eventually, in v1, or never?
5. PWA install (like /todo) so it feels like a native camera app, or plain web page v1?
6. Where on the website: own route or portfolio entry linking a standalone app?

## Open questions for the design session (technical)

- Serving pattern; upload route limits; client-side image compression approach.
- One-shot vs two-step (vision then recipes) flow; chips-editing UX.
- Model choice and cost per run measured with real fridge photos.
