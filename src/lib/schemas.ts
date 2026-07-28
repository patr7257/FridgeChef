import { z } from "zod";

// Preferences (stored in localStorage on the client, sent with every recipes call)

export const DietSchema = z.enum(["none", "vegetarian", "vegan"]);
export type Diet = z.infer<typeof DietSchema>;

export const PreferencesSchema = z.object({
  diet: DietSchema,
  allergies: z.array(z.string().min(1).max(40)).max(20),
  dislikes: z.array(z.string().min(1).max(40)).max(20),
  householdSize: z.number().int().min(1).max(8),
});
export type Preferences = z.infer<typeof PreferencesSchema>;

export const DEFAULT_PREFERENCES: Preferences = {
  diet: "none",
  allergies: [],
  dislikes: [],
  householdSize: 2,
};

// Request bodies

export const MAX_IMAGES = 3;
export const MAX_IMAGE_BYTES = 1_500_000;
export const MAX_REQUEST_BYTES = 4_500_000;

export const IngredientsRequestSchema = z.object({
  images: z
    .array(z.string().startsWith("data:image/"))
    .min(1)
    .max(MAX_IMAGES),
});
export type IngredientsRequest = z.infer<typeof IngredientsRequestSchema>;

export const RecipesRequestSchema = z.object({
  ingredients: z.array(z.string().min(1).max(60)).min(1).max(60),
  preferences: PreferencesSchema,
});
export type RecipesRequest = z.infer<typeof RecipesRequestSchema>;

// Model output schemas (OpenAI structured outputs; keep keywords simple, no numeric
// bounds, they are enforced in prompts and clamped in code)

export const ConfidenceSchema = z.enum(["high", "medium", "low"]);
export type Confidence = z.infer<typeof ConfidenceSchema>;

export const IngredientsExtractionSchema = z.object({
  ingredients: z.array(
    z.object({
      name: z.string(),
      confidence: ConfidenceSchema,
    })
  ),
});
export type IngredientsExtraction = z.infer<typeof IngredientsExtractionSchema>;

export const RecipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  cookMinutes: z.number(),
  completeness: z.number(),
  usedIngredients: z.array(z.string()),
  missingItems: z.array(z.string()),
  steps: z.array(z.string()),
});
export type Recipe = z.infer<typeof RecipeSchema>;

export const RecipesGenerationSchema = z.object({
  recipes: z.array(RecipeSchema),
});
export type RecipesGeneration = z.infer<typeof RecipesGenerationSchema>;

/** Approximate decoded byte size of a base64 data URL. */
export function dataUrlBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(",");
  const base64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  return Math.floor((base64.length * 3) / 4);
}

/** Clamp completeness to 0-100 and sort best-first, keeping at most three recipes. */
export function normalizeRecipes(recipes: Recipe[]): Recipe[] {
  return recipes
    .map((r) => ({
      ...r,
      completeness: Math.max(0, Math.min(100, Math.round(r.completeness))),
      cookMinutes: Math.max(1, Math.round(r.cookMinutes)),
    }))
    .sort((a, b) => b.completeness - a.completeness)
    .slice(0, 3);
}
