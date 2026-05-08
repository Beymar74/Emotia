import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import { GraficoTopProductos, GraficoEstadoProductos, GraficoCategorias } from "./ProductosCharts";

export default async function ReporteProductosPage() {
  const [productosDB, detallesDB] = await Promise.all([
    prisma.productos.findMany({
      select: {
        id: true,
        nombre: true,
        precio_venta: true,
        activo: true,
        created_at: true,
        categorias: { select: { nombre: true } },
        proveedores: { select: { nombre_negocio: true } },
        _count: { select: { detalle_pedidos: true } },
      },
      orderBy: { created_at: "desc" },
    }),
    prisma.detalle_pedidos.findMany({
      where: { pedidos: { estado: "entregado" } },
      select: { producto_id: true, cantidad: true, subtotal: true },
    }),
  ]);

  const totalProductos = productosDB.length;
  const productosActivos = productosDB.filter((p) => p.activo).length;
  const productosInactivos = totalProductos - productosActivos;

  type ProdVenta = {
    id: number; nombre: string; categoria: string; empresa: string;
    precio: number; unidades: number; ingresos: number; activo: boolean;
  };

  const ventasMap: Record<number, { unidades: number; ingresos: number }> = {};
  detallesDB.forEach((d) => {
    if (!d.producto_id) return;
    if (!ventasMap[d.producto_id]) ventasMap[d.producto_id] = { unidades: 0, ingresos: 0 };
    ventasMap[d.producto_id].unidades += Number(d.cantidad || 0);
    ventasMap[d.producto_id].ingresos += Number(d.subtotal || 0);
  });

  const productosConVentas: ProdVenta[] = productosDB.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    categoria: (p.categorias as any)?.nombre || "Sin categoría",
    empresa: (p.proveedores as any)?.nombre_negocio || "—",
    precio: Number(p.precio_venta || 0),
    unidades: ventasMap[p.id]?.unidades || 0,
    ingresos: ventasMap[p.id]?.ingresos || 0,
    activo: p.activo,
  }));

  const topVendidos = [...productosConVentas].sort((a, b) => b.ingresos - a.ingresos).slice(0, 8);
  const sinVentas = productosConVentas.filter((p) => p.unidades === 0 && p.activo).slice(0, 6);

  type CatData = { nombre: string; total: number; activos: number; ingresos: number };
  const catMap: Record<string, CatData> = {};
  productosConVentas.forEach((p) => {
    const cat = p.categoria;
    if (!catMap[cat]) catMap[cat] = { nombre: cat, total: 0, activos: 0, ingresos: 0 };
    catMap[cat].total += 1;
    if (p.activo) catMap[cat].activos += 1;
    catMap[cat].ingresos += p.ingresos;
  });
  const categorias = Object.values(catMap).sort((a, b) => b.ingresos - a.ingresos);
  const maxCatIngresos = Math.max(...categorias.map((c) => c.ingresos), 1);

  const formatBs = (n: number) =>
    `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const totalIngresos = productosConVentas.reduce((s, p) => s + p.ingresos, 0);
  const maxIngresos = Math.max(...topVendidos.map((p) => p.ingresos), 1);

  // Datos para descarga
  const config = {
    filename: "reporte-productos",
    titulo: "Reporte de Productos — Emotia",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Total productos", valor: String(totalProductos), color: "#8E1B3A" },
      { label: "Activos", valor: String(productosActivos), color: "#2D7A47" },
      { label: "Inactivos", valor: String(productosInactivos), color: "#A32D2D" },
      { label: "Sin ventas", valor: String(sinVentas.length), color: "#8C5E08" },
    ],
    graficos: [
      { tipo: "dona" as const, titulo: "Estado del catálogo", datos: [
        { nombre: "Activos", valor: productosActivos, color: "#2D7A47" },
        { nombre: "Inactivos", valor: productosInactivos, color: "#A32D2D" },
      ]},
      { tipo: "barras" as const, titulo: "Ingresos por categoría (Bs)", datos: categorias.slice(0, 6).map((c, i) => ({ nombre: c.nombre, valor: c.ingresos, color: ["#8E1B3A","#BC9968","#2D7A47","#185FA5","#AB3A50","#8C5E08"][i] })) },
      { tipo: "barras-h" as const, titulo: "Top productos por ingresos (Bs)", datos: topVendidos.slice(0, 6).map((p) => ({ nombre: p.nombre, valor: p.ingresos })), color: "#8E1B3A" },
    ],
    tablas: [
      {
        nombre: "Top por ingresos",
        columnas: ["Producto", "Categoría", "Empresa", "Precio (Bs)", "Unidades vendidas", "Ingresos (Bs)", "% Participación"],
        filas: topVendidos.map((p) => [
          p.nombre, p.categoria, p.empresa,
          p.precio,
          p.unidades,
          p.ingresos,
          totalIngresos > 0 ? Math.round((p.ingresos / totalIngresos) * 100) + "%" : "0%",
        ]),
      },
      {
        nombre: "Por categoría",
        columnas: ["Categoría", "Total productos", "Activos", "Ingresos (Bs)"],
        filas: categorias.map((c) => [c.nombre, c.total, c.activos, c.ingresos]),
      },
      {
        nombre: "Catálogo completo",
        columnas: ["Producto", "Categoría", "Empresa", "Precio (Bs)", "Estado", "Unidades vendidas", "Ingresos (Bs)"],
        filas: productosConVentas.map((p) => [
          p.nombre, p.categoria, p.empresa, p.precio,
          p.activo ? "Activo" : "Inactivo",
          p.unidades, p.ingresos,
        ]),
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
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
            <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Reportes</p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte de Productos</h1>
          </div>
        </div>
        <DescargarReporteBtn config={config} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total productos", valor: String(totalProductos), color: "#8E1B3A" },
          { label: "Activos", valor: String(productosActivos), color: "#2D7A47" },
          { label: "Inactivos", valor: String(productosInactivos), color: "#A32D2D" },
          { label: "Sin ventas", valor: String(sinVentas.length), color: "#8C5E08" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: k.color }} />
            <p className="font-serif text-3xl font-bold text-[#5A0F24]">{k.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GraficoEstadoProductos activos={productosActivos} inactivos={productosInactivos} />
        <GraficoCategorias data={categorias} />
      </div>

      <GraficoTopProductos data={topVendidos} totalIngresos={totalIngresos} />

      {/* Productos sin ventas */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">
          Productos activos sin ventas
          {sinVentas.length > 0 && (
            <span className="ml-2 text-xs bg-[#8C5E08]/10 text-[#8C5E08] px-2 py-0.5 rounded-full font-normal">
              {sinVentas.length} encontrados
            </span>
          )}
        </h3>
        {sinVentas.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-sm font-medium text-[#2D7A47]">¡Excelente! Todos los productos activos tienen al menos una venta.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sinVentas.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-[#FDF5E6] border border-[#8C5E08]/10">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#2A0E18] truncate">{p.nombre}</p>
                  <p className="text-xs text-[#7A5260]">{p.categoria}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-sm font-semibold text-[#5A0F24]">{formatBs(p.precio)}</p>
                  <p className="text-[10px] text-[#8C5E08] font-medium">Sin ventas</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
