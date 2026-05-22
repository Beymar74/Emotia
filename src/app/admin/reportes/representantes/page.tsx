import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import RepresentantesCharts from "./RepresentantesCharts";
import ReportSubNav from "../_components/ReportSubNav";
import RepresentantesTabla from "./_components/RepresentantesTabla";

export const dynamic = "force-dynamic";

export default async function ReporteRepresentantesPage() {
  const proveedoresDB = await prisma.proveedores.findMany({
    select: {
      id: true,
      nombre_negocio: true,
      rep_nombre: true,
      email: true,
      estado: true,
      total_vendido: true,
      created_at: true,
      logo_url: true,
      _count: {
        select: {
          productos: true,
          detalle_pedidos: true,
        },
      },
    },
    orderBy: { total_vendido: "desc" },
  });

  const total = proveedoresDB.length;
  const aprobados = proveedoresDB.filter((p) => p.estado === "aprobado").length;
  const pendientes = proveedoresDB.filter((p) => p.estado === "pendiente").length;
  const suspendidos = proveedoresDB.filter((p) => p.estado === "suspendido" || p.estado === "rechazado").length;

  const totalVendido = proveedoresDB.reduce((s, p) => s + Number(p.total_vendido || 0), 0);

  // Registro mensual (últimos 6 meses)
  const ahora = new Date();
  const mesesMap: Record<string, { mes: string; total: number }> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = new Intl.DateTimeFormat("es-BO", { month: "short", year: "numeric" }).format(d);
    mesesMap[key] = { mes: label, total: 0 };
  }
  proveedoresDB.forEach((p) => {
    const key = `${p.created_at.getFullYear()}-${String(p.created_at.getMonth() + 1).padStart(2, "0")}`;
    if (mesesMap[key]) mesesMap[key].total += 1;
  });
  const registroMensual = Object.values(mesesMap);

  const formatBs = (n: number) =>
    `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  // Top representantes por ventas
  const topRepresentantes = proveedoresDB
    .filter((p) => p.estado === "aprobado")
    .map((p) => ({
      ...p,
      total_vendido: Number(p.total_vendido || 0),
    }));

  // maxVentas removed (unused)

  const config = {
    filename: "reporte-representantes",
    titulo: "Reporte de Representantes — PREPE",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Total representantes", valor: String(total), color: "#8E1B3A" },
      { label: "Aprobados", valor: String(aprobados), color: "#2D7A47" },
      { label: "Pendientes", valor: String(pendientes), color: "#8C5E08" },
      { label: "Suspendidos / Rechazados", valor: String(suspendidos), color: "#A32D2D" },
    ],
    graficos: [
      {
        tipo: "dona" as const,
        titulo: "Estado de representantes",
        datos: [
          { nombre: "Aprobados", valor: aprobados, color: "#2D7A47" },
          { nombre: "Pendientes", valor: pendientes, color: "#8C5E08" },
          { nombre: "Suspendidos", valor: suspendidos, color: "#A32D2D" },
        ],
      },
      {
        tipo: "barras-h" as const,
        titulo: "Top representantes por ventas (Bs)",
        datos: topRepresentantes.slice(0, 8).map((p) => ({
          nombre: p.rep_nombre ? `${p.rep_nombre} (${p.nombre_negocio})` : p.nombre_negocio,
          valor: Number(p.total_vendido || 0),
        })),
        color: "#8E1B3A",
      },
      {
        tipo: "area" as const,
        titulo: "Nuevos representantes por mes",
        datos: registroMensual.map((m) => ({ x: m.mes, y: m.total })),
        color: "#BC9968",
      },
    ],
    tablas: [
      {
        nombre: "Resumen del sistema",
        columnas: ["Métrica", "Valor"],
        filas: [
          ["Total representantes registrados", total],
          ["Representantes aprobados", aprobados],
          ["Representantes pendientes de aprobación", pendientes],
          ["Representantes suspendidos / rechazados", suspendidos],
          ["Total vendido por todos los representantes", formatBs(totalVendido)],
        ],
      },
      {
        nombre: "Representantes por ventas",
        columnas: ["Representante", "Empresa", "Estado", "Ventas (Bs)", "Productos", "Pedidos"],
        filas: topRepresentantes.map((p) => [
          p.rep_nombre || "—",
          p.nombre_negocio,
          p.estado,
          Number(p.total_vendido || 0),
          p._count.productos,
          p._count.detalle_pedidos,
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
            <span className="text-xs text-[#5A0F24] font-medium">Representantes</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte de Representantes</h1>
          <p className="mt-1 text-sm text-[#7A5260] max-w-2xl leading-relaxed">
            Estado, rendimiento y actividad de todos los representantes de empresas registrados en el Sistema PREPE.
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
          { label: "Total representantes", valor: String(total), color: "#8E1B3A", sub: "En el sistema" },
          { label: "Aprobados", valor: String(aprobados), color: "#2D7A47", sub: "Operativos" },
          { label: "Pendientes", valor: String(pendientes), color: "#8C5E08", sub: "Por revisar" },
          { label: "Suspendidos / Rechazados", valor: String(suspendidos), color: "#A32D2D", sub: "Sin acceso" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: k.color }} />
            <p className="font-serif text-3xl font-bold text-[#5A0F24]">{k.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{k.label}</p>
            <p className="text-xs mt-0.5" style={{ color: k.color }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Gráficas */}
      <RepresentantesCharts
        estados={[
          { nombre: "Aprobados", valor: aprobados, color: "#2D7A47" },
          { nombre: "Pendientes", valor: pendientes, color: "#8C5E08" },
          { nombre: "Suspendidos", valor: suspendidos, color: "#A32D2D" },
        ]}
        registroMensual={registroMensual}
        topRepresentantes={topRepresentantes.slice(0, 8)}
      />

      {/* Tabla detallada */}
      <RepresentantesTabla representantes={proveedoresDB} />
    </div>
  );
}
