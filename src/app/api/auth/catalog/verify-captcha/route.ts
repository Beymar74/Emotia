import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { token?: string };
    const token = body.token?.trim();

    if (!token) {
      return NextResponse.json({ error: "Token requerido." }, { status: 400 });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.error("RECAPTCHA_SECRET_KEY no está configurada.");
      return NextResponse.json({ error: "Configuración de seguridad incompleta." }, { status: 500 });
    }

    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);

    const cfResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      },
    );

    const data = (await cfResponse.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };

    if (!data.success) {
      return NextResponse.json({ error: "Verificación de seguridad fallida." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error al verificar la seguridad." }, { status: 500 });
  }
}
