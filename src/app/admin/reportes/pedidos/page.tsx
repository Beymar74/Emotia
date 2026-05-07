import Link from "next/link";
import prisma from "@/lib/prisma";
import ExportarPDFButton from "../_components/ExportarPDFButton";
import { Gift, Mail } from "lucide-react";

export default async function ReportePedidosPage() {
  const [todosPedidos, detallesDB] = await Promise.all([
    prisma.pedidos.findMany({
      select: { estado: true, total: true, created_at: true, metodo_pago: true },
    }),
    prisma.detalle_pedidos.findMany({
      where: { pedidos: { estado: "entregado" } },
      include: { productos: { select: { nombre: true } } },
    }),
  ]);

  const fmt = (n: number) =>
    `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;

  // ─── Conteos por estado ──────────────────────────────────────────────────────
  const estadosConfig: Record<string, { label: string; color: string }> = {
    pendiente:  { label: "Pendiente",  color: "#F59E0B" },
    pagado:     { label: "Pagado",     color: "#3B82F6" },
    preparando: { label: "Preparando", color: "#8B5CF6" },
    enviado:    { label: "Enviado",    color: "#06B6D4" },
    entregado:  { label: "Entregado",  color: "#22C55E" },
    cancelado:  { label: "Cancelado",  color: "#EF4444" },
  };
  const estadoMap: Record<string, { count: number; monto: number }> = {};
  todosPedidos.forEach((p: any) => {
    if (!estadoMap[p.estado]) estadoMap[p.estado] = { count: 0, monto: 0 };
    estadoMap[p.estado].count++;
    estadoMap[p.estado].monto += Number(p.total);
  });
  const totalPedidos     = todosPedidos.length;
  const totalEntregados  = estadoMap["entregado"]?.count ?? 0;
  const totalPendientes  = estadoMap["pendiente"]?.count ?? 0;
  const totalCancelados  = estadoMap["cancelado"]?.count ?? 0;
  const estadosLista = Object.entries(estadoMap)
    .map(([e, d]) => ({
      label:  estadosConfig[e]?.label ?? e,
      color:  estadosConfig[e]?.color ?? "#8E1B3A",
      count:  d.count,
      monto:  fmt(d.monto),
      pct:    totalPedidos > 0 ? Math.round((d.count / totalPedidos) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // ─── Top 10 productos ────────────────────────────────────────────────────────
  const prodMap: Record<number, { nombre: string; unidades: number; ingresos: number }> = {};
  detallesDB.forEach((d: any) => {
    const id = d.producto_id;
    if (!prodMap[id]) prodMap[id] = { nombre: d.productos?.nombre ?? `#${id}`, unidades: 0, ingresos: 0 };
    prodMap[id].unidades += Number(d.cantidad);
    prodMap[id].ingresos += Number(d.subtotal || 0);
  });
  const topProductos = Object.values(prodMap).sort((a, b) => b.unidades - a.unidades).slice(0, 10);
  const maxUnd = Math.max(...topProductos.map((p) => p.unidades), 1);

  // ─── Día de semana ───────────────────────────────────────────────────────────
  const diasLabels = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const diaMap = Array.from({ length: 7 }, (_, i) => ({ dia: diasLabels[i], corto: diasLabels[i].slice(0,3), count: 0 }));
  todosPedidos.forEach((p: any) => { diaMap[new Date(p.created_at).getDay()].count++; });
  const maxDia      = Math.max(...diaMap.map((d) => d.count), 1);
  const mejorDia    = [...diaMap].sort((a, b) => b.count - a.count)[0];

  // ─── Personalización ────────────────────────────────────────────────────────
  const totalItems    = detallesDB.length;
  const totalEmpaques = detallesDB.filter((d: any) => d.empaque_especial).length;
  const totalMensajes = detallesDB.filter((d: any) => d.mensaje_personal).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-[#7A5260] mb-3">
          <Link href="/admin/reportes" className="hover:text-[#8E1B3A] transition-colors">← Reportes</Link>
          <span>/</span>
          <span className="text-[#5A0F24] font-medium">Pedidos</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Reporte individual</p>
            <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Pedidos</h1>
            <p className="text-sm text-[#7A5260] mt-0.5">Estado, productos más vendidos, temporalidad y personalización</p>
          </div>
          <ExportarPDFButton />
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total pedidos",    valor: String(totalPedidos),   color: "#8E1B3A", sub: "histórico completo" },
          { label: "Entregados",       valor: String(totalEntregados), color: "#22C55E", sub: `${totalPedidos > 0 ? Math.round((totalEntregados / totalPedidos) * 100) : 0}% del total` },
          { label: "Pendientes",       valor: String(totalPendientes), color: "#F59E0B", sub: "en espera de atención" },
          { label: "Cancelados",       valor: String(totalCancelados), color: "#EF4444", sub: `${totalPedidos > 0 ? Math.round((totalCancelados / totalPedidos) * 100) : 0}% del total` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: s.color }} />
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#5A0F24]">{s.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{s.label}</p>
            <p className="text-xs text-[#B0B0B0] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Estado de pedidos con montos */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Distribución por estado</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Estado", "Pedidos", "Monto total", "%"].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {estadosLista.map((e) => (
                  <tr key={e.label} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: e.color }} />
                        <span className="text-sm font-medium text-[#2A0E18]">{e.label}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-[#7A5260]">{e.count}</td>
                    <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24]">{e.monto}</td>
                    <td className="px-3 py-3 text-sm font-bold" style={{ color: e.color }}>{e.pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Día de semana */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Pedidos por día de semana</h3>
            <span className="text-xs bg-[#FAF3EC] text-[#7A5260] px-2.5 py-1 rounded-full font-medium">Pico: {mejorDia?.dia}</span>
          </div>
          <div className="flex items-end gap-2 h-32 mb-3">
            {diaMap.map((d) => (
              <div key={d.dia} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-semibold text-[#5A0F24]">{d.count}</span>
                <div className="w-full flex items-end" style={{ height: "84px" }}>
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${Math.max((d.count / maxDia) * 100, 4)}%`,
                      background: d.dia === mejorDia?.dia
                        ? "linear-gradient(180deg,#8E1B3A,#BC9968)"
                        : "linear-gradient(180deg,#BC9968,#D4A96A)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {diaMap.map((d) => (
              <div key={d.dia} className="flex-1 text-center text-xs text-[#7A5260]">{d.corto}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 10 productos */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Top 10 productos más vendidos</h3>
        {topProductos.length === 0 ? (
          <p className="text-sm text-[#7A5260] text-center py-4">Sin ventas registradas.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {topProductos.map((p, i) => (
              <div key={p.nombre} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#FAF3EC] flex items-center justify-center text-xs font-bold text-[#8E1B3A] flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-[#2A0E18] truncate" title={p.nombre}>{p.nombre}</span>
                    <span className="text-[#7A5260] ml-2 flex-shrink-0">{p.unidades} uds</span>
                  </div>
                  <div className="h-1.5 bg-[#8E1B3A]/8 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      width: `${Math.round((p.unidades / maxUnd) * 100)}%`,
                      background: i < 3 ? "linear-gradient(90deg,#8E1B3A,#BC9968)" : "linear-gradient(90deg,#BC9968,#D4A96A)",
                    }} />
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#5A0F24] flex-shrink-0">{fmt(p.ingresos)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Personalización */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-1">Personalización de pedidos</h3>
        <p className="text-xs text-[#7A5260] mb-5">Sobre {totalItems} items en pedidos entregados</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { icono: <Gift className="w-5 h-5" />, label: "Empaque especial", count: totalEmpaques, color: "#8E1B3A" },
            { icono: <Mail className="w-5 h-5" />, label: "Mensaje personal",  count: totalMensajes, color: "#BC9968" },
          ].map((item) => {
            const pct = totalItems > 0 ? Math.round((item.count / totalItems) * 100) : 0;
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span style={{ color: item.color }}>{item.icono}</span>
                    <span className="text-sm font-medium text-[#2A0E18]">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#7A5260]">{item.count} items</span>
                    <span className="font-bold text-sm" style={{ color: item.color }}>{pct}%</span>
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: item.color }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: "Empaques especiales", valor: totalEmpaques, color: "#8E1B3A" },
            { label: "Mensajes personales", valor: totalMensajes, color: "#BC9968" },
            { label: "Total personalizados", valor: totalEmpaques + totalMensajes, color: "#5A0F24" },
          ].map((s) => (
            <div key={s.label} className="bg-[#FAF3EC] rounded-lg p-3 text-center">
              <p className="font-serif text-2xl font-bold" style={{ color: s.color }}>{s.valor}</p>
              <p className="text-xs text-[#7A5260] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
