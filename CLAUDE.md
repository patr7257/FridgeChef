# CLAUDE.md, FridgeChef (Patrick, pr@zrm.dk)

Idea-stage project: fridge photo in (OpenAI vision), dinner suggestions + recipes out. No
code exists yet; stack deliberately undecided until the design session.

## Facts

- Repo: `patr7257/FridgeChef` (public).
- Local clone lives at `C:\Users\pr\repos\1-Personal\FridgeChef`, sibling to
  `PatrickRobelWeb` (same convention as MusicTimelineQuiz and MiniGames).
- Showcase relationship: this repo holds the project; where it plugs into the website is
  decided later and wired from the PatrickRobelWeb repo via its `add-website-project`
  skill. Do not edit PatrickRobelWeb from here.
- API: OpenAI vision-capable model, `OPENAI_API_KEY` server-side only. Image upload means
  the backend route accepts photos; photos of fridges are harmless but still user uploads
  (size caps, no retention in v1).
- Mobile-first: the camera flow IS the product. Danish UI likely (æ/ø/å, global rule).

## Read first

- `IDEA.md`: full concept, feature sketch, and the "Questions for Patrick" section that a
  design session MUST walk through (AskUserQuestion) before writing any code.
- `PLAN.md`: skeleton to be filled in the design session.
