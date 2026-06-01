import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stackServerApp } from "@/lib/stack";

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

async function getCatalogUsuarioId() {
  const currentUser = await stackServerApp.getUser({ or: "return-null" });

  if (!currentUser?.primaryEmail) {
    return null;
  }

  const usuario = await prisma.usuarios.findUnique({
    where: {
      email: currentUser.primaryEmail,
    },
    select: {
      id: true,
    },
  });

  return usuario?.id ?? null;
}

function normalizarTextoReporte(value: string) {
  return value.trim().toLowerCase();
}

function normalizarPersonalidad(value: string) {
  const personalidad = normalizarTextoReporte(value);

  if (!personalidad) return [];

  return personalidad
    .split(/[,\s/]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);
}

export async function POST(request: Request) {
  try {
      const body = (await request.json()) as {
    prompt?: string;
    intent?: Partial<RecommendationIntent>;
    productosSugeridos?: number[];
  };

  const { prompt } = body;
  const usuarioId = await getCatalogUsuarioId();

  if (!usuarioId) {
    return NextResponse.json(
      {
        success: false,
        authRequired: true,
        error: "Inicia sesión para usar las recomendaciones inteligentes de Emotia.",
      },
      { status: 401 }
    );
  }
    if (body.intent) {
    const intent = normalizeIntent(body.intent);
    let recomendacionId: number | null = null;

    try {
  const productosSugeridos = Array.isArray(body.productosSugeridos)
    ? body.productosSugeridos
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0)
        .slice(0, 12)
    : [];

  const recomendacion = await prisma.recomendaciones.create({
    data: {
      usuario_id: usuarioId,
      destinatario_rel: intent.destinatario
        ? normalizarTextoReporte(intent.destinatario)
        : null,
      destinatario_edad: intent.edad,
      destinatario_genero: "cualquiera",
      personalidad: normalizarPersonalidad(intent.personalidad),
      ocasion: intent.ocasion ? normalizarTextoReporte(intent.ocasion) : null,
      presupuesto_min: null,
      presupuesto_max: intent.presupuestoMax,
      productos_sugeridos: productosSugeridos,
      productos_elegidos: [],
      producto_elegido: null,
      convertida_en_compra: false,
    },
    select: {
      id: true,
    },
  });

  recomendacionId = recomendacion.id;
} catch (error) {
  console.error("No se pudo registrar la recomendación manual:", error);
}

    return NextResponse.json({
      success: true,
      intent,
      recomendacionId,
    });
  }
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
    const intent = normalizeIntent(parsed);

    let recomendacionId: number | null = null;

    try {
      const usuarioId = await getCatalogUsuarioId();

      if (usuarioId) {
        const recomendacion = await prisma.recomendaciones.create({
          data: {
            usuario_id: usuarioId,
            destinatario_rel: intent.destinatario
              ? normalizarTextoReporte(intent.destinatario)
              : null,
            destinatario_edad: intent.edad,
            destinatario_genero: "cualquiera",
            personalidad: normalizarPersonalidad(intent.personalidad),
            ocasion: intent.ocasion ? normalizarTextoReporte(intent.ocasion) : null,
            presupuesto_min: null,
            presupuesto_max: intent.presupuestoMax,
            productos_sugeridos: [],
            productos_elegidos: [],
            producto_elegido: null,
            convertida_en_compra: false,
          },
          select: {
            id: true,
          },
        });

        recomendacionId = recomendacion.id;
      }
    } catch (error) {
      console.error("No se pudo registrar la recomendación IA:", error);
    }

    return NextResponse.json({
      success: true,
      intent,
      recomendacionId,
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
export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      recomendacionId?: number;
      productosSugeridos?: number[];
      productoElegido?: number;
      convertidaEnCompra?: boolean;
    };

    const recomendacionId = Number(body.recomendacionId);

    if (!Number.isInteger(recomendacionId) || recomendacionId <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Recomendación inválida.",
        },
        { status: 400 }
      );
    }

    const usuarioId = await getCatalogUsuarioId();

    if (!usuarioId) {
      return NextResponse.json(
        {
          success: false,
          error: "Usuario no autenticado.",
        },
        { status: 401 }
      );
    }

    const data: {
      productos_sugeridos?: number[];
      productos_elegidos?: number[];
      producto_elegido?: number;
      convertida_en_compra?: boolean;
    } = {};

    if (Array.isArray(body.productosSugeridos)) {
      data.productos_sugeridos = body.productosSugeridos
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0)
        .slice(0, 12);
    }

    if (body.productoElegido !== undefined && body.productoElegido !== null) {
  const productoElegido = Number(body.productoElegido);

  if (Number.isInteger(productoElegido) && productoElegido > 0) {
    const recomendacionActual = await prisma.recomendaciones.findFirst({
      where: {
        id: recomendacionId,
        usuario_id: usuarioId,
      },
      select: {
        producto_elegido: true,
        productos_elegidos: true,
      },
    });

    if (!recomendacionActual) {
      return NextResponse.json(
        {
          success: false,
          error: "No se encontró la recomendación para este usuario.",
          debug: {
            recomendacionId,
            usuarioId,
          },
        },
        { status: 404 }
      );
    }

    const productosElegidosActuales =
      recomendacionActual.productos_elegidos || [];

    const productosElegidos = Array.from(
      new Set([...productosElegidosActuales, productoElegido])
    );

    data.productos_elegidos = productosElegidos;

    if (!recomendacionActual.producto_elegido) {
      data.producto_elegido = productoElegido;
    }
  }
}

    if (typeof body.convertidaEnCompra === "boolean") {
      data.convertida_en_compra = body.convertidaEnCompra;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No hay datos válidos para actualizar.",
        },
        { status: 400 }
      );
    }

    const updated = await prisma.recomendaciones.updateMany({
      where: {
        id: recomendacionId,
        usuario_id: usuarioId,
      },
      data,
    });

    if (updated.count === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No se encontró la recomendación para este usuario.",
          debug: {
            recomendacionId,
            usuarioId,
            data,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      updated: updated.count,
    });
  } catch (error) {
    console.error("Error actualizando recomendación IA:", error);

    return NextResponse.json(
      {
        success: false,
        error: "No se pudo actualizar la recomendación.",
      },
      { status: 500 }
    );
  }
}