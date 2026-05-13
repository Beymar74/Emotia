import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stackServerApp } from "@/lib/stack"; // <-- Importas la herramienta de tu equipo

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Validamos quién está haciendo la petición (igual que en account-overview)
    const currentUser = await stackServerApp.getUser({ or: "return-null" });
    if (!currentUser?.primaryEmail) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    // Buscamos el ID del usuario en la BD
    const usuario = await prisma.usuarios.findUnique({
      where: { email: currentUser.primaryEmail },
      select: { id: true },
    });

    if (!usuario) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 });
    }

    const { id } = await context.params;
    const notificacionId = Number(id);

    console.log("🔥 API ALCANZADA! ID:", notificacionId, "POR USUARIO:", usuario.id);

    // 2. Actualizamos, pero asegurándonos de que la notificación le pertenezca a este usuario
    const actualizada = await prisma.notificaciones.updateMany({
      where: { 
        id: notificacionId,
        usuario_id: usuario.id // <-- ¡El candado de seguridad!
      },
      data: { leida: true },
    });

    // updateMany devuelve la cantidad de registros actualizados. Si es 0, no era suya o no existe.
    if (actualizada.count === 0) {
      return NextResponse.json({ success: false, error: "Notificación no encontrada o no autorizada" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar" },
      { status: 500 }
    );
  }
}