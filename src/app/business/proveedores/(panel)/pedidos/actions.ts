"use server";

import prisma from "@/lib/prisma";
import { requireProveedor } from "@/lib/auth-proveedor";

const FLUJO_ESTADOS = [
  "pendiente",
  "en_preparacion",
  "listo",
  "entregado",
];

const MAPA_ESTADOS: Record<string, string> = {
  pendiente: "pendiente",
  preparacion: "en_preparacion",
  en_preparacion: "en_preparacion",
  "en_preparación": "en_preparacion",
  listo: "listo",
  entregado: "entregado",
  completado: "entregado",
};

function normalizarEstadoPedido(estado: string) {
  const estadoBase = estado.toLowerCase().trim().replace(/\s+/g, "_");
  return MAPA_ESTADOS[estadoBase] || estadoBase;
}

function siguienteEstado(estado: string) {
  const estadoNormalizado = normalizarEstadoPedido(estado);
  const index = FLUJO_ESTADOS.indexOf(estadoNormalizado);

  if (index === -1) {
    throw new Error(`Estado inválido: ${estado}`);
  }

  if (index === FLUJO_ESTADOS.length - 1) {
    return null;
  }

  return FLUJO_ESTADOS[index + 1];
}

// ... (Aquí mantienes tu función obtenerPedidosProveedor tal cual la tenías) ...
export async function obtenerPedidosProveedor() {
  const proveedor = await requireProveedor();

  const detalles = await prisma.detalle_pedidos.findMany({
    where: { proveedor_id: proveedor.id },
    include: {
      pedidos: { include: { usuarios: true, direcciones: true } },
      productos: true,
    },
    orderBy: { created_at: "desc" },
  });

  // ... (Tu lógica de map para agrupar pedidos sigue aquí igual) ...
  // (Nota: mantén tu lógica original de mapeo intacta aquí para no romper el dashboard)
  // ...
}

export async function avanzarEstadoPedidoProveedor(pedidoId: number) {
  const proveedor = await requireProveedor();

  // 1. Buscamos el pedido y el usuario asociado
  const detalle = await prisma.detalle_pedidos.findFirst({
    where: {
      pedido_id: pedidoId,
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
    return { success: false, message: "El pedido ya está completado." };
  }

  // 2. Transacción: Actualizar estado + Crear notificación para el cliente
  await prisma.$transaction([
    prisma.pedidos.update({
      where: { id: pedidoId },
      data: { estado: nuevoEstado },
    }),
    
    prisma.notificaciones.create({
      data: {
        usuario_id: detalle.pedidos.usuario_id,
        tipo: "actualizacion_pedido",
        titulo: "¡Actualización de tu pedido!",
        mensaje: `Tu pedido EM-${String(pedidoId).padStart(4, "0")} ahora está: ${nuevoEstado.replace("_", " ")}.`,
        leida: false,
      },
    })
  ]);

  return {
    success: true,
    nuevoEstado,
  };
}