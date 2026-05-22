import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import ReportSubNav from "../_components/ReportSubNav";
import { GraficoVentasCategoria, GraficoProductosCategoria } from "./CategoriasCharts";

export const dynamic = "force-dynamic";

const fmtBs = (n: number) =>
  `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export default async function ReporteCategoriasPage() {
  const [categoriasDB, productosDB, detallesDB] = await Promise.all([
    prisma.categorias.findMany({
      select: { id: true, nombre: true, activo: true, created_at: true, _count: { select: { productos: true } } },
      orderBy: { nombre: "asc" },
    }),
    prisma.productos.findMany({
      select: { id: true, categoria_id: true, activo: true },
    }),
    prisma.detalle_pedidos.findMany({
      select: { subtotal: true, cantidad: true, producto_id: true },
    }),
  ]);

  // Map product -> category
  const prodCatMap: Record<number, number | null> = {};
  productosDB.forEach((p) => { prodCatMap[p.id] = p.categoria_id; });

  // Aggregate per category
  type CatStat = { nombre: string; ventas: number; pedidos: number; productos: number; activo: boolean };
  const catMap: Record<number, CatStat> = {};
  categoriasDB.forEach((c) => {
    catMap[c.id] = { nombre: c.nombre, ventas: 0, pedidos: 0, productos: c._count.productos, activo: c.activo };
  });
  detallesDB.forEach((d) => {
    const catId = prodCatMap[d.producto_id];
    if (catId && catMap[catId]) {
      catMap[catId].ventas += Number(d.subtotal || 0);
      catMap[catId].pedidos += 1;
    }
  });

  const categorias = Object.entries(catMap)
    .map(([id, v]) => ({ id: Number(id), ...v }))
    .sort((a, b) => b.ventas - a.ventas);

  const totalCategorias = categoriasDB.length;
  const activas = categoriasDB.filter((c) => c.activo).length;
  const totalProductos = categoriasDB.reduce((s, c) => s + c._count.productos, 0);
  const totalVentas = categorias.reduce((s, c) => s + c.ventas, 0);
  const topCategoria = categorias[0]?.nombre || "—";

  const chartVentas = categorias.filter((c) => c.ventas > 0).map((c) => ({ nombre: c.nombre, ventas: c.ventas }));
  const chartProductos = categorias.filter((c) => c.productos > 0).map((c) => ({ nombre: c.nombre, productos: c.productos }));

  const config = {
    filename: "reporte-categorias",
    titulo: "Reporte de Categorías — PREPE",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Total categorías", valor: String(totalCategorias), color: "#185FA5" },
      { label: "Activas", valor: String(activas), color: "#2D7A47" },
      { label: "Total productos", valor: String(totalProductos), color: "#8E1B3A" },
      { label: "Ventas totales", valor: fmtBs(totalVentas), color: "#BC9968" },
    ],
    graficos: [
      {
        tipo: "barras-h" as const,
        titulo: "Ingresos por categoría",
        datos: chartVentas.map((c) => ({ nombre: c.nombre, valor: c.ventas })),
        color: "#185FA5",
      },
      {
        tipo: "dona" as const,
        titulo: "Productos por categoría",
        datos: chartProductos.map((c) => ({ nombre: c.nombre, valor: c.productos, color: "#185FA5" })),
      },
    ],
    tablas: [
      {
        nombre: "Detalle por categoría",
        columnas: ["Categoría", "Estado", "Productos", "Pedidos", "Ingresos"],
        filas: categorias.map((c) => [c.nombre, c.activo ? "Activa" : "Inactiva", c.productos, c.pedidos, fmtBs(c.ventas)]),
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
            <span className="text-xs text-[#5A0F24] font-medium">Categorías</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte de Categorías</h1>
          <p className="mt-1 text-sm text-[#7A5260] max-w-2xl leading-relaxed">
            Rendimiento del catálogo por categoría: productos asignados, pedidos e ingresos generados.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <DescargarReporteBtn config={config} />
        </div>
      </div>

      <ReportSubNav />

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total categorías", valor: String(totalCategorias), color: "#185FA5", sub: "En el catálogo" },
          { label: "Activas", valor: String(activas), color: "#2D7A47", sub: "Visibles al cliente" },
          { label: "Total productos", valor: String(totalProductos), color: "#8E1B3A", sub: "Asignados" },
          { label: "Categoría líder", valor: topCategoria, color: "#BC9968", sub: "Mayor ingreso" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: k.color }} />
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#5A0F24] truncate">{k.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{k.label}</p>
            <p className="text-xs mt-0.5" style={{ color: k.color }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GraficoVentasCategoria data={chartVentas} />
        <GraficoProductosCategoria data={chartProductos} />
      </div>

      {/* Tabla detallada */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 overflow-x-auto">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Detalle por categoría</h3>
        {categorias.length === 0 ? (
          <p className="text-sm text-[#7A5260] text-center py-4">Sin categorías registradas.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Categoría", "Estado", "Productos", "Pedidos", "Ingresos totales", "Ticket prom."].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categorias.map((c, i) => (
                <tr key={c.id} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: i === 0 ? "#185FA5" : i === 1 ? "#8E1B3A" : "#BC9968" }} />
                      <span className="text-sm font-medium text-[#2A0E18]">{c.nombre}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${c.activo ? "bg-[#EEF8F0] text-[#2D7A47]" : "bg-[#FBF0F0] text-[#A32D2D]"}`}>
                      {c.activo ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm text-[#7A5260]">{c.productos}</td>
                  <td className="px-3 py-3 text-sm text-[#7A5260]">{c.pedidos}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24]">{fmtBs(c.ventas)}</td>
                  <td className="px-3 py-3 text-sm text-[#7A5260]">
                    {c.pedidos > 0 ? fmtBs(c.ventas / c.pedidos) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
