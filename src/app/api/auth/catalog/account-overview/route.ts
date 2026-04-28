import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stackServerApp } from "@/lib/stack";

function buildShortDisplayName(nombres: string | null | undefined, apellidos: string | null | undefined) {
  const primerNombre = nombres?.trim().split(/\s+/).filter(Boolean)[0] || "";
  const primerApellido = apellidos?.trim().split(/\s+/).filter(Boolean)[0] || "";
  return [primerNombre, primerApellido].filter(Boolean).join(" ");
}

export async function GET() {
  try {
    const currentUser = await stackServerApp.getUser({ or: "return-null" });
    if (!currentUser?.primaryEmail) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const usuario = await prisma.usuarios.findUnique({
      where: { email: currentUser.primaryEmail },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
      },
    });

    if (!usuario) {
      return NextResponse.json({ authenticated: true, orders: [], notifications: [], unreadNotifications: 0 });
    }

    const [orders, notifications, unreadNotifications, pendingOrders, activeOrders] = await Promise.all([
      prisma.pedidos.findMany({
        where: { usuario_id: usuario.id },
        orderBy: { created_at: "desc" },
        take: 4,
        select: {
          id: true,
          estado: true,
          total: true,
          created_at: true,
          detalle_pedidos: {
            select: {
              cantidad: true,
              productos: {
                select: {
                  id: true,
                  nombre: true,
                  imagen_url: true,
                },
              },
              proveedores: {
                select: {
                  nombre_negocio: true,
                  logo_url: true,
                },
              },
            },
          },
        },
      }),
      prisma.notificaciones.findMany({
        where: { usuario_id: usuario.id },
        orderBy: { created_at: "desc" },
        take: 6,
        select: {
          id: true,
          tipo: true,
          titulo: true,
          mensaje: true,
          leida: true,
          created_at: true,
        },
      }),
      prisma.notificaciones.count({
        where: {
          usuario_id: usuario.id,
          leida: false,
        },
      }),
      prisma.pedidos.count({
        where: {
          usuario_id: usuario.id,
          estado: "pendiente",
        },
      }),
      prisma.pedidos.count({
        where: {
          usuario_id: usuario.id,
          estado: {
            in: ["pendiente", "confirmado", "en_preparacion"],
          },
        },
      }),
    ]);

    return NextResponse.json({
      authenticated: true,
      profile: {
        shortName: buildShortDisplayName(usuario.nombre, usuario.apellido) || usuario.nombre || null,
        email: usuario.email,
      },
      summary: {
        pendingOrders,
        activeOrders,
        unreadNotifications,
      },
      orders: orders.map((order) => {
        const firstItem = order.detalle_pedidos[0];

        return {
          id: order.id,
          estado: order.estado,
          total: Number(order.total),
          createdAt: order.created_at.toISOString(),
          itemCount: order.detalle_pedidos.reduce((acc, item) => acc + item.cantidad, 0),
          primaryProductName: firstItem?.productos.nombre ?? "Pedido Emotia",
          productImageUrl: firstItem?.productos.imagen_url ?? null,
          brandName: firstItem?.proveedores.nombre_negocio ?? "Emotia Store",
          brandLogoUrl: firstItem?.proveedores.logo_url ?? null,
          items: order.detalle_pedidos.map((item) => ({
            id: item.productos.id,
            name: item.productos.nombre,
            quantity: item.cantidad,
            imageUrl: item.productos.imagen_url ?? null,
          })),
        };
      }),
      notifications: notifications.map((notification) => ({
        id: notification.id,
        tipo: notification.tipo,
        titulo: notification.titulo,
        mensaje: notification.mensaje,
        leida: notification.leida,
        createdAt: notification.created_at.toISOString(),
      })),
      unreadNotifications,
    });
  } catch (error) {
    console.error("Error al obtener el resumen del catalogo:", error);
    return NextResponse.json({ error: "No pudimos cargar tu actividad." }, { status: 500 });
  }
}
