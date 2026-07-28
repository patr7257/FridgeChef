# HANDOVER.md

## Date, branch, PR, CI

- 2026-07-28, branch `main` (this repo commits straight to main; no open PR, no CI).
- Related repo: PatrickRobelWeb PR #148 (portfolio entry) MERGED with green checks.

## TLDR of session outcome

- DONE: FridgeChef v1 designed (spec committed), built, tested (lint, 14 vitest tests,
  build), and deployed. Two-step OpenAI flow (vision -> editable chips -> 3 ranked
  Danish recipes), full preferences, PWA, size caps + rate limit, no photo retention.
- DONE: live at `https://fridgechef.patrickrobel.dk` (own origin, A record at
  simply.com) and `https://fridgechef-seven.vercel.app`. OPENAI_API_KEY set in Vercel
  (Production + Preview). End-to-end verified with a real fridge photo: 16 ingredients,
  3 recipes ranked 100/95/80, roughly 1 to 2 cents per run on gpt-5-mini.
- DONE: portfolio card + detail page on patrickrobel.dk (violet accent, chefHat icon,
  featuredRank 12) plus `/fridgechef` redirect.
- NOT done: Patrick has not yet tested the camera flow on a real phone photo of his own
  fridge, and the PWA install prompt on the phone is unverified.

## Prioritized next steps

1. Test on the phone: open `https://fridgechef.patrickrobel.dk`, photograph the real
   fridge, check chips editing and recipes; install via "Føj til hjemmeskærm".
2. Set a monthly spend cap on the OpenAI key (platform.openai.com billing limits) if
   not already done; prepaid credit is the current guard.
3. Pick up issue #1 (TodoList shopping-list tie-in) when wanted.
4. Consider a rate-limit upgrade (Upstash Redis) only if the app is ever shared beyond
   the household.

## Verbatim resume commands

```
cd "C:\Users\pr\repos\1-Personal\FridgeChef"; pnpm dev
```

```
cd "C:\Users\pr\repos\1-Personal\FridgeChef"; .\scripts\setup-env.ps1
```

```
cd "C:\Users\pr\repos\1-Personal\FridgeChef"; pnpm lint; pnpm test; pnpm build
```

## Gotchas discovered this session

- create-next-app 16 generates its own CLAUDE.md (`@AGENTS.md`); moving a scaffold into
  a repo with `Move-Item -Force` clobbers the real CLAUDE.md. Restored from git; the
  repo CLAUDE.md now starts with `@AGENTS.md` plus the project content.
- pnpm node_modules cannot be moved between folders (virtual store path breaks);
  delete and `pnpm install` fresh instead.
- Editing files with PowerShell `-replace`/`Set-Content` mangles Danish letters
  (UTF-8 read as ANSI). Use the Write/Edit tools for any file containing æ/ø/å.
- `new OpenAI()` at module level breaks `next build` without a key; the client is
  created lazily in `src/lib/ai.ts`.
- The Vercel production alias is `fridgechef-seven.vercel.app` (`fridgechef.vercel.app`
  was taken); `fridgechef-przrms-projects.vercel.app` sits behind Vercel SSO.
- gpt-5-mini vision call ~23s, recipes ~44s; route maxDuration is 90/120s.

## Open decisions waiting on Patrick

- None blocking. Optional: want the deep-dive gated write-up on the portfolio entry
  later? (Currently public entry only.)

## Environment state

- Dev server stopped, no docker, no cron jobs, keep-awake OFF (lid-close sleep
  restored), no orphaned worktrees, website repo back on synced main with the feature
  branch deleted. Vercel project `fridgechef` linked in `.vercel/`.
