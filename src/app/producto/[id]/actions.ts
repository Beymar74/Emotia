"use server";

import prisma from "@/lib/prisma";
import { stackServerApp } from "@/lib/stack";
import { revalidatePath } from "next/cache";

export async function getTarjetasActivas() {
  return await prisma.tarjeta_disenos.findMany({
    where: { activo: true },
    orderBy: { id: "asc" },
  });
}

export async function guardarResenaProducto(
  productoId: number,
  calificacion: number,
  resena: string
) {
  try {
    const rating = Number(calificacion);
    const texto = resena.trim();

    if (!Number.isInteger(productoId) || productoId <= 0) {
      return {
        success: false,
        error: "Producto inválido.",
      };
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return {
        success: false,
        error: "La calificación debe estar entre 1 y 5.",
      };
    }

    if (!texto) {
      return {
        success: false,
        error: "Escribe una reseña antes de publicarla.",
      };
    }

    const currentUser = await stackServerApp.getUser({ or: "return-null" });

    if (!currentUser?.primaryEmail) {
      return {
        success: false,
        authRequired: true,
        error: "Inicia sesión para dejar una reseña.",
      };
    }

    const usuario = await prisma.usuarios.findUnique({
      where: {
        email: currentUser.primaryEmail,
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
      },
    });

    if (!usuario) {
      return {
        success: false,
        authRequired: true,
        error: "No se encontró tu usuario del catálogo.",
      };
    }

    const producto = await prisma.productos.findUnique({
      where: {
        id: productoId,
      },
      select: {
        id: true,
        proveedor_id: true,
      },
    });

    if (!producto) {
      return {
        success: false,
        error: "Producto no encontrado.",
      };
    }

    const detalleConResena = await prisma.detalle_pedidos.findFirst({
      where: {
        producto_id: productoId,
        pedidos: {
          usuario_id: usuario.id,
        },
        calificacion: {
          not: null,
        },
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
      },
    });

    const detalleComprado =
      detalleConResena ??
      (await prisma.detalle_pedidos.findFirst({
        where: {
          producto_id: productoId,
          pedidos: {
            usuario_id: usuario.id,
          },
        },
        orderBy: {
          created_at: "desc",
        },
        select: {
          id: true,
        },
      }));

    if (!detalleComprado) {
      return {
        success: false,
        error: "Solo puedes reseñar productos que compraste.",
      };
    }

    await prisma.$transaction([
      prisma.detalle_pedidos.updateMany({
        where: {
          producto_id: productoId,
          pedidos: {
            usuario_id: usuario.id,
          },
          id: {
            not: detalleComprado.id,
          },
        },
        data: {
          calificacion: null,
          resena: null,
        },
      }),

      prisma.detalle_pedidos.update({
        where: {
          id: detalleComprado.id,
        },
        data: {
          calificacion: rating,
          resena: texto,
        },
      }),
    ]);

    const [comentariosDB, promedioProveedor] = await Promise.all([
      prisma.detalle_pedidos.findMany({
        where: {
          producto_id: productoId,
          calificacion: {
            not: null,
          },
        },
        orderBy: {
          created_at: "desc",
        },
        select: {
          id: true,
          calificacion: true,
          resena: true,
          pedidos: {
            select: {
              usuarios: {
                select: {
                  nombre: true,
                  apellido: true,
                },
              },
            },
          },
        },
      }),

      prisma.detalle_pedidos.aggregate({
        where: {
          proveedor_id: producto.proveedor_id,
          calificacion: {
            not: null,
          },
        },
        _avg: {
          calificacion: true,
        },
      }),
    ]);

    await prisma.proveedores.update({
      where: {
        id: producto.proveedor_id,
      },
      data: {
        calificacion_prom: promedioProveedor._avg.calificacion
          ? Number(promedioProveedor._avg.calificacion.toFixed(2))
          : 0,
      },
    });

    revalidatePath(`/producto/${productoId}`);
    revalidatePath(`/producto/marca/${producto.proveedor_id}`);

    return {
      success: true,
      comentarios: comentariosDB.map((comentario) => {
        const user = comentario.pedidos.usuarios;

        return {
          id: `detalle-${comentario.id}`,
          author: `${user.nombre} ${user.apellido || ""}`.trim(),
          rating: comentario.calificacion || 0,
          text: comentario.resena || "",
        };
      }),
    };
  } catch (error) {
    console.error("Error guardando reseña:", error);

    return {
      success: false,
      error: "No se pudo guardar la reseña.",
    };
  }
}