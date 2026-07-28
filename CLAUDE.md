@AGENTS.md

# CLAUDE.md, FridgeChef (Patrick, pr@zrm.dk)

Fridge photo in (OpenAI vision), dinner suggestions + recipes out. V1 built 2026-07-28;
design spec: `docs/superpowers/specs/2026-07-28-fridgechef-design.md`, decisions and
milestones: `PLAN.md`.

## Facts

- Repo: `patr7257/FridgeChef` (public). Local clone at
  `C:\Users\pr\repos\1-Personal\FridgeChef`, sibling to `PatrickRobelWeb`.
- Stack: Next.js App Router + TypeScript + Tailwind 4, pnpm, Vercel. Tests with vitest
  (`pnpm test`).
- Two-step flow: `POST /api/ingredients` (vision, editable chips) then
  `POST /api/recipes` (text). Models default to gpt-5-mini via `src/lib/ai.ts`,
  overridable with `OPENAI_VISION_MODEL` / `OPENAI_TEXT_MODEL`.
- `OPENAI_API_KEY` server-side only. No photo retention: process and discard, the UI
  says so. Size caps + best-effort in-memory rate limit in `src/lib/ratelimit.ts`; the
  real budget guard is the spend cap on the OpenAI key.
- Danish-only UI (real æ/ø/å). Mobile-first; the camera flow IS the product. PWA:
  `src/app/manifest.ts`, `public/sw.js`, icons regenerated with
  `node scripts/generate-icons.mjs`.
- Showcase relationship: standalone app; the portfolio entry is wired later from the
  PatrickRobelWeb repo. Do not edit PatrickRobelWeb from here.
