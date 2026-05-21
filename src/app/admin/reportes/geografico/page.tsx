import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import ReportSubNav from "../_components/ReportSubNav";
import { GraficoPedidosCiudad, GraficoIngresosCiudad } from "./GeograficoCharts";

export const dynamic = "force-dynamic";

const fmtBs = (n: number) =>
  `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export default async function ReporteGeograficoPage() {
  const direccionesDB = await prisma.direcciones.findMany({
    select: {
      ciudad: true,
      usuario_id: true,
      pedidos: { select: { id: true, total: true, estado: true } },
    },
  });

  // Aggregate per city
  type CiudadStat = { ciudad: string; pedidos: number; ingresos: number; usuarios: Set<number> };
  const ciudadMap: Record<string, CiudadStat> = {};

  direccionesDB.forEach((d) => {
    const ciudad = d.ciudad || "Sin especificar";
    if (!ciudadMap[ciudad]) ciudadMap[ciudad] = { ciudad, pedidos: 0, ingresos: 0, usuarios: new Set() };
    ciudadMap[ciudad].usuarios.add(d.usuario_id);
    d.pedidos.forEach((p) => {
      ciudadMap[ciudad].pedidos += 1;
      if (p.estado === "entregado") ciudadMap[ciudad].ingresos += Number(p.total || 0);
    });
  });

  const ciudades = Object.values(ciudadMap)
    .map((c) => ({ ciudad: c.ciudad, pedidos: c.pedidos, ingresos: c.ingresos, usuarios: c.usuarios.size }))
    .sort((a, b) => b.pedidos - a.pedidos);

  const totalCiudades = ciudades.length;
  const ciudadLider = ciudades[0]?.ciudad || "—";
  const pedidosCiudadLider = ciudades[0]?.pedidos || 0;
  const totalPedidos = ciudades.reduce((s, c) => s + c.pedidos, 0);
  const totalIngresos = ciudades.reduce((s, c) => s + c.ingresos, 0);

  const chartPedidos = ciudades.slice(0, 8).map((c) => ({ ciudad: c.ciudad, pedidos: c.pedidos }));
  const chartIngresos = ciudades.filter((c) => c.ingresos > 0).slice(0, 8).map((c) => ({ ciudad: c.ciudad, ingresos: c.ingresos }));

  const config = {
    filename: "reporte-geografico",
    titulo: "Reporte Geográfico — PREPE",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Ciudades activas", valor: String(totalCiudades), color: "#185FA5" },
      { label: "Ciudad líder", valor: ciudadLider, color: "#8E1B3A" },
      { label: "Pedidos ciudad líder", valor: String(pedidosCiudadLider), color: "#BC9968" },
      { label: "Ingresos totales", valor: fmtBs(totalIngresos), color: "#2D7A47" },
    ],
    graficos: [
      {
        tipo: "barras-h" as const,
        titulo: "Pedidos por ciudad",
        datos: chartPedidos.map((c) => ({ nombre: c.ciudad, valor: c.pedidos })),
        color: "#185FA5",
      },
      {
        tipo: "barras-h" as const,
        titulo: "Ingresos por ciudad",
        datos: chartIngresos.map((c) => ({ nombre: c.ciudad, valor: c.ingresos })),
        color: "#8E1B3A",
      },
    ],
    tablas: [
      {
        nombre: "Detalle por ciudad",
        columnas: ["Ciudad", "Pedidos", "% del total", "Ingresos", "Usuarios"],
        filas: ciudades.map((c) => [
          c.ciudad,
          c.pedidos,
          totalPedidos > 0 ? Math.round((c.pedidos / totalPedidos) * 100) + "%" : "0%",
          fmtBs(c.ingresos),
          c.usuarios,
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
            <span className="text-xs text-[#5A0F24] font-medium">Geográfico</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte Geográfico</h1>
          <p className="mt-1 text-sm text-[#7A5260] max-w-2xl leading-relaxed">
            Distribución de pedidos e ingresos por ciudad. Conoce dónde están tus clientes más activos.
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
          { label: "Ciudades activas", valor: String(totalCiudades), color: "#185FA5", sub: "Con pedidos registrados" },
          { label: "Ciudad líder", valor: ciudadLider, color: "#8E1B3A", sub: `${pedidosCiudadLider} pedidos` },
          { label: "Total pedidos", valor: String(totalPedidos), color: "#BC9968", sub: "Con dirección registrada" },
          { label: "Ingresos totales", valor: fmtBs(totalIngresos), color: "#2D7A47", sub: "Pedidos entregados" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: k.color }} />
            <p className="font-serif text-2xl font-bold text-[#5A0F24] truncate">{k.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{k.label}</p>
            <p className="text-xs mt-0.5" style={{ color: k.color }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GraficoPedidosCiudad data={chartPedidos} />
        <GraficoIngresosCiudad data={chartIngresos} />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 overflow-x-auto">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Detalle por ciudad</h3>
        {ciudades.length === 0 ? (
          <p className="text-sm text-[#7A5260] text-center py-4">Sin datos geográficos disponibles.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Ciudad", "Pedidos", "% del total", "Ingresos", "Usuarios únicos", "Ticket promedio"].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ciudades.map((c, i) => (
                <tr key={c.ciudad} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: i === 0 ? "#185FA5" : i === 1 ? "#8E1B3A" : "#BC9968" }} />
                      <span className="text-sm font-medium text-[#2A0E18]">{c.ciudad}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm font-bold text-[#5A0F24]">{c.pedidos}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#F3EBE8] rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-[#185FA5]"
                          style={{ width: `${totalPedidos > 0 ? Math.round((c.pedidos / totalPedidos) * 100) : 0}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-[#185FA5]">
                        {totalPedidos > 0 ? Math.round((c.pedidos / totalPedidos) * 100) : 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24]">{fmtBs(c.ingresos)}</td>
                  <td className="px-3 py-3 text-sm text-[#7A5260]">{c.usuarios}</td>
                  <td className="px-3 py-3 text-sm text-[#7A5260]">
                    {c.pedidos > 0 ? fmtBs(c.ingresos / c.pedidos) : "—"}
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
