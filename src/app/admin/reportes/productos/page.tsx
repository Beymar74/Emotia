import Link from "next/link";
import prisma from "@/lib/prisma";
import ExportarPDFButton from "../_components/ExportarPDFButton";
import { CheckCircle2, User, Sparkles } from "lucide-react";

export default async function ReporteProductosPage() {
  const [productosActivos, stockCriticoRaw, detallesDB] = await Promise.all([
    prisma.productos.count({ where: { activo: true } }),
    prisma.productos.findMany({
      where: { activo: true, stock: { lte: 10 } },
      select: {
        id: true, nombre: true, stock: true,
        categorias: { select: { nombre: true } },
        proveedores: { select: { nombre_negocio: true } },
      },
      orderBy: { stock: "asc" },
    }),
    prisma.detalle_pedidos.findMany({
      where: { pedidos: { estado: "entregado" } },
      include: { productos: { include: { categorias: true } } },
    }),
  ]);

  const fmt = (n: number) =>
    `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;

  // ─── Stock ───────────────────────────────────────────────────────────────────
  const stockCritico = stockCriticoRaw.map((p: any) => ({
    nombre:    p.nombre,
    stock:     p.stock,
    categoria: p.categorias?.nombre ?? "Sin categoría",
    proveedor: p.proveedores?.nombre_negocio ?? "—",
    nivel:     p.stock === 0 ? "agotado" : p.stock <= 3 ? "critico" : "bajo",
  }));
  const agotados = stockCritico.filter((p) => p.nivel === "agotado").length;
  const criticos = stockCritico.filter((p) => p.nivel === "critico").length;
  const bajos    = stockCritico.filter((p) => p.nivel === "bajo").length;

  // ─── Top 10 productos ────────────────────────────────────────────────────────
  const prodMap: Record<number, { nombre: string; unidades: number; ingresos: number; categoria: string }> = {};
  detallesDB.forEach((d: any) => {
    const id = d.producto_id;
    if (!prodMap[id])
      prodMap[id] = {
        nombre:    d.productos?.nombre ?? `#${id}`,
        unidades:  0,
        ingresos:  0,
        categoria: d.productos?.categorias?.nombre ?? "Otros",
      };
    prodMap[id].unidades += Number(d.cantidad);
    prodMap[id].ingresos += Number(d.subtotal || 0);
  });
  const topProductos = Object.values(prodMap).sort((a, b) => b.unidades - a.unidades).slice(0, 10);
  const maxUnd = Math.max(...topProductos.map((p) => p.unidades), 1);

  // ─── Productos sin ventas ─────────────────────────────────────────────────────
  const productosConVentas = new Set(Object.keys(prodMap).map(Number));
  // Note: we'd need all active product IDs to compute this precisely; use count as proxy
  const sinVentasNote = productosActivos - productosConVentas.size;

  // ─── Ventas por ocasión ───────────────────────────────────────────────────────
  const ocasionesMap: Record<string, number> = {};
  detallesDB.forEach((d: any) => {
    const ocs: string[] = d.productos?.ocasiones ?? [];
    ocs.forEach((oc) => { ocasionesMap[oc] = (ocasionesMap[oc] || 0) + Number(d.cantidad); });
  });
  const topOcasiones = Object.entries(ocasionesMap)
    .map(([oc, count]) => ({ oc, count }))
    .sort((a, b) => b.count - a.count);
  const maxOc = Math.max(...topOcasiones.map((o) => o.count), 1);

  // ─── Género destinatario ─────────────────────────────────────────────────────
  const generoMap: Record<string, number> = {};
  detallesDB.forEach((d: any) => {
    const g = d.productos?.genero_destinatario ?? "cualquiera";
    generoMap[g] = (generoMap[g] || 0) + Number(d.cantidad);
  });
  const generoConfig: Record<string, { label: string; color: string; icono: any }> = {
    masculino:  { label: "Masculino",  color: "#3B82F6", icono: <User className="w-5 h-5" /> },
    femenino:   { label: "Femenino",   color: "#EC4899", icono: <User className="w-5 h-5" /> },
    cualquiera: { label: "Universal",  color: "#BC9968", icono: <Sparkles className="w-5 h-5" /> },
  };
  const totalGenero = Object.values(generoMap).reduce((s, v) => s + v, 0);
  const generoData = Object.entries(generoMap)
    .map(([g, count]) => ({
      label: generoConfig[g]?.label ?? g,
      color: generoConfig[g]?.color ?? "#8E1B3A",
      icono: generoConfig[g]?.icono ?? "?",
      count,
      pct: totalGenero > 0 ? Math.round((count / totalGenero) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-[#7A5260] mb-3">
          <Link href="/admin/reportes" className="hover:text-[#8E1B3A] transition-colors">← Reportes</Link>
          <span>/</span>
          <span className="text-[#5A0F24] font-medium">Productos & Inventario</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Reporte individual</p>
            <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Productos & Inventario</h1>
            <p className="text-sm text-[#7A5260] mt-0.5">Stock crítico, mejores productos, ocasiones y análisis de mercado</p>
          </div>
          <ExportarPDFButton />
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Productos activos",   valor: String(productosActivos),              color: "#8E1B3A", sub: "en catálogo" },
          { label: "Agotados",            valor: String(agotados),                       color: "#EF4444", sub: "sin stock disponible" },
          { label: "Stock crítico (≤3)",  valor: String(criticos),                       color: "#F97316", sub: "menos de 3 unidades" },
          { label: "Sin ventas (SKUs)",   valor: sinVentasNote > 0 ? String(sinVentasNote) : "0", color: "#BC9968", sub: "productos inactivos" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: s.color }} />
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#5A0F24]">{s.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{s.label}</p>
            <p className="text-xs text-[#B0B0B0] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Stock crítico completo */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Inventario en alerta</h3>
          <div className="flex gap-2">
            {[
              { label: `${agotados} agotados`,  color: "#EF4444" },
              { label: `${criticos} críticos`,  color: "#F97316" },
              { label: `${bajos} bajo stock`,   color: "#EAB308" },
            ].map((b) => (
              <span key={b.label} className="text-xs font-medium px-2 py-1 rounded-full"
                style={{ background: `${b.color}15`, color: b.color }}>{b.label}</span>
            ))}
          </div>
        </div>
        {stockCritico.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-[#22C55E] mb-2" />
            <p className="text-sm font-semibold text-[#22C55E]">Inventario saludable</p>
            <p className="text-xs text-[#7A5260] mt-1">Todos los productos tienen stock suficiente</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {stockCritico.map((p) => {
              const bg    = p.nivel === "agotado" ? "#FEF2F2" : p.nivel === "critico" ? "#FFF7ED" : "#FEFCE8";
              const color = p.nivel === "agotado" ? "#EF4444" : p.nivel === "critico" ? "#F97316" : "#EAB308";
              return (
                <div key={p.nombre} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: bg }}>
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2A0E18] truncate">{p.nombre}</p>
                    <p className="text-xs text-[#7A5260]">{p.categoria} · {p.proveedor}</p>
                  </div>
                  <span className="text-sm font-bold flex-shrink-0" style={{ color }}>
                    {p.stock === 0 ? "Agotado" : `${p.stock} uds`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
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
                  <div className="flex justify-between text-sm mb-0.5">
                    <span className="font-medium text-[#2A0E18] truncate" title={p.nombre}>{p.nombre}</span>
                    <span className="text-[#7A5260] ml-2 flex-shrink-0">{p.unidades} uds</span>
                  </div>
                  <p className="text-xs text-[#B0B0B0] mb-1">{p.categoria}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Ventas por ocasión */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Ventas por ocasión</h3>
          {topOcasiones.length === 0 ? (
            <p className="text-sm text-[#7A5260] text-center py-4">Sin datos de ocasiones.</p>
          ) : (
            <div className="space-y-3">
              {topOcasiones.map((o) => (
                <div key={o.oc}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-[#2A0E18] capitalize">{o.oc}</span>
                    <span className="text-[#7A5260]">{o.count} items</span>
                  </div>
                  <div className="h-2 bg-[#BC9968]/15 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.round((o.count / maxOc) * 100)}%`, background: "linear-gradient(90deg,#BC9968,#D4A96A)" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Género destinatario */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Género destinatario</h3>
          {generoData.length === 0 ? (
            <p className="text-sm text-[#7A5260] text-center py-4">Sin datos.</p>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {generoData.map((g) => (
                  <div key={g.label} className="rounded-xl p-4 text-center border-2"
                    style={{ borderColor: `${g.color}30`, background: `${g.color}08` }}>
                    <div className="flex justify-center mb-2" style={{ color: g.color }}>{g.icono}</div>
                    <p className="font-serif text-2xl font-bold" style={{ color: g.color }}>{g.pct}%</p>
                    <p className="text-xs font-medium text-[#2A0E18]">{g.label}</p>
                    <p className="text-xs text-[#7A5260]">{g.count} items</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {generoData.map((g) => (
                  <div key={g.label}>
                    <div className="flex justify-between text-xs text-[#7A5260] mb-1">
                      <span>{g.label}</span><span>{g.pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${g.pct}%`, background: g.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
