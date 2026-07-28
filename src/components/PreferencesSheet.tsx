"use client";

import { useState } from "react";
import type { Diet, Preferences } from "@/lib/schemas";

type Props = {
  open: boolean;
  prefs: Preferences;
  onChange: (prefs: Preferences) => void;
  onClose: () => void;
};

const DIETS: { value: Diet; label: string }[] = [
  { value: "none", label: "Alt" },
  { value: "vegetarian", label: "Vegetarisk" },
  { value: "vegan", label: "Vegansk" },
];

function TagEditor({
  label,
  placeholder,
  items,
  onChange,
}: {
  label: string;
  placeholder: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const value = draft.trim();
    if (!value || items.includes(value)) {
      setDraft("");
      return;
    }
    onChange([...items, value]);
    setDraft("");
  }

  return (
    <div>
      <h3 className="text-sm font-medium">{label}</h3>
      {items.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-center gap-1 rounded-lg bg-surface-raised pl-3 pr-1.5 py-1 text-sm"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(items.filter((i) => i !== item))}
                aria-label={`Fjern ${item}`}
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted hover:text-ember focus-visible:outline-2 focus-visible:outline-accent"
              >
                x
              </button>
            </li>
          ))}
        </ul>
      )}
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          aria-label={label}
          className="grow rounded-xl border border-magnet-edge bg-background px-4 py-2 text-sm placeholder:text-muted/70 focus:outline-2 focus:outline-accent"
        />
        <button
          type="submit"
          className="rounded-xl bg-surface-raised px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-accent"
        >
          Tilføj
        </button>
      </form>
    </div>
  );
}

export function PreferencesSheet({ open, prefs, onChange, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Præferencer"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl border-t border-magnet-edge bg-surface px-5 pb-10 pt-5"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Præferencer</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-surface-raised px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-accent"
          >
            Færdig
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium">Kost</h3>
            <div className="mt-2 flex gap-2" role="radiogroup" aria-label="Kost">
              {DIETS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  role="radio"
                  aria-checked={prefs.diet === d.value}
                  onClick={() => onChange({ ...prefs, diet: d.value })}
                  className={`rounded-xl px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                    prefs.diet === d.value
                      ? "bg-accent font-semibold text-background"
                      : "bg-surface-raised text-muted hover:text-foreground"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <TagEditor
            label="Allergier (bruges aldrig i opskrifter)"
            placeholder="Fx nødder, skaldyr ..."
            items={prefs.allergies}
            onChange={(allergies) => onChange({ ...prefs, allergies })}
          />

          <TagEditor
            label="Kan ikke lide"
            placeholder="Fx svampe, oliven ..."
            items={prefs.dislikes}
            onChange={(dislikes) => onChange({ ...prefs, dislikes })}
          />

          <div>
            <h3 className="text-sm font-medium">Antal personer</h3>
            <div className="mt-2 flex items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...prefs,
                    householdSize: Math.max(1, prefs.householdSize - 1),
                  })
                }
                aria-label="Færre personer"
                className="h-11 w-11 rounded-xl bg-surface-raised text-lg focus-visible:outline-2 focus-visible:outline-accent"
              >
                -
              </button>
              <span className="min-w-8 text-center font-display text-xl font-semibold">
                {prefs.householdSize}
              </span>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...prefs,
                    householdSize: Math.min(8, prefs.householdSize + 1),
                  })
                }
                aria-label="Flere personer"
                className="h-11 w-11 rounded-xl bg-surface-raised text-lg focus-visible:outline-2 focus-visible:outline-accent"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
