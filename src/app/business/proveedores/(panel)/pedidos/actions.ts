"use server";

import prisma from "@/lib/prisma";
import { requireProveedor } from "@/lib/auth-proveedor";
import { revalidatePath } from "next/cache"; // IMPORTANTE: Agrega esto arriba

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

type PedidoAgrupado = {
  id: number;
  pedidoId: number;
  codigo: string;
  cliente: string;
  direccion: string;
  total: number;
  estado: string;
  fecha: string;
  personalizacion: string | null;
  imagen: string | null;
  producto: string;
  productos: {
    detalleId: number;
    nombre: string;
    imagen: string | null;
    personalizacion: string | null;
    total: number;
  }[];
};

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

  const pedidosMap = new Map<number, PedidoAgrupado>();

  for (const detalle of detalles) {
    const pedidoId = detalle.pedido_id;

    const direccion = detalle.pedidos.direcciones
      ? [
          detalle.pedidos.direcciones.calle,
          detalle.pedidos.direcciones.zona,
          detalle.pedidos.direcciones.ciudad,
        ]
          .filter(Boolean)
          .join(", ")
      : "Dirección no registrada";

    const cliente = `${detalle.pedidos.usuarios.nombre} ${
      detalle.pedidos.usuarios.apellido || ""
    }`.trim();

    const productoDetalle = {
      detalleId: detalle.id,
      nombre: detalle.productos.nombre,
      imagen: detalle.productos.imagen_url,
      personalizacion: detalle.mensaje_personal || null,
      total: Number(detalle.subtotal),
    };

    const pedidoExistente = pedidosMap.get(pedidoId);

    if (!pedidoExistente) {
      pedidosMap.set(pedidoId, {
        id: pedidoId,
        pedidoId,
        codigo: `PED-${pedidoId}`,
        cliente,
        direccion,
        total: Number(detalle.subtotal),
        estado: normalizarEstadoPedido(detalle.pedidos.estado),
        fecha: detalle.created_at.toISOString(),
        personalizacion: detalle.mensaje_personal || null,
        imagen: detalle.productos.imagen_url,
        producto: detalle.productos.nombre,
        productos: [productoDetalle],
      });

      continue;
    }

    pedidoExistente.total += Number(detalle.subtotal);
    pedidoExistente.productos.push(productoDetalle);

    if (!pedidoExistente.personalizacion && detalle.mensaje_personal) {
      pedidoExistente.personalizacion = detalle.mensaje_personal;
    }

    if (!pedidoExistente.imagen && detalle.productos.imagen_url) {
      pedidoExistente.imagen = detalle.productos.imagen_url;
    }

    pedidoExistente.producto =
      pedidoExistente.productos.length === 1
        ? pedidoExistente.productos[0].nombre
        : `${pedidoExistente.productos.length} productos`;

    if (detalle.created_at > new Date(pedidoExistente.fecha)) {
      pedidoExistente.fecha = detalle.created_at.toISOString();
    }
  }

  return Array.from(pedidosMap.values()).sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

export async function avanzarEstadoPedidoProveedor(pedidoId: number) {
  const proveedor = await requireProveedor();

  const detalle = await prisma.detalle_pedidos.findFirst({
    where: {
      pedido_id: pedidoId,
      proveedor_id: proveedor.id,
    },
    include: {
      pedidos: true, // Vital para sacar el usuario_id
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

  // 1. Textos adaptados a la experiencia de Emotia
  const mensajesNotificacion: Record<string, { titulo: string; descripcion: string }> = {
    en_preparacion: {
      titulo: "Preparación y confirmación",
      descripcion: "La empresa aceptó tu pedido y lo deja listo para avanzar.",
    },
    listo: {
      titulo: "Pedido listo para envío",
      descripcion: "Tu regalo ya está empaquetado y esperando a ser despachado.",
    },
    entregado: {
      titulo: "Pedido entregado",
      descripcion: "Tu pedido llegó a su destino. ¡Esperamos que lo disfruten!",
    },
  };

  const infoNotificacion = mensajesNotificacion[nuevoEstado] || {
    titulo: "Actualización de pedido",
    descripcion: `Tu pedido ha pasado a la fase: ${nuevoEstado}`,
  };

  // 2. Transacción: Actualiza el pedido y crea la notificación al mismo tiempo
  await prisma.$transaction([
    prisma.pedidos.update({
      where: {
        id: pedidoId,
      },
      data: {
        estado: nuevoEstado,
      },
    }),
    
    // Usamos el modelo "notificaciones" exacto de tu schema.prisma
    prisma.notificaciones.create({
      data: {
        usuario_id: detalle.pedidos.usuario_id,
        tipo: "actualizacion_pedido", // Coincide con tu VarChar(50)
        titulo: infoNotificacion.titulo,
        mensaje: infoNotificacion.descripcion,
        leida: false,
      },
    }),
  ]);

  // 3. Revalidamos la ruta para que la UI del cliente se refresque
  // Ajusta esta ruta según dónde esté tu layout principal con la campanita
  revalidatePath("/", "layout"); 

  return {
    success: true,
    nuevoEstado,
  };
}