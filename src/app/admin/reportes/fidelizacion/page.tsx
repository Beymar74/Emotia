import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";

export default async function ReporteFidelizacionPage() {
  const [pedidosDB, usuariosDB] = await Promise.all([
    prisma.pedidos.findMany({
      select: { id: true, usuario_id: true, total: true, estado: true, created_at: true },
      orderBy: { created_at: 'asc' },
    }),
    prisma.usuarios.findMany({
      where: { tipo: 'usuario', activo: true },
      select: { id: true, nombre: true, email: true, created_at: true },
    }),
  ]);

  const formatBs = (n: number) => `Bs ${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  // Frecuencia de compra por cliente
  type ClienteFreq = { id: number; nombre: string; email: string; pedidos: number; total: number; entregados: number };
  const frecMap: Record<number, ClienteFreq> = {};
  usuariosDB.forEach((u: any) => {
    frecMap[u.id] = { id: u.id, nombre: u.nombre, email: u.email, pedidos: 0, total: 0, entregados: 0 };
  });
  pedidosDB.forEach((p: any) => {
    if (!p.usuario_id || !frecMap[p.usuario_id]) return;
    frecMap[p.usuario_id].pedidos += 1;
    frecMap[p.usuario_id].total += Number(p.total || 0);
    if (p.estado === 'entregado') frecMap[p.usuario_id].entregados += 1;
  });

  const clientes = Object.values(frecMap).filter(c => c.pedidos > 0);
  const clientesUnaVez = clientes.filter(c => c.pedidos === 1).length;
  const clientesRecurrentes = clientes.filter(c => c.pedidos >= 2).length;
  const clientesLeales = clientes.filter(c => c.pedidos >= 5).length;

  const tasaRetencion = clientes.length > 0 ? Math.round((clientesRecurrentes / clientes.length) * 100) : 0;

  // Top clientes recurrentes
  const topRecurrentes = [...clientes]
    .sort((a, b) => b.pedidos - a.pedidos)
    .slice(0, 8);

  // Segmentación RFM simplificada
  const segmentos = [
    { nombre: "Compradores leales", descripcion: "5+ pedidos", count: clientesLeales, color: "#2D7A47", bg: "bg-[#EEF8F0]" },
    { nombre: "Compradores frecuentes", descripcion: "2-4 pedidos", count: clientesRecurrentes - clientesLeales, color: "#BC9968", bg: "bg-[#FAF3EC]" },
    { nombre: "Primera compra", descripcion: "1 pedido", count: clientesUnaVez, color: "#185FA5", bg: "bg-[#EEF3FB]" },
    { nombre: "Sin compras", descripcion: "Registrados sin pedidos", count: usuariosDB.length - clientes.length, color: "#A32D2D", bg: "bg-[#FBF0F0]" },
  ];
  const totalSegmento = usuariosDB.length;

  // Evolución mensual de clientes activos
  const ahora = new Date();
  type MesData = { mes: string; nuevos: number; recurrentes: number };
  const mesesMap: Record<string, MesData> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = new Intl.DateTimeFormat('es-BO', { month: 'short', year: 'numeric' }).format(d);
    mesesMap[key] = { mes: label, nuevos: 0, recurrentes: 0 };
  }

  const primeraCompra: Record<number, string> = {};
  [...pedidosDB].sort((a: any, b: any) => a.created_at - b.created_at).forEach((p: any) => {
    if (!p.usuario_id) return;
    if (!primeraCompra[p.usuario_id]) {
      primeraCompra[p.usuario_id] = `${p.created_at.getFullYear()}-${String(p.created_at.getMonth() + 1).padStart(2, '0')}`;
    }
  });
  pedidosDB.forEach((p: any) => {
    if (!p.usuario_id) return;
    const key = `${p.created_at.getFullYear()}-${String(p.created_at.getMonth() + 1).padStart(2, '0')}`;
    if (!mesesMap[key]) return;
    if (primeraCompra[p.usuario_id] === key) {
      mesesMap[key].nuevos += 1;
    } else {
      mesesMap[key].recurrentes += 1;
    }
  });
  const evolucion = Object.values(mesesMap);
  const maxEv = Math.max(...evolucion.map(m => m.nuevos + m.recurrentes), 1);

  const config = {
    filename: "reporte-fidelizacion",
    titulo: "Reporte de Fidelización — Emotia",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Clientes con compras", valor: String(clientes.length), color: "#8E1B3A" },
      { label: "Compradores recurrentes", valor: String(clientesRecurrentes), color: "#2D7A47" },
      { label: "Clientes leales (5+)", valor: String(clientesLeales), color: "#BC9968" },
      { label: "Tasa de retención", valor: `${tasaRetencion}%`, color: "#AB3A50" },
    ],
    graficos: [
      { tipo: "dona" as const, titulo: "Segmentación RFM", datos: [
        { nombre: "Leales (5+ pedidos)", valor: clientesLeales, color: "#2D7A47" },
        { nombre: "Frecuentes (2-4)", valor: clientesRecurrentes - clientesLeales, color: "#BC9968" },
        { nombre: "Primera compra", valor: clientesUnaVez, color: "#185FA5" },
        { nombre: "Sin compras", valor: usuariosDB.length - clientes.length, color: "#A32D2D" },
      ]},
      { tipo: "barras" as const, titulo: "Actividad mensual (compradores)", datos: evolucion.map((m) => ({ nombre: m.mes, valor: m.nuevos + m.recurrentes })), color: "#8E1B3A" },
    ],
    tablas: [
      {
        nombre: "Segmentación",
        columnas: ["Segmento", "Descripción", "Cantidad"],
        filas: segmentos.map((s) => [s.nombre, s.descripcion, s.count]),
      },
      {
        nombre: "Clientes recurrentes",
        columnas: ["Cliente", "Email", "Total pedidos", "Entregados", "Gasto total (Bs)", "Ticket promedio (Bs)", "Perfil"],
        filas: topRecurrentes.map((c) => {
          const ticket = c.pedidos > 0 ? Math.round(c.total / c.pedidos) : 0;
          const perfil = c.pedidos >= 5 ? "Leal" : c.pedidos >= 2 ? "Frecuente" : "Nuevo";
          return [c.nombre, c.email, c.pedidos, c.entregados, c.total, ticket, perfil];
        }),
      },
      {
        nombre: "Evolución mensual",
        columnas: ["Período", "Nuevos compradores", "Recurrentes", "Total"],
        filas: evolucion.map((m) => [m.mes, m.nuevos, m.recurrentes, m.nuevos + m.recurrentes]),
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
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte de Fidelización</h1>
          </div>
        </div>
        <DescargarReporteBtn config={config} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Clientes con compras", valor: String(clientes.length), color: "#8E1B3A" },
          { label: "Compradores recurrentes", valor: String(clientesRecurrentes), color: "#2D7A47" },
          { label: "Clientes leales (5+)", valor: String(clientesLeales), color: "#BC9968" },
          { label: "Tasa de retención", valor: `${tasaRetencion}%`, color: "#AB3A50" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: k.color }} />
            <p className="font-serif text-3xl font-bold text-[#5A0F24]">{k.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Segmentación */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Segmentación de clientes</h3>
          <div className="space-y-3">
            {segmentos.map((s) => {
              const pct = totalSegmento > 0 ? Math.round((s.count / totalSegmento) * 100) : 0;
              return (
                <div key={s.nombre} className={`p-4 rounded-xl ${s.bg}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-[#2A0E18] text-sm">{s.nombre}</p>
                      <p className="text-xs text-[#7A5260]">{s.descripcion}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-2xl font-bold" style={{ color: s.color }}>{s.count}</p>
                      <p className="text-xs text-[#7A5260]">{pct}%</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: s.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Evolución mensual */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Compras por mes (nuevos vs recurrentes)</h3>
          <div className="space-y-3">
            {evolucion.map((m) => {
              const total = m.nuevos + m.recurrentes;
              const barPct = Math.round((total / maxEv) * 100);
              const recPct = total > 0 ? Math.round((m.recurrentes / total) * 100) : 0;
              return (
                <div key={m.mes}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-[#2A0E18] capitalize">{m.mes}</span>
                    <div className="flex gap-3 text-[#7A5260]">
                      <span className="text-[#2D7A47]">↺ {m.recurrentes}</span>
                      <span className="text-[#185FA5]">★ {m.nuevos}</span>
                      <span className="font-semibold text-[#5A0F24]">{total} total</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-[#8E1B3A]/8 rounded-full overflow-hidden flex">
                    <div className="h-full rounded-l-full" style={{ width: `${Math.round((m.recurrentes / maxEv) * 100)}%`, background: "#2D7A47" }} />
                    <div className="h-full" style={{ width: `${Math.round((m.nuevos / maxEv) * 100)}%`, background: "#185FA5" }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4 text-xs text-[#7A5260]">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#2D7A47] inline-block" /> Recurrentes</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#185FA5] inline-block" /> Primera compra</span>
          </div>
        </div>
      </div>

      {/* Top clientes recurrentes */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 overflow-x-auto">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Clientes más recurrentes</h3>
        {topRecurrentes.length === 0 ? (
          <p className="text-sm text-[#7A5260] text-center py-4">Sin datos de compras.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["#", "Cliente", "Total pedidos", "Entregados", "Gasto total", "Ticket promedio", "Perfil"].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topRecurrentes.map((c, i) => {
                const ticket = c.pedidos > 0 ? c.total / c.pedidos : 0;
                const perfil = c.pedidos >= 5 ? "Leal" : c.pedidos >= 2 ? "Frecuente" : "Nuevo";
                const perfilColor = c.pedidos >= 5 ? "bg-[#EEF8F0] text-[#2D7A47]" : c.pedidos >= 2 ? "bg-[#FAF3EC] text-[#8C5E08]" : "bg-[#EEF3FB] text-[#185FA5]";
                return (
                  <tr key={c.id} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50">
                    <td className="px-3 py-3">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8E1B3A] to-[#BC9968] text-white text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#FAF3EC] flex items-center justify-center text-[#8E1B3A] text-xs font-bold flex-shrink-0">
                          {(c.nombre?.[0] || "C").toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#2A0E18]">{c.nombre}</p>
                          <p className="text-[10px] text-[#7A5260]">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm font-bold text-[#5A0F24]">{c.pedidos}</td>
                    <td className="px-3 py-3 text-sm text-[#2D7A47] font-medium">{c.entregados}</td>
                    <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24]">{formatBs(c.total)}</td>
                    <td className="px-3 py-3 text-sm text-[#7A5260]">{formatBs(ticket)}</td>
                    <td className="px-3 py-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${perfilColor}`}>
                        {perfil}
                      </span>
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
