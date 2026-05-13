import { NextResponse } from "next/server";

type RecommendationIntent = {
  destinatario: string;
  ocasion: string;
  presupuestoMax: number | null;
  personalidad: string;
  edad: number | null;
  necesitaMensaje: boolean;
  necesitaEmpaque: boolean;
};

function normalizeIntent(value: Partial<RecommendationIntent>): RecommendationIntent {
  return {
    destinatario: typeof value.destinatario === "string" ? value.destinatario : "",
    ocasion: typeof value.ocasion === "string" ? value.ocasion : "",
    presupuestoMax:
      typeof value.presupuestoMax === "number" && Number.isFinite(value.presupuestoMax)
        ? value.presupuestoMax
        : null,
    personalidad: typeof value.personalidad === "string" ? value.personalidad : "",
    edad:
      typeof value.edad === "number" && Number.isFinite(value.edad)
        ? value.edad
        : null,
    necesitaMensaje:
      typeof value.necesitaMensaje === "boolean" ? value.necesitaMensaje : true,
    necesitaEmpaque:
      typeof value.necesitaEmpaque === "boolean" ? value.necesitaEmpaque : false,
  };
}

function extractJsonFromText(text: string) {
  const clean = text.trim();

  try {
    return JSON.parse(clean);
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found");
    return JSON.parse(match[0]);
  }
}

export async function POST(request: Request) {
  try {
    const { prompt } = (await request.json()) as { prompt?: string };

    if (!prompt || prompt.trim().length < 4) {
      return NextResponse.json(
        {
          success: false,
          error: "Escribe una idea un poco más completa para recomendarte mejor.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || "openrouter/free";

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Falta configurar OPENROUTER_API_KEY.",
        },
        { status: 500 }
      );
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-OpenRouter-Title": "Emotia",
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        messages: [
          {
            role: "system",
            content: [
              "Eres un extractor de intención para un marketplace de regalos llamado Emotia.",
              "Tu trabajo NO es recomendar productos ni inventar productos.",
              "Tu trabajo es convertir texto libre del usuario en JSON válido.",
              "Responde SOLO JSON, sin markdown, sin explicación y sin texto adicional.",
            ].join(" "),
          },
          {
            role: "user",
            content: `
Convierte esta frase en JSON para recomendar regalos:

"${prompt}"

Devuelve exactamente esta forma:

{
  "destinatario": "",
  "ocasion": "",
  "presupuestoMax": null,
  "personalidad": "",
  "edad": null,
  "necesitaMensaje": true,
  "necesitaEmpaque": false
}

Reglas:
- destinatario: texto corto. Ejemplos: "mamá", "novia", "amigo", "niño".
- ocasion: cumpleaños, aniversario, día de la madre, día del niño, navidad, graduación, amor, amistad, agradecimiento, evento formal, u otra si aparece.
- presupuestoMax: número en bolivianos si aparece. Si dice "menos de 250", devuelve 250. Si no aparece, devuelve null.
- personalidad: romántico, elegante, divertido, creativo, gamer, foodie, minimalista, kawaii, detallista, fanático, infantil, premium, tierno, sorpresa, u otra si aparece.
- edad: número si aparece. Si no aparece, devuelve null.
- necesitaMensaje: true si menciona tarjeta, mensaje, dedicatoria o si no está claro.
- necesitaEmpaque: true si menciona empaque, caja, presentación premium o envoltura.
`.trim(),
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", data);

      return NextResponse.json(
        {
          success: false,
          error: "No se pudo interpretar tu solicitud con IA.",
        },
        { status: 502 }
      );
    }

    const content = data?.choices?.[0]?.message?.content;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "La IA no devolvió una respuesta válida.",
        },
        { status: 502 }
      );
    }

    const parsed = extractJsonFromText(content) as Partial<RecommendationIntent>;

    return NextResponse.json({
      success: true,
      intent: normalizeIntent(parsed),
    });
  } catch (error) {
    console.error("Error interpretando recomendación:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ocurrió un error al interpretar la recomendación.",
      },
      { status: 500 }
    );
  }
}