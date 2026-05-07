import Link from "next/link";
import prisma from "@/lib/prisma";
import ExportarPDFButton from "../_components/ExportarPDFButton";

export default async function ReporteVentasPage() {
  const [pedidosDB, proveedoresDB, detallesDB] = await Promise.all([
    prisma.pedidos.findMany({
      where: { estado: "entregado" },
      select: { total: true, created_at: true },
      orderBy: { created_at: "asc" },
    }),
    prisma.proveedores.findMany({
      where: { estado: "aprobado" },
      orderBy: { total_vendido: "desc" },
      take: 10,
      include: { _count: { select: { detalle_pedidos: true, productos: true } } },
    }),
    prisma.detalle_pedidos.findMany({
      where: { pedidos: { estado: "entregado" } },
      include: { productos: { include: { categorias: true } } },
    }),
  ]);

  const fmt = (n: number) =>
    `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;

  // ─── Métricas globales ───────────────────────────────────────────────────────
  const totalIngresos = pedidosDB.reduce((s: number, p: any) => s + Number(p.total), 0);
  const totalPedidos  = pedidosDB.length;
  const ticketProm    = totalPedidos > 0 ? totalIngresos / totalPedidos : 0;

  // ─── Evolución mensual (últimos 6 meses) ─────────────────────────────────────
  const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const now   = new Date();
  const mesesData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const mes = pedidosDB.filter((p: any) => {
      const pd = new Date(p.created_at);
      return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth();
    });
    const monto = mes.reduce((s: number, p: any) => s + Number(p.total), 0);
    return { label: `${MESES[d.getMonth()]}`, montoNum: monto, count: mes.length };
  });
  const maxMes = Math.max(...mesesData.map((m) => m.montoNum), 1);
  const mejorMes = [...mesesData].sort((a, b) => b.montoNum - a.montoNum)[0];

  // ─── Top 10 proveedores ──────────────────────────────────────────────────────
  const topProveedores = proveedoresDB.map((p: any) => {
    const ventas = Number(p.total_vendido || 0);
    return {
      nombre:  p.nombre_negocio,
      ventas,
      items:   p._count.detalle_pedidos,
      productos: p._count.productos,
      pct:     totalIngresos > 0 ? Math.min(Math.round((ventas / totalIngresos) * 100), 100) : 0,
    };
  });

  // ─── Top 10 categorías ───────────────────────────────────────────────────────
  const catMap: Record<string, { monto: number; items: number }> = {};
  detallesDB.forEach((d: any) => {
    const cat = d.productos?.categorias?.nombre || "Otros";
    if (!catMap[cat]) catMap[cat] = { monto: 0, items: 0 };
    catMap[cat].monto += Number(d.subtotal || 0);
    catMap[cat].items += Number(d.cantidad || 0);
  });
  const topCategorias = Object.entries(catMap)
    .map(([nombre, v]) => ({
      nombre,
      montoNum: v.monto,
      monto: fmt(v.monto),
      items: v.items,
      pct: totalIngresos > 0 ? Math.round((v.monto / totalIngresos) * 100) : 0,
    }))
    .sort((a, b) => b.montoNum - a.montoNum)
    .slice(0, 10);

  // ─── Ticket promedio por mes ─────────────────────────────────────────────────
  const ticketsConDatos = mesesData.filter((m) => m.count > 0);
  const mejorTicket = ticketsConDatos.length > 0
    ? Math.max(...ticketsConDatos.map((m) => m.montoNum / m.count))
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-[#7A5260] mb-3">
          <Link href="/admin/reportes" className="hover:text-[#8E1B3A] transition-colors">← Reportes</Link>
          <span>/</span>
          <span className="text-[#5A0F24] font-medium">Ventas</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Reporte individual</p>
            <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Ventas</h1>
            <p className="text-sm text-[#7A5260] mt-0.5">Análisis completo de ingresos, proveedores y categorías</p>
          </div>
          <ExportarPDFButton />
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Ingresos totales",   valor: fmt(totalIngresos),  color: "#8E1B3A", sub: "pedidos entregados" },
          { label: "Ticket promedio",    valor: fmt(ticketProm),     color: "#BC9968", sub: `de ${totalPedidos} pedidos` },
          { label: "Mejor mes",          valor: mejorMes?.label ?? "—", color: "#5C3A2E", sub: fmt(mejorMes?.montoNum ?? 0) },
          { label: "Mejor ticket/mes",   valor: fmt(mejorTicket),    color: "#AB3A50", sub: "ticket promedio más alto" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: s.color }} />
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">{s.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{s.label}</p>
            <p className="text-xs text-[#B0B0B0] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Evolución mensual */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-5">Evolución mensual (últimos 6 meses)</h3>
        <div className="flex items-end gap-3 h-40 mb-3">
          {mesesData.map((m) => (
            <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-semibold text-[#5A0F24]">{fmt(m.montoNum)}</span>
              <div className="w-full flex items-end" style={{ height: "100px" }}>
                <div
                  className="w-full rounded-t-md"
                  style={{
                    height: `${Math.max((m.montoNum / maxMes) * 100, 4)}%`,
                    background: "linear-gradient(180deg,#8E1B3A,#BC9968)",
                  }}
                />
              </div>
              <span className="text-xs text-[#7A5260]">{m.count} ped.</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          {mesesData.map((m) => (
            <div key={m.label} className="flex-1 text-center text-xs font-medium text-[#7A5260]">{m.label}</div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 10 proveedores */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Top 10 proveedores por ventas</h3>
          {topProveedores.length === 0 ? (
            <p className="text-sm text-[#7A5260] text-center py-4">Sin datos.</p>
          ) : (
            <div className="space-y-3">
              {topProveedores.map((p, i) => (
                <div key={p.nombre}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#FAF3EC] flex items-center justify-center text-xs font-bold text-[#8E1B3A] flex-shrink-0">{i + 1}</span>
                      <span className="font-medium text-[#2A0E18] truncate">{p.nombre}</span>
                    </div>
                    <div className="flex gap-3 text-[#7A5260] flex-shrink-0 ml-2">
                      <span>{p.items} items</span>
                      <span className="font-semibold text-[#5A0F24]">{fmt(p.ventas)}</span>
                      <span className="font-bold w-8 text-right text-[#8E1B3A]">{p.pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[#8E1B3A]/8 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: i === 0 ? "linear-gradient(90deg,#8E1B3A,#BC9968)" : "linear-gradient(90deg,#BC9968,#D4A96A)" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top 10 categorías */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Top 10 categorías por ingresos</h3>
          {topCategorias.length === 0 ? (
            <p className="text-sm text-[#7A5260] text-center py-4">Sin datos.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {["#", "Categoría", "Ingresos", "Items", "%"].map((h) => (
                      <th key={h} className="text-left px-2 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topCategorias.map((c, i) => (
                    <tr key={c.nombre} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50">
                      <td className="px-2 py-2.5 text-xs text-[#B0B0B0]">{i + 1}</td>
                      <td className="px-2 py-2.5 text-sm font-medium text-[#2A0E18]">{c.nombre}</td>
                      <td className="px-2 py-2.5 text-sm font-semibold text-[#5A0F24]">{c.monto}</td>
                      <td className="px-2 py-2.5 text-sm text-[#7A5260]">{c.items}</td>
                      <td className="px-2 py-2.5 text-sm font-bold text-[#8E1B3A]">{c.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
