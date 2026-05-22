import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import ReportSubNav from "../_components/ReportSubNav";
import { GraficoInsignias, GraficoTopPuntos } from "./PuntosCharts";
import PuntosTabla from "./_components/PuntosTabla";

export const dynamic = "force-dynamic";

const fmtBs = (n: number) =>
  `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export default async function ReportePuntosPage() {
  const [puntosAgg, pedidosPuntos, insigniasDB, topPuntosDB] = await Promise.all([
    prisma.usuarios.aggregate({
      _sum: { puntos: true },
      _avg: { puntos: true },
      where: { tipo: "usuario" },
    }),
    prisma.pedidos.aggregate({
      _sum: { puntos_usados: true, puntos_ganados: true, descuento_puntos: true },
    }),
    prisma.insignias.findMany({
      select: { tipo: true, otorgada_en: true },
    }),
    prisma.usuarios.findMany({
      select: { nombre: true, email: true, puntos: true },
      orderBy: { puntos: "desc" },
      where: { tipo: "usuario" },
    }),
  ]);

  const puntosActivos = Number(puntosAgg._sum.puntos || 0);
  const puntosUsados = Number(pedidosPuntos._sum.puntos_usados || 0);
  const puntosGanados = Number(pedidosPuntos._sum.puntos_ganados || 0);
  const descuentoAplicado = Number(pedidosPuntos._sum.descuento_puntos || 0);
  const totalInsignias = insigniasDB.length;

  // Insignias por tipo
  const insMap: Record<string, number> = {};
  insigniasDB.forEach((i) => {
    insMap[i.tipo] = (insMap[i.tipo] || 0) + 1;
  });
  const insigniasPorTipo = Object.entries(insMap)
    .map(([tipo, total]) => ({ tipo, total }))
    .sort((a, b) => b.total - a.total);

  const chartTopPuntos = topPuntosDB.slice(0, 10).map((u) => ({
    nombre: u.nombre || "Usuario",
    puntos: u.puntos || 0,
  }));

  const config = {
    filename: "reporte-puntos-gamificacion",
    titulo: "Reporte de Puntos y Gamificación — PREPE",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Puntos activos", valor: puntosActivos.toLocaleString(), color: "#BC9968" },
      { label: "Puntos usados", valor: puntosUsados.toLocaleString(), color: "#8E1B3A" },
      { label: "Descuento aplicado", valor: fmtBs(descuentoAplicado), color: "#2D7A47" },
      { label: "Insignias otorgadas", valor: String(totalInsignias), color: "#185FA5" },
    ],
    graficos: [
      {
        tipo: "dona" as const,
        titulo: "Insignias por tipo",
        datos: insigniasPorTipo.map((i) => ({ nombre: i.tipo, valor: i.total, color: "#BC9968" })),
      },
      {
        tipo: "barras-h" as const,
        titulo: "Top usuarios por puntos",
        datos: chartTopPuntos.map((u) => ({ nombre: u.nombre, valor: u.puntos })),
        color: "#BC9968",
      },
    ],
    tablas: [
      {
        nombre: "Ranking de puntos por usuario",
        columnas: ["Usuario", "Email", "Puntos"],
        filas: topPuntosDB.map((u) => [u.nombre || "—", u.email, u.puntos || 0]),
      },
      {
        nombre: "Insignias por tipo",
        columnas: ["Tipo de insignia", "Total otorgadas"],
        filas: insigniasPorTipo.map((i) => [i.tipo, i.total]),
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
            <span className="text-xs text-[#5A0F24] font-medium">Puntos & Gamificación</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Puntos & Gamificación</h1>
          <p className="mt-1 text-sm text-[#7A5260] max-w-2xl leading-relaxed">
            Puntos en circulación, descuentos canjeados, insignias otorgadas y top usuarios más activos.
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
          { label: "Puntos activos", valor: puntosActivos.toLocaleString(), color: "#BC9968", sub: "En poder de usuarios" },
          { label: "Puntos usados", valor: puntosUsados.toLocaleString(), color: "#8E1B3A", sub: "Canjeados históricamente" },
          { label: "Descuento aplicado", valor: fmtBs(descuentoAplicado), color: "#2D7A47", sub: "En descuentos totales" },
          { label: "Insignias otorgadas", valor: String(totalInsignias), color: "#185FA5", sub: "A usuarios" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: k.color }} />
            <p className="font-serif text-3xl font-bold text-[#5A0F24]">{k.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{k.label}</p>
            <p className="text-xs mt-0.5" style={{ color: k.color }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Resumen puntos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Puntos ganados en pedidos", valor: puntosGanados.toLocaleString(), color: "#2D7A47" },
          { label: "Puntos usados en descuentos", valor: puntosUsados.toLocaleString(), color: "#8E1B3A" },
          { label: "Puntos restantes en sistema", valor: puntosActivos.toLocaleString(), color: "#BC9968" },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: m.color + "15" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: m.color }}>
                <path d="M12 2L9.5 8.5H3L8.5 12.5L6.5 19L12 15L17.5 19L15.5 12.5L21 8.5H14.5L12 2Z"
                  stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold" style={{ color: m.color }}>{m.valor}</p>
              <p className="text-xs text-[#7A5260] mt-0.5">{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GraficoInsignias data={insigniasPorTipo} />
        <GraficoTopPuntos data={chartTopPuntos} />
      </div>

      {/* Top usuarios */}
      <PuntosTabla usuarios={topPuntosDB} />
    </div>
  );
}
