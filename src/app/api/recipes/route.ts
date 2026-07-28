import { NextResponse } from "next/server";
import { generateRecipes } from "@/lib/ai";
import { checkRateLimit } from "@/lib/ratelimit";
import { RecipesRequestSchema } from "@/lib/schemas";

export const maxDuration = 120;

export async function POST(request: Request) {
  if (!checkRateLimit(request)) {
    return NextResponse.json(
      { error: "For mange forsøg. Vent en times tid og prøv igen." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Ugyldig forespørgsel." },
      { status: 400 }
    );
  }

  const parsed = RecipesRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ingredienslisten kunne ikke læses." },
      { status: 400 }
    );
  }

  try {
    const recipes = await generateRecipes(
      parsed.data.ingredients,
      parsed.data.preferences
    );
    if (recipes.length === 0) {
      return NextResponse.json(
        { error: "Fik ingen opskrifter tilbage. Prøv igen." },
        { status: 500 }
      );
    }
    return NextResponse.json({ recipes });
  } catch (err) {
    console.error("recipes: OpenAI call failed", err);
    return NextResponse.json(
      { error: "Kunne ikke finde opskrifter. Prøv igen." },
      { status: 500 }
    );
  }
}
