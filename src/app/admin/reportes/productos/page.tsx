import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import { GraficoTopProductos, GraficoEstadoProductos, GraficoCategorias } from "./ProductosCharts";
import { Suspense } from "react";
import EmpresaFilter from "../../_components/EmpresaFilter";
import ReportSubNav from "../_components/ReportSubNav";
import ProductosReporteTabla from "./_components/ProductosReporteTabla";

export default async function ReporteProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const empresaId = typeof sp.empresa === "string" && sp.empresa !== "todas" ? parseInt(sp.empresa) : 0;
  const empresaFiltroProducto = empresaId > 0 ? { proveedor_id: empresaId } : {};
  const empresaFiltroDetalle = empresaId > 0 ? { proveedor_id: empresaId } : {};
  const [productosDB, detallesDB, empresasLista] = await Promise.all([
    prisma.productos.findMany({
      where: { ...empresaFiltroProducto },
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
      where: { pedidos: { estado: "entregado" }, ...empresaFiltroDetalle },
      select: { producto_id: true, cantidad: true, subtotal: true },
    }),
    prisma.proveedores.findMany({ select: { id: true, nombre_negocio: true, logo_url: true }, orderBy: { nombre_negocio: "asc" } })
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

  const topVendidos = [...productosConVentas].sort((a, b) => b.ingresos - a.ingresos);
  const sinVentas = productosConVentas.filter((p) => p.unidades === 0 && p.activo);

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

  const totalIngresos = productosConVentas.reduce((s, p) => s + p.ingresos, 0);

  const empresaNombre = empresaId > 0 ? (empresasLista.find(e => e.id === empresaId)?.nombre_negocio || "") : "";

  // Datos para descarga
  const config = {
    filename: empresaId > 0 ? `reporte-productos-${empresaNombre.toLowerCase().replace(/[^a-z0-9]/g, "-")}` : "reporte-productos",
    titulo: empresaId > 0 ? `Reporte de Productos — ${empresaNombre}` : "Reporte de Productos — PREPE",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Total productos", valor: String(totalProductos), color: "#8E1B3A" },
      { label: "Activos", valor: String(productosActivos), color: "#2D7A47" },
      { label: "Inactivos", valor: String(productosInactivos), color: "#A32D2D" },
      { label: "Sin ventas", valor: String(sinVentas.length), color: "#8C5E08" },
    ],
    logoUrl: empresaId > 0 ? (empresasLista.find(e => e.id === empresaId)?.logo_url || undefined) : undefined,
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
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/reportes" className="text-xs text-[#BC9968] hover:text-[#8E1B3A] font-medium transition-colors">Reportes</Link>
            <span className="text-[#BC9968]/40 text-xs">/</span>
            <span className="text-xs text-[#5A0F24] font-medium">Productos</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte de Productos</h1>
          <p className="mt-1 text-sm text-[#7A5260] max-w-2xl leading-relaxed">
            Catálogo activo, productos más vendidos, inventario por categoría y alertas de stock sin ventas.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Suspense><EmpresaFilter empresas={empresasLista} /></Suspense>
          <DescargarReporteBtn config={config} />
        </div>
      </div>

      <ReportSubNav />

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

      <GraficoTopProductos data={topVendidos.slice(0, 8)} totalIngresos={totalIngresos} />

      {/* Interactive Products Table Component */}
      <ProductosReporteTabla productos={productosConVentas} />
    </div>
  );
}
