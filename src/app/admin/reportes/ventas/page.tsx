import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import { GraficoEvolucionVentas, GraficoPedidosMes, GraficoEmpresasVentas, GraficoCategoriasPie, GraficoProductosVentas } from "./VentasCharts";
import { Suspense } from "react";
import EmpresaFilter from "../../_components/EmpresaFilter";
import ReportSubNav from "../_components/ReportSubNav";
import VentasTabla from "./_components/VentasTabla";

export default async function ReporteVentasPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const empresaId = typeof sp.empresa === "string" && sp.empresa !== "todas" ? parseInt(sp.empresa) : 0;
  
  const empresaFiltroPedido = empresaId > 0 ? { detalle_pedidos: { some: { proveedor_id: empresaId } } } : {};
  const empresaFiltroDetalle = empresaId > 0 ? { proveedor_id: empresaId } : {};
  const empresaFiltroEmpresa = empresaId > 0 ? { id: empresaId } : {};

  const [pedidosDB, empresasTop, detallesDB, empresasLista, empresaActual] = await Promise.all([
    prisma.pedidos.findMany({
      where: { estado: 'entregado', ...empresaFiltroPedido },
      select: { id: true, total: true, created_at: true },
      orderBy: { created_at: 'asc' },
    }),
    prisma.proveedores.findMany({
      where: { estado: 'aprobado', ...empresaFiltroEmpresa },
      orderBy: { total_vendido: 'desc' },
      // take: 6, <-- REMOVED LIMIT to show all companies in the report
      include: { _count: { select: { detalle_pedidos: true } } },
    }),
    prisma.detalle_pedidos.findMany({
      where: { pedidos: { estado: 'entregado' }, ...empresaFiltroDetalle },
      include: { productos: { include: { categorias: true } } },
    }),
    prisma.proveedores.findMany({ select: { id: true, nombre_negocio: true, logo_url: true }, orderBy: { nombre_negocio: "asc" } }),
    empresaId > 0 ? prisma.proveedores.findUnique({ where: { id: empresaId }, select: { nombre_negocio: true, logo_url: true } }) : Promise.resolve(null),
  ]);

  const empresaNombre = empresaActual?.nombre_negocio || "";
  const tituloReporte = empresaId > 0 ? `Reporte de Ventas — ${empresaNombre}` : "Reporte de Ventas — PREPE";
  const filenameReporte = empresaId > 0 ? `reporte-ventas-${empresaNombre.toLowerCase().replace(/[^a-z0-9]/g, "-")}` : "reporte-ventas";

  const formatBs = (n: number) => `Bs ${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;

  const totalIngresos = empresaId > 0
    ? detallesDB.reduce((sum, d) => sum + Number(d.subtotal || 0), 0)
    : pedidosDB.reduce((sum: number, p: any) => sum + Number(p.total), 0);

  const totalPedidos = empresaId > 0
    ? new Set(detallesDB.map((d) => d.pedido_id)).size
    : pedidosDB.length;

  const ticketPromedio = totalPedidos > 0 ? totalIngresos / totalPedidos : 0;

  // Ventas por mes (últimos 6 meses)
  type MesData = { mes: string; pedidos: number; monto: number };
  const mesesMap: Record<string, MesData> = {};
  const ahora = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = new Intl.DateTimeFormat('es-BO', { month: 'short', year: 'numeric' }).format(d);
    mesesMap[key] = { mes: label, pedidos: 0, monto: 0 };
  }

  if (empresaId > 0) {
    const mesesPedidosSet: Record<string, Set<number>> = {};
    for (const key in mesesMap) {
      mesesPedidosSet[key] = new Set<number>();
    }
    detallesDB.forEach((d: any) => {
      const date = new Date(d.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (mesesMap[key]) {
        mesesMap[key].monto += Number(d.subtotal || 0);
        if (!mesesPedidosSet[key].has(d.pedido_id)) {
          mesesPedidosSet[key].add(d.pedido_id);
          mesesMap[key].pedidos += 1;
        }
      }
    });
  } else {
    pedidosDB.forEach((p: any) => {
      const key = `${p.created_at.getFullYear()}-${String(p.created_at.getMonth() + 1).padStart(2, '0')}`;
      if (mesesMap[key]) {
        mesesMap[key].pedidos += 1;
        mesesMap[key].monto += Number(p.total);
      }
    });
  }
  const ventasMensuales = Object.values(mesesMap);

  // Ventas por empresa (Todas)
  const ventasEmpresas = empresasTop.map((e: any) => {
    const ventas = Number(e.total_vendido || 0);
    const pct = totalIngresos > 0 ? Math.round((ventas / totalIngresos) * 100) : 0;
    return { nombre: e.nombre_negocio, monto: ventas, pct, items: e._count.detalle_pedidos };
  });

  // Ventas por categoría (Todas)
  type CatData = { monto: number; items: number };
  const catMap: Record<string, CatData> = {};
  detallesDB.forEach((d: any) => {
    const cat = d.productos?.categorias?.nombre || "Sin categoría";
    const sub = Number(d.subtotal || 0);
    if (!catMap[cat]) catMap[cat] = { monto: 0, items: 0 };
    catMap[cat].monto += sub;
    catMap[cat].items += Number(d.cantidad || 0);
  });
  const ventasCategorias = Object.entries(catMap)
    .map(([nombre, data]) => ({ nombre, ...data, pct: totalIngresos > 0 ? Math.round((data.monto / totalIngresos) * 100) : 0 }))
    .sort((a, b) => b.monto - a.monto);
  // .slice(0, 5); <-- REMOVED LIMIT from data, slice only inside graphic config

  // Aggregated sold products from details database (uncapped)
  type ProdVendido = { nombre: string; monto: number; cantidad: number; categoria: string; empresa: string };
  const prodVendidoMap: Record<number, ProdVendido> = {};
  detallesDB.forEach((d) => {
    const pId = d.producto_id;
    if (!pId) return;
    const nombre = d.productos?.nombre || `Producto #${pId}`;
    const sub = Number(d.subtotal || 0);
    const cant = Number(d.cantidad || 0);
    const cat = d.productos?.categorias?.nombre || "Sin categoría";
    const emp = d.productos?.proveedor_id ? (empresasLista.find(e => e.id === d.productos?.proveedor_id)?.nombre_negocio || "PREPE") : "PREPE";
    if (!prodVendidoMap[pId]) {
      prodVendidoMap[pId] = { nombre, monto: 0, cantidad: 0, categoria: cat, empresa: emp };
    }
    prodVendidoMap[pId].monto += sub;
    prodVendidoMap[pId].cantidad += cant;
  });
  const productosVendidos = Object.values(prodVendidoMap).sort((a, b) => b.monto - a.monto);

  const config = {
    filename: filenameReporte,
    titulo: tituloReporte,
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    logoUrl: empresaActual?.logo_url || undefined,
    kpis: [
      { label: "Ingresos totales", valor: formatBs(totalIngresos), color: "#8E1B3A" },
      { label: "Total pedidos", valor: String(totalPedidos), color: "#BC9968" },
      { label: "Ticket promedio", valor: formatBs(ticketPromedio), color: "#5C3A2E" },
    ],
    graficos: [
      { tipo: "area" as const, titulo: "Ingresos mensuales", datos: ventasMensuales.map((m) => ({ x: m.mes, y: m.monto })), color: "#8E1B3A" },
      { tipo: "barras" as const, titulo: "Pedidos por mes", datos: ventasMensuales.map((m) => ({ nombre: m.mes, valor: m.pedidos })), color: "#BC9968" },
      empresaId > 0
        ? { tipo: "barras-h" as const, titulo: "Top productos (Bs)", datos: productosVendidos.slice(0, 6).map((p) => ({ nombre: p.nombre, valor: p.monto })), color: "#AB3A50" }
        : { tipo: "barras-h" as const, titulo: "Top empresas (Bs)", datos: ventasEmpresas.slice(0, 6).map((e) => ({ nombre: e.nombre, valor: e.monto })), color: "#AB3A50" },
      { tipo: "dona" as const, titulo: "Ventas por categoría", datos: ventasCategorias.slice(0, 5).map((c, i) => ({ nombre: c.nombre, valor: c.monto, color: ["#8E1B3A","#BC9968","#5C3A2E","#AB3A50","#185FA5"][i] })) },
    ],
    tablas: [
      {
        nombre: "Resumen mensual",
        columnas: ["Período", "Pedidos", "Ingresos (Bs)", "Ticket promedio (Bs)", "% Participación"],
        filas: ventasMensuales.map((m) => {
          const ticket = m.pedidos > 0 ? m.monto / m.pedidos : 0;
          const part = totalIngresos > 0 ? Math.round((m.monto / totalIngresos) * 100) : 0;
          return [m.mes, m.pedidos, m.monto, Math.round(ticket), part + "%"];
        }),
      },
      {
        nombre: "Productos vendidos",
        columnas: ["Producto", "Categoría", "Empresa", "Ingresos (Bs)", "Unidades vendidas"],
        filas: productosVendidos.map((p) => [p.nombre, p.categoria, p.empresa, p.monto, p.cantidad]),
      },
      !empresaId
        ? {
            nombre: "Rendimiento de empresas",
            columnas: ["Empresa", "Ingresos (Bs)", "% del total", "Ítems despachados"],
            filas: ventasEmpresas.map((v) => [v.nombre, v.monto, v.pct + "%", v.items]),
          }
        : null,
      {
        nombre: "Por categoría",
        columnas: ["Categoría", "Ingresos (Bs)", "Ítems", "% del total"],
        filas: ventasCategorias.map((c) => [c.nombre, c.monto, c.items, c.pct + "%"]),
      },
    ].filter(Boolean) as any[],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/reportes" className="text-xs text-[#BC9968] hover:text-[#8E1B3A] font-medium transition-colors">Reportes</Link>
            <span className="text-[#BC9968]/40 text-xs">/</span>
            <span className="text-xs text-[#5A0F24] font-medium">Ventas</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">{tituloReporte}</h1>
          <p className="mt-1 text-sm text-[#7A5260] max-w-2xl leading-relaxed">
            Volumen de transacciones, ingresos generados y evolución de ventas por periodo y empresa.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Suspense><EmpresaFilter empresas={empresasLista} /></Suspense>
          <DescargarReporteBtn config={config} />
        </div>
      </div>

      <ReportSubNav />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Ingresos totales", valor: formatBs(totalIngresos), color: "#8E1B3A", sub: "Pedidos entregados" },
          { label: "Total pedidos", valor: String(totalPedidos), color: "#BC9968", sub: "Ventas completadas" },
          { label: "Ticket promedio", valor: formatBs(ticketPromedio), color: "#5C3A2E", sub: "Por pedido" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: k.color }} />
            <p className="font-serif text-3xl font-bold text-[#5A0F24]">{k.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{k.label}</p>
            <p className="text-xs text-[#BC9968] mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Gráfico de área — evolución mensual */}
      <GraficoEvolucionVentas data={ventasMensuales} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GraficoPedidosMes data={ventasMensuales} />
        <GraficoCategoriasPie data={ventasCategorias.slice(0, 5)} />
      </div>

      {empresaId > 0 ? (
        <GraficoProductosVentas data={productosVendidos.slice(0, 6)} />
      ) : (
        <GraficoEmpresasVentas data={ventasEmpresas.slice(0, 6)} />
      )}

      {/* Tabla Desglose Ventas (Completa & Interactiva) */}
      <VentasTabla
        productos={productosVendidos}
        empresas={ventasEmpresas}
        isEmpresaFiltrada={empresaId > 0}
      />

      {/* Tabla resumen mensual */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 overflow-x-auto">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Detalle mensual</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Período", "Pedidos", "Ingresos", "Ticket promedio", "Participación"].map(h => (
                <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ventasMensuales.map((m) => {
              const ticket = m.pedidos > 0 ? m.monto / m.pedidos : 0;
              const participacion = totalIngresos > 0 ? Math.round((m.monto / totalIngresos) * 100) : 0;
              return (
                <tr key={m.mes} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50">
                  <td className="px-3 py-3 text-sm font-medium text-[#2A0E18] capitalize">{m.mes}</td>
                  <td className="px-3 py-3 text-sm text-[#7A5260]">{m.pedidos}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24]">{formatBs(m.monto)}</td>
                  <td className="px-3 py-3 text-sm text-[#7A5260]">{formatBs(ticket)}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-[#8E1B3A]/8 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#8E1B3A]" style={{ width: `${participacion}%` }} />
                      </div>
                      <span className="text-xs text-[#7A5260]">{participacion}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
