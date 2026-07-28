"use client";

import { useState } from "react";
import { compressImage } from "@/lib/images";
import { loadPreferences, savePreferences } from "@/lib/prefs";
import type {
  IngredientsExtraction,
  Preferences,
  Recipe,
} from "@/lib/schemas";
import { CaptureStep } from "@/components/CaptureStep";
import { ChipsStep, type Chip } from "@/components/ChipsStep";
import { SuggestionsStep } from "@/components/SuggestionsStep";
import { PreferencesSheet } from "@/components/PreferencesSheet";

type Step = "capture" | "analyzing" | "chips" | "cooking" | "suggestions";

async function readError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    if (data.error) return data.error;
  } catch {
    // fall through to generic message
  }
  return "Noget gik galt. Prøv igen.";
}

export function FridgeChefApp() {
  const [step, setStep] = useState<Step>("capture");
  const [photos, setPhotos] = useState<string[]>([]);
  const [chips, setChips] = useState<Chip[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  // Lazy init reads localStorage on the client; the server render uses the
  // defaults, which is fine because preferences are not in the initial DOM.
  const [prefs, setPrefs] = useState<Preferences>(loadPreferences);
  const [prefsOpen, setPrefsOpen] = useState(false);

  function updatePrefs(next: Preferences) {
    setPrefs(next);
    savePreferences(next);
  }

  async function addPhotos(files: File[]) {
    setError(null);
    try {
      const compressed = await Promise.all(files.map(compressImage));
      setPhotos((prev) => [...prev, ...compressed].slice(0, 3));
    } catch {
      setError("Kunne ikke læse billedet. Prøv et andet.");
    }
  }

  async function analyze() {
    setError(null);
    setStep("analyzing");
    try {
      const res = await fetch("/api/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: photos }),
      });
      if (!res.ok) throw new Error(await readError(res));
      const data = (await res.json()) as IngredientsExtraction;
      if (data.ingredients.length === 0) {
        throw new Error(
          "Kunne ikke genkende noget på billederne. Prøv med mere lys eller tættere på."
        );
      }
      setChips(
        data.ingredients.map((i, idx) => ({
          id: `${idx}-${i.name}`,
          name: i.name,
          uncertain: i.confidence === "low",
        }))
      );
      setStep("chips");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noget gik galt. Prøv igen.");
      setStep("capture");
    }
  }

  async function suggest() {
    setError(null);
    setStep("cooking");
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: chips.map((c) => c.name),
          preferences: prefs,
        }),
      });
      if (!res.ok) throw new Error(await readError(res));
      const data = (await res.json()) as { recipes: Recipe[] };
      setRecipes(data.recipes);
      setStep("suggestions");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noget gik galt. Prøv igen.");
      setStep("chips");
    }
  }

  function restart() {
    setPhotos([]);
    setChips([]);
    setRecipes([]);
    setError(null);
    setStep("capture");
  }

  return (
    <div className="mx-auto flex w-full max-w-md grow flex-col px-4 pb-8 pt-6">
      <header className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={restart}
          className="font-display text-2xl font-semibold tracking-tight text-foreground"
        >
          Fridge<span className="text-accent">Chef</span>
        </button>
        <button
          type="button"
          onClick={() => setPrefsOpen(true)}
          aria-label="Præferencer"
          className="rounded-full bg-surface px-4 py-2 text-sm text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
        >
          Præferencer
        </button>
      </header>

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ember"
        >
          {error}
        </p>
      )}

      {(step === "capture" || step === "analyzing") && (
        <CaptureStep
          photos={photos}
          busy={step === "analyzing"}
          onAddPhotos={addPhotos}
          onRemovePhoto={(idx) =>
            setPhotos((prev) => prev.filter((_, i) => i !== idx))
          }
          onAnalyze={analyze}
        />
      )}

      {(step === "chips" || step === "cooking") && (
        <ChipsStep
          chips={chips}
          busy={step === "cooking"}
          onChange={setChips}
          onBack={() => setStep("capture")}
          onSuggest={suggest}
        />
      )}

      {step === "suggestions" && (
        <SuggestionsStep
          recipes={recipes}
          onBack={() => setStep("chips")}
          onRestart={restart}
        />
      )}

      <PreferencesSheet
        open={prefsOpen}
        prefs={prefs}
        onChange={updatePrefs}
        onClose={() => setPrefsOpen(false)}
      />
    </div>
  );
}
