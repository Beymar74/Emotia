export const dynamic = 'force-dynamic';

import prisma from "@/lib/prisma";
import MetricCard from "./_components/MetricCard";
import QuickActions from "./_components/QuickActions";
import ProveedoresTable from "./_components/ProveedoresTable";
import VentasCategorias from "./_components/VentasCategorias";
import SolicitudesPendientes from "./_components/SolicitudesPendientes";
import DashboardFilter from "./_components/DashboardFilter";
import EmpresaFilter from "./_components/EmpresaFilter";
import { Suspense } from "react";

function calcDelta(actual: number, anterior: number): { delta: string; deltaType: "up" | "down" | "neutral" } {
  if (anterior === 0) return { delta: "Sin datos prev.", deltaType: "neutral" };
  const pct = ((actual - anterior) / anterior) * 100;
  if (Math.abs(pct) < 0.5) return { delta: "Estable", deltaType: "neutral" };
  const sign = pct > 0 ? "+" : "";
  return {
    delta: `${sign}${pct.toFixed(1)}%`,
    deltaType: pct > 0 ? "up" : "down",
  };
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const rango = typeof sp.rango === "string" ? sp.rango : "historico";
  const empresaId = typeof sp.empresa === "string" && sp.empresa !== "todas" ? parseInt(sp.empresa) : 0;

  const now = new Date();
  let startDate: Date | undefined;
  let prevStartDate: Date | undefined;
  let prevEndDate: Date | undefined;

  if (rango !== "historico") {
    startDate = new Date();
    if (rango === "hoy") {
      startDate.setHours(0, 0, 0, 0);
      prevStartDate = new Date(startDate); prevStartDate.setDate(prevStartDate.getDate() - 1);
      prevEndDate = new Date(startDate);
    } else if (rango === "7dias") {
      startDate.setDate(now.getDate() - 7);
      prevStartDate = new Date(startDate); prevStartDate.setDate(prevStartDate.getDate() - 7);
      prevEndDate = new Date(startDate);
    } else if (rango === "30dias") {
      startDate.setDate(now.getDate() - 30);
      prevStartDate = new Date(startDate); prevStartDate.setDate(prevStartDate.getDate() - 30);
      prevEndDate = new Date(startDate);
    } else if (rango === "este_mes") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      prevEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
    }
  }

  const dateFilter = startDate ? { created_at: { gte: startDate } } : {};
  const prevDateFilter = (prevStartDate && prevEndDate)
    ? { created_at: { gte: prevStartDate, lte: prevEndDate } }
    : null;

  const empresaFiltroPedido = empresaId > 0 ? { detalle_pedidos: { some: { proveedor_id: empresaId } } } : {};
  const empresaFiltroUsuario = empresaId > 0 ? { pedidos: { some: { detalle_pedidos: { some: { proveedor_id: empresaId } } } } } : {};
  const empresaFiltroDetalle = empresaId > 0 ? { proveedor_id: empresaId } : {};
  const empresaFiltroProducto = empresaId > 0 ? { proveedor_id: empresaId } : {};

  // --- MÉTRICAS ACTUALES ---
  const [ingresosResult, pedidosCompletados, usuariosActivos, proveedoresAprobados, empresasLista] = await Promise.all([
    prisma.pedidos.aggregate({ _sum: { total: true }, where: { estado: 'entregado', ...dateFilter, ...empresaFiltroPedido } }),
    prisma.pedidos.count({ where: { estado: 'entregado', ...dateFilter, ...empresaFiltroPedido } }),
    prisma.usuarios.count({ where: { activo: true, tipo: 'usuario', ...dateFilter, ...empresaFiltroUsuario } }),
    prisma.proveedores.count({ where: { estado: 'aprobado', ...(empresaId > 0 ? { id: empresaId } : {}) } }),
    prisma.proveedores.findMany({ select: { id: true, nombre_negocio: true }, orderBy: { nombre_negocio: "asc" } }),
  ]);

  const ingresosTotales = Number(ingresosResult._sum.total || 0);

  // --- MÉTRICAS PERÍODO ANTERIOR (para deltas) ---
  let ingresosPrev = 0, pedidosPrev = 0, usuariosPrev = 0;
  if (prevDateFilter) {
    const [ingPrev, pedPrev, usPrev] = await Promise.all([
      prisma.pedidos.aggregate({ _sum: { total: true }, where: { estado: 'entregado', ...prevDateFilter, ...empresaFiltroPedido } }),
      prisma.pedidos.count({ where: { estado: 'entregado', ...prevDateFilter, ...empresaFiltroPedido } }),
      prisma.usuarios.count({ where: { activo: true, tipo: 'usuario', ...prevDateFilter, ...empresaFiltroUsuario } }),
    ]);
    ingresosPrev = Number(ingPrev._sum.total || 0);
    pedidosPrev = pedPrev;
    usuariosPrev = usPrev;
  }

  const deltaIngresos = prevDateFilter ? calcDelta(ingresosTotales, ingresosPrev) : { delta: "Histórico", deltaType: "neutral" as const };
  const deltaPedidos  = prevDateFilter ? calcDelta(pedidosCompletados, pedidosPrev) : { delta: "Histórico", deltaType: "neutral" as const };
  const deltaUsuarios = prevDateFilter ? calcDelta(usuariosActivos, usuariosPrev) : { delta: "Histórico", deltaType: "neutral" as const };

  // --- VENTAS POR CATEGORÍA (datos reales) ---
  const ventasCategoria = await prisma.detalle_pedidos.findMany({
    where: {
      pedidos: { estado: 'entregado', ...dateFilter },
      ...empresaFiltroDetalle
    },
    select: {
      subtotal: true,
      productos: { select: { categorias: { select: { nombre: true } } } },
    },
  });

  const totalVentas = ventasCategoria.reduce((acc, d) => acc + Number(d.subtotal), 0);
  const ventasPorCat: Record<string, number> = {};
  for (const d of ventasCategoria) {
    const cat = d.productos.categorias?.nombre ?? "Sin categoría";
    ventasPorCat[cat] = (ventasPorCat[cat] ?? 0) + Number(d.subtotal);
  }
  const categoriasData = Object.entries(ventasPorCat)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([nombre, total]) => ({
      nombre,
      total,
      porcentaje: totalVentas > 0 ? Math.round((total / totalVentas) * 100) : 0,
    }));

  // --- SOLICITUDES PENDIENTES (datos reales) ---
  const [proveedoresPendientes, productosInactivos, pedidosCancelados, pagosFallidos] = await Promise.all([
    prisma.proveedores.count({ where: { estado: 'pendiente', ...(empresaId > 0 ? { id: empresaId } : {}) } }),
    prisma.productos.count({ where: { activo: false, ...empresaFiltroProducto } }),
    prisma.pedidos.count({ where: { estado: 'cancelado', ...dateFilter, ...empresaFiltroPedido } }),
    prisma.pedidos.count({ where: { estado: 'cancelado', metodo_pago: { not: null }, ...dateFilter, ...empresaFiltroPedido } }),
  ]);

  // --- ÚLTIMOS PROVEEDORES ---
  const ultimosProveedores = await prisma.proveedores.findMany({
    where: empresaId > 0 ? { id: empresaId } : undefined,
    take: 5,
    orderBy: { created_at: 'desc' },
  });

  const formatBs = (monto: number) => `Bs ${monto.toLocaleString('es-BO', { minimumFractionDigits: 0 })}`;
  const formatNum = (num: number) => num.toLocaleString('es-BO');

  return (
    <div className="space-y-6 p-4">

      {/* Banner de bienvenida */}
      <div className="bg-gradient-to-r from-[#5A0F24] to-[#8E1B3A] rounded-2xl px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-[2px] uppercase text-[#BC9968] font-semibold mb-1">Panel de Administración</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
            Bienvenido al Sistema PREPE
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Plataforma de Regalos Personalizados y Experiencias — Administración total
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-xs bg-white/15 text-white px-3 py-1.5 rounded-full border border-white/20 font-medium">
            Acceso completo al sistema
          </span>
        </div>
      </div>

      {/* Sección de Métricas */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
          <div>
            <h2 className="text-[9px] tracking-[2.5px] uppercase text-[#7A5260] font-bold opacity-80">
              Resumen — {new Intl.DateTimeFormat("es-BO", { month: "long", year: "numeric", timeZone: "America/La_Paz" }).format(new Date())}
            </h2>
            <p className="mt-2 text-sm text-[#7A5260] max-w-3xl leading-relaxed">
              Resumen global de las métricas clave del Sistema PREPE. Puedes filtrar por empresa para analizar su desempeño particular.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Suspense><EmpresaFilter empresas={empresasLista} /></Suspense>
            <Suspense><DashboardFilter /></Suspense>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            value={formatBs(ingresosTotales)}
            label="Ingresos Totales"
            delta={deltaIngresos.delta}
            deltaType={deltaIngresos.deltaType}
            barFrom="#8E1B3A"
            barTo="#BC9968"
          />
          <MetricCard
            value={formatNum(pedidosCompletados)}
            label="Pedidos Completados"
            delta={deltaPedidos.delta}
            deltaType={deltaPedidos.deltaType}
            barFrom="#AB3A50"
            barTo="#BC9968"
          />
          <MetricCard
            value={formatNum(usuariosActivos)}
            label="Usuarios Activos"
            delta={deltaUsuarios.delta}
            deltaType={deltaUsuarios.deltaType}
            barFrom="#5C3A2E"
            barTo="#BC9968"
          />
          <MetricCard
            value={formatNum(proveedoresAprobados)}
            label="Empresas Aprobadas"
            barFrom="#BC9968"
            barTo="#F5E6D0"
          />
        </div>
      </section>

      {/* Acciones Rápidas */}
      <section>
        <h2 className="text-[9px] tracking-[2.5px] uppercase text-[#7A5260] font-bold mb-4 opacity-80">
          Acciones rápidas de administración
        </h2>
        <QuickActions empresaId={empresaId} />
      </section>

      {/* Grid Principal: Tabla y Actividad */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4">
        <ProveedoresTable data={ultimosProveedores} />
        <VentasCategorias categorias={categoriasData} />
      </div>

      {/* Grid Inferior */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <SolicitudesPendientes
          proveedoresPendientes={proveedoresPendientes}
          productosInactivos={productosInactivos}
          pedidosCancelados={pedidosCancelados}
          pagosFallidos={pagosFallidos}
        />
      </div>

    </div>
  );
}
