import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import { GraficoSemanalGlobal, GraficoEmpresasGlobal, GraficoCategoriasGlobal } from "./GlobalCharts";
import { Suspense } from "react";
import EmpresaFilter from "../../_components/EmpresaFilter";
import ReportSubNav from "../_components/ReportSubNav";
import GlobalEmpresaDetail from "./GlobalEmpresaDetail";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  Award,
  Star,
  MapPin,
  Mail,
  Phone,
  Bell,
  Gift,
  Sparkles
} from "lucide-react";

function serializeDecimal(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "object") {
    // Check if it's a Decimal (Prisma Decimal or decimal.js)
    if (
      typeof obj.toNumber === "function" ||
      obj.constructor?.name === "Decimal" ||
      obj.constructor?.name?.includes("Decimal") ||
      (obj.d !== undefined && obj.e !== undefined && obj.s !== undefined)
    ) {
      try {
        return Number(obj.toString());
      } catch (e) {
        return 0;
      }
    }

    if (obj instanceof Date) {
      return obj.toISOString();
    }

    if (Array.isArray(obj)) {
      return obj.map(serializeDecimal);
    }

    const serialized: any = {};
    for (const key of Object.keys(obj)) {
      serialized[key] = serializeDecimal(obj[key]);
    }
    return serialized;
  }

  return obj;
}

