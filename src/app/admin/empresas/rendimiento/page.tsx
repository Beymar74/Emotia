import Link from "next/link";
import prisma from "@/lib/prisma";

const subPages = [
  { href: "/admin/empresas/actividad", label: "Supervisar actividad", icon: "◷" },
  { href: "/admin/empresas/rendimiento", label: "Rendimiento", icon: "▲", active: true },
];

export const dynamic = "force-dynamic";

export default async function RendimientoEmpresasPage() {
  const empresasDB = await prisma.proveedores.findMany({
    where: { estado: "aprobado" },
    orderBy: { total_vendido: "desc" },
  });

  // Pedidos reales por proveedor
  const pedidosPorProveedor = await prisma.detalle_pedidos.groupBy({
    by: ["proveedor_id"],
    _count: { id: true },
    where: {
      pedidos: { estado: { in: ["entregado", "cancelado"] } },
    },
  });

  const completadosPorProveedor = await prisma.detalle_pedidos.groupBy({
    by: ["proveedor_id"],
    _count: { id: true },
    where: { pedidos: { estado: "entregado" } },
  });

  const canceladosPorProveedor = await prisma.detalle_pedidos.groupBy({
    by: ["proveedor_id"],
    _count: { id: true },
    where: { pedidos: { estado: "cancelado" } },
  });

  // Ventas últimos 7 días por proveedor (para sparkline)
  const hoy = new Date();
  const sparklineData: Record<number, number[]> = {};
  for (const emp of empresasDB) {
    const counts: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const desde = new Date(hoy); desde.setDate(hoy.getDate() - i); desde.setHours(0, 0, 0, 0);
      const hasta = new Date(desde); hasta.setHours(23, 59, 59, 999);
      const count = await prisma.detalle_pedidos.count({
        where: {
          proveedor_id: emp.id,
          pedidos: { estado: "entregado", created_at: { gte: desde, lte: hasta } },
        },
      });
      counts.push(count);
    }
    sparklineData[emp.id] = counts;
  }

  const completadosMap: Record<number, number> = {};
  const canceladosMap: Record<number, number> = {};
  for (const r of completadosPorProveedor) completadosMap[r.proveedor_id] = r._count.id;
  for (const r of canceladosPorProveedor)  canceladosMap[r.proveedor_id]  = r._count.id;

  const getInitials = (nombre: string) =>
    nombre ? nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "EM";

  type RendimientoData = {
    id: number;
    empresa: string;
    initials: string;
    montoTotal: string;
    pedidosCompletados: number;
    pedidosCancelados: number;
    calificacion: string;
    calificacionPct: number;
    semana: number[];
  };

  const rendimientoMapeado: RendimientoData[] = empresasDB.map((p) => {
    const ventas = Number(p.total_vendido || 0);
    const calif  = Number(p.calificacion_prom || 0);
    const califPct = Math.round((calif / 5) * 100);
    const completados = completadosMap[p.id] ?? 0;
    const cancelados  = canceladosMap[p.id]  ?? 0;

    return {
      id: p.id,
      empresa: p.nombre_negocio,
      initials: getInitials(p.nombre_negocio),
      montoTotal: `Bs ${ventas.toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
      pedidosCompletados: completados,
      pedidosCancelados: cancelados,
      calificacion: calif > 0 ? calif.toFixed(1) : "—",
      calificacionPct: califPct,
      semana: sparklineData[p.id] ?? [0, 0, 0, 0, 0, 0, 0],
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Empresas</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Rendimiento de empresas</h1>
          <p className="mt-2 text-sm text-[#7A5260] max-w-3xl leading-relaxed">
            En esta sección puedes analizar el rendimiento financiero y operativo de las empresas proveedoras, incluyendo ventas, calificaciones y tiempos de respuesta.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-1.5 flex flex-col sm:flex-row gap-1.5">
        {subPages.map((sp) => (
          <Link
            key={sp.href}
            href={sp.href}
            className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              sp.active
                ? "bg-gradient-to-r from-[#8E1B3A] to-[#AB3A50] text-white shadow-sm"
                : "text-[#7A5260] hover:bg-[#FAF3EC] hover:text-[#5A0F24]"
            }`}
          >
            <span>{sp.icon}</span>
            <span>{sp.label}</span>
          </Link>
        ))}
      </div>

      {rendimientoMapeado.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-12 text-center">
          <p className="text-sm text-[#7A5260]">No hay empresas aprobadas aún.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {rendimientoMapeado.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-4 sm:p-5 flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8E1B3A] to-[#AB3A50] flex items-center justify-center text-sm font-bold text-white">
                        {r.initials}
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-[#2A0E18]">{r.empresa}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-yellow-500 text-xs">★</span>
                          <span className="text-sm font-medium text-[#5A0F24]">{r.calificacion}</span>
                          <span className="text-xs text-[#7A5260]">/ 5.0</span>
                        </div>
                      </div>
                    </div>
                    <p className="font-serif text-xl sm:text-2xl font-bold text-[#5A0F24]">{r.montoTotal}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                    <div className="bg-[#FAF3EC] rounded-lg p-2 sm:p-3 text-center">
                      <p className="font-serif text-lg sm:text-2xl font-bold text-[#5A0F24]">{r.pedidosCompletados}</p>
                      <p className="text-xs text-[#7A5260] mt-0.5">Completados</p>
                    </div>
                    <div className="bg-[#FBF0F0] rounded-lg p-2 sm:p-3 text-center">
                      <p className="font-serif text-lg sm:text-2xl font-bold text-[#A32D2D]">{r.pedidosCancelados}</p>
                      <p className="text-xs text-[#7A5260] mt-0.5">Cancelados</p>
                    </div>
                    <div className="bg-[#EEF8F0] rounded-lg p-2 sm:p-3 text-center">
                      <p className="font-serif text-lg sm:text-2xl font-bold text-[#2D7A47]">{r.calificacionPct}%</p>
                      <p className="text-xs text-[#7A5260] mt-0.5">Satisfacción</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-[#7A5260] mb-1.5">
                      <span>Índice de satisfacción</span>
                      <span>{r.calificacionPct}%</span>
                    </div>
                    <div className="h-2 bg-[#8E1B3A]/8 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${r.calificacionPct}%`, background: "linear-gradient(90deg,#8E1B3A,#BC9968)" }}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-[#7A5260] mb-2">Pedidos completados (últimos 7 días)</p>
                    <div className="flex items-end gap-1 h-10">
                      {r.semana.map((val, i) => {
                        const max = Math.max(...r.semana, 1);
                        const pct = (val / max) * 100;
                        return (
                          <div key={i} className="flex-1 rounded-t" style={{ height: `${Math.max(pct, 4)}%`, background: "linear-gradient(to top,#8E1B3A,#BC9968)" }} />
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-1">
                      {["L", "M", "X", "J", "V", "S", "D"].map(d => (
                        <span key={d} className="flex-1 text-center text-xs text-[#B0B0B0]">{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-3 sm:p-5">
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#5A0F24] mb-4">Comparativa general</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[700px]">
                <thead>
                  <tr>
                    {["Empresa", "Monto total", "Completados", "Cancelados", "Tasa éxito", "Calificación", "Ranking", "Acción"].map((h) => (
                      <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...rendimientoMapeado]
                    .sort((a, b) => Number(b.calificacion === "—" ? 0 : b.calificacion) - Number(a.calificacion === "—" ? 0 : a.calificacion))
                    .map((r, i) => {
                      const totalPedidos = r.pedidosCompletados + r.pedidosCancelados;
                      const tasaExito = totalPedidos > 0 ? Math.round((r.pedidosCompletados / totalPedidos) * 100) : 0;
                      return (
                        <tr key={r.id} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50 transition-colors">
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8E1B3A] to-[#AB3A50] flex items-center justify-center text-xs font-bold text-white">
                                {r.initials}
                              </div>
                              <span className="text-sm font-medium text-[#2A0E18]">{r.empresa}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24]">{r.montoTotal}</td>
                          <td className="px-3 py-3 text-sm text-[#2D7A47] font-medium">{r.pedidosCompletados}</td>
                          <td className="px-3 py-3 text-sm text-[#A32D2D] font-medium">{r.pedidosCancelados}</td>
                          <td className="px-3 py-3">
                            <span className={`text-sm font-semibold ${tasaExito >= 95 ? "text-[#2D7A47]" : tasaExito >= 85 ? "text-[#8C5E08]" : "text-[#A32D2D]"}`}>
                              {totalPedidos > 0 ? `${tasaExito}%` : "—"}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-sm text-[#2A0E18]">⭐ {r.calificacion}</td>
                          <td className="px-3 py-3">
                            <span className="inline-flex w-7 h-7 rounded-full bg-gradient-to-br from-[#8E1B3A] to-[#BC9968] text-white text-xs font-bold items-center justify-center">
                              #{i + 1}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <Link
                              href={`/admin/empresas/actividad/${r.id}`}
                              className="text-xs px-3 py-1.5 rounded-lg bg-[#8E1B3A]/8 text-[#8E1B3A] font-medium hover:opacity-80 block w-max"
                            >
                              Ver reporte
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
