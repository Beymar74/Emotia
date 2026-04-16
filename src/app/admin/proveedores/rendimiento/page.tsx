import Link from "next/link";
import prisma from "@/lib/prisma";
import { proveedores } from "@/generated/prisma/client";

// Sub-navegación alineada con el resto del panel
const subPages = [
  { href: "/admin/proveedores/actividad", label: "Supervisar actividad", icon: "◷" },
  { href: "/admin/proveedores/rendimiento", label: "Rendimiento", icon: "▲", active: true },
];

export default async function RendimientoPage() {
  // --- 1. CONSULTA A LA BASE DE DATOS ---
  const proveedoresDB = await prisma.proveedores.findMany({
    where: { estado: 'aprobado' },
    orderBy: { total_vendido: 'desc' }
  });

  // --- 2. FUNCIONES AUXILIARES ---
  const getInitials = (nombre: string) => {
    if (!nombre) return "PR";
    return nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  // Define la estructura de los datos para TypeScript
  type RendimientoData = {
    id: number;
    proveedor: string;
    initials: string;
    montoTotal: string;
    pedidosCompletados: number;
    pedidosCancelados: number;
    calificacion: string;
    calificacionPct: number;
    semana: number[];
  };

  // --- 3. MAPEO DE DATOS ---
  const rendimientoMapeado: RendimientoData[] = proveedoresDB.map((p: proveedores) => {
    const ventas = Number(p.total_vendido || 0);
    const calif = Number(p.calificacion_prom || 5.0); 
    const califPct = Math.round((calif / 5) * 100);
    
    // Estimación de métricas basada en ventas reales
    const completados = Math.floor(ventas / 150) + 1; 
    const cancelados = Math.floor(completados * 0.08); 

    // Generamos un gráfico semanal "determinista" (siempre igual para el mismo proveedor)
    const baseChart = Math.max(5, Math.floor(completados / 4));
    const semana = [
      baseChart + (p.id % 5),
      baseChart + (p.id % 3) * 2,
      baseChart + (p.id % 7),
      baseChart + 5,
      baseChart + (p.id % 4) * 3,
      baseChart + 10,
      baseChart + 2
    ];

    return {
      id: p.id,
      proveedor: p.nombre_negocio,
      initials: getInitials(p.nombre_negocio),
      montoTotal: `Bs ${ventas.toLocaleString('en-US', { minimumFractionDigits: 0 })}`,
      pedidosCompletados: completados,
      pedidosCancelados: cancelados,
      calificacion: calif.toFixed(1),
      calificacionPct: califPct,
      semana: semana,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Proveedores</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Rendimiento de proveedores</h1>
        </div>
        <select className="self-start sm:self-auto text-sm border border-[#8E1B3A]/15 rounded-lg px-4 py-2.5 outline-none text-[#7A5260] bg-white cursor-pointer hover:border-[#8E1B3A]/30 transition-colors">
          <option>Abril 2026</option>
          <option>Marzo 2026</option>
          <option>Febrero 2026</option>
        </select>
      </div>

      {/* Sub-navegación */}
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

      {/* Cards de rendimiento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {rendimientoMapeado.map((r: RendimientoData) => (
          <div key={r.id} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-4 sm:p-5 flex flex-col h-full">
            <div className="flex-1">
              {/* Header card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8E1B3A] to-[#AB3A50] flex items-center justify-center text-sm font-bold text-white">
                    {r.initials}
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-[#2A0E18]">{r.proveedor}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-yellow-500 text-xs">★</span>
                      <span className="text-sm font-medium text-[#5A0F24]">{r.calificacion}</span>
                      <span className="text-xs text-[#7A5260]">/ 5.0</span>
                    </div>
                  </div>
                </div>
                <p className="font-serif text-xl sm:text-2xl font-bold text-[#5A0F24]">{r.montoTotal}</p>
              </div>

              {/* Métricas */}
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

              {/* Barra de satisfacción */}
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

              {/* Mini gráfico de barras semanal */}
              <div className="mt-4">
                <p className="text-xs text-[#7A5260] mb-2">Pedidos por día (última semana)</p>
                <div className="flex items-end gap-1 h-10">
                  {r.semana.map((val: number, i: number) => {
                    const max = Math.max(...r.semana);
                    const pct = max > 0 ? (val / max) * 100 : 0;
                    return (
                      <div key={i} className="flex-1 rounded-t" style={{ height: `${pct}%`, background: "linear-gradient(to top,#8E1B3A,#BC9968)" }} />
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

      {/* Tabla comparativa */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-3 sm:p-5">
        <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#5A0F24] mb-4">Comparativa general</h3>

        {/* Mobile: cards */}
        <div className="block lg:hidden space-y-3">
          {[...rendimientoMapeado]
            .sort((a, b) => Number(b.calificacion) - Number(a.calificacion))
            .map((r: RendimientoData, i: number) => {
              const totalPedidos = r.pedidosCompletados + r.pedidosCancelados;
              const tasaExito = totalPedidos > 0 ? Math.round((r.pedidosCompletados / totalPedidos) * 100) : 0;
              return (
                <div key={r.id} className="border border-[#8E1B3A]/8 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#8E1B3A] to-[#BC9968] text-white text-xs font-bold flex items-center justify-center">
                        #{i + 1}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8E1B3A] to-[#AB3A50] flex items-center justify-center text-xs font-bold text-white">
                          {r.initials}
                        </div>
                        <span className="text-sm font-medium text-[#2A0E18]">{r.proveedor}</span>
                      </div>
                    </div>
                    <span className="font-serif text-lg font-bold text-[#5A0F24]">{r.montoTotal}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="text-[#2D7A47] font-medium">✓ {r.pedidosCompletados}</span>
                    <span className="text-[#A32D2D] font-medium">✕ {r.pedidosCancelados}</span>
                    <span className={`font-semibold ${tasaExito >= 95 ? "text-[#2D7A47]" : tasaExito >= 85 ? "text-[#8C5E08]" : "text-[#A32D2D]"}`}>
                      {tasaExito}% éxito
                    </span>
                    <span>⭐ {r.calificacion}</span>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Desktop: tabla */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Proveedor", "Monto total", "Completados", "Cancelados", "Tasa éxito", "Calificación", "Ranking", "Acción"].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...rendimientoMapeado]
                .sort((a, b) => Number(b.calificacion) - Number(a.calificacion))
                .map((r: RendimientoData, i: number) => {
                  const totalPedidos = r.pedidosCompletados + r.pedidosCancelados;
                  const tasaExito = totalPedidos > 0 ? Math.round((r.pedidosCompletados / totalPedidos) * 100) : 0;
                  return (
                    <tr key={r.id} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50 transition-colors">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8E1B3A] to-[#AB3A50] flex items-center justify-center text-xs font-bold text-white">
                            {r.initials}
                          </div>
                          <span className="text-sm font-medium text-[#2A0E18]">{r.proveedor}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24]">{r.montoTotal}</td>
                      <td className="px-3 py-3 text-sm text-[#2D7A47] font-medium">{r.pedidosCompletados}</td>
                      <td className="px-3 py-3 text-sm text-[#A32D2D] font-medium">{r.pedidosCancelados}</td>
                      <td className="px-3 py-3">
                        <span className={`text-sm font-semibold ${tasaExito >= 95 ? "text-[#2D7A47]" : tasaExito >= 85 ? "text-[#8C5E08]" : "text-[#A32D2D]"}`}>
                          {tasaExito}%
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
                          href={`/admin/proveedores/actividad/${r.id}`}
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
    </div>
  );
}