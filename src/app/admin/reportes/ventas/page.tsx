import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import { GraficoEvolucionVentas, GraficoPedidosMes, GraficoEmpresasVentas, GraficoCategoriasPie } from "./VentasCharts";
import { Suspense } from "react";
import EmpresaFilter from "../../_components/EmpresaFilter";

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
  const [pedidosDB, empresasTop, detallesDB, empresasLista] = await Promise.all([
    prisma.pedidos.findMany({
      where: { estado: 'entregado', ...empresaFiltroPedido },
      select: { id: true, total: true, created_at: true },
      orderBy: { created_at: 'asc' },
    }),
    prisma.proveedores.findMany({
      where: { estado: 'aprobado', ...empresaFiltroEmpresa },
      orderBy: { total_vendido: 'desc' },
      take: 6,
      include: { _count: { select: { detalle_pedidos: true } } },
    }),
    prisma.detalle_pedidos.findMany({
      where: { pedidos: { estado: 'entregado' }, ...empresaFiltroDetalle },
      include: { productos: { include: { categorias: true } } },
    }),
    prisma.proveedores.findMany({ select: { id: true, nombre_negocio: true }, orderBy: { nombre_negocio: "asc" } }),
  ]);

  const formatBs = (n: number) => `Bs ${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;

  const totalIngresos = pedidosDB.reduce((sum: number, p: any) => sum + Number(p.total), 0);
  const totalPedidos = pedidosDB.length;
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
  pedidosDB.forEach((p: any) => {
    const key = `${p.created_at.getFullYear()}-${String(p.created_at.getMonth() + 1).padStart(2, '0')}`;
    if (mesesMap[key]) {
      mesesMap[key].pedidos += 1;
      mesesMap[key].monto += Number(p.total);
    }
  });
  const ventasMensuales = Object.values(mesesMap);
  const maxMonto = Math.max(...ventasMensuales.map(m => m.monto), 1);

  // Ventas por empresa
  const ventasEmpresas = empresasTop.map((e: any) => {
    const ventas = Number(e.total_vendido || 0);
    const pct = totalIngresos > 0 ? Math.round((ventas / totalIngresos) * 100) : 0;
    return { nombre: e.nombre_negocio, monto: ventas, pct, items: e._count.detalle_pedidos };
  });

  // Ventas por categoría
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
    .sort((a, b) => b.monto - a.monto)
    .slice(0, 5);

  const config = {
    filename: "reporte-ventas",
    titulo: "Reporte de Ventas — PREPE",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Ingresos totales", valor: formatBs(totalIngresos), color: "#8E1B3A" },
      { label: "Total pedidos", valor: String(totalPedidos), color: "#BC9968" },
      { label: "Ticket promedio", valor: formatBs(ticketPromedio), color: "#5C3A2E" },
    ],
    graficos: [
      { tipo: "area" as const, titulo: "Ingresos mensuales", datos: ventasMensuales.map((m) => ({ x: m.mes, y: m.monto })), color: "#8E1B3A" },
      { tipo: "barras" as const, titulo: "Pedidos por mes", datos: ventasMensuales.map((m) => ({ nombre: m.mes, valor: m.pedidos })), color: "#BC9968" },
      { tipo: "barras-h" as const, titulo: "Top empresas (Bs)", datos: ventasEmpresas.slice(0, 6).map((e) => ({ nombre: e.nombre, valor: e.monto })), color: "#AB3A50" },
      { tipo: "dona" as const, titulo: "Ventas por categoría", datos: ventasCategorias.map((c, i) => ({ nombre: c.nombre, valor: c.monto, color: ["#8E1B3A","#BC9968","#5C3A2E","#AB3A50","#185FA5"][i] })) },
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
        nombre: "Top empresas",
        columnas: ["Empresa", "Ingresos (Bs)", "% del total", "Ítems despachados"],
        filas: ventasEmpresas.map((v) => [v.nombre, v.monto, v.pct + "%", v.items]),
      },
      {
        nombre: "Por categoría",
        columnas: ["Categoría", "Ingresos (Bs)", "Ítems", "% del total"],
        filas: ventasCategorias.map((c) => [c.nombre, c.monto, c.items, c.pct + "%"]),
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/reportes" className="p-2 bg-white border border-[#8E1B3A]/10 rounded-xl text-[#7A5260] hover:text-[#8E1B3A] hover:bg-[#FDFBF9] transition-all shadow-sm">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <div>
            <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Reportes</p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte de Ventas</h1>
        <p className="mt-2 text-sm text-[#7A5260] max-w-3xl leading-relaxed">
          Aquí puedes analizar en detalle el volumen de transacciones, ingresos generados y el crecimiento de las ventas en periodos específicos.
        </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Suspense><EmpresaFilter empresas={empresasLista} /></Suspense>
          <DescargarReporteBtn config={config} />
        </div>
      </div>

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
        <GraficoCategoriasPie data={ventasCategorias} />
      </div>

      <GraficoEmpresasVentas data={ventasEmpresas} />

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
