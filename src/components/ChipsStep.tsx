"use client";

import { useState } from "react";

export type Chip = {
  id: string;
  name: string;
  uncertain: boolean;
};

type Props = {
  chips: Chip[];
  busy: boolean;
  onChange: (chips: Chip[]) => void;
  onBack: () => void;
  onSuggest: () => void;
};

export function ChipsStep({ chips, busy, onChange, onBack, onSuggest }: Props) {
  const [draft, setDraft] = useState("");

  function addChip() {
    const name = draft.trim();
    if (!name) return;
    onChange([
      ...chips,
      { id: `manual-${Date.now()}-${name}`, name, uncertain: false },
    ]);
    setDraft("");
  }

  function renameChip(id: string) {
    const chip = chips.find((c) => c.id === id);
    if (!chip) return;
    const name = window.prompt("Ret ingrediens", chip.name)?.trim();
    if (!name) return;
    onChange(
      chips.map((c) => (c.id === id ? { ...c, name, uncertain: false } : c))
    );
  }

  return (
    <div className="flex grow flex-col">
      <h2 className="font-display text-2xl font-semibold">
        Fandt {chips.length} {chips.length === 1 ? "ting" : "ting"} i
        køleskabet
      </h2>
      <p className="mt-2 text-sm text-muted">
        Ret listen før vi finder opskrifter: tryk på en ingrediens for at rette
        den, tryk på krydset for at fjerne den.
      </p>

      <ul className="mt-5 flex flex-wrap gap-2.5" aria-label="Ingredienser">
        {chips.map((chip) => (
          <li
            key={chip.id}
            className={`magnet flex items-center gap-1 rounded-lg border bg-surface-raised pl-3 pr-1.5 py-1.5 text-sm ${
              chip.uncertain
                ? "border-dashed border-muted/60 text-muted"
                : "border-magnet-edge text-foreground"
            }`}
          >
            <button
              type="button"
              onClick={() => renameChip(chip.id)}
              title={chip.uncertain ? "Usikkert gæt, tryk for at rette" : "Tryk for at rette"}
              className="focus-visible:outline-2 focus-visible:outline-accent"
            >
              {chip.name}
              {chip.uncertain && <span aria-hidden="true"> ?</span>}
            </button>
            <button
              type="button"
              onClick={() => onChange(chips.filter((c) => c.id !== chip.id))}
              aria-label={`Fjern ${chip.name}`}
              className="flex h-6 w-6 items-center justify-center rounded-md text-muted hover:text-ember focus-visible:outline-2 focus-visible:outline-accent"
            >
              x
            </button>
          </li>
        ))}
      </ul>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addChip();
        }}
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Tilføj ingrediens ..."
          aria-label="Tilføj ingrediens"
          className="grow rounded-xl border border-magnet-edge bg-surface px-4 py-2.5 text-sm placeholder:text-muted/70 focus:outline-2 focus:outline-accent"
        />
        <button
          type="submit"
          className="rounded-xl bg-surface-raised px-4 py-2.5 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-accent"
        >
          Tilføj
        </button>
      </form>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <button
          type="button"
          disabled={busy || chips.length === 0}
          onClick={onSuggest}
          className="rounded-2xl bg-accent px-6 py-4 text-lg font-semibold text-background transition-colors hover:bg-accent-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-70"
        >
          {busy ? "Finder opskrifter ..." : "Foreslå aftensmad"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onBack}
          className="rounded-2xl px-6 py-2 text-sm text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
        >
          Tilbage til billeder
        </button>
      </div>
    </div>
  );
}
