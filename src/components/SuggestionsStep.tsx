"use client";

import { useState } from "react";
import type { Recipe } from "@/lib/schemas";

type Props = {
  recipes: Recipe[];
  onBack: () => void;
  onRestart: () => void;
};

function CompletenessBadge({ value }: { value: number }) {
  if (value >= 95) {
    return (
      <span className="rounded-full bg-herb/15 px-2.5 py-1 text-xs font-medium text-herb">
        Kan laves nu
      </span>
    );
  }
  return (
    <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">
      {value} % på plads
    </span>
  );
}

function RecipeCard({ recipe, rank }: { recipe: Recipe; rank: number }) {
  const [open, setOpen] = useState(rank === 1);
  const [copied, setCopied] = useState(false);

  async function copyMissing() {
    try {
      await navigator.clipboard.writeText(recipe.missingItems.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked; nothing sensible to do
    }
  }

  return (
    <li className="rounded-2xl border border-magnet-edge bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-3 rounded-2xl px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-accent"
      >
        <span>
          <span className="font-display text-xl font-semibold leading-snug">
            {recipe.title}
          </span>
          <span className="mt-1 block text-sm text-muted">
            {recipe.description}
          </span>
        </span>
        <span className="mt-1 shrink-0 text-muted" aria-hidden="true">
          {open ? "-" : "+"}
        </span>
      </button>

      <div className="flex flex-wrap items-center gap-2 px-5 pb-4">
        <CompletenessBadge value={recipe.completeness} />
        <span className="rounded-full bg-surface-raised px-2.5 py-1 text-xs text-muted">
          {recipe.cookMinutes} min
        </span>
      </div>

      {open && (
        <div className="border-t border-magnet-edge px-5 py-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Du bruger
          </h4>
          <p className="mt-1 text-sm">{recipe.usedIngredients.join(", ")}</p>

          {recipe.missingItems.length > 0 && (
            <>
              <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-ember">
                Mangler
              </h4>
              <ul className="mt-1 list-inside list-disc text-sm text-muted">
                {recipe.missingItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={copyMissing}
                className="mt-2 rounded-lg bg-surface-raised px-3 py-1.5 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-accent"
              >
                {copied ? "Kopieret" : "Kopiér indkøbsliste"}
              </button>
            </>
          )}

          <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">
            Sådan gør du
          </h4>
          <ol className="mt-1 space-y-2 text-sm">
            {recipe.steps.map((step, idx) => (
              <li key={idx} className="flex gap-2.5">
                <span className="font-display font-semibold text-accent">
                  {idx + 1}.
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </li>
  );
}

export function SuggestionsStep({ recipes, onBack, onRestart }: Props) {
  return (
    <div className="flex grow flex-col">
      <h2 className="font-display text-2xl font-semibold">
        Tre forslag til i aften
      </h2>
      <p className="mt-2 text-sm text-muted">
        Rangeret efter hvor meget du allerede har i køleskabet.
      </p>

      <ol className="mt-5 space-y-3">
        {recipes.map((recipe, idx) => (
          <RecipeCard key={recipe.title} recipe={recipe} rank={idx + 1} />
        ))}
      </ol>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-2xl bg-accent px-6 py-4 text-lg font-semibold text-background transition-colors hover:bg-accent-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Ny søgning
        </button>
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl px-6 py-2 text-sm text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
        >
          Tilbage til ingredienser
        </button>
      </div>
    </div>
  );
}
