"use server";

import prisma from "@/lib/prisma";
import { requireProveedor } from "@/lib/auth-proveedor";

export async function obtenerDashboardProveedor() {
  const proveedor = await requireProveedor();

  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const inicioMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
  const finMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0, 23, 59, 59);

  const [
    productosActivos,
    productosStockBajo,
    productosRecientes,
    detalleMes,
    detalleMesAnterior,
    pedidosPendientes,
    pedidosEnProceso,
    pedidosEntregados,
    ultimosDetalles,
  ] = await Promise.all([
    prisma.productos.count({
      where: {
        proveedor_id: proveedor.id,
        activo: true,
      },
    }),

    prisma.productos.findMany({
      where: {
        proveedor_id: proveedor.id,
        stock: {
          lte: 5,
        },
      },
      orderBy: {
        stock: "asc",
      },
      take: 5,
      select: {
        id: true,
        nombre: true,
        stock: true,
        imagen_url: true,
      },
    }),

    prisma.productos.findMany({
      where: {
        proveedor_id: proveedor.id,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 5,
      select: {
        id: true,
        nombre: true,
        stock: true,
        activo: true,
        precio_venta: true,
        imagen_url: true,
      },
    }),

    prisma.detalle_pedidos.findMany({
      where: {
        proveedor_id: proveedor.id,
        created_at: {
          gte: inicioMes,
        },
      },
      select: {
        subtotal: true,
      },
    }),

    prisma.detalle_pedidos.findMany({
      where: {
        proveedor_id: proveedor.id,
        created_at: {
          gte: inicioMesAnterior,
          lte: finMesAnterior,
        },
      },
      select: {
        subtotal: true,
      },
    }),

    prisma.detalle_pedidos.count({
      where: {
        proveedor_id: proveedor.id,
        pedidos: {
          estado: "pendiente",
        },
      },
    }),

    prisma.detalle_pedidos.count({
      where: {
        proveedor_id: proveedor.id,
        pedidos: {
          estado: {
            in: ["en_preparacion", "preparacion", "en preparación", "listo"],
          },
        },
      },
    }),

    prisma.detalle_pedidos.count({
      where: {
        proveedor_id: proveedor.id,
        pedidos: {
          estado: {
            in: ["entregado", "completado"],
          },
        },
      },
    }),

    prisma.detalle_pedidos.findMany({
      where: {
        proveedor_id: proveedor.id,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 5,
      include: {
        pedidos: {
          include: {
            usuarios: {
              select: {
                nombre: true,
                apellido: true,
              },
            },
          },
        },
        productos: {
          select: {
            nombre: true,
            imagen_url: true,
          },
        },
      },
    }),
  ]);

  const ingresosMes = detalleMes.reduce(
    (total, item) => total + Number(item.subtotal),
    0
  );

  const ingresosMesAnterior = detalleMesAnterior.reduce(
    (total, item) => total + Number(item.subtotal),
    0
  );

  const crecimientoIngresos =
    ingresosMesAnterior > 0
      ? ((ingresosMes - ingresosMesAnterior) / ingresosMesAnterior) * 100
      : ingresosMes > 0
        ? 100
        : 0;

  const ultimosPedidos = ultimosDetalles.map((detalle) => {
    const usuario = detalle.pedidos.usuarios;

    return {
      id: `PED-${detalle.pedido_id}`,
      cliente: `${usuario.nombre} ${usuario.apellido || ""}`.trim(),
      producto: detalle.productos.nombre,
      estado: detalle.pedidos.estado,
      total: Number(detalle.subtotal),
      fecha: detalle.created_at.toISOString(),
      imagen: detalle.productos.imagen_url,
    };
  });

  const inventario = productosStockBajo.map((producto) => ({
    id: producto.id,
    nombre: producto.nombre,
    stock: producto.stock,
    imagen: producto.imagen_url,
    porcentaje: Math.min(100, Math.max(0, producto.stock * 10)),
  }));

  return {
    metricas: {
      ingresosMes,
      crecimientoIngresos,
      pedidosPendientes,
      pedidosEnProceso,
      pedidosEntregados,
      productosActivos,
      stockBajo: productosStockBajo.length,
    },
    productosRecientes: productosRecientes.map((producto) => ({
      id: producto.id,
      nombre: producto.nombre,
      stock: producto.stock,
      activo: producto.activo,
      precio: Number(producto.precio_venta),
      imagen: producto.imagen_url,
    })),
    inventario,
    ultimosPedidos,
    graficaVentas: [
      { name: "Lun", ventas: 0 },
      { name: "Mar", ventas: 0 },
      { name: "Mié", ventas: 0 },
      { name: "Jue", ventas: 0 },
      { name: "Vie", ventas: 0 },
      { name: "Sáb", ventas: 0 },
      { name: "Dom", ventas: ingresosMes },
    ],
  };
}