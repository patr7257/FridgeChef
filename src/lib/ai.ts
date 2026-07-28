import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import {
  IngredientsExtractionSchema,
  RecipesGenerationSchema,
  normalizeRecipes,
  type IngredientsExtraction,
  type Preferences,
  type Recipe,
} from "@/lib/schemas";

// Created lazily so builds and tests do not require OPENAI_API_KEY.
let client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!client) client = new OpenAI();
  return client;
}

const VISION_MODEL = process.env.OPENAI_VISION_MODEL ?? "gpt-5-mini";
const TEXT_MODEL = process.env.OPENAI_TEXT_MODEL ?? "gpt-5-mini";

const INGREDIENTS_PROMPT = `Du ser billeder af et køleskab og eventuelt et spisekammer i en dansk husholdning.
Lav en liste over de fødevarer og ingredienser du kan genkende på billederne.

Regler:
- Navne på dansk, korte og i ental hvor det er naturligt (fx "leverpostej", "fløde", "rugbrød").
- Medtag kun ting du faktisk kan se eller med rimelighed aflæse af emballagen.
- Kend almindelige danske varer og mærker (leverpostej, remoulade, skyr, makrel i tomat osv.).
- confidence: "high" hvis du er sikker, "medium" hvis sandsynlig, "low" hvis du gætter.
- Ingen dubletter. Spring uspiselige ting over.`;

export async function extractIngredients(
  images: string[]
): Promise<IngredientsExtraction> {
  const response = await getClient().responses.parse({
    model: VISION_MODEL,
    max_output_tokens: 4000,
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: INGREDIENTS_PROMPT },
          ...images.map((dataUrl) => ({
            type: "input_image" as const,
            image_url: dataUrl,
            detail: "auto" as const,
          })),
        ],
      },
    ],
    text: {
      format: zodTextFormat(IngredientsExtractionSchema, "ingredients"),
    },
  });
  return response.output_parsed ?? { ingredients: [] };
}

function preferencesText(prefs: Preferences): string {
  const lines: string[] = [];
  if (prefs.diet === "vegetarian") lines.push("Husstanden er vegetarisk.");
  if (prefs.diet === "vegan") lines.push("Husstanden er vegansk.");
  if (prefs.allergies.length > 0) {
    lines.push(
      `ALLERGIER (hård regel, må ALDRIG indgå): ${prefs.allergies.join(", ")}.`
    );
  }
  if (prefs.dislikes.length > 0) {
    lines.push(`Undgå helst: ${prefs.dislikes.join(", ")}.`);
  }
  lines.push(
    `Husstanden er på ${prefs.householdSize} ${prefs.householdSize === 1 ? "person" : "personer"}; skalér mængderne efter det.`
  );
  return lines.join("\n");
}

export async function generateRecipes(
  ingredients: string[],
  prefs: Preferences
): Promise<Recipe[]> {
  const prompt = `Du er en dansk hverdagskok. En husholdning har disse ingredienser (plus helt almindelige basisvarer som salt, peber, olie, smør, mel og sukker):

${ingredients.join(", ")}

${preferencesText(prefs)}

Foreslå PRÆCIS 3 aftensmadsretter, rangeret efter hvor komplet retten kan laves med det der er:
- completeness: et tal 0-100 for hvor stor en del af retten der kan laves nu (100 = alt er der).
- Foretræk dansk og nordisk hverdagsmad der passer til ingredienserne; andre køkkener er fine når de passer bedre.
- cookMinutes: realistisk samlet tid i minutter.
- usedIngredients: de af husholdningens ingredienser retten bruger (samme navne som i listen).
- missingItems: det der mangler eller ville løfte retten (fx "fløde ville gøre saucen bedre"), tom liste hvis intet mangler.
- steps: 4-8 korte, konkrete trin en travl person kan følge.
- description: en enkelt appetitlig sætning.
- Alt på dansk med rigtige æ, ø og å.`;

  const response = await getClient().responses.parse({
    model: TEXT_MODEL,
    max_output_tokens: 8000,
    input: [{ role: "user", content: [{ type: "input_text", text: prompt }] }],
    text: { format: zodTextFormat(RecipesGenerationSchema, "recipes") },
  });
  const parsed = response.output_parsed ?? { recipes: [] };
  return normalizeRecipes(parsed.recipes);
}
