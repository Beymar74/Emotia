import Link from "next/link";
import prisma from "@/lib/prisma";
import ExportarPDFButton from "../_components/ExportarPDFButton";

export default async function ReporteClientesPage() {
  const [pedidosDB, usuariosDB, recomTotal, recomConvertidas, metodosPagoRaw] = await Promise.all([
    prisma.pedidos.findMany({
      where: { estado: "entregado" },
      select: {
        usuario_id: true, total: true, created_at: true,
        usuarios: { select: { nombre: true, apellido: true, plan: true } },
      },
    }),
    prisma.usuarios.findMany({
      select: { created_at: true, plan: true, activo: true },
    }),
    prisma.recomendaciones.count(),
    prisma.recomendaciones.count({ where: { convertida_en_compra: true } }),
    prisma.pedidos.findMany({
      where: { estado: "entregado", metodo_pago: { not: null } },
      select: { metodo_pago: true, total: true },
    }),
  ]);

  const fmt = (n: number) =>
    `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;

  const totalUsuarios  = usuariosDB.length;
  const tasaConvIA     = recomTotal > 0 ? Math.round((recomConvertidas / recomTotal) * 100) : 0;

  // ─── Nuevos este mes ─────────────────────────────────────────────────────────
  const now = new Date();
  const nuevosEsteMes = usuariosDB.filter((u: any) => {
    const d = new Date(u.created_at);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  // ─── Top 10 clientes ─────────────────────────────────────────────────────────
  const clientesMap: Record<number, { nombre: string; pedidos: number; total: number; plan: string }> = {};
  pedidosDB.forEach((p: any) => {
    const id = p.usuario_id;
    if (!clientesMap[id])
      clientesMap[id] = {
        nombre: `${p.usuarios?.nombre ?? ""} ${p.usuarios?.apellido ?? ""}`.trim() || `Usuario #${id}`,
        pedidos: 0, total: 0,
        plan: p.usuarios?.plan ?? "basico",
      };
    clientesMap[id].pedidos++;
    clientesMap[id].total += Number(p.total);
  });
  const topClientes = Object.values(clientesMap).sort((a, b) => b.total - a.total).slice(0, 10);
  const topClientePedidos = [...Object.values(clientesMap)].sort((a, b) => b.pedidos - a.pedidos)[0];

  // ─── Crecimiento (últimos 6 meses) ───────────────────────────────────────────
  const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const mesesData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const count = usuariosDB.filter((u: any) => {
      const ud = new Date(u.created_at);
      return ud.getFullYear() === d.getFullYear() && ud.getMonth() === d.getMonth();
    }).length;
    return { label: MESES[d.getMonth()], count };
  });
  const maxMes = Math.max(...mesesData.map((m) => m.count), 1);

  // ─── Usuarios por plan ───────────────────────────────────────────────────────
  const planMap: Record<string, number> = {};
  usuariosDB.forEach((u: any) => {
    const p = u.plan ?? "basico";
    planMap[p] = (planMap[p] || 0) + 1;
  });
  const planColors: Record<string, string> = { basico: "#BC9968", premium: "#8B5CF6" };
  const planesData = Object.entries(planMap)
    .map(([plan, count]) => ({
      plan: plan.charAt(0).toUpperCase() + plan.slice(1),
      count,
      pct: totalUsuarios > 0 ? Math.round((count / totalUsuarios) * 100) : 0,
      color: planColors[plan] ?? "#8E1B3A",
    }))
    .sort((a, b) => b.count - a.count);

  // ─── Métodos de pago ─────────────────────────────────────────────────────────
  const metodoColores: Record<string, string> = {
    qr: "#3B82F6", efectivo: "#22C55E", transferencia: "#8B5CF6", tarjeta: "#F59E0B",
  };
  const metodosMap: Record<string, { count: number; total: number }> = {};
  metodosPagoRaw.forEach((p: any) => {
    const m = (p.metodo_pago ?? "otro").toLowerCase();
    if (!metodosMap[m]) metodosMap[m] = { count: 0, total: 0 };
    metodosMap[m].count++;
    metodosMap[m].total += Number(p.total);
  });
  const totalPagados = metodosPagoRaw.length;
  const metodosPago = Object.entries(metodosMap)
    .map(([m, d]) => ({
      metodo: m.charAt(0).toUpperCase() + m.slice(1),
      count: d.count,
      total: fmt(d.total),
      pct: totalPagados > 0 ? Math.round((d.count / totalPagados) * 100) : 0,
      color: metodoColores[m] ?? "#BC9968",
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-[#7A5260] mb-3">
          <Link href="/admin/reportes" className="hover:text-[#8E1B3A] transition-colors">← Reportes</Link>
          <span>/</span>
          <span className="text-[#5A0F24] font-medium">Clientes</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Reporte individual</p>
            <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Clientes</h1>
            <p className="text-sm text-[#7A5260] mt-0.5">Frecuencia, crecimiento, planes, métodos de pago e IA Emotia</p>
          </div>
          <ExportarPDFButton />
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Usuarios registrados", valor: String(totalUsuarios),   color: "#8E1B3A", sub: "total en la plataforma" },
          { label: "Nuevos este mes",       valor: String(nuevosEsteMes),   color: "#22C55E", sub: "registros en el período" },
          { label: "Cliente top (gasto)",   valor: topClientes[0]?.nombre ?? "—", color: "#BC9968", sub: topClientes[0] ? fmt(topClientes[0].total) : "sin datos" },
          { label: "Conversión IA Emotia",  valor: `${tasaConvIA}%`,        color: "#AB3A50", sub: `${recomConvertidas} de ${recomTotal}` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: s.color }} />
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24] truncate">{s.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{s.label}</p>
            <p className="text-xs text-[#B0B0B0] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Top 10 clientes por gasto */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Top 10 clientes por gasto total</h3>
        {topClientes.length === 0 ? (
          <p className="text-sm text-[#7A5260] text-center py-4">Sin datos.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["#", "Cliente", "Plan", "Pedidos", "Total gastado"].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topClientes.map((c, i) => (
                  <tr key={c.nombre} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50">
                    <td className="px-3 py-3">
                      <span className="w-6 h-6 rounded-full bg-[#FAF3EC] flex items-center justify-center text-xs font-bold text-[#8E1B3A]">{i + 1}</span>
                    </td>
                    <td className="px-3 py-3 text-sm font-medium text-[#2A0E18]">{c.nombre}</td>
                    <td className="px-3 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: planColors[c.plan] ? `${planColors[c.plan]}18` : "#FAF3EC", color: planColors[c.plan] ?? "#7A5260" }}>
                        {c.plan.charAt(0).toUpperCase() + c.plan.slice(1)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-[#7A5260]">{c.pedidos}</td>
                    <td className="px-3 py-3 text-sm font-bold text-[#5A0F24]">{fmt(c.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Crecimiento mensual */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Crecimiento últimos 6 meses</h3>
            <span className="text-xs bg-[#FAF3EC] text-[#7A5260] px-2.5 py-1 rounded-full font-medium">{totalUsuarios} totales</span>
          </div>
          <div className="flex items-end gap-2 h-32 mb-3">
            {mesesData.map((m) => (
              <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-semibold text-[#5A0F24]">{m.count}</span>
                <div className="w-full flex items-end" style={{ height: "84px" }}>
                  <div className="w-full rounded-t-md"
                    style={{ height: `${Math.max((m.count / maxMes) * 100, 4)}%`, background: "linear-gradient(180deg,#8E1B3A,#BC9968)" }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {mesesData.map((m) => (
              <div key={m.label} className="flex-1 text-center text-xs text-[#7A5260]">{m.label}</div>
            ))}
          </div>
        </div>

        {/* Usuarios por plan */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Usuarios por plan</h3>
          <div className="space-y-4">
            {planesData.map((p) => (
              <div key={p.plan}>
                <div className="flex justify-between items-center mb-1.5 text-sm">
                  <span className="font-medium text-[#2A0E18]">{p.plan}</span>
                  <div className="flex gap-3">
                    <span className="text-[#7A5260]">{p.count} usuarios</span>
                    <span className="font-bold w-8 text-right" style={{ color: p.color }}>{p.pct}%</span>
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {planesData.map((p) => (
              <div key={p.plan} className="rounded-lg p-3 text-center border"
                style={{ borderColor: `${p.color}30`, background: `${p.color}08` }}>
                <p className="font-serif text-2xl font-bold" style={{ color: p.color }}>{p.count}</p>
                <p className="text-xs text-[#7A5260]">{p.plan}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Métodos de pago */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Métodos de pago preferidos</h3>
          {metodosPago.length === 0 ? (
            <p className="text-sm text-[#7A5260] text-center py-4">Sin datos de métodos de pago.</p>
          ) : (
            <div className="space-y-3">
              {metodosPago.map((m) => (
                <div key={m.metodo}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: m.color }} />
                      <span className="font-medium text-[#2A0E18]">{m.metodo}</span>
                    </div>
                    <div className="flex gap-3 text-[#7A5260]">
                      <span>{m.count} pedidos</span>
                      <span className="font-semibold text-[#5A0F24]">{m.total}</span>
                      <span className="font-bold w-8 text-right" style={{ color: m.color }}>{m.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* IA Emotia conversión */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-1">IA Emotia — Embudo de conversión</h3>
          <p className="text-xs text-[#7A5260] mb-5">Recomendaciones generadas → compras reales</p>
          <div className="flex items-end gap-6 mb-5">
            <div>
              <p className="font-serif text-5xl font-bold text-[#8E1B3A]">{tasaConvIA}%</p>
              <p className="text-xs text-[#7A5260] mt-1">tasa de conversión</p>
            </div>
            <div className="space-y-1 pb-1">
              <p className="text-sm text-[#7A5260]"><span className="font-semibold text-[#2A0E18]">{recomTotal}</span> recomendaciones</p>
              <p className="text-sm text-[#7A5260]"><span className="font-semibold text-[#22C55E]">{recomConvertidas}</span> convertidas</p>
              <p className="text-sm text-[#7A5260]"><span className="font-semibold text-[#EF4444]">{recomTotal - recomConvertidas}</span> sin conversión</p>
            </div>
          </div>
          <div className="h-3 bg-[#8E1B3A]/8 rounded-full overflow-hidden mb-4">
            <div className="h-full rounded-full" style={{ width: `${tasaConvIA}%`, background: "linear-gradient(90deg,#8E1B3A,#BC9968)" }} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#FAF3EC] rounded-lg p-3 text-center">
              <p className="font-serif text-xl font-bold text-[#8E1B3A]">{recomTotal}</p>
              <p className="text-xs text-[#7A5260]">Generadas</p>
            </div>
            <div className="bg-[#F0FAF4] rounded-lg p-3 text-center">
              <p className="font-serif text-xl font-bold text-[#22C55E]">{recomConvertidas}</p>
              <p className="text-xs text-[#7A5260]">Convertidas</p>
            </div>
            <div className="bg-[#FEF2F2] rounded-lg p-3 text-center">
              <p className="font-serif text-xl font-bold text-[#EF4444]">{recomTotal - recomConvertidas}</p>
              <p className="text-xs text-[#7A5260]">Perdidas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
