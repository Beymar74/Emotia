"use server";

import prisma from "@/lib/prisma";
import { requireProveedor } from "@/lib/auth-proveedor";

const FLUJO_ESTADOS = [
  "pendiente",
  "en_preparacion",
  "listo",
  "entregado",
];

function siguienteEstado(estado: string) {
  const index = FLUJO_ESTADOS.indexOf(estado);

  if (index === -1 || index === FLUJO_ESTADOS.length - 1) {
    return null;
  }

  return FLUJO_ESTADOS[index + 1];
}

export async function obtenerPedidosProveedor() {
  const proveedor = await requireProveedor();

  const detalles = await prisma.detalle_pedidos.findMany({
    where: {
      proveedor_id: proveedor.id,
    },
    include: {
      pedidos: {
        include: {
          usuarios: {
            select: {
              nombre: true,
              apellido: true,
            },
          },
          direcciones: {
            select: {
              calle: true,
              zona: true,
              ciudad: true,
            },
          },
        },
      },
      productos: {
        select: {
          nombre: true,
          imagen_url: true,
          permite_mensaje: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return detalles.map((detalle) => ({
    id: detalle.id,
    pedidoId: detalle.pedido_id,
    codigo: `PED-${detalle.pedido_id}`,
    cliente: `${detalle.pedidos.usuarios.nombre} ${detalle.pedidos.usuarios.apellido || ""}`.trim(),
    producto: detalle.productos.nombre,
    imagen: detalle.productos.imagen_url,
    personalizacion: detalle.mensaje_personal || null,
    direccion: detalle.pedidos.direcciones
      ? [
          detalle.pedidos.direcciones.calle,
          detalle.pedidos.direcciones.zona,
          detalle.pedidos.direcciones.ciudad,
        ]
          .filter(Boolean)
          .join(", ")
      : "Dirección no registrada",
    total: Number(detalle.subtotal),
    estado: detalle.pedidos.estado,
    fecha: detalle.created_at.toISOString(),
  }));
}

export async function avanzarEstadoPedidoProveedor(detallePedidoId: number) {
  const proveedor = await requireProveedor();

  const detalle = await prisma.detalle_pedidos.findFirst({
    where: {
      id: detallePedidoId,
      proveedor_id: proveedor.id,
    },
    include: {
      pedidos: true,
    },
  });

  if (!detalle) {
    throw new Error("Pedido no encontrado.");
  }

  const nuevoEstado = siguienteEstado(detalle.pedidos.estado);

  if (!nuevoEstado) {
    return {
      success: false,
      message: "El pedido ya está completado.",
    };
  }

  await prisma.pedidos.update({
    where: {
      id: detalle.pedido_id,
    },
    data: {
      estado: nuevoEstado,
    },
  });

  return {
    success: true,
    nuevoEstado,
  };
}