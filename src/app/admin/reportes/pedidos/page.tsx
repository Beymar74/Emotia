import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import { GraficoDonutEstados, GraficoEvolucionPedidos, GraficoValorEstados } from "./PedidosCharts";
import { Suspense } from "react";
import EmpresaFilter from "../../_components/EmpresaFilter";
import ReportSubNav from "../_components/ReportSubNav";

export default async function ReportePedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const empresaId = typeof sp.empresa === "string" && sp.empresa !== "todas" ? parseInt(sp.empresa) : 0;
  const empresaFiltroPedido = empresaId > 0 ? { detalle_pedidos: { some: { proveedor_id: empresaId } } } : {};
  const [pedidosDB, empresasLista] = await Promise.all([
    prisma.pedidos.findMany({
      where: { ...empresaFiltroPedido },
      select: { id: true, total: true, estado: true, created_at: true, updated_at: true },
      orderBy: { created_at: 'desc' },
    }),
    prisma.proveedores.findMany({ select: { id: true, nombre_negocio: true, logo_url: true }, orderBy: { nombre_negocio: "asc" } })
  ]);

  // Por estado
  const estados = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];
  const estadoColors: Record<string, string> = {
    pendiente: "#8C5E08",
    procesando: "#185FA5",
    enviado: "#BC9968",
    entregado: "#2D7A47",
    cancelado: "#A32D2D",
  };
  const estadoLabels: Record<string, string> = {
    pendiente: "Pendientes",
    procesando: "Procesando",
    enviado: "Enviados",
    entregado: "Entregados",
    cancelado: "Cancelados",
  };
  const conteoEstados = estados.map(e => ({
    estado: e,
    label: estadoLabels[e],
    color: estadoColors[e],
    count: pedidosDB.filter((p: any) => p.estado === e).length,
    monto: pedidosDB.filter((p: any) => p.estado === e).reduce((s: number, p: any) => s + Number(p.total), 0),
  }));
  const totalPedidos = pedidosDB.length;

  // Evolución mensual
  const ahora = new Date();
  type MesData = { mes: string; entregados: number; cancelados: number; total: number };
  const mesesMap: Record<string, MesData> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = new Intl.DateTimeFormat('es-BO', { month: 'short', year: 'numeric' }).format(d);
    mesesMap[key] = { mes: label, entregados: 0, cancelados: 0, total: 0 };
  }
  pedidosDB.forEach((p: any) => {
    const key = `${p.created_at.getFullYear()}-${String(p.created_at.getMonth() + 1).padStart(2, '0')}`;
    if (mesesMap[key]) {
      mesesMap[key].total += 1;
      if (p.estado === 'entregado') mesesMap[key].entregados += 1;
      if (p.estado === 'cancelado') mesesMap[key].cancelados += 1;
    }
  });
  const evolucion = Object.values(mesesMap);

  // Tasa de éxito
  const entregados = conteoEstados.find(e => e.estado === 'entregado')?.count || 0;
  const cancelados = conteoEstados.find(e => e.estado === 'cancelado')?.count || 0;
  const tasaExito = totalPedidos > 0 ? Math.round((entregados / totalPedidos) * 100) : 0;
  const tasaCancelacion = totalPedidos > 0 ? Math.round((cancelados / totalPedidos) * 100) : 0;

  const empresaNombre = empresaId > 0 ? (empresasLista.find(e => e.id === empresaId)?.nombre_negocio || "") : "";

  const config = {
    filename: empresaId > 0 ? `reporte-pedidos-${empresaNombre.toLowerCase().replace(/[^a-z0-9]/g, "-")}` : "reporte-pedidos",
    titulo: empresaId > 0 ? `Reporte de Pedidos — ${empresaNombre}` : "Reporte de Pedidos — PREPE",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Total pedidos", valor: String(totalPedidos), color: "#8E1B3A" },
      { label: "Entregados", valor: String(entregados), color: "#2D7A47" },
      { label: "Tasa de éxito", valor: `${tasaExito}%`, color: "#BC9968" },
      { label: "Tasa cancelación", valor: `${tasaCancelacion}%`, color: "#A32D2D" },
    ],
    logoUrl: empresaId > 0 ? (empresasLista.find(e => e.id === empresaId)?.logo_url || undefined) : undefined,
    graficos: [
      { tipo: "dona" as const, titulo: "Distribución por estado", datos: conteoEstados.filter((e) => e.count > 0).map((e) => ({ nombre: e.label, valor: e.count, color: e.color })) },
      { tipo: "barras" as const, titulo: "Evolución mensual (total)", datos: evolucion.map((m) => ({ nombre: m.mes, valor: m.total })), color: "#8E1B3A" },
      { tipo: "barras-h" as const, titulo: "Valor por estado (Bs)", datos: conteoEstados.filter((e) => e.monto > 0).map((e) => ({ nombre: e.label, valor: e.monto, color: e.color })) },
    ],
    tablas: [
      {
        nombre: "Por estado",
        columnas: ["Estado", "Cantidad", "Monto total (Bs)", "% del total"],
        filas: conteoEstados.map((e) => [
          e.label, e.count, e.monto,
          totalPedidos > 0 ? Math.round((e.count / totalPedidos) * 100) + "%" : "0%",
        ]),
      },
      {
        nombre: "Evolución mensual",
        columnas: ["Período", "Total", "Entregados", "Cancelados", "Tasa éxito"],
        filas: evolucion.map((m) => [
          m.mes, m.total, m.entregados, m.cancelados,
          m.total > 0 ? Math.round((m.entregados / m.total) * 100) + "%" : "0%",
        ]),
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/reportes" className="text-xs text-[#BC9968] hover:text-[#8E1B3A] font-medium transition-colors">Reportes</Link>
            <span className="text-[#BC9968]/40 text-xs">/</span>
            <span className="text-xs text-[#5A0F24] font-medium">Pedidos</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte de Pedidos</h1>
          <p className="mt-1 text-sm text-[#7A5260] max-w-2xl leading-relaxed">
            Estados, tiempos de entrega, tasa de éxito y volumen logístico mensual.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Suspense><EmpresaFilter empresas={empresasLista} /></Suspense>
          <DescargarReporteBtn config={config} />
        </div>
      </div>

      <ReportSubNav />

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total pedidos", valor: String(totalPedidos), color: "#8E1B3A" },
          { label: "Entregados", valor: String(entregados), color: "#2D7A47" },
          { label: "Tasa de éxito", valor: `${tasaExito}%`, color: "#BC9968" },
          { label: "Tasa cancelación", valor: `${tasaCancelacion}%`, color: "#A32D2D" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: k.color }} />
            <p className="font-serif text-3xl font-bold text-[#5A0F24]">{k.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GraficoDonutEstados data={conteoEstados} total={totalPedidos} />
        <GraficoEvolucionPedidos data={evolucion} />
      </div>

      <GraficoValorEstados data={conteoEstados} />

      {/* Tabla resumen mensual */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 overflow-x-auto">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Detalle mensual</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Período", "Total", "Entregados", "Cancelados", "Tasa éxito"].map(h => (
                <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {evolucion.map((m) => {
              const tasa = m.total > 0 ? Math.round((m.entregados / m.total) * 100) : 0;
              return (
                <tr key={m.mes} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50">
                  <td className="px-3 py-3 text-sm font-medium text-[#2A0E18] capitalize">{m.mes}</td>
                  <td className="px-3 py-3 text-sm font-bold text-[#5A0F24]">{m.total}</td>
                  <td className="px-3 py-3 text-sm text-[#2D7A47] font-medium">{m.entregados}</td>
                  <td className="px-3 py-3 text-sm text-[#A32D2D] font-medium">{m.cancelados}</td>
                  <td className="px-3 py-3">
                    <span className={`text-sm font-semibold ${tasa >= 80 ? "text-[#2D7A47]" : tasa >= 60 ? "text-[#8C5E08]" : "text-[#A32D2D]"}`}>
                      {tasa}%
                    </span>
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
