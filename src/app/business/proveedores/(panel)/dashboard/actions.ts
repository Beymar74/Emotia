"use server";

import prisma from "@/lib/prisma";
import { requireProveedor } from "@/lib/auth-proveedor";

type ActividadReciente = {
  tipo: "pedido" | "stock";
  titulo: string;
  descripcion: string;
  tiempo: string;
  fechaOrden: string;
};

function obtenerTiempoRelativo(fecha: Date) {
  const ahora = new Date();
  const diffMs = ahora.getTime() - fecha.getTime();

  const minutos = Math.floor(diffMs / (1000 * 60));
  const horas = Math.floor(diffMs / (1000 * 60 * 60));
  const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutos < 1) return "Ahora";
  if (minutos < 60) return `Hace ${minutos}m`;
  if (horas < 24) return `Hace ${horas}h`;
  return `Hace ${dias}d`;
}
function normalizarEstadoPedido(estado: string) {
  const estadoNormalizado = estado.toLowerCase().trim();

  if (estadoNormalizado === "pendiente") {
    return "Pendiente";
  }

  if (
    [
      "en_preparacion",
      "preparacion",
      "en preparación",
      "listo",
    ].includes(estadoNormalizado)
  ) {
    return "En proceso";
  }

  if (
    ["entregado", "completado"].includes(estadoNormalizado)
  ) {
    return "Entregado";
  }

  return "Desconocido";
}

