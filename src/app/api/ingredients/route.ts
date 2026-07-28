import { NextResponse } from "next/server";
import { extractIngredients } from "@/lib/ai";
import { checkRateLimit } from "@/lib/ratelimit";
import {
  IngredientsRequestSchema,
  MAX_IMAGE_BYTES,
  MAX_REQUEST_BYTES,
  dataUrlBytes,
} from "@/lib/schemas";

export const maxDuration = 90;

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

  const parsed = IngredientsRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Send 1 til 3 billeder som JPEG." },
      { status: 400 }
    );
  }

  const sizes = parsed.data.images.map(dataUrlBytes);
  const total = sizes.reduce((a, b) => a + b, 0);
  if (sizes.some((s) => s > MAX_IMAGE_BYTES) || total > MAX_REQUEST_BYTES) {
    return NextResponse.json(
      { error: "Billederne er for store. Prøv igen." },
      { status: 413 }
    );
  }

  try {
    const result = await extractIngredients(parsed.data.images);
    return NextResponse.json(result);
  } catch (err) {
    console.error("ingredients: OpenAI call failed", err);
    return NextResponse.json(
      { error: "Kunne ikke analysere billederne. Prøv igen." },
      { status: 500 }
    );
  }
}
