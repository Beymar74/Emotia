import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import ReportSubNav from "../_components/ReportSubNav";
import { GraficoDistribucionPagos, GraficoIngresosPagos } from "./PagosCharts";

export const dynamic = "force-dynamic";

const fmtBs = (n: number) =>
  `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const METODO_COLORES: Record<string, string> = {
  qr: "#185FA5",
  efectivo: "#2D7A47",
  transferencia: "#8E1B3A",
  tarjeta: "#BC9968",
  online: "#AB3A50",
};

export default async function ReportePagosPage() {
  const pedidosDB = await prisma.pedidos.findMany({
    select: { id: true, metodo_pago: true, total: true, estado: true },
  });

  // Distribución de métodos de pago (todos los pedidos)
  const metodosMap: Record<string, { pedidos: number; ingresos: number }> = {};
  pedidosDB.forEach((p) => {
    const m = p.metodo_pago?.toLowerCase() || "sin registrar";
    if (!metodosMap[m]) metodosMap[m] = { pedidos: 0, ingresos: 0 };
    metodosMap[m].pedidos += 1;
    if (p.estado === "entregado") {
      metodosMap[m].ingresos += Number(p.total || 0);
    }
  });

  const metodos = Object.entries(metodosMap)
    .map(([metodo, v]) => ({ metodo, ...v }))
    .sort((a, b) => b.pedidos - a.pedidos);

  const totalPedidos = pedidosDB.length;
  const metodosDistintos = metodos.length;
  const metodoPrincipal = metodos[0]?.metodo || "—";
  const ingresosPrincipal = metodos[0]?.ingresos || 0;
  const totalIngresos = metodos.reduce((s, m) => s + m.ingresos, 0);

  const chartDistribucion = metodos.map((m) => ({
    metodo: m.metodo,
    pedidos: m.pedidos,
    color: METODO_COLORES[m.metodo.toLowerCase()] || "#7A5260",
  }));

  const chartIngresos = metodos.map((m) => ({ metodo: m.metodo, ingresos: m.ingresos }));

  const config = {
    filename: "reporte-pagos",
    titulo: "Reporte de Métodos de Pago — PREPE",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Total pedidos", valor: String(totalPedidos), color: "#185FA5" },
      { label: "Métodos distintos", valor: String(metodosDistintos), color: "#2D7A47" },
      { label: "Método principal", valor: metodoPrincipal, color: "#8E1B3A" },
      { label: "Ingresos método líder", valor: fmtBs(ingresosPrincipal), color: "#BC9968" },
    ],
    graficos: [
      {
        tipo: "dona" as const,
        titulo: "Distribución de métodos",
        datos: chartDistribucion.map((m) => ({ nombre: m.metodo, valor: m.pedidos, color: m.color })),
      },
      {
        tipo: "barras-h" as const,
        titulo: "Ingresos por método",
        datos: chartIngresos.map((m) => ({ nombre: m.metodo, valor: m.ingresos })),
        color: "#185FA5",
      },
    ],
    tablas: [
      {
        nombre: "Detalle por método de pago",
        columnas: ["Método", "Pedidos", "% del total", "Ingresos (entregados)"],
        filas: metodos.map((m) => [
          m.metodo,
          m.pedidos,
          totalPedidos > 0 ? Math.round((m.pedidos / totalPedidos) * 100) + "%" : "0%",
          fmtBs(m.ingresos),
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
            <span className="text-xs text-[#5A0F24] font-medium">Métodos de Pago</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Métodos de Pago</h1>
          <p className="mt-1 text-sm text-[#7A5260] max-w-2xl leading-relaxed">
            Distribución de métodos de pago utilizados, volumen de pedidos e ingresos generados por cada modalidad.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <DescargarReporteBtn config={config} />
        </div>
      </div>

      <ReportSubNav />

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total pedidos", valor: String(totalPedidos), color: "#185FA5", sub: "Con método registrado" },
          { label: "Métodos distintos", valor: String(metodosDistintos), color: "#2D7A47", sub: "Modalidades en uso" },
          { label: "Método principal", valor: metodoPrincipal, color: "#8E1B3A", sub: `${metodos[0]?.pedidos || 0} pedidos` },
          { label: "Ingresos totales", valor: fmtBs(totalIngresos), color: "#BC9968", sub: "Pedidos entregados" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: k.color }} />
            <p className="font-serif text-2xl font-bold text-[#5A0F24] truncate capitalize">{k.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{k.label}</p>
            <p className="text-xs mt-0.5" style={{ color: k.color }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GraficoDistribucionPagos data={chartDistribucion} />
        <GraficoIngresosPagos data={chartIngresos} />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 overflow-x-auto">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Detalle por método de pago</h3>
        {metodos.length === 0 ? (
          <p className="text-sm text-[#7A5260] text-center py-4">Sin datos de métodos de pago.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Método", "Pedidos totales", "% del total", "Ingresos (entregados)", "Ticket promedio"].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metodos.map((m) => (
                <tr key={m.metodo} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: METODO_COLORES[m.metodo.toLowerCase()] || "#7A5260" }} />
                      <span className="text-sm font-medium text-[#2A0E18] capitalize">{m.metodo}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm font-bold text-[#5A0F24]">{m.pedidos}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#F3EBE8] rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-[#185FA5]"
                          style={{ width: `${totalPedidos > 0 ? Math.round((m.pedidos / totalPedidos) * 100) : 0}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-[#185FA5]">
                        {totalPedidos > 0 ? Math.round((m.pedidos / totalPedidos) * 100) : 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24]">{fmtBs(m.ingresos)}</td>
                  <td className="px-3 py-3 text-sm text-[#7A5260]">
                    {m.pedidos > 0 ? fmtBs(m.ingresos / m.pedidos) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
