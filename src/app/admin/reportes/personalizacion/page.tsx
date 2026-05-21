import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import ReportSubNav from "../_components/ReportSubNav";
import { GraficoTiposTarjeta, GraficoAdopcionPersonalizacion } from "./PersonalizacionCharts";

export const dynamic = "force-dynamic";

export default async function ReportePersonalizacionPage() {
  const detallesDB = await prisma.detalle_pedidos.findMany({
    select: {
      id: true,
      empaque_especial: true,
      mensaje_personal: true,
      personalizacion: { select: { tipo_tarjeta: true } },
    },
  });

  const total = detallesDB.length;
  const conMensaje = detallesDB.filter((d) => d.mensaje_personal && d.mensaje_personal.trim() !== "").length;
  const conEmpaque = detallesDB.filter((d) => d.empaque_especial).length;
  const conTarjeta = detallesDB.filter((d) => d.personalizacion !== null).length;
  const tasaAdopcion = total > 0 ? Math.round(((conMensaje + conEmpaque + conTarjeta) / (total * 3)) * 100) : 0;

  // Tipos de tarjeta
  const tarjetaMap: Record<string, number> = {};
  detallesDB.forEach((d) => {
    if (d.personalizacion) {
      const tipo = d.personalizacion.tipo_tarjeta || "Sin tipo";
      tarjetaMap[tipo] = (tarjetaMap[tipo] || 0) + 1;
    }
  });
  const tiposTarjeta = Object.entries(tarjetaMap)
    .map(([tipo, total]) => ({ tipo, total }))
    .sort((a, b) => b.total - a.total);

  const topTarjeta = tiposTarjeta[0]?.tipo || "—";

  const config = {
    filename: "reporte-personalizacion",
    titulo: "Reporte de Personalización — PREPE",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Con mensaje personal", valor: String(conMensaje), color: "#8E1B3A" },
      { label: "Con empaque especial", valor: String(conEmpaque), color: "#BC9968" },
      { label: "Con tarjeta personalizada", valor: String(conTarjeta), color: "#185FA5" },
      { label: "Tasa de personalización", valor: `${tasaAdopcion}%`, color: "#2D7A47" },
    ],
    graficos: [
      {
        tipo: "dona" as const,
        titulo: "Tipos de tarjeta más usados",
        datos: tiposTarjeta.map((t) => ({ nombre: t.tipo, valor: t.total, color: "#8E1B3A" })),
      },
    ],
    tablas: [
      {
        nombre: "Adopción de personalización",
        columnas: ["Tipo", "Cantidad", "% del total"],
        filas: [
          ["Mensaje personal", conMensaje, total > 0 ? Math.round((conMensaje / total) * 100) + "%" : "0%"],
          ["Empaque especial", conEmpaque, total > 0 ? Math.round((conEmpaque / total) * 100) + "%" : "0%"],
          ["Tarjeta personalizada", conTarjeta, total > 0 ? Math.round((conTarjeta / total) * 100) + "%" : "0%"],
        ],
      },
      {
        nombre: "Tipos de tarjeta",
        columnas: ["Tipo de tarjeta", "Pedidos"],
        filas: tiposTarjeta.map((t) => [t.tipo, t.total]),
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
            <span className="text-xs text-[#5A0F24] font-medium">Personalización</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte de Personalización</h1>
          <p className="mt-1 text-sm text-[#7A5260] max-w-2xl leading-relaxed">
            Adopción de mensajes personales, empaques especiales y tarjetas personalizadas en los pedidos.
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
          { label: "Con mensaje personal", valor: String(conMensaje), color: "#8E1B3A", sub: `${total > 0 ? Math.round((conMensaje / total) * 100) : 0}% de pedidos` },
          { label: "Con empaque especial", valor: String(conEmpaque), color: "#BC9968", sub: `${total > 0 ? Math.round((conEmpaque / total) * 100) : 0}% de pedidos` },
          { label: "Con tarjeta personalizada", valor: String(conTarjeta), color: "#185FA5", sub: `${total > 0 ? Math.round((conTarjeta / total) * 100) : 0}% de pedidos` },
          { label: "Tarjeta más popular", valor: topTarjeta, color: "#2D7A47", sub: "Diseño favorito" },
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
        {tiposTarjeta.length > 0 && <GraficoTiposTarjeta data={tiposTarjeta} />}
        <GraficoAdopcionPersonalizacion conMensaje={conMensaje} conEmpaque={conEmpaque} conTarjeta={conTarjeta} total={total} />
      </div>

      {/* Tabla tipos de tarjeta */}
      {tiposTarjeta.length > 0 && (
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 overflow-x-auto">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Tipos de tarjeta usados</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["#", "Tipo de tarjeta", "Pedidos con este tipo", "% del total con tarjeta"].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tiposTarjeta.map((t, i) => (
                <tr key={t.tipo} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50">
                  <td className="px-3 py-3 text-sm text-[#7A5260]">{i + 1}</td>
                  <td className="px-3 py-3 text-sm font-medium text-[#2A0E18] capitalize">{t.tipo}</td>
                  <td className="px-3 py-3 text-sm font-bold text-[#5A0F24]">{t.total}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-[#F3EBE8] rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-[#8E1B3A]"
                          style={{ width: `${conTarjeta > 0 ? Math.round((t.total / conTarjeta) * 100) : 0}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-[#8E1B3A]">
                        {conTarjeta > 0 ? Math.round((t.total / conTarjeta) * 100) : 0}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
