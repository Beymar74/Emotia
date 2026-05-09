import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import { GraficoEstrellas, GraficoSatisfaccion } from "./CalidadCharts";
import { Suspense } from "react";
import EmpresaFilter from "../../_components/EmpresaFilter";

export default async function ReporteCalidadPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const empresaId = typeof sp.empresa === "string" && sp.empresa !== "todas" ? parseInt(sp.empresa) : 0;
  const empresaFiltroDetalle = empresaId > 0 ? { proveedor_id: empresaId } : {};
  const empresaFiltroPedido = empresaId > 0 ? { detalle_pedidos: { some: { proveedor_id: empresaId } } } : {};
  const [detallesDB, pedidosDB, empresasLista] = await Promise.all([
    prisma.detalle_pedidos.findMany({
      where: { calificacion: { not: null }, ...empresaFiltroDetalle },
      select: {
        id: true,
        calificacion: true,
        resena: true,
        created_at: true,
        productos: { select: { nombre: true, categorias: { select: { nombre: true } } } },
        pedidos: { select: { usuarios: { select: { nombre: true } } } },
      },
      orderBy: { created_at: "desc" },
    }),
    prisma.pedidos.findMany({
      where: { ...empresaFiltroPedido },
      select: { id: true, estado: true, created_at: true },
    }),
    prisma.proveedores.findMany({ select: { id: true, nombre_negocio: true }, orderBy: { nombre_negocio: "asc" } })
  ]);

  const totalReseñas = detallesDB.length;
  const promedioGlobal =
    totalReseñas > 0
      ? detallesDB.reduce((s, c) => s + Number(c.calificacion), 0) / totalReseñas
      : 0;

  // Distribución de estrellas
  const distribucion = [5, 4, 3, 2, 1].map((stars) => {
    const count = detallesDB.filter((c) => Math.round(Number(c.calificacion)) === stars).length;
    const pct = totalReseñas > 0 ? Math.round((count / totalReseñas) * 100) : 0;
    return { stars, count, pct };
  });

  // Productos mejor calificados
  type ProdCalif = { nombre: string; categoria: string; promedio: number; total: number };
  const prodMap: Record<string, ProdCalif> = {};
  detallesDB.forEach((c) => {
    const nombre = c.productos?.nombre || "Desconocido";
    const cat = (c.productos as any)?.categorias?.nombre || "Sin categoría";
    if (!prodMap[nombre]) prodMap[nombre] = { nombre, categoria: cat, promedio: 0, total: 0 };
    prodMap[nombre].promedio += Number(c.calificacion);
    prodMap[nombre].total += 1;
  });
  const productosCalif = Object.values(prodMap)
    .map((p) => ({ ...p, promedio: p.promedio / p.total }))
    .sort((a, b) => b.promedio - a.promedio);
  const topProductos = productosCalif.slice(0, 6);
  const bottomProductos = [...productosCalif].sort((a, b) => a.promedio - b.promedio).slice(0, 4);

  // Métricas de pedidos
  const totalPedidos = pedidosDB.length;
  const cancelados = pedidosDB.filter((p) => p.estado === "cancelado").length;
  const entregados = pedidosDB.filter((p) => p.estado === "entregado").length;
  const tasaCancelacion = totalPedidos > 0 ? Math.round((cancelados / totalPedidos) * 100) : 0;
  const tasaEntrega = totalPedidos > 0 ? Math.round((entregados / totalPedidos) * 100) : 0;

  // Reseñas recientes
  const reseñasRecientes = detallesDB.slice(0, 6);

  const formatFecha = (d: Date) =>
    new Intl.DateTimeFormat("es-BO", { day: "2-digit", month: "short", year: "numeric" }).format(d);

  const starColor = (avg: number) => (avg >= 4 ? "#2D7A47" : avg >= 3 ? "#8C5E08" : "#A32D2D");

  // Datos para descarga
  const config = {
    filename: "reporte-calidad",
    titulo: "Reporte de Calidad — Emotia",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Calificación promedio", valor: promedioGlobal.toFixed(2) + " ★", color: "#BC9968" },
      { label: "Total reseñas", valor: String(totalReseñas), color: "#8E1B3A" },
      { label: "Tasa de entrega", valor: `${tasaEntrega}%`, color: "#2D7A47" },
      { label: "Tasa cancelación", valor: `${tasaCancelacion}%`, color: "#A32D2D" },
    ],
    graficos: [
      { tipo: "barras" as const, titulo: "Distribución de reseñas por estrellas", datos: [...distribucion].reverse().map((d) => ({ nombre: d.stars + " ★", valor: d.count, color: d.stars >= 4 ? "#2D7A47" : d.stars === 3 ? "#BC9968" : "#A32D2D" })) },
      { tipo: "barras-h" as const, titulo: "Productos mejor calificados", datos: topProductos.map((p) => ({ nombre: p.nombre, valor: Math.round(p.promedio * 10) / 10 })), color: "#BC9968" },
    ],
    tablas: [
      {
        nombre: "Distribución estrellas",
        columnas: ["Estrellas", "Cantidad", "Porcentaje"],
        filas: distribucion.map((d) => [d.stars + " ★", d.count, d.pct + "%"]),
      },
      {
        nombre: "Productos calificados",
        columnas: ["Producto", "Categoría", "Promedio", "Total reseñas"],
        filas: productosCalif.map((p) => [p.nombre, p.categoria, p.promedio.toFixed(2), p.total]),
      },
      {
        nombre: "Reseñas detalle",
        columnas: ["Producto", "Cliente", "Calificación", "Reseña", "Fecha"],
        filas: detallesDB.map((r) => [
          r.productos?.nombre || "Producto",
          (r.pedidos as any)?.usuarios?.nombre || "Cliente",
          Number(r.calificacion).toFixed(1),
          r.resena || "",
          formatFecha(r.created_at),
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
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte de Calidad</h1>
        <p className="mt-2 text-sm text-[#7A5260] max-w-3xl leading-relaxed">
          Aquí puedes analizar las métricas de calidad del servicio, evaluaciones de productos y el nivel de satisfacción general de los clientes.
        </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Suspense><EmpresaFilter empresas={empresasLista} /></Suspense>
          <DescargarReporteBtn config={config} />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Calificación promedio", valor: promedioGlobal.toFixed(2) + " ★", color: "#BC9968" },
          { label: "Total reseñas", valor: String(totalReseñas), color: "#8E1B3A" },
          { label: "Tasa de entrega", valor: `${tasaEntrega}%`, color: "#2D7A47" },
          { label: "Tasa cancelación", valor: `${tasaCancelacion}%`, color: "#A32D2D" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: k.color }} />
            <p className="font-serif text-3xl font-bold text-[#5A0F24]">{k.valor}</p>
            <p className="text-sm text-[#7A5260] mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GraficoEstrellas data={distribucion} promedio={promedioGlobal} />
        <GraficoSatisfaccion
          satisfaccion={Math.round((promedioGlobal / 5) * 100)}
          tasaEntrega={tasaEntrega}
          tasaCancelacion={tasaCancelacion}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top productos */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Productos mejor calificados</h3>
          {topProductos.length === 0 ? (
            <p className="text-sm text-[#7A5260] text-center py-4">Sin reseñas disponibles.</p>
          ) : (
            <div className="space-y-3">
              {topProductos.map((p) => (
                <div key={p.nombre} className="flex items-center justify-between p-3 rounded-xl bg-[#FAF3EC]">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#2A0E18] truncate">{p.nombre}</p>
                    <p className="text-xs text-[#7A5260]">{p.categoria} · {p.total} reseñas</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-lg font-serif font-bold" style={{ color: starColor(p.promedio) }}>
                      {p.promedio.toFixed(1)}
                    </span>
                    <span style={{ color: starColor(p.promedio) }}>★</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Productos con baja calificación */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Productos con oportunidad de mejora</h3>
          {bottomProductos.filter((p) => p.promedio < 4).length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-sm font-medium text-[#2D7A47]">Todos los productos tienen buena calificación.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bottomProductos
                .filter((p) => p.promedio < 4)
                .map((p) => (
                  <div key={p.nombre} className="flex items-center justify-between p-3 rounded-xl bg-[#FBF0F0]">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#2A0E18] truncate">{p.nombre}</p>
                      <p className="text-xs text-[#7A5260]">{p.categoria} · {p.total} reseñas</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-lg font-serif font-bold text-[#A32D2D]">{p.promedio.toFixed(1)}</span>
                      <span className="text-[#A32D2D]">★</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Reseñas recientes */}
      {reseñasRecientes.length > 0 && (
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Reseñas recientes</h3>
          <div className="space-y-3">
            {reseñasRecientes.map((r) => {
              const calif = Number(r.calificacion);
              return (
                <div key={r.id} className="border border-[#8E1B3A]/8 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-medium text-[#2A0E18]">{r.productos?.nombre || "Producto"}</p>
                      <p className="text-xs text-[#7A5260]">
                        por {(r.pedidos as any)?.usuarios?.nombre || "Cliente"} · {formatFecha(r.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className="text-sm" style={{ color: s <= Math.round(calif) ? "#BC9968" : "#E5E7EB" }}>
                          ★
                        </span>
                      ))}
                      <span className="text-xs font-bold text-[#5A0F24] ml-1">{calif.toFixed(1)}</span>
                    </div>
                  </div>
                  {r.resena && <p className="text-sm text-[#7A5260] leading-relaxed">{r.resena}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
