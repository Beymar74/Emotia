import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";

export default async function ReporteEmpresasPage() {
  const [empresasDB, detallesDB] = await Promise.all([
    prisma.proveedores.findMany({
      orderBy: { total_vendido: 'desc' },
      include: {
        _count: { select: { productos: true, detalle_pedidos: true } },
      },
    }),
    prisma.detalle_pedidos.findMany({
      where: { pedidos: { estado: 'entregado' } },
      select: { proveedor_id: true, subtotal: true, cantidad: true },
    }),
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
    filename: "reporte-empresas",
    titulo: "Reporte de Empresas — Emotia",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Total empresas", valor: String(totalEmpresas), color: "#8E1B3A" },
      { label: "Activas", valor: String(activas), color: "#2D7A47" },
      { label: "Suspendidas", valor: String(suspendidas), color: "#A32D2D" },
      { label: "Pendientes", valor: String(pendientes), color: "#8C5E08" },
    ],
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
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/reportes" className="p-2 bg-white border border-[#8E1B3A]/10 rounded-xl text-[#7A5260] hover:text-[#8E1B3A] hover:bg-[#FDFBF9] transition-all shadow-sm">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <div>
            <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Reportes</p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte de Empresas</h1>
          </div>
        </div>
        <DescargarReporteBtn config={config} />
      </div>

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

      {/* Top empresas por ventas */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Participación por empresa</h3>
        {empresasRows.filter(e => e.estado === 'aprobado').length === 0 ? (
          <p className="text-sm text-[#7A5260] text-center py-4">Sin datos de ventas.</p>
        ) : (
          <div className="space-y-4">
            {empresasRows
              .filter(e => e.estado === 'aprobado')
              .slice(0, 8)
              .map((e, i) => {
                const barPct = maxIngresos > 0 ? Math.round((e.ingresos / maxIngresos) * 100) : 0;
                return (
                  <div key={e.id}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#8E1B3A] to-[#BC9968] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8E1B3A] to-[#AB3A50] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                          {e.initials}
                        </div>
                        <div>
                          <p className="font-medium text-[#2A0E18]">{e.nombre}</p>
                          <p className="text-[10px] text-[#7A5260]">⭐ {e.calificacion.toFixed(1)} · {e.productos} prods · {e.despachos} despachos</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-[#5A0F24]">{formatBs(e.ingresos)}</p>
                        <p className="text-[10px] text-[#7A5260]">{e.pct}% del total</p>
                      </div>
                    </div>
                    <div className="h-2.5 bg-[#8E1B3A]/8 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${barPct}%`, background: "linear-gradient(90deg,#8E1B3A,#BC9968)" }} />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

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
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8E1B3A] to-[#AB3A50] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
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
