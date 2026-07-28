"use client";

import { useRef } from "react";
/* eslint-disable @next/next/no-img-element */

type Props = {
  photos: string[];
  busy: boolean;
  onAddPhotos: (files: File[]) => void;
  onRemovePhoto: (index: number) => void;
  onAnalyze: () => void;
};

export function CaptureStep({
  photos,
  busy,
  onAddPhotos,
  onRemovePhoto,
  onAnalyze,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex grow flex-col">
      {photos.length === 0 && (
        <div className="mb-8 mt-4">
          <h1 className="font-display text-4xl font-semibold leading-tight">
            Hvad skal vi have til aftensmad?
          </h1>
          <p className="mt-3 text-muted">
            Tag et billede af dit åbne køleskab, så finder FridgeChef tre
            retter du kan lave nu.
          </p>
        </div>
      )}

      {photos.length > 0 && (
        <ul className="mb-4 grid grid-cols-3 gap-2">
          {photos.map((src, idx) => (
            <li key={idx} className="relative">
              <img
                src={src}
                alt={`Billede ${idx + 1} af køleskabet`}
                className="aspect-square w-full rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={() => onRemovePhoto(idx)}
                aria-label={`Fjern billede ${idx + 1}`}
                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-accent"
              >
                x
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        hidden
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length > 0) onAddPhotos(files);
          e.target.value = "";
        }}
      />

      <div className="mt-auto flex flex-col gap-3">
        {photos.length < 3 && (
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className={
              photos.length === 0
                ? "rounded-2xl bg-accent px-6 py-4 text-lg font-semibold text-background transition-colors hover:bg-accent-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
                : "rounded-2xl bg-surface px-6 py-3 text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50"
            }
          >
            {photos.length === 0 ? "Tag billede" : "Tilføj billede"}
          </button>
        )}

        {photos.length > 0 && (
          <button
            type="button"
            disabled={busy}
            onClick={onAnalyze}
            className="rounded-2xl bg-accent px-6 py-4 text-lg font-semibold text-background transition-colors hover:bg-accent-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-70"
          >
            {busy ? "Kigger i køleskabet ..." : "Find ingredienser"}
          </button>
        )}

        <p className="text-center text-xs text-muted">
          Billederne analyseres og gemmes ikke.
        </p>
      </div>
    </div>
  );
}