export async function obtenerDashboardProveedor(
  filtro: "ultimos_7_dias" | "este_mes" | "anio_actual" = "este_mes"
) {
  const proveedor = await requireProveedor();

  const ahora = new Date();

  let inicioPeriodo: Date;

  if (filtro === "ultimos_7_dias") {
    inicioPeriodo = new Date(ahora);
    inicioPeriodo.setDate(ahora.getDate() - 6);
    inicioPeriodo.setHours(0, 0, 0, 0);
  } else if (filtro === "anio_actual") {
    inicioPeriodo = new Date(ahora.getFullYear(), 0, 1);
  } else {
    inicioPeriodo = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  }

  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const inicioMesAnterior = new Date(
    ahora.getFullYear(),
    ahora.getMonth() - 1,
    1
  );
  const finMesAnterior = new Date(
    ahora.getFullYear(),
    ahora.getMonth(),
    0,
    23,
    59,
    59
  );

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
    pedidosPendientesMes,
    pedidosEntregadosMes,
    pedidosEntregadosMesAnterior,
    detalleReporte,
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
          gte: inicioPeriodo,
        },
      },
      select: {
        subtotal: true,
        created_at: true,
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
        created_at: {
          gte: inicioPeriodo,
        },
        pedidos: {
          estado: "pendiente",
        },
      },
    }),

    prisma.detalle_pedidos.count({
      where: {
        proveedor_id: proveedor.id,
        created_at: {
          gte: inicioPeriodo,
        },
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
        created_at: {
          gte: inicioPeriodo,
        },
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
      created_at: {
        gte: inicioPeriodo,
      },
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

    prisma.detalle_pedidos.count({
      where: {
        proveedor_id: proveedor.id,
        pedidos: {
          estado: "pendiente",
        },
        created_at: {
          gte: inicioPeriodo,
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
        created_at: {
          gte: inicioPeriodo,
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
        created_at: {
          gte: inicioMesAnterior,
          lte: finMesAnterior,
        },
      },
    }),
    prisma.detalle_pedidos.findMany({
  where: {
    proveedor_id: proveedor.id,
    created_at: {
      gte: inicioPeriodo,
    },
  },
  orderBy: {
    created_at: "desc",
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
      },
    },
    productos: {
      select: {
        id: true,
        nombre: true,
        imagen_url: true,
        stock: true,
        categorias: {
          select: {
            nombre: true,
          },
        },
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

  const crecimientoEntregados =
    pedidosEntregadosMesAnterior > 0
      ? ((pedidosEntregadosMes - pedidosEntregadosMesAnterior) /
          pedidosEntregadosMesAnterior) *
        100
      : pedidosEntregadosMes > 0
        ? 100
        : 0;

  const estadoOperacion =
    pedidosEnProceso >= 10
      ? "Alta carga"
      : pedidosEnProceso >= 4
        ? "Moderado"
        : "Estable";

  const textoOperacion =
    pedidosEnProceso >= 10
      ? "requiere atención"
      : pedidosEnProceso >= 4
        ? "flujo activo"
        : "operación saludable";

  const ultimosPedidos = ultimosDetalles.map((detalle) => {
    const usuario = detalle.pedidos.usuarios;

    return {
      id: `DET-${detalle.id}`,
      pedidoId: `PED-${detalle.pedido_id}`,
      cliente: `${usuario.nombre} ${usuario.apellido || ""}`.trim(),
      producto: detalle.productos.nombre,
      estado: normalizarEstadoPedido(detalle.pedidos.estado),
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

  const actividadPedidos: ActividadReciente[] = ultimosDetalles.map(
    (detalle) => {
      const usuario = detalle.pedidos.usuarios;
      const cliente = `${usuario.nombre} ${usuario.apellido || ""}`.trim();

      return {
        tipo: "pedido",
        titulo: `Nuevo pedido PED-${detalle.pedido_id}`,
        descripcion: `${cliente} pidió ${detalle.productos.nombre}`,
        tiempo: obtenerTiempoRelativo(detalle.created_at),
        fechaOrden: detalle.created_at.toISOString(),
      };
    }
  );

  const actividadStock: ActividadReciente[] = productosStockBajo.map(
    (producto) => ({
      tipo: "stock",
      titulo: "Stock bajo",
      descripcion: `${producto.nombre} tiene ${producto.stock} unidades disponibles`,
      tiempo: "Ahora",
      fechaOrden: ahora.toISOString(),
    })
  );

  const actividadReciente = [...actividadPedidos, ...actividadStock]
    .sort(
      (a, b) =>
        new Date(b.fechaOrden).getTime() - new Date(a.fechaOrden).getTime()
    )
    .slice(0, 6);
  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const ventasPorDia = diasSemana.map((dia) => ({
    name: dia,
    ventas: 0,
  }));

  detalleMes.forEach((detalle) => {
    const dia = detalle.created_at.getDay();
    ventasPorDia[dia].ventas += Number(detalle.subtotal);
  });

  const graficaVentas = [
    ventasPorDia[1],
    ventasPorDia[2],
    ventasPorDia[3],
    ventasPorDia[4],
    ventasPorDia[5],
    ventasPorDia[6],
    ventasPorDia[0],
  ];

  const totalPedidosReporte = detalleReporte.length;
const productosVendidos = detalleReporte.reduce(
  (total, detalle) => total + Number(detalle.cantidad || 0),
  0
);

const ticketPromedio =
  totalPedidosReporte > 0 ? ingresosMes / totalPedidosReporte : 0;

const pedidosPorEstadoMap = new Map<string, number>();

detalleReporte.forEach((detalle) => {
  const estado = normalizarEstadoPedido(detalle.pedidos.estado);
  pedidosPorEstadoMap.set(estado, (pedidosPorEstadoMap.get(estado) || 0) + 1);
});

const pedidosPorEstado = Array.from(pedidosPorEstadoMap.entries()).map(
  ([estado, cantidad]) => ({
    estado,
    cantidad,
  })
);

const ventasPorMesMap = new Map<
  string,
  {
    mes: string;
    ingresos: number;
    pedidos: number;
  }
>();

detalleReporte.forEach((detalle) => {
  const fecha = detalle.created_at;
  const mes = new Intl.DateTimeFormat("es-BO", {
    month: "short",
    year: "numeric",
    timeZone: "America/La_Paz",
  }).format(fecha);

  const actual = ventasPorMesMap.get(mes) || {
    mes,
    ingresos: 0,
    pedidos: 0,
  };

  actual.ingresos += Number(detalle.subtotal || 0);
  actual.pedidos += 1;

  ventasPorMesMap.set(mes, actual);
});

const ventasPorMes = Array.from(ventasPorMesMap.values());

const productosMap = new Map<
  number,
  {
    producto: string;
    categoria: string;
    ingresos: number;
    cantidad: number;
  }
>();

detalleReporte.forEach((detalle) => {
  const productoId = detalle.productos.id;

  const actual = productosMap.get(productoId) || {
    producto: detalle.productos.nombre,
    categoria: detalle.productos.categorias?.nombre || "Sin categoría",
    ingresos: 0,
    cantidad: 0,
  };

  actual.ingresos += Number(detalle.subtotal || 0);
  actual.cantidad += Number(detalle.cantidad || 0);

  productosMap.set(productoId, actual);
});

const topProductos = Array.from(productosMap.values())
  .sort((a, b) => b.ingresos - a.ingresos)
  .slice(0, 8);

const estadoPredominante =
  pedidosPorEstado.length > 0
    ? [...pedidosPorEstado].sort((a, b) => b.cantidad - a.cantidad)[0].estado
    : "Sin pedidos";

const mejorProducto =
  topProductos.length > 0 ? topProductos[0].producto : "Sin ventas registradas";

const reporteEjecutivo = {
  empresa: proveedor.nombre_negocio,
  filtro: filtro,
  rango: filtro === "ultimos_7_dias"
    ? "Últimos 7 días"
    : filtro === "anio_actual"
      ? "Año actual"
      : "Este mes",
  generadoEn: ahora.toISOString(),
  kpis: {
    ingresosTotales: ingresosMes,
    totalPedidos: totalPedidosReporte,
    ticketPromedio,
    productosVendidos,
    entregados: pedidosEntregados,
    pendientes: pedidosPendientes,
    enProceso: pedidosEnProceso,
    cancelados: detalleReporte.filter(
      (detalle) => detalle.pedidos.estado === "cancelado"
    ).length,
    productosActivos,
    stockBajo: productosStockBajo.length,
  },
  ventasPorMes,
  pedidosPorEstado,
  topProductos,
  stockBajo: inventario,
  insights: {
    estadoPredominante,
    mejorProducto,
    estadoOperacion,
    textoOperacion,
    crecimientoIngresos,
    crecimientoEntregados,
  },
  pedidos: ultimosPedidos,
};
  return {
  metricas: {
    ingresosMes,
    crecimientoIngresos,
    pedidosPendientes,
    pedidosPendientesMes,
    pedidosEnProceso,
    pedidosEntregados,
    crecimientoEntregados,
    estadoOperacion,
    textoOperacion,
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
  actividadReciente,
  graficaVentas,
  reporteEjecutivo,
};
}