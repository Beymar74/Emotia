import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        // 👇 EL CAMBIO ESTÁ AQUÍ (await cookies) 👇
        const cookieStore = await cookies();
        const token = cookieStore.get("emotia_b2b_session")?.value;

        if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });


        const sesion = await prisma.proveedor_sesiones.findUnique({
            where: { token },
            select: { proveedor_id: true },
        });

        if (!sesion) return NextResponse.json({ error: "Sesión inválida" }, { status: 401 });

        const notificaciones = await prisma.proveedor_notificaciones.findMany({
            where: { proveedor_id: sesion.proveedor_id },
            orderBy: { created_at: "desc" },
            take: 10,
        });

        const unreadCount = await prisma.proveedor_notificaciones.count({
            where: { proveedor_id: sesion.proveedor_id, leida: false },
        });

        return NextResponse.json({ notificaciones, unreadCount });
    } catch (error) {
        console.error("Error en GET notificaciones:", error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}

export async function PATCH() {
    try {
        // 👇 EL CAMBIO ESTÁ AQUÍ (await cookies) 👇
        const cookieStore = await cookies();
        const token = cookieStore.get("emotia_b2b_session")?.value;

        if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

        const sesion = await prisma.proveedor_sesiones.findUnique({
            where: { token },
            select: { proveedor_id: true },
        });

        if (!sesion) return NextResponse.json({ error: "Sesión inválida" }, { status: 401 });

        await prisma.proveedor_notificaciones.updateMany({
            where: { proveedor_id: sesion.proveedor_id, leida: false },
            data: { leida: true },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error en PATCH notificaciones:", error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}