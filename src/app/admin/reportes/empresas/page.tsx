import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import { Suspense } from "react";
import EmpresaFilter from "../../_components/EmpresaFilter";
import ReportSubNav from "../_components/ReportSubNav";
import EmpresasCharts from "./EmpresasCharts";

export default async function ReporteEmpresasPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const empresaId = typeof sp.empresa === "string" && sp.empresa !== "todas" ? parseInt(sp.empresa) : 0;
  const empresaFiltroDetalle = empresaId > 0 ? { proveedor_id: empresaId } : {};
  const empresaFiltroEmpresa = empresaId > 0 ? { id: empresaId } : {};
  const [empresasDB, detallesDB, empresasLista] = await Promise.all([
    prisma.proveedores.findMany({
      where: { ...empresaFiltroEmpresa },
      orderBy: { total_vendido: 'desc' },
      include: {
        _count: { select: { productos: true, detalle_pedidos: true } },
      },
    }),
    prisma.detalle_pedidos.findMany({
      where: { pedidos: { estado: 'entregado' }, ...empresaFiltroDetalle },
      select: { proveedor_id: true, subtotal: true, cantidad: true },
    }),
    prisma.proveedores.findMany({ select: { id: true, nombre_negocio: true, logo_url: true }, orderBy: { nombre_negocio: "asc" } })
  ]);

  const totalEmpresas = empresasDB.length;
  const activas = empresasDB.filter((e: any) => e.estado === 'aprobado').length;
  const suspendidas = empresasDB.filter((e: any) => e.estado === 'suspendido').length;
  const pendientes = empresasDB.filter((e: any) => e.estado === 'pendiente').length;

  const formatBs = (n: number) => `Bs ${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  // Ingresos por empresa desde detalle_pedidos
  const ingresosMap: Record<number, number> = {};
  detallesDB.forEach((d: any) => {
    if (!d.proveedor_id) return;
    ingresosMap[d.proveedor_id] = (ingresosMap[d.proveedor_id] || 0) + Number(d.subtotal || 0);
  });

  const totalIngresosGlobal = Object.values(ingresosMap).reduce((s, v) => s + v, 0);

  const getInitials = (n: string) => n ? n.split(" ").map(x => x[0]).join("").slice(0, 2).toUpperCase() : "EM";

  type EmpresaRow = {
    id: number;
    nombre: string;
    initials: string;
    estado: string;
    ingresos: number;
    productos: number;
    despachos: number;
    calificacion: number;
    pct: number;
    logo_url?: string | null;
  };

  const empresasRows: EmpresaRow[] = empresasDB.map((e: any) => {
    const ingresos = Number(e.total_vendido || 0);
    const pct = totalIngresosGlobal > 0 ? Math.round((ingresos / totalIngresosGlobal) * 100) : 0;
    return {
      id: e.id,
      nombre: e.nombre_negocio,
      initials: getInitials(e.nombre_negocio),
      estado: e.estado,
      ingresos,
      productos: e._count.productos,
      despachos: e._count.detalle_pedidos,
      calificacion: Number(e.calificacion_prom || 0),
      pct,
      logo_url: e.logo_url,
    };
  });

  const maxIngresos = Math.max(...empresasRows.map(e => e.ingresos), 1);

  const estadoPill: Record<string, string> = {
    aprobado: "bg-[#EEF8F0] text-[#2D7A47]",
    suspendido: "bg-[#FBF0F0] text-[#A32D2D]",
    pendiente: "bg-[#FDF5E6] text-[#8C5E08]",
  };
  const estadoLabel: Record<string, string> = {
    aprobado: "Activa",
    suspendido: "Suspendida",
    pendiente: "Pendiente",
  };

  const config = {
    filename: empresaId > 0 ? `reporte-empresas-${(empresasRows[0]?.nombre || "").toLowerCase().replace(/[^a-z0-9]/g, "-")}` : "reporte-empresas",
    titulo: empresaId > 0 ? `Reporte de Empresa: ${empresasRows[0]?.nombre || ""} — PREPE` : "Reporte de Empresas — PREPE",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Total empresas", valor: String(totalEmpresas), color: "#8E1B3A" },
      { label: "Activas", valor: String(activas), color: "#2D7A47" },
      { label: "Suspendidas", valor: String(suspendidas), color: "#A32D2D" },
      { label: "Pendientes", valor: String(pendientes), color: "#8C5E08" },
    ],
    logoUrl: empresaId > 0 ? (empresasRows[0]?.logo_url || undefined) : undefined,
    graficos: [
      { tipo: "dona" as const, titulo: "Estado de empresas", datos: [
        { nombre: "Activas", valor: activas, color: "#2D7A47" },
        { nombre: "Pendientes", valor: pendientes, color: "#BC9968" },
        { nombre: "Suspendidas", valor: suspendidas, color: "#A32D2D" },
      ]},
      { tipo: "barras-h" as const, titulo: "Top empresas por ingresos (Bs)", datos: empresasRows.filter((e) => e.estado === "aprobado").slice(0, 6).map((e) => ({ nombre: e.nombre, valor: e.ingresos })), color: "#8E1B3A" },
    ],
    tablas: [
      {
        nombre: "Directorio completo",
        columnas: ["Empresa", "Estado", "Productos", "Despachos", "Calificación", "Ingresos (Bs)", "Participación"],
        filas: empresasRows.map((e) => [
          e.nombre,
          estadoLabel[e.estado] || e.estado,
          e.productos,
          e.despachos,
          e.calificacion.toFixed(1),
          e.ingresos,
          e.pct + "%",
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
            <span className="text-xs text-[#5A0F24] font-medium">Empresas</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte de Empresas</h1>
          <p className="mt-1 text-sm text-[#7A5260] max-w-2xl leading-relaxed">
            Afiliación, distribución por estado, ingresos generados y actividad de cada empresa en el marketplace.
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
          { label: "Total empresas", valor: String(totalEmpresas), color: "#8E1B3A" },
          { label: "Activas", valor: String(activas), color: "#2D7A47" },
          { label: "Suspendidas", valor: String(suspendidas), color: "#A32D2D" },
          { label: "Pendientes", valor: String(pendientes), color: "#8C5E08" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: k.color }} />
            <p className="font-serif text-3xl font-bold text-[#5A0F24]">{k.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Gráficas */}
      <EmpresasCharts
        estados={[
          { nombre: "Activas", valor: activas, color: "#2D7A47" },
          { nombre: "Pendientes", valor: pendientes, color: "#BC9968" },
          { nombre: "Suspendidas", valor: suspendidas, color: "#A32D2D" },
        ]}
        empresas={empresasRows}
        maxIngresos={maxIngresos}
      />

      {/* Tabla completa */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 overflow-x-auto">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Directorio completo</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Empresa", "Estado", "Productos", "Despachos", "Calificación", "Ingresos generados", "Participación"].map(h => (
                <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {empresasRows.map((e) => (
              <tr key={e.id} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    {e.logo_url ? (
                      <img
                        src={e.logo_url}
                        alt={e.nombre}
                        className="w-8 h-8 rounded-lg object-cover border border-[#BC9968]/20 bg-white flex-shrink-0"
                        onError={(evt) => {
                          const img = evt.currentTarget;
                          img.style.display = "none";
                          const fallback = img.nextElementSibling;
                          if (fallback) {
                            (fallback as HTMLElement).style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8E1B3A] to-[#AB3A50] flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={e.logo_url ? { display: "none" } : undefined}
                    >
                      {e.initials}
                    </div>
                    <span className="text-sm font-medium text-[#2A0E18]">{e.nombre}</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${estadoPill[e.estado] || "bg-[#F1EFE8] text-[#5F5E5A]"}`}>
                    {estadoLabel[e.estado] || e.estado}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm text-[#2A0E18] font-medium">{e.productos}</td>
                <td className="px-3 py-3 text-sm text-[#7A5260]">{e.despachos}</td>
                <td className="px-3 py-3 text-sm text-[#2A0E18]">⭐ {e.calificacion.toFixed(1)}</td>
                <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24]">{formatBs(e.ingresos)}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 bg-[#8E1B3A]/8 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#8E1B3A]" style={{ width: `${e.pct}%` }} />
                    </div>
                    <span className="text-xs text-[#7A5260]">{e.pct}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
