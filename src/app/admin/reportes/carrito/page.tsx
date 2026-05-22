import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import ReportSubNav from "../_components/ReportSubNav";
import { GraficoTopProductosCarrito, GraficoDistribucionCarritos } from "./CarritoCharts";
import CarritoProductosTabla from "./_components/CarritoProductosTabla";

export const dynamic = "force-dynamic";

const fmtBs = (n: number) =>
  `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export default async function ReporteCarritoPage() {
  const carritoDB = await prisma.carrito.findMany({
    select: {
      id: true,
      usuario_id: true,
      producto_id: true,
      cantidad: true,
      subtotal: true,
      created_at: true,
      productos: { select: { nombre: true } },
    },
  });

  const totalItems = carritoDB.length;
  const usuariosConCarrito = new Set(carritoDB.map((c) => c.usuario_id)).size;
  const valorTotal = carritoDB.reduce((s, c) => s + Number(c.subtotal || 0), 0);
  const ticketPromedio = usuariosConCarrito > 0
    ? carritoDB.reduce((acc, c) => {
        const uid = String(c.usuario_id);
        if (!acc[uid]) acc[uid] = 0;
        acc[uid] += Number(c.subtotal || 0);
        return acc;
      }, {} as Record<string, number>)
    : {};
  const ticketProm = Object.keys(ticketPromedio).length > 0
    ? Object.values(ticketPromedio).reduce((s, v) => s + v, 0) / Object.keys(ticketPromedio).length
    : 0;

  // Top productos en carrito
  const prodMap: Record<string, { nombre: string; cantidad: number; valor: number }> = {};
  carritoDB.forEach((c) => {
    const nombre = c.productos?.nombre || "Producto";
    if (!prodMap[nombre]) prodMap[nombre] = { nombre, cantidad: 0, valor: 0 };
    prodMap[nombre].cantidad += c.cantidad;
    prodMap[nombre].valor += Number(c.subtotal || 0);
  });
  const topProductos = Object.values(prodMap)
    .sort((a, b) => b.cantidad - a.cantidad);

  // Distribución por valor de carrito por usuario
  const valoresPorUsuario = Object.values(ticketPromedio);
  const dist = [
    { rango: "Bs 0–50", min: 0, max: 50, color: "#BC9968" },
    { rango: "Bs 50–150", min: 50, max: 150, color: "#8E1B3A" },
    { rango: "Bs 150–300", min: 150, max: 300, color: "#185FA5" },
    { rango: "Bs 300+", min: 300, max: Infinity, color: "#2D7A47" },
  ].map((d) => ({
    rango: d.rango,
    usuarios: valoresPorUsuario.filter((v) => v >= d.min && v < d.max).length,
    color: d.color,
  }));

  const config = {
    filename: "reporte-carrito",
    titulo: "Reporte de Carrito — PREPE",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Items en carrito", valor: String(totalItems), color: "#8E1B3A" },
      { label: "Usuarios con carrito", valor: String(usuariosConCarrito), color: "#185FA5" },
      { label: "Valor total en carritos", valor: fmtBs(valorTotal), color: "#BC9968" },
      { label: "Ticket promedio", valor: fmtBs(ticketProm), color: "#2D7A47" },
    ],
    graficos: [
      {
        tipo: "barras-h" as const,
        titulo: "Productos más agregados",
        datos: topProductos.slice(0, 8).map((p) => ({ nombre: p.nombre, valor: p.cantidad })),
        color: "#8E1B3A",
      },
    ],
    tablas: [
      {
        nombre: "Top productos en carrito",
        columnas: ["Producto", "Unidades", "Valor total"],
        filas: topProductos.map((p) => [p.nombre, p.cantidad, fmtBs(p.valor)]),
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
            <span className="text-xs text-[#5A0F24] font-medium">Carrito</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte de Carrito</h1>
          <p className="mt-1 text-sm text-[#7A5260] max-w-2xl leading-relaxed">
            Items actualmente en carritos, productos más deseados y valor potencial de ventas pendientes.
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
          { label: "Items en carrito", valor: String(totalItems), color: "#8E1B3A", sub: "Líneas activas" },
          { label: "Usuarios con carrito", valor: String(usuariosConCarrito), color: "#185FA5", sub: "Sin finalizar compra" },
          { label: "Valor total en carritos", valor: fmtBs(valorTotal), color: "#BC9968", sub: "Potencial de venta" },
          { label: "Ticket promedio", valor: fmtBs(ticketProm), color: "#2D7A47", sub: "Por usuario" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: k.color }} />
            <p className="font-serif text-3xl font-bold text-[#5A0F24]">{k.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{k.label}</p>
            <p className="text-xs mt-0.5" style={{ color: k.color }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GraficoTopProductosCarrito data={topProductos.slice(0, 8)} />
        <GraficoDistribucionCarritos data={dist} />
      </div>

      {/* Interactive Table */}
      <CarritoProductosTabla productos={topProductos} />
    </div>
  );
}
