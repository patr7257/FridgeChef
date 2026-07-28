import { describe, expect, it } from "vitest";
import {
  IngredientsRequestSchema,
  RecipesRequestSchema,
  dataUrlBytes,
  normalizeRecipes,
  type Recipe,
} from "@/lib/schemas";

const jpeg = (payload: string) => `data:image/jpeg;base64,${payload}`;

describe("IngredientsRequestSchema", () => {
  it("accepts 1 to 3 image data URLs", () => {
    expect(
      IngredientsRequestSchema.safeParse({ images: [jpeg("aaaa")] }).success
    ).toBe(true);
    expect(
      IngredientsRequestSchema.safeParse({
        images: [jpeg("a"), jpeg("b"), jpeg("c")],
      }).success
    ).toBe(true);
  });

  it("rejects zero, four, or non-image entries", () => {
    expect(IngredientsRequestSchema.safeParse({ images: [] }).success).toBe(
      false
    );
    expect(
      IngredientsRequestSchema.safeParse({
        images: [jpeg("a"), jpeg("b"), jpeg("c"), jpeg("d")],
      }).success
    ).toBe(false);
    expect(
      IngredientsRequestSchema.safeParse({ images: ["data:text/plain,hej"] })
        .success
    ).toBe(false);
  });
});

describe("RecipesRequestSchema", () => {
  const preferences = {
    diet: "none",
    allergies: ["nødder"],
    dislikes: [],
    householdSize: 2,
  };

  it("accepts a normal request", () => {
    expect(
      RecipesRequestSchema.safeParse({
        ingredients: ["fløde", "leverpostej"],
        preferences,
      }).success
    ).toBe(true);
  });

  it("rejects empty ingredient lists and out-of-range household sizes", () => {
    expect(
      RecipesRequestSchema.safeParse({ ingredients: [], preferences }).success
    ).toBe(false);
    expect(
      RecipesRequestSchema.safeParse({
        ingredients: ["fløde"],
        preferences: { ...preferences, householdSize: 9 },
      }).success
    ).toBe(false);
  });
});

describe("dataUrlBytes", () => {
  it("approximates decoded size from base64 length", () => {
    // 8 base64 chars decode to 6 bytes
    expect(dataUrlBytes("data:image/jpeg;base64,AAAAAAAA")).toBe(6);
  });
});

describe("normalizeRecipes", () => {
  const recipe = (over: Partial<Recipe>): Recipe => ({
    title: "Ret",
    description: "En ret.",
    cookMinutes: 30,
    completeness: 50,
    usedIngredients: [],
    missingItems: [],
    steps: [],
    ...over,
  });

  it("sorts by completeness descending and keeps at most three", () => {
    const result = normalizeRecipes([
      recipe({ title: "c", completeness: 40 }),
      recipe({ title: "a", completeness: 100 }),
      recipe({ title: "d", completeness: 10 }),
      recipe({ title: "b", completeness: 80 }),
    ]);
    expect(result.map((r) => r.title)).toEqual(["a", "b", "c"]);
  });

  it("clamps completeness to 0-100 and cook time to at least 1", () => {
    const [r] = normalizeRecipes([
      recipe({ completeness: 140, cookMinutes: 0 }),
    ]);
    expect(r.completeness).toBe(100);
    expect(r.cookMinutes).toBe(1);
  });
});
