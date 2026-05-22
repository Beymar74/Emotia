import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import ReportSubNav from "../_components/ReportSubNav";
import { GraficoTiposNotif, GraficoNotifMes } from "./NotificacionesCharts";

export const dynamic = "force-dynamic";

export default async function ReporteNotificacionesPage() {
  const notificacionesDB = await prisma.notificaciones.findMany({
    select: { id: true, tipo: true, leida: true, created_at: true },
    orderBy: { created_at: "desc" },
  });

  const total = notificacionesDB.length;
  const leidas = notificacionesDB.filter((n) => n.leida).length;
  const noLeidas = total - leidas;
  const tasaLectura = total > 0 ? Math.round((leidas / total) * 100) : 0;

  // Por tipo
  const tiposMap: Record<string, { total: number; leidas: number }> = {};
  notificacionesDB.forEach((n) => {
    const t = n.tipo || "otro";
    if (!tiposMap[t]) tiposMap[t] = { total: 0, leidas: 0 };
    tiposMap[t].total += 1;
    if (n.leida) tiposMap[t].leidas += 1;
  });
  const tipos = Object.entries(tiposMap)
    .map(([tipo, v]) => ({ tipo, ...v }))
    .sort((a, b) => b.total - a.total);
  const tipoMasFrecuente = tipos[0]?.tipo || "—";

  // Mensual (últimos 6 meses)
  const ahora = new Date();
  const mesesMap: Record<string, { mes: string; total: number; leidas: number }> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = new Intl.DateTimeFormat("es-BO", { month: "short", year: "numeric" }).format(d);
    mesesMap[key] = { mes: label, total: 0, leidas: 0 };
  }
  notificacionesDB.forEach((n) => {
    const key = `${n.created_at.getFullYear()}-${String(n.created_at.getMonth() + 1).padStart(2, "0")}`;
    if (mesesMap[key]) {
      mesesMap[key].total += 1;
      if (n.leida) mesesMap[key].leidas += 1;
    }
  });
  const mensual = Object.values(mesesMap);

  const config = {
    filename: "reporte-notificaciones",
    titulo: "Reporte de Notificaciones — PREPE",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Total enviadas", valor: String(total), color: "#185FA5" },
      { label: "Leídas", valor: String(leidas), color: "#2D7A47" },
      { label: "No leídas", valor: String(noLeidas), color: "#A32D2D" },
      { label: "Tasa de lectura", valor: `${tasaLectura}%`, color: "#BC9968" },
    ],
    graficos: [
      {
        tipo: "dona" as const,
        titulo: "Tipos de notificación",
        datos: tipos.map((t) => ({ nombre: t.tipo, valor: t.total, color: "#185FA5" })),
      },
      {
        tipo: "area" as const,
        titulo: "Notificaciones por mes",
        datos: mensual.map((m) => ({ x: m.mes, y: m.total })),
        color: "#185FA5",
      },
    ],
    tablas: [
      {
        nombre: "Por tipo de notificación",
        columnas: ["Tipo", "Total", "Leídas", "Tasa de lectura"],
        filas: tipos.map((t) => [t.tipo, t.total, t.leidas, t.total > 0 ? Math.round((t.leidas / t.total) * 100) + "%" : "0%"]),
      },
      {
        nombre: "Histórico mensual",
        columnas: ["Período", "Total enviadas", "Leídas"],
        filas: mensual.map((m) => [m.mes, m.total, m.leidas]),
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
            <span className="text-xs text-[#5A0F24] font-medium">Notificaciones</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte de Notificaciones</h1>
          <p className="mt-1 text-sm text-[#7A5260] max-w-2xl leading-relaxed">
            Volumen de notificaciones enviadas, tasa de lectura y tipos más frecuentes en la plataforma.
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
          { label: "Total enviadas", valor: String(total), color: "#185FA5", sub: "Notificaciones históricas" },
          { label: "Leídas", valor: String(leidas), color: "#2D7A47", sub: `${tasaLectura}% de lectura` },
          { label: "No leídas", valor: String(noLeidas), color: "#A32D2D", sub: "Pendientes de leer" },
          { label: "Tipo más frecuente", valor: tipoMasFrecuente, color: "#BC9968", sub: `${tipos[0]?.total || 0} notificaciones` },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: k.color }} />
            <p className="font-serif text-2xl font-bold text-[#5A0F24] truncate capitalize">{k.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{k.label}</p>
            <p className="text-xs mt-0.5" style={{ color: k.color }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Tasa visual */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-serif text-lg font-semibold text-[#5A0F24]">Tasa de lectura global</h3>
          <span className="font-serif text-2xl font-bold text-[#185FA5]">{tasaLectura}%</span>
        </div>
        <div className="w-full bg-[#F3EBE8] rounded-full h-3">
          <div className="h-3 rounded-full bg-[#185FA5] transition-all" style={{ width: `${tasaLectura}%` }} />
        </div>
        <div className="flex justify-between text-xs text-[#7A5260] mt-2">
          <span>{leidas} leídas</span>
          <span>{noLeidas} no leídas</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GraficoTiposNotif data={tipos} />
        <GraficoNotifMes data={mensual} />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 overflow-x-auto">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Detalle por tipo</h3>
        {tipos.length === 0 ? (
          <p className="text-sm text-[#7A5260] text-center py-4">Sin notificaciones registradas.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Tipo", "Total enviadas", "Leídas", "No leídas", "Tasa de lectura"].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tipos.map((t) => {
                const tasa = t.total > 0 ? Math.round((t.leidas / t.total) * 100) : 0;
                return (
                  <tr key={t.tipo} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50">
                    <td className="px-3 py-3 text-sm font-medium text-[#2A0E18] capitalize">{t.tipo.replace(/_/g, " ")}</td>
                    <td className="px-3 py-3 text-sm font-bold text-[#5A0F24]">{t.total}</td>
                    <td className="px-3 py-3 text-sm text-[#2D7A47] font-semibold">{t.leidas}</td>
                    <td className="px-3 py-3 text-sm text-[#A32D2D]">{t.total - t.leidas}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#F3EBE8] rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-[#185FA5]" style={{ width: `${tasa}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-[#185FA5]">{tasa}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
