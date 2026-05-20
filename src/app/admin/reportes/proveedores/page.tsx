import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";

export const dynamic = "force-dynamic";

export default async function ReporteProveedoresPage() {
  const [proveedoresDB, pedidosDB, productosDB] = await Promise.all([
    prisma.proveedores.findMany({
      select: {
        id: true,
        nombre_negocio: true,
        nombre_contacto: true,
        email: true,
        estado: true,
        total_vendido: true,
        created_at: true,
        _count: {
          select: {
            productos: true,
            detalle_pedidos: true,
          },
        },
      },
      orderBy: { total_vendido: "desc" },
    }),
    prisma.pedidos.findMany({
      select: { id: true, estado: true, total: true },
    }),
    prisma.productos.findMany({
      select: { id: true, activo: true, proveedor_id: true },
    }),
  ]);

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

  // Top 10 proveedores por ventas
  const topProveedores = proveedoresDB
    .filter((p) => p.estado === "aprobado")
    .slice(0, 10);

  const maxVentas = Math.max(...topProveedores.map((p) => Number(p.total_vendido || 0)), 1);
  const maxRegistro = Math.max(...registroMensual.map((m) => m.total), 1);

  const config = {
    filename: "reporte-proveedores",
    titulo: "Reporte de Proveedores — PREPE",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Total proveedores", valor: String(total), color: "#8E1B3A" },
      { label: "Aprobados", valor: String(aprobados), color: "#2D7A47" },
      { label: "Pendientes", valor: String(pendientes), color: "#8C5E08" },
      { label: "Suspendidos / Rechazados", valor: String(suspendidos), color: "#A32D2D" },
    ],
    graficos: [
      {
        tipo: "dona" as const,
        titulo: "Estado de proveedores",
        datos: [
          { nombre: "Aprobados", valor: aprobados, color: "#2D7A47" },
          { nombre: "Pendientes", valor: pendientes, color: "#8C5E08" },
          { nombre: "Suspendidos", valor: suspendidos, color: "#A32D2D" },
        ],
      },
      {
        tipo: "barras-h" as const,
        titulo: "Top proveedores por ventas (Bs)",
        datos: topProveedores.slice(0, 6).map((p) => ({
          nombre: p.nombre_negocio,
          valor: Number(p.total_vendido || 0),
        })),
        color: "#8E1B3A",
      },
      {
        tipo: "area" as const,
        titulo: "Nuevos proveedores por mes",
        datos: registroMensual.map((m) => ({ x: m.mes, y: m.total })),
        color: "#BC9968",
      },
    ],
    tablas: [
      {
        nombre: "Resumen del sistema",
        columnas: ["Métrica", "Valor"],
        filas: [
          ["Total proveedores registrados", total],
          ["Proveedores aprobados", aprobados],
          ["Proveedores pendientes de aprobación", pendientes],
          ["Proveedores suspendidos / rechazados", suspendidos],
          ["Total vendido por todos los proveedores", formatBs(totalVendido)],
        ],
      },
      {
        nombre: "Top proveedores por ventas",
        columnas: ["Proveedor", "Estado", "Ventas (Bs)", "Productos", "Pedidos"],
        filas: topProveedores.map((p) => [
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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/reportes"
            className="p-2 bg-white border border-[#8E1B3A]/10 rounded-xl text-[#7A5260] hover:text-[#8E1B3A] hover:bg-[#FDFBF9] transition-all shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div>
            <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Reportes — PREPE</p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte de Proveedores</h1>
            <p className="mt-1 text-sm text-[#7A5260] max-w-2xl">
              Estado, rendimiento y actividad de todos los proveedores registrados en el Sistema PREPE.
            </p>
          </div>
        </div>
        <DescargarReporteBtn config={config} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total proveedores", valor: String(total), color: "#8E1B3A", sub: "En el sistema" },
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Estado de proveedores */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-lg font-semibold text-[#5A0F24] mb-4">Estado de proveedores</h3>
          <div className="space-y-3">
            {[
              { label: "Aprobados", value: aprobados, color: "#2D7A47" },
              { label: "Pendientes", value: pendientes, color: "#8C5E08" },
              { label: "Suspendidos / Rechazados", value: suspendidos, color: "#A32D2D" },
            ].map((seg) => {
              const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0;
              return (
                <div key={seg.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-[#2A0E18]">{seg.label}</span>
                    <span className="text-sm font-bold text-[#5A0F24]">
                      {seg.value}{" "}
                      <span className="font-normal text-[#7A5260]">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2.5 bg-[#FAF3EC] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: seg.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-[#8E1B3A]/8">
            <p className="text-xs text-[#7A5260]">
              Total vendido por todos los proveedores:{" "}
              <span className="font-bold text-[#5A0F24]">{formatBs(totalVendido)}</span>
            </p>
          </div>
        </div>

        {/* Registro mensual */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-lg font-semibold text-[#5A0F24] mb-4">Nuevos proveedores por mes</h3>
          <div className="space-y-2">
            {registroMensual.map((m) => (
              <div key={m.mes} className="flex items-center gap-3">
                <span className="text-xs text-[#7A5260] w-20 flex-shrink-0 capitalize">{m.mes}</span>
                <div className="flex-1 h-6 bg-[#FAF3EC] rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#8E1B3A] to-[#BC9968] rounded-lg transition-all"
                    style={{ width: `${Math.round((m.total / maxRegistro) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-[#5A0F24] w-8 text-right">{m.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top proveedores por ventas */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h3 className="font-serif text-lg font-semibold text-[#5A0F24] mb-4">Top proveedores por ventas</h3>
        <div className="space-y-2">
          {topProveedores.map((p, i) => {
            const ventas = Number(p.total_vendido || 0);
            const pct = Math.round((ventas / maxVentas) * 100);
            return (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#8E1B3A] to-[#BC9968] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-[#2A0E18] w-40 truncate flex-shrink-0">{p.nombre_negocio}</span>
                <div className="flex-1 h-5 bg-[#FAF3EC] rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#8E1B3A] to-[#BC9968] rounded-lg"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-[#5A0F24] w-24 text-right flex-shrink-0">{formatBs(ventas)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabla detallada */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 overflow-x-auto">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Detalle de todos los proveedores</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Proveedor", "Contacto", "Estado", "Ventas totales", "Productos", "Pedidos", "Registro"].map((h) => (
                <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {proveedoresDB.map((p) => (
              <tr key={p.id} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50">
                <td className="px-3 py-3">
                  <span className="text-sm font-medium text-[#2A0E18]">{p.nombre_negocio}</span>
                </td>
                <td className="px-3 py-3 text-sm text-[#7A5260]">{p.nombre_contacto || "—"}</td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                      p.estado === "aprobado"
                        ? "bg-[#EEF8F0] text-[#2D7A47]"
                        : p.estado === "pendiente"
                        ? "bg-[#FFF8EC] text-[#8C5E08]"
                        : "bg-[#FBF0F0] text-[#A32D2D]"
                    }`}
                  >
                    {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24]">
                  {formatBs(Number(p.total_vendido || 0))}
                </td>
                <td className="px-3 py-3 text-sm text-[#7A5260]">{p._count.productos}</td>
                <td className="px-3 py-3 text-sm text-[#7A5260]">{p._count.detalle_pedidos}</td>
                <td className="px-3 py-3 text-sm text-[#7A5260]">
                  {new Intl.DateTimeFormat("es-BO", { day: "2-digit", month: "short", year: "numeric" }).format(
                    new Date(p.created_at)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