export default async function ReporteGlobalPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const empresaId = typeof sp.empresa === "string" && sp.empresa !== "todas" ? parseInt(sp.empresa) : 0;
  const tab = typeof sp.tab === "string" ? sp.tab : "comercial";

  const empresasLista = await prisma.proveedores.findMany({
    select: { id: true, nombre_negocio: true },
    orderBy: { nombre_negocio: "asc" }
  });

  let selectedEmpresa: any = null;
  let selectedEmpresaProductos: any[] = [];
  let selectedEmpresaPedidos: any[] = [];
  let selectedEmpresaOpiniones: any[] = [];

  let globalData: any = null;

  if (empresaId > 0) {
    const [empresaData, productosData, pedidosData, opinionesData] = await Promise.all([
      prisma.proveedores.findUnique({
        where: { id: empresaId },
      }),
      prisma.productos.findMany({
        where: { proveedor_id: empresaId },
        include: { categorias: { select: { nombre: true } } },
        orderBy: { nombre: "asc" },
      }),
      prisma.detalle_pedidos.findMany({
        where: { proveedor_id: empresaId },
        include: {
          pedidos: {
            include: {
              usuarios: {
                select: {
                  nombre: true,
                  apellido: true,
                  email: true,
                }
              }
            }
          },
          productos: {
            select: {
              nombre: true,
              categorias: {
                select: {
                  nombre: true,
                }
              }
            }
          }
        },
        orderBy: {
          created_at: "desc",
        }
      }),
      prisma.detalle_pedidos.findMany({
        where: {
          proveedor_id: empresaId,
          calificacion: { not: null },
        },
        include: {
          pedidos: {
            include: {
              usuarios: {
                select: {
                  nombre: true,
                  apellido: true,
                }
              }
            }
          },
          productos: {
            select: {
              nombre: true,
            }
          }
        },
        orderBy: {
          created_at: "desc",
        }
      }),
    ]);

    if (empresaData) {
      selectedEmpresa = serializeDecimal(empresaData);
    }
    selectedEmpresaProductos = serializeDecimal(productosData);
    selectedEmpresaPedidos = serializeDecimal(pedidosData);
    selectedEmpresaOpiniones = serializeDecimal(opinionesData);
  } else {
    const [
      pedidosDB,
      empresasDB,
      usuariosDB,
      productosDB,
      calificacionesDB,
      detallesDB,
      recomendacionesDB,
      carritoCount,
      recordatoriosCount,
      notificacionesUnreadCount,
      personalizacionesCount
    ] = await Promise.all([
      prisma.pedidos.findMany({
        select: {
          id: true,
          total: true,
          subtotal: true,
          estado: true,
          created_at: true,
          metodo_pago: true,
          puntos_usados: true,
          puntos_ganados: true,
          direcciones: {
            select: {
              ciudad: true
            }
          }
        }
      }),
      prisma.proveedores.findMany({
        select: {
          id: true,
          nombre_negocio: true,
          logo_url: true,
          email: true,
          telefono: true,
          rep_nombre: true,
          rep_email: true,
          rep_telefono: true,
          estado: true,
          total_vendido: true,
          calificacion_prom: true
        }
      }),
      prisma.usuarios.findMany({
        where: { tipo: "usuario" },
        select: {
          id: true,
          activo: true,
          plan: true,
          puntos: true
        }
      }),
      prisma.productos.findMany({
        select: {
          id: true,
          activo: true,
          stock: true,
          precio_venta: true,
          categoria_id: true,
          categorias: {
            select: {
              nombre: true
            }
          }
        }
      }),
      prisma.detalle_pedidos.findMany({
        where: { calificacion: { not: null } },
        select: {
          id: true,
          calificacion: true,
          resena: true,
          proveedor_id: true,
          created_at: true,
          productos: {
            select: {
              nombre: true
            }
          }
        }
      }),
      prisma.detalle_pedidos.findMany({
        where: { pedidos: { estado: "entregado" } },
        select: {
          id: true,
          cantidad: true,
          subtotal: true,
          producto_id: true,
          proveedor_id: true,
          empaque_especial: true,
          mensaje_personal: true,
          productos: {
            select: {
              nombre: true,
              categorias: {
                select: {
                  nombre: true
                }
              }
            }
          }
        }
      }),
      prisma.recomendaciones.findMany({
        select: {
          id: true,
          convertida_en_compra: true
        }
      }),
      prisma.carrito.count(),
      prisma.recordatorios.count({
        where: { activo: true }
      }),
      prisma.notificaciones.count({
        where: { leida: false }
      }),
      prisma.personalizaciones.count()
    ]);

    globalData = {
      pedidosDB: serializeDecimal(pedidosDB),
      empresasDB: serializeDecimal(empresasDB),
      usuariosDB: serializeDecimal(usuariosDB),
      productosDB: serializeDecimal(productosDB),
      calificacionesDB: serializeDecimal(calificacionesDB),
      detallesDB: serializeDecimal(detallesDB),
      recomendacionesDB: serializeDecimal(recomendacionesDB),
      carritoCount,
      recordatoriosCount,
      notificacionesUnreadCount,
      personalizacionesCount
    };
  }

  const formatBs = (n: number) =>
    `Bs ${n.toLocaleString("es-BO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  let totalIngresos = 0;
  let totalPedidos = 0;
  let ticketPromedio = 0;
  let usuariosActivos = 0;
  let empresasActivas = 0;
  let productosActivos = 0;
  let totalReseñas = 0;
  let promedioCalif = 0;
  let topEmpresas: any[] = [];
  let semanas: any[] = [];
  let topCategorias: any[] = [];
  let kpisGenerales: any[] = [];

  // Extended variables
  let totalUsuarios = 0;
  let usuariosPremium = 0;
  let usuariosBasico = 0;
  let usuariosInactivos = 0;
  let totalEmpresas = 0;
  let empresasPendientes = 0;
  let totalProductos = 0;
  let productosInactivos = 0;
  let totalStock = 0;
  let promedioCalificacionEmpresas: any[] = [];
  let recomendacionesTotales = 0;
  let recomendacionesConvertidas = 0;
  let tasaConversionIA = 0;
  let totalPuntosAcumulados = 0;
  let totalPuntosUsados = 0;
  let totalPuntosGanados = 0;
  let carritoAbandonadoCount = 0;
  let recordatoriosActivosCount = 0;
  let notificacionesNoLeidasCount = 0;
  let empaqueEspecialCount = 0;
  
  // Tables for global download and view
  let metodosPagoTabla: any[] = [];
  let inventarioCategoriaTabla: any[] = [];
  let topProductosTabla: any[] = [];
  let distribucionGeograficaTabla: any[] = [];
  let representanteDirectorioTabla: any[] = [];

  if (globalData) {
    const {
      pedidosDB,
      empresasDB,
      usuariosDB,
      productosDB,
      calificacionesDB,
      detallesDB,
      recomendacionesDB,
      carritoCount,
      recordatoriosCount,
      notificacionesUnreadCount,
      personalizacionesCount
    } = globalData;

    const pedidosEntregados = pedidosDB.filter((p: any) => p.estado === "entregado");
    totalIngresos = pedidosEntregados.reduce((s: number, p: any) => s + Number(p.total), 0);
    totalPedidos = pedidosEntregados.length;
    ticketPromedio = totalPedidos > 0 ? totalIngresos / totalPedidos : 0;
    
    // User metrics
    totalUsuarios = usuariosDB.length;
    usuariosActivos = usuariosDB.filter((u: any) => u.activo).length;
    usuariosInactivos = totalUsuarios - usuariosActivos;
    usuariosPremium = usuariosDB.filter((u: any) => u.plan === "premium").length;
    usuariosBasico = totalUsuarios - usuariosPremium;

    // Supplier metrics
    totalEmpresas = empresasDB.length;
    empresasActivas = empresasDB.filter((e: any) => e.estado === "aprobado").length;
    empresasPendientes = totalEmpresas - empresasActivas;

    // Product metrics
    totalProductos = productosDB.length;
    productosActivos = productosDB.filter((p: any) => p.activo).length;
    productosInactivos = totalProductos - productosActivos;
    totalStock = productosDB.reduce((s: number, p: any) => s + (p.stock || 0), 0);

    // Rating metrics
    totalReseñas = calificacionesDB.length;
    promedioCalif = totalReseñas > 0
      ? calificacionesDB.reduce((s: number, c: any) => s + Number(c.calificacion), 0) / totalReseñas
      : 0;

    // Company sales
    const salesMap: Record<number, number> = {};
    detallesDB.forEach((d: any) => {
      const pId = d.proveedor_id;
      salesMap[pId] = (salesMap[pId] || 0) + Number(d.subtotal || 0);
    });

    topEmpresas = [...empresasDB]
      .map((e: any) => ({
        ...e,
        total_vendido: salesMap[e.id] || 0,
      }))
      .sort((a: any, b: any) => b.total_vendido - a.total_vendido);

    // Representantes Directorio rows
    representanteDirectorioTabla = empresasDB.map((e: any) => [
      e.nombre_negocio,
      e.rep_nombre || "Sin Asignar",
      e.rep_email || "N/A",
      e.rep_telefono || "N/A",
      e.email,
      e.telefono || "N/A",
      e.estado.toUpperCase()
    ]);

    // Average rating per company
    const ratingsByEmpresa: Record<number, { sum: number; count: number }> = {};
    calificacionesDB.forEach((c: any) => {
      const pId = c.proveedor_id;
      if (!ratingsByEmpresa[pId]) ratingsByEmpresa[pId] = { sum: 0, count: 0 };
      ratingsByEmpresa[pId].sum += Number(c.calificacion);
      ratingsByEmpresa[pId].count += 1;
    });

    promedioCalificacionEmpresas = empresasDB.map((e: any) => {
      const entry = ratingsByEmpresa[e.id];
      const avg = entry ? entry.sum / entry.count : 0;
      return {
        nombre: e.nombre_negocio,
        promedio: avg,
        total: entry ? entry.count : 0
      };
    }).sort((a: any, b: any) => b.promedio - a.promedio);

    // Ventas semanales (últimas 4 semanas)
    const ahora = new Date();
    for (let i = 3; i >= 0; i--) {
      const inicio = new Date(ahora);
      inicio.setDate(ahora.getDate() - (i + 1) * 7);
      const fin = new Date(ahora);
      fin.setDate(ahora.getDate() - i * 7);
      const label = `Sem ${4 - i} (${inicio.getDate()}/${inicio.getMonth() + 1})`;
      const peds = pedidosEntregados.filter((p: any) => {
        const d = new Date(p.created_at);
        return d >= inicio && d < fin;
      });
      semanas.push({
        periodo: label,
        pedidos: peds.length,
        monto: peds.reduce((s: number, p: any) => s + Number(p.total), 0),
      });
    }

    // Categories
    type CatData = { monto: number; items: number };
    const catMap: Record<string, CatData> = {};
    detallesDB.forEach((d: any) => {
      const cat = d.productos?.categorias?.nombre || "Otros";
      const sub = Number(d.subtotal || 0);
      if (!catMap[cat]) catMap[cat] = { monto: 0, items: 0 };
      catMap[cat].monto += sub;
      catMap[cat].items += Number(d.cantidad || 0);
    });
    topCategorias = Object.entries(catMap)
      .map(([nombre, data]) => ({
        nombre,
        ...data,
        pct: totalIngresos > 0 ? Math.round((data.monto / totalIngresos) * 100) : 0,
      }))
      .sort((a: any, b: any) => b.monto - a.monto)
      .slice(0, 5);

    // Methods of payment
    const paymentMap: Record<string, { count: number; sum: number }> = {};
    pedidosEntregados.forEach((p: any) => {
      const met = p.metodo_pago || "No Especificado";
      if (!paymentMap[met]) paymentMap[met] = { count: 0, sum: 0 };
      paymentMap[met].count += 1;
      paymentMap[met].sum += Number(p.total);
    });
    metodosPagoTabla = Object.entries(paymentMap).map(([met, d]) => [
      met.toUpperCase(),
      d.count,
      d.sum
    ]);

    // Geography distribution
    const geoMap: Record<string, { count: number; sum: number }> = {};
    pedidosEntregados.forEach((p: any) => {
      const ciudad = p.direcciones?.ciudad || "La Paz";
      if (!geoMap[ciudad]) geoMap[ciudad] = { count: 0, sum: 0 };
      geoMap[ciudad].count += 1;
      geoMap[ciudad].sum += Number(p.total);
    });
    distribucionGeograficaTabla = Object.entries(geoMap).map(([ciudad, d]) => [
      ciudad,
      d.count,
      d.sum
    ]).sort((a: any, b: any) => b[2] - a[2]);

    // Top 10 products
    const prodMap: Record<number, { nombre: string; categoria: string; cantidad: number; sum: number }> = {};
    detallesDB.forEach((d: any) => {
      const pId = d.producto_id;
      if (!prodMap[pId]) {
        prodMap[pId] = {
          nombre: d.productos?.nombre || `Prod #${pId}`,
          categoria: d.productos?.categorias?.nombre || "N/A",
          cantidad: 0,
          sum: 0
        };
      }
      prodMap[pId].cantidad += d.cantidad;
      prodMap[pId].sum += Number(d.subtotal);
    });
    topProductosTabla = Object.values(prodMap)
      .sort((a: any, b: any) => b.sum - a.sum)
      .slice(0, 10)
      .map((p: any) => [
        p.nombre,
        p.categoria,
        p.cantidad,
        p.sum
      ]);

    // Category Inventory
    const categoryInvMap: Record<string, { count: number; stock: number }> = {};
    productosDB.forEach((p: any) => {
      const cat = p.categorias?.nombre || "Sin Categoría";
      if (!categoryInvMap[cat]) categoryInvMap[cat] = { count: 0, stock: 0 };
      if (p.activo) categoryInvMap[cat].count += 1;
      categoryInvMap[cat].stock += p.stock || 0;
    });
    inventarioCategoriaTabla = Object.entries(categoryInvMap).map(([cat, d]) => {
      const sales = catMap[cat]?.monto || 0;
      return [
        cat,
        d.count,
        d.stock,
        sales
      ];
    });

    // IA recommendations metrics
    recomendacionesTotales = recomendacionesDB.length;
    recomendacionesConvertidas = recomendacionesDB.filter((r: any) => r.convertida_en_compra).length;
    tasaConversionIA = recomendacionesTotales > 0
      ? (recomendacionesConvertidas / recomendacionesTotales) * 100
      : 0;

    // Loyalty points
    totalPuntosAcumulados = usuariosDB.reduce((s: number, u: any) => s + (u.puntos || 0), 0);
    totalPuntosUsados = pedidosEntregados.reduce((s: number, p: any) => s + (p.puntos_usados || 0), 0);
    totalPuntosGanados = pedidosEntregados.reduce((s: number, p: any) => s + (p.puntos_ganados || 0), 0);

    // Carts, reminders, notifications, personalizations
    carritoAbandonadoCount = carritoCount;
    recordatoriosActivosCount = recordatoriosCount;
    notificacionesNoLeidasCount = notificacionesUnreadCount;
    empaqueEspecialCount = detallesDB.filter((d: any) => d.empaque_especial).length;

    kpisGenerales = [
      { label: "Ingresos totales", valor: formatBs(totalIngresos), color: "#8E1B3A" },
      { label: "Pedidos completados", valor: String(totalPedidos), color: "#BC9968" },
      { label: "Ticket promedio", valor: formatBs(ticketPromedio), color: "#5C3A2E" },
      { label: "Empresas activas", valor: `${empresasActivas} / ${totalEmpresas}`, color: "#AB3A50" },
      { label: "Clientes activos", valor: `${usuariosActivos} / ${totalUsuarios}`, color: "#185FA5" },
      { label: "Productos activos", valor: `${productosActivos} / ${totalProductos}`, color: "#2D7A47" },
      { label: "Calificación media", valor: promedioCalif.toFixed(2) + " ★", color: "#8C5E08" },
      { label: "Reseñas totales", valor: String(totalReseñas), color: "#5A0F24" },
    ];
  }

  // Datos para descarga
  let config;
  if (empresaId > 0 && selectedEmpresa) {
    const totalFacturado = selectedEmpresaPedidos
      .filter((p) => p.pedidos.estado === "entregado")
      .reduce((acc, curr) => acc + Number(curr.subtotal), 0);
    const totalPedidosEntregados = new Set(
      selectedEmpresaPedidos.filter((p) => p.pedidos.estado === "entregado").map((p) => p.pedido_id)
    ).size;
    const ticketPromedioEmpresa = totalPedidosEntregados > 0 ? totalFacturado / totalPedidosEntregados : 0;
    const totalProductosActivosEmpresa = selectedEmpresaProductos.filter((p) => p.activo).length;
    const ratingPromedioEmpresa = selectedEmpresaOpiniones.length > 0
      ? selectedEmpresaOpiniones.reduce((acc, curr) => acc + (curr.calificacion || 0), 0) / selectedEmpresaOpiniones.length
      : 0;
    const totalOpinionesEmpresa = selectedEmpresaOpiniones.length;

    // Ventas semanales locales de la empresa
    const semanasEmpresa: { periodo: string; pedidos: number; monto: number }[] = [];
    const ahora = new Date();
    for (let i = 3; i >= 0; i--) {
      const inicio = new Date(ahora);
      inicio.setDate(ahora.getDate() - (i + 1) * 7);
      const fin = new Date(ahora);
      fin.setDate(ahora.getDate() - i * 7);
      const label = `Sem ${4 - i} (${inicio.getDate()}/${inicio.getMonth() + 1})`;
      const peds = selectedEmpresaPedidos.filter((p) => {
        const d = new Date(p.created_at);
        return p.pedidos.estado === "entregado" && d >= inicio && d < fin;
      });
      const uniquePeds = new Set(peds.map((p) => p.pedido_id)).size;
      semanasEmpresa.push({
        periodo: label,
        pedidos: uniquePeds,
        monto: peds.reduce((s, p) => s + Number(p.subtotal), 0),
      });
    }

    // Categorías de la empresa
    type CatDataEmp = { monto: number; items: number };
    const catMapEmp: Record<string, CatDataEmp> = {};
    selectedEmpresaPedidos
      .filter((p) => p.pedidos.estado === "entregado")
      .forEach((d: any) => {
        const cat = d.productos?.categorias?.nombre || "Otros";
        const sub = Number(d.subtotal || 0);
        if (!catMapEmp[cat]) catMapEmp[cat] = { monto: 0, items: 0 };
        catMapEmp[cat].monto += sub;
        catMapEmp[cat].items += Number(d.cantidad || 0);
      });
    const topCategoriasEmpresa = Object.entries(catMapEmp)
      .map(([nombre, data]) => ({
        nombre,
        ...data,
        pct: totalFacturado > 0 ? Math.round((data.monto / totalFacturado) * 100) : 0,
      }))
      .sort((a, b) => b.monto - a.monto)
      .slice(0, 5);

    const kpisEmpresa = [
      { label: "Ventas de la empresa", valor: formatBs(totalFacturado), color: "#8E1B3A" },
      { label: "Pedidos entregados", valor: String(totalPedidosEntregados), color: "#BC9968" },
      { label: "Ticket promedio", valor: formatBs(ticketPromedioEmpresa), color: "#5C3A2E" },
      { label: "Catálogo de productos activos", valor: String(totalProductosActivosEmpresa), color: "#2D7A47" },
      { label: "Promedio de calificación", valor: ratingPromedioEmpresa.toFixed(2) + " ★", color: "#8C5E08" },
      { label: "Total de reseñas", valor: String(totalOpinionesEmpresa), color: "#5A0F24" },
    ];

    const cleanNombre = selectedEmpresa.nombre_negocio.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    config = {
      filename: `reporte-empresa-${cleanNombre}`,
      titulo: `Reporte de Empresa: ${selectedEmpresa.nombre_negocio} — PREPE`,
      formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
      kpis: kpisEmpresa,
      logoUrl: selectedEmpresa.logo_url || undefined,
      graficos: [
        { tipo: "area" as const, titulo: "Evolución semanal de ingresos", datos: semanasEmpresa.map((s) => ({ x: s.periodo, y: s.monto })), color: "#8E1B3A" },
        { tipo: "dona" as const, titulo: "Distribución por categoría (Ventas)", datos: topCategoriasEmpresa.map((c, i) => ({ nombre: c.nombre, valor: c.monto, color: ["#8E1B3A","#BC9968","#5C3A2E","#AB3A50","#185FA5"][i] })) },
      ],
      tablas: [
        {
          nombre: "KPIs de la empresa",
          columnas: ["Métrica", "Valor"],
          filas: kpisEmpresa.map((k) => [k.label, k.valor]),
        },
        {
          nombre: "Evolución semanal",
          columnas: ["Período", "Pedidos Entregados", "Monto (Bs)"],
          filas: semanasEmpresa.map((s) => [s.periodo, s.pedidos, s.monto]),
        },
        {
          nombre: "Catálogo de Productos",
          columnas: ["Producto", "Categoría", "Precio Base (Bs)", "Precio Venta (Bs)", "Estado"],
          filas: selectedEmpresaProductos.map((p) => [p.nombre, p.categorias?.nombre || "N/A", p.precio_base, p.precio_venta, p.activo ? "Activo" : "Inactivo"]),
        },
        {
          nombre: "Historial de Pedidos y Ventas",
          columnas: ["ID Pedido", "Cliente", "Fecha", "Producto", "Cantidad", "Subtotal (Bs)", "Estado"],
          filas: selectedEmpresaPedidos.map((p) => [
            p.pedido_id,
            `${p.pedidos.usuarios.nombre} ${p.pedidos.usuarios.apellido || ""}`,
            new Date(p.created_at).toLocaleDateString("es-BO"),
            p.productos.nombre,
            p.cantidad,
            p.subtotal,
            p.pedidos.estado,
          ]),
        },
        {
          nombre: "Opiniones y Calificaciones",
          columnas: ["Cliente", "Producto", "Calificación", "Reseña", "Fecha"],
          filas: selectedEmpresaOpiniones.map((o) => [
            `${o.pedidos.usuarios.nombre} ${o.pedidos.usuarios.apellido || ""}`,
            o.productos.nombre,
            `${o.calificacion} ★`,
            o.resena || "Sin comentario",
            new Date(o.created_at).toLocaleDateString("es-BO"),
          ]),
        },
      ],
    };
  } else {
    config = {
      filename: "reporte-global",
      titulo: "Reporte Global del Sistema — PREPE",
      formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
      kpis: kpisGenerales,
      graficos: [
        { tipo: "area" as const, titulo: "Evolución semanal de ingresos", datos: semanas.map((s) => ({ x: s.periodo, y: s.monto })), color: "#8E1B3A" },
        { tipo: "barras" as const, titulo: "Ventas por empresa (Bs)", datos: topEmpresas.slice(0, 5).map((e) => ({ nombre: e.nombre_negocio, valor: Number(e.total_vendido || 0) })), color: "#BC9968" },
        { tipo: "dona" as const, titulo: "Distribución por categoría", datos: topCategorias.map((c, i) => ({ nombre: c.nombre, valor: c.monto, color: ["#8E1B3A","#BC9968","#5C3A2E","#AB3A50","#185FA5"][i] })) },
      ],
      tablas: [
        {
          nombre: "KPIs Generales",
          columnas: ["Métrica", "Valor"],
          filas: [
            ...kpisGenerales.map((k) => [k.label, k.valor]),
            ["Clientes Registrados", totalUsuarios],
            ["Clientes Premium", usuariosPremium],
            ["Clientes Básicos", usuariosBasico],
            ["Empresas Registradas", totalEmpresas],
            ["Empresas Aprobadas", empresasActivas],
            ["Empresas Pendientes", empresasPendientes],
            ["Productos Totales", totalProductos],
            ["Stock Total de Inventario", totalStock],
            ["Conversión IA Recomendaciones", `${tasaConversionIA.toFixed(1)}% (${recomendacionesConvertidas}/${recomendacionesTotales})`],
            ["Puntos Acumulados por Clientes", totalPuntosAcumulados],
            ["Puntos Canjeados en Pedidos", totalPuntosUsados],
            ["Puntos Otorgados en Pedidos", totalPuntosGanados],
            ["Carritos Abandonados Activos", carritoAbandonadoCount],
            ["Recordatorios Activos", recordatoriosActivosCount],
            ["Notificaciones Pendientes de Lectura", notificacionesNoLeidasCount],
            ["Pedidos con Empaque Especial", empaqueEspecialCount],
          ],
        },
        {
          nombre: "Evolución Semanal",
          columnas: ["Período", "Pedidos", "Monto (Bs)"],
          filas: semanas.map((s) => [s.periodo, s.pedidos, s.monto]),
        },
        {
          nombre: "Ventas por Empresa",
          columnas: ["Empresa", "Ventas (Bs)", "Estado", "Representante", "Email Contacto"],
          filas: topEmpresas.map((e) => [
            e.nombre_negocio,
            e.total_vendido,
            e.estado.toUpperCase(),
            e.rep_nombre || "Sin Asignar",
            e.email
          ]),
        },
        {
          nombre: "Métodos de Pago",
          columnas: ["Método de Pago", "Cantidad de Transacciones", "Monto Total (Bs)"],
          filas: metodosPagoTabla,
        },
        {
          nombre: "Inventario por Categoría",
          columnas: ["Categoría", "Productos Activos", "Stock Total", "Ventas Totales (Bs)"],
          filas: inventarioCategoriaTabla,
        },
        {
          nombre: "Top 10 Productos Más Vendidos",
          columnas: ["Producto", "Categoría", "Cantidad Vendida", "Monto Total (Bs)"],
          filas: topProductosTabla,
        },
        {
          nombre: "Distribución Geográfica",
          columnas: ["Ciudad", "Pedidos Entregados", "Monto Facturado (Bs)"],
          filas: distribucionGeograficaTabla,
        },
      ],
    };
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/reportes" className="text-xs text-[#BC9968] hover:text-[#8E1B3A] font-medium transition-colors">Reportes</Link>
            <span className="text-[#BC9968]/40 text-xs">/</span>
            <span className="text-xs text-[#5A0F24] font-medium">Global</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte Global del Sistema</h1>
          <p className="mt-1 text-sm text-[#7A5260] max-w-2xl leading-relaxed">
            Perspectiva holística del Sistema EMOTIA: métricas consolidadas de todas las áreas y operaciones.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Suspense><EmpresaFilter empresas={empresasLista} /></Suspense>
          <DescargarReporteBtn config={config} />
        </div>
      </div>

      <ReportSubNav />

      {/* If a company is selected, show company detail */}
      {empresaId > 0 && selectedEmpresa ? (
        <GlobalEmpresaDetail
          empresa={selectedEmpresa}
          productos={selectedEmpresaProductos}
          pedidos={selectedEmpresaPedidos}
          resenas={selectedEmpresaOpiniones}
        />
      ) : (
        <>
          {/* Tabs Navigation */}
          <div className="flex flex-wrap gap-1 border-b border-[#8E1B3A]/20 pb-px mb-6">
            <Link
              href="?tab=comercial"
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all relative border-t-2 border-x border-[#8E1B3A]/10 rounded-t-xl -mb-px ${
                tab === "comercial"
                  ? "bg-[#FAF3EC] text-[#5A0F24] border-[#8E1B3A] border-b-[#FAF3EC] font-bold shadow-sm"
                  : "bg-white text-[#7A5260] hover:text-[#5A0F24] hover:bg-[#FDFBF9] border-transparent"
              }`}
            >
              <TrendingUp className="w-4 h-4 text-[#8E1B3A]" />
              <span>Comercial & Geográfico</span>
            </Link>
            <Link
              href="?tab=cuentas"
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all relative border-t-2 border-x border-[#8E1B3A]/10 rounded-t-xl -mb-px ${
                tab === "cuentas"
                  ? "bg-[#FAF3EC] text-[#5A0F24] border-[#8E1B3A] border-b-[#FAF3EC] font-bold shadow-sm"
                  : "bg-white text-[#7A5260] hover:text-[#5A0F24] hover:bg-[#FDFBF9] border-transparent"
              }`}
            >
              <Users className="w-4 h-4 text-[#8E1B3A]" />
              <span>Cuentas & Hub</span>
            </Link>
            <Link
              href="?tab=catalogo"
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all relative border-t-2 border-x border-[#8E1B3A]/10 rounded-t-xl -mb-px ${
                tab === "catalogo"
                  ? "bg-[#FAF3EC] text-[#5A0F24] border-[#8E1B3A] border-b-[#FAF3EC] font-bold shadow-sm"
                  : "bg-white text-[#7A5260] hover:text-[#5A0F24] hover:bg-[#FDFBF9] border-transparent"
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-[#8E1B3A]" />
              <span>Catálogo & Calidad</span>
            </Link>
            <Link
              href="?tab=fidelidad"
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all relative border-t-2 border-x border-[#8E1B3A]/10 rounded-t-xl -mb-px ${
                tab === "fidelidad"
                  ? "bg-[#FAF3EC] text-[#5A0F24] border-[#8E1B3A] border-b-[#FAF3EC] font-bold shadow-sm"
                  : "bg-white text-[#7A5260] hover:text-[#5A0F24] hover:bg-[#FDFBF9] border-transparent"
              }`}
            >
              <Award className="w-4 h-4 text-[#8E1B3A]" />
              <span>Fidelidad & Operaciones</span>
            </Link>
          </div>

          {/* TAB 1: Comercial & Geográfico */}
          {tab === "comercial" && (
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#8E1B3A]" />
                  <p className="text-xs sm:text-sm text-[#7A5260] font-medium">Ingresos Totales</p>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24] mt-2">{formatBs(totalIngresos)}</p>
                </div>
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#BC9968]" />
                  <p className="text-xs sm:text-sm text-[#7A5260] font-medium">Pedidos Completados</p>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24] mt-2">{totalPedidos}</p>
                </div>
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#5C3A2E]" />
                  <p className="text-xs sm:text-sm text-[#7A5260] font-medium">Ticket Promedio</p>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24] mt-2">{formatBs(ticketPromedio)}</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <GraficoSemanalGlobal data={semanas} totalIngresos={totalIngresos} />
                <GraficoEmpresasGlobal data={topEmpresas.slice(0, 5)} totalIngresos={totalIngresos} />
              </div>

              {/* Tables: Métodos de pago & Distribución geográfica */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Métodos de Pago */}
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 shadow-sm">
                  <h3 className="font-serif text-lg font-bold text-[#5A0F24] mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#BC9968]" />
                    Métodos de Pago
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#8E1B3A]/10 text-[#7A5260] font-semibold">
                          <th className="py-2.5">Método</th>
                          <th className="py-2.5 text-right">Transacciones</th>
                          <th className="py-2.5 text-right">Monto Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#8E1B3A]/5">
                        {metodosPagoTabla.map(([met, count, sum]) => (
                          <tr key={met} className="text-[#2A0E18]">
                            <td className="py-3 font-medium">{met}</td>
                            <td className="py-3 text-right">{count}</td>
                            <td className="py-3 text-right font-semibold text-[#5A0F24]">{formatBs(sum)}</td>
                          </tr>
                        ))}
                        {metodosPagoTabla.length === 0 && (
                          <tr>
                            <td colSpan={3} className="py-4 text-center text-xs text-[#7A5260]">Sin datos registrados</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Distribución Geográfica */}
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 shadow-sm">
                  <h3 className="font-serif text-lg font-bold text-[#5A0F24] mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#BC9968]" />
                    Distribución Geográfica de Envíos
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#8E1B3A]/10 text-[#7A5260] font-semibold">
                          <th className="py-2.5">Ciudad</th>
                          <th className="py-2.5 text-right">Pedidos</th>
                          <th className="py-2.5 text-right">Total Facturado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#8E1B3A]/5">
                        {distribucionGeograficaTabla.map(([ciudad, count, sum]) => (
                          <tr key={ciudad} className="text-[#2A0E18]">
                            <td className="py-3 font-medium">{ciudad}</td>
                            <td className="py-3 text-right">{count}</td>
                            <td className="py-3 text-right font-semibold text-[#5A0F24]">{formatBs(sum)}</td>
                          </tr>
                        ))}
                        {distribucionGeograficaTabla.length === 0 && (
                          <tr>
                            <td colSpan={3} className="py-4 text-center text-xs text-[#7A5260]">Sin datos registrados</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Cuentas & Hub */}
          {tab === "cuentas" && (
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#185FA5]" />
                  <p className="text-xs text-[#7A5260] font-medium">Clientes Registrados</p>
                  <p className="font-serif text-2xl font-bold text-[#5A0F24] mt-2">{totalUsuarios}</p>
                </div>
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#8E1B3A]" />
                  <p className="text-xs text-[#7A5260] font-medium">Clientes Activos</p>
                  <p className="font-serif text-2xl font-bold text-[#5A0F24] mt-2">{usuariosActivos}</p>
                </div>
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#BC9968]" />
                  <p className="text-xs text-[#7A5260] font-medium">Clientes Premium</p>
                  <p className="font-serif text-2xl font-bold text-[#5A0F24] mt-2">{usuariosPremium}</p>
                </div>
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#AB3A50]" />
                  <p className="text-xs text-[#7A5260] font-medium">Empresas Aprobadas</p>
                  <p className="font-serif text-2xl font-bold text-[#5A0F24] mt-2">{empresasActivas}</p>
                </div>
              </div>

              {/* Segmentación de planes y empresas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 shadow-sm">
                  <h3 className="font-serif text-lg font-bold text-[#5A0F24] mb-4">Segmentación de Clientes</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-[#7A5260] mb-1">
                        <span>PLAN DE MEMBRESÍA</span>
                        <span>{usuariosPremium} Premium / {usuariosBasico} Básico</span>
                      </div>
                      <div className="w-full bg-[#FAF3EC] rounded-full h-2.5 overflow-hidden flex">
                        <div className="bg-[#BC9968] h-full" style={{ width: `${totalUsuarios > 0 ? (usuariosPremium / totalUsuarios) * 100 : 0}%` }} />
                        <div className="bg-[#8E1B3A]/20 h-full flex-1" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-[#7A5260] mb-1">
                        <span>ESTADO DE CUENTA</span>
                        <span>{usuariosActivos} Activos / {usuariosInactivos} Inactivos</span>
                      </div>
                      <div className="w-full bg-[#FAF3EC] rounded-full h-2.5 overflow-hidden flex">
                        <div className="bg-[#8E1B3A] h-full" style={{ width: `${totalUsuarios > 0 ? (usuariosActivos / totalUsuarios) * 100 : 0}%` }} />
                        <div className="bg-[#8E1B3A]/20 h-full flex-1" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 shadow-sm">
                  <h3 className="font-serif text-lg font-bold text-[#5A0F24] mb-4">Red de Empresas</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-[#7A5260] mb-1">
                        <span>ESTADO DE PROVEEDORES</span>
                        <span>{empresasActivas} Aprobados / {empresasPendientes} Pendientes/Inactivos</span>
                      </div>
                      <div className="w-full bg-[#FAF3EC] rounded-full h-2.5 overflow-hidden flex">
                        <div className="bg-[#2D7A47] h-full" style={{ width: `${totalEmpresas > 0 ? (empresasActivas / totalEmpresas) * 100 : 0}%` }} />
                        <div className="bg-[#BC9968]/30 h-full flex-1" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#7A5260] pt-2">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#2D7A47]" /> Aprobadas</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#BC9968]" /> Pendientes / Otras</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Directorio de Representantes */}
              <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-[#5A0F24] mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#BC9968]" />
                  Directorio de Empresas (Hub)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[700px]">
                    <thead>
                      <tr className="border-b border-[#8E1B3A]/10 text-[#7A5260] font-semibold">
                        <th className="py-2.5">Empresa</th>
                        <th className="py-2.5">Representante</th>
                        <th className="py-2.5">Contacto Rep.</th>
                        <th className="py-2.5">Email Corporativo</th>
                        <th className="py-2.5">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#8E1B3A]/5">
                      {representanteDirectorioTabla.map(([emp, rep, emailRep, telRep, emailCorp, telCorp, estado]) => (
                        <tr key={emp} className="text-[#2A0E18] hover:bg-[#FAF3EC]/30">
                          <td className="py-3 font-semibold text-[#5A0F24]">{emp}</td>
                          <td className="py-3 font-medium">{rep}</td>
                          <td className="py-3 text-xs text-[#7A5260]">
                            <div className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {emailRep}</div>
                            {telRep !== "N/A" && <div className="flex items-center gap-1 mt-0.5"><Phone className="w-3.5 h-3.5" /> {telRep}</div>}
                          </td>
                          <td className="py-3 text-xs text-[#7A5260]">
                            <div>{emailCorp}</div>
                            {telCorp !== "N/A" && <div className="mt-0.5">{telCorp}</div>}
                          </td>
                          <td className="py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              estado === "APROBADO"
                                ? "bg-[#2D7A47]/10 text-[#2D7A47]"
                                : "bg-[#BC9968]/10 text-[#BC9968]"
                            }`}>
                              {estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Catálogo & Calidad */}
          {tab === "catalogo" && (
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#2D7A47]" />
                  <p className="text-xs text-[#7A5260] font-medium">Productos Activos</p>
                  <p className="font-serif text-2xl font-bold text-[#5A0F24] mt-2">{productosActivos} / {totalProductos}</p>
                </div>
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#BC9968]" />
                  <p className="text-xs text-[#7A5260] font-medium">Stock Total de Inventario</p>
                  <p className="font-serif text-2xl font-bold text-[#5A0F24] mt-2">{totalStock} uds</p>
                </div>
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#8C5E08]" />
                  <p className="text-xs text-[#7A5260] font-medium">Calificación Media</p>
                  <p className="font-serif text-2xl font-bold text-[#5A0F24] mt-2">{promedioCalif.toFixed(2)} ★</p>
                </div>
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#5A0F24]" />
                  <p className="text-xs text-[#7A5260] font-medium">Reseñas de Clientes</p>
                  <p className="font-serif text-2xl font-bold text-[#5A0F24] mt-2">{totalReseñas}</p>
                </div>
              </div>

              {/* Categorías Donut Chart */}
              <GraficoCategoriasGlobal data={topCategorias} />

              {/* Leaderboards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Selling Products */}
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 shadow-sm">
                  <h3 className="font-serif text-lg font-bold text-[#5A0F24] mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#BC9968]" />
                    Top 10 Productos Más Vendidos
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#8E1B3A]/10 text-[#7A5260] font-semibold">
                          <th className="py-2.5">Producto</th>
                          <th className="py-2.5">Categoría</th>
                          <th className="py-2.5 text-right">Cant. Vendida</th>
                          <th className="py-2.5 text-right">Total (Bs)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#8E1B3A]/5">
                        {topProductosTabla.map(([nombre, cat, cant, sum], idx) => (
                          <tr key={idx} className="text-[#2A0E18] hover:bg-[#FAF3EC]/20">
                            <td className="py-3 font-medium truncate max-w-[150px]">{nombre}</td>
                            <td className="py-3 text-xs text-[#7A5260]">{cat}</td>
                            <td className="py-3 text-right">{cant}</td>
                            <td className="py-3 text-right font-semibold text-[#5A0F24]">{formatBs(sum)}</td>
                          </tr>
                        ))}
                        {topProductosTabla.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-4 text-center text-xs text-[#7A5260]">Sin productos registrados</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Calidad de Servicio por Empresa */}
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 shadow-sm">
                  <h3 className="font-serif text-lg font-bold text-[#5A0F24] mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#BC9968]" />
                    Calidad de Servicio por Empresa
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#8E1B3A]/10 text-[#7A5260] font-semibold">
                          <th className="py-2.5">Empresa</th>
                          <th className="py-2.5 text-right">Promedio Calificación</th>
                          <th className="py-2.5 text-right">Total Reseñas</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#8E1B3A]/5">
                        {promedioCalificacionEmpresas.map(({ nombre, promedio, total }) => (
                          <tr key={nombre} className="text-[#2A0E18] hover:bg-[#FAF3EC]/20">
                            <td className="py-3 font-medium">{nombre}</td>
                            <td className="py-3 text-right">
                              <span className="inline-flex items-center gap-1 font-semibold text-[#8C5E08]">
                                {promedio > 0 ? `${promedio.toFixed(2)} ★` : "Sin calificaciones"}
                              </span>
                            </td>
                            <td className="py-3 text-right text-xs text-[#7A5260]">{total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Fidelidad & Operaciones */}
          {tab === "fidelidad" && (
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#8E1B3A]" />
                  <p className="text-xs text-[#7A5260] font-medium">Conversión Recomendador IA</p>
                  <p className="font-serif text-2xl font-bold text-[#5A0F24] mt-2">{tasaConversionIA.toFixed(1)}%</p>
                </div>
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#BC9968]" />
                  <p className="text-xs text-[#7A5260] font-medium">Carritos Activos</p>
                  <p className="font-serif text-2xl font-bold text-[#5A0F24] mt-2">{carritoAbandonadoCount}</p>
                </div>
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#5C3A2E]" />
                  <p className="text-xs text-[#7A5260] font-medium">Recordatorios Activos</p>
                  <p className="font-serif text-2xl font-bold text-[#5A0F24] mt-2">{recordatoriosActivosCount}</p>
                </div>
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#AB3A50]" />
                  <p className="text-xs text-[#7A5260] font-medium">Mensajería y Envolturas</p>
                  <p className="font-serif text-2xl font-bold text-[#5A0F24] mt-2">{empaqueEspecialCount} uds</p>
                </div>
              </div>

              {/* Loyalty Details & IA Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fidelización por Puntos */}
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 shadow-sm">
                  <h3 className="font-serif text-lg font-bold text-[#5A0F24] mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#BC9968]" />
                    Programa de Fidelización
                  </h3>
                  <div className="space-y-4 text-sm text-[#2A0E18]">
                    <div className="flex justify-between py-2 border-b border-[#8E1B3A]/5">
                      <span className="text-[#7A5260]">Puntos Totales Acumulados por Clientes</span>
                      <span className="font-bold text-[#5A0F24]">{totalPuntosAcumulados} pts</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#8E1B3A]/5">
                      <span className="text-[#7A5260]">Puntos Canjeados en Pedidos</span>
                      <span className="font-bold text-[#BC9968]">{totalPuntosUsados} pts</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-[#7A5260]">Puntos Ganados en Ventas</span>
                      <span className="font-bold text-[#2D7A47]">{totalPuntosGanados} pts</span>
                    </div>
                  </div>
                </div>

                {/* Motor de Recomendaciones IA */}
                <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 shadow-sm">
                  <h3 className="font-serif text-lg font-bold text-[#5A0F24] mb-4 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-[#BC9968]" />
                    Efectividad del Recomendador IA
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs text-[#7A5260]">
                      <span>RECOMENDACIONES CONVERTIDAS EN COMPRA</span>
                      <span className="font-semibold">{recomendacionesConvertidas} / {recomendacionesTotales}</span>
                    </div>
                    <div className="w-full bg-[#FAF3EC] rounded-full h-2.5 overflow-hidden">
                      <div className="bg-[#8E1B3A] h-full" style={{ width: `${tasaConversionIA}%` }} />
                    </div>
                    <p className="text-xs text-[#7A5260] leading-relaxed">
                      La tasa de conversión indica el porcentaje de recomendaciones generadas por el motor IA que finalizaron en una venta exitosa en la plataforma.
                    </p>
                  </div>
                </div>
              </div>

              {/* Operaciones y Alertas */}
              <div className="bg-[#FAF3EC] rounded-2xl border border-[#BC9968]/20 p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-[#5A0F24]/10 flex items-center justify-center text-[#5A0F24] flex-shrink-0">
                  <Bell className="w-6 h-6" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-serif text-lg font-bold text-[#5A0F24]">Resumen de Alertas Operacionales</h4>
                  <p className="text-sm text-[#7A5260] mt-1">
                    Existen <span className="font-bold text-[#5A0F24]">{notificacionesNoLeidasCount} notificaciones no leídas</span> y el inventario registra un stock consolidado de {totalStock} unidades activas en el catálogo.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
