import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import ReportSubNav from "../_components/ReportSubNav";
import { GraficoRecordatoriosMes, GraficoProximidadEventos } from "./RecordatoriosCharts";

export const dynamic = "force-dynamic";

export default async function ReporteRecordatoriosPage() {
  const recordatoriosDB = await prisma.recordatorios.findMany({
    select: {
      id: true,
      titulo: true,
      fecha_evento: true,
      activo: true,
      dias_aviso: true,
      created_at: true,
      usuario_id: true,
    },
    orderBy: { fecha_evento: "asc" },
  });

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const en30dias = new Date(hoy);
  en30dias.setDate(en30dias.getDate() + 30);
  const en7dias = new Date(hoy);
  en7dias.setDate(en7dias.getDate() + 7);

  const total = recordatoriosDB.length;
  const activos = recordatoriosDB.filter((r) => r.activo).length;
  const proximos30 = recordatoriosDB.filter((r) => {
    const f = new Date(r.fecha_evento);
    return r.activo && f >= hoy && f <= en30dias;
  }).length;
  const usuariosConRec = new Set(recordatoriosDB.map((r) => r.usuario_id)).size;

  // Registro mensual (últimos 6 meses)
  const ahora = new Date();
  const mesesMap: Record<string, { mes: string; total: number; activos: number }> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = new Intl.DateTimeFormat("es-BO", { month: "short", year: "numeric" }).format(d);
    mesesMap[key] = { mes: label, total: 0, activos: 0 };
  }
  recordatoriosDB.forEach((r) => {
    const key = `${r.created_at.getFullYear()}-${String(r.created_at.getMonth() + 1).padStart(2, "0")}`;
    if (mesesMap[key]) {
      mesesMap[key].total += 1;
      if (r.activo) mesesMap[key].activos += 1;
    }
  });
  const registroMensual = Object.values(mesesMap);

  // Distribución por proximidad
  const proximidadData = [
    {
      rango: "Esta semana",
      total: recordatoriosDB.filter((r) => { const f = new Date(r.fecha_evento); return r.activo && f >= hoy && f <= en7dias; }).length,
      color: "#A32D2D",
    },
    {
      rango: "Próximos 30 días",
      total: recordatoriosDB.filter((r) => { const f = new Date(r.fecha_evento); return r.activo && f > en7dias && f <= en30dias; }).length,
      color: "#8C5E08",
    },
    {
      rango: "Más de 30 días",
      total: recordatoriosDB.filter((r) => { const f = new Date(r.fecha_evento); return r.activo && f > en30dias; }).length,
      color: "#2D7A47",
    },
    {
      rango: "Inactivos",
      total: recordatoriosDB.filter((r) => !r.activo).length,
      color: "#7A5260",
    },
  ];

  // Próximos eventos
  const proxEventos = recordatoriosDB
    .filter((r) => r.activo && new Date(r.fecha_evento) >= hoy)
    .slice(0, 10);

  const fmtFecha = (d: Date) =>
    new Intl.DateTimeFormat("es-BO", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(d));

  const diasHasta = (fecha: Date) => {
    const diff = new Date(fecha).getTime() - hoy.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const config = {
    filename: "reporte-recordatorios",
    titulo: "Reporte de Recordatorios — PREPE",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Total recordatorios", valor: String(total), color: "#185FA5" },
      { label: "Activos", valor: String(activos), color: "#2D7A47" },
      { label: "Próximos 30 días", valor: String(proximos30), color: "#8C5E08" },
      { label: "Usuarios con recordatorios", valor: String(usuariosConRec), color: "#8E1B3A" },
    ],
    graficos: [
      {
        tipo: "area" as const,
        titulo: "Recordatorios creados por mes",
        datos: registroMensual.map((m) => ({ x: m.mes, y: m.total })),
        color: "#185FA5",
      },
    ],
    tablas: [
      {
        nombre: "Próximos eventos",
        columnas: ["Título", "Fecha", "Días restantes", "Aviso (días)"],
        filas: proxEventos.map((r) => [r.titulo, fmtFecha(r.fecha_evento), diasHasta(r.fecha_evento), r.dias_aviso]),
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
            <span className="text-xs text-[#5A0F24] font-medium">Recordatorios</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte de Recordatorios</h1>
          <p className="mt-1 text-sm text-[#7A5260] max-w-2xl leading-relaxed">
            Eventos próximos, fechas importantes y actividad del sistema de recordatorios de usuarios.
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
          { label: "Total recordatorios", valor: String(total), color: "#185FA5", sub: "Registrados" },
          { label: "Activos", valor: String(activos), color: "#2D7A47", sub: "En seguimiento" },
          { label: "Próximos 30 días", valor: String(proximos30), color: "#8C5E08", sub: "Eventos inminentes" },
          { label: "Usuarios con recordatorios", valor: String(usuariosConRec), color: "#8E1B3A", sub: "Usuarios activos" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: k.color }} />
            <p className="font-serif text-3xl font-bold text-[#5A0F24]">{k.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{k.label}</p>
            <p className="text-xs mt-0.5" style={{ color: k.color }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GraficoRecordatoriosMes data={registroMensual} />
        <GraficoProximidadEventos data={proximidadData} />
      </div>

      {/* Próximos eventos */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 overflow-x-auto">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Próximos eventos</h3>
        {proxEventos.length === 0 ? (
          <p className="text-sm text-[#7A5260] text-center py-4">No hay eventos próximos activos.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Título", "Fecha del evento", "Días restantes", "Aviso previo"].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {proxEventos.map((r) => {
                const dias = diasHasta(r.fecha_evento);
                const urgencia = dias <= 7 ? "#A32D2D" : dias <= 30 ? "#8C5E08" : "#2D7A47";
                return (
                  <tr key={r.id} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50">
                    <td className="px-3 py-3 text-sm font-medium text-[#2A0E18]">{r.titulo}</td>
                    <td className="px-3 py-3 text-sm text-[#7A5260]">{fmtFecha(r.fecha_evento)}</td>
                    <td className="px-3 py-3">
                      <span className="inline-block text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: urgencia + "18", color: urgencia }}>
                        {dias === 0 ? "Hoy" : dias === 1 ? "Mañana" : `${dias} días`}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-[#7A5260]">{r.dias_aviso} días antes</td>
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
