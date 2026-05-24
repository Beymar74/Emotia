import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import ReportSubNav from "../_components/ReportSubNav";
import { GraficoOcasiones, GraficoConversionIA } from "./RecomendacionesCharts";

export const dynamic = "force-dynamic";

const fmtBs = (n: number) =>
  `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export default async function ReporteRecomendacionesPage() {
  const recomendacionesDB = await prisma.recomendaciones.findMany({
    select: {
      id: true,
      ocasion: true,
      personalidad: true,
      presupuesto_min: true,
      presupuesto_max: true,
      productos_sugeridos: true,
      productos_elegidos: true,
      producto_elegido: true,
      convertida_en_compra: true,
      created_at: true,
      destinatario_rel: true,
      destinatario_genero: true,
    },
    orderBy: { created_at: "desc" },
  });

  const total = recomendacionesDB.length;
  const convertidas = recomendacionesDB.filter((r) => r.convertida_en_compra).length;
  const noConvertidas = total - convertidas;
  const tasaConversion = total > 0 ? Math.round((convertidas / total) * 100) : 0;

  const presupuestos = recomendacionesDB
    .map((r) => Number(r.presupuesto_max || r.presupuesto_min || 0))
    .filter((n) => n > 0);
  const presupuestoPromedio = presupuestos.length > 0
    ? presupuestos.reduce((s, n) => s + n, 0) / presupuestos.length
    : 0;

  // Ocasiones más buscadas
  const ocasionesMap: Record<string, { total: number; convertidas: number }> = {};
  recomendacionesDB.forEach((r) => {
    const key = r.ocasion || "Sin especificar";
    if (!ocasionesMap[key]) ocasionesMap[key] = { total: 0, convertidas: 0 };
    ocasionesMap[key].total += 1;
    if (r.convertida_en_compra) ocasionesMap[key].convertidas += 1;
  });
  const ocasiones = Object.entries(ocasionesMap)
    .map(([ocasion, v]) => ({ ocasion, ...v }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  // Personalidades más pedidas
  const personalidadesMap: Record<string, number> = {};
  recomendacionesDB.forEach((r) => {
    (r.personalidad || []).forEach((p: string) => {
      personalidadesMap[p] = (personalidadesMap[p] || 0) + 1;
    });
  });
  const personalidades = Object.entries(personalidadesMap)
    .map(([nombre, total]) => ({ nombre, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  // Destinatario más frecuente
  const destinatarioMap: Record<string, number> = {};
  recomendacionesDB.forEach((r) => {
    const d = r.destinatario_rel || "Sin especificar";
    destinatarioMap[d] = (destinatarioMap[d] || 0) + 1;
  });
  const topDestinatario = Object.entries(destinatarioMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  const productosSugeridosIds = recomendacionesDB.flatMap(
  (r) => r.productos_sugeridos || []
);

const productosElegidosIds = recomendacionesDB.flatMap((r) => {
  const elegidos = r.productos_elegidos || [];

  if (elegidos.length > 0) {
    return elegidos;
  }

  return r.producto_elegido ? [r.producto_elegido] : [];
});

const totalProductosSugeridos = productosSugeridosIds.length;
const totalProductosElegidos = productosElegidosIds.length;

const tasaEleccion =
  totalProductosSugeridos > 0
    ? Math.round((totalProductosElegidos / totalProductosSugeridos) * 100)
    : 0;

const contarIds = (ids: number[]) =>
  ids.reduce<Record<number, number>>((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

const sugeridosCount = contarIds(productosSugeridosIds);
const elegidosCount = contarIds(productosElegidosIds);

const productoIds = Array.from(
  new Set([...productosSugeridosIds, ...productosElegidosIds])
);

const productosDB =
  productoIds.length > 0
    ? await prisma.productos.findMany({
        where: {
          id: {
            in: productoIds,
          },
        },
        select: {
          id: true,
          nombre: true,
          precio_venta: true,
          imagen_url: true,
          categorias: {
            select: {
              nombre: true,
            },
          },
          proveedores: {
            select: {
              nombre_negocio: true,
            },
          },
        },
      })
    : [];

const productosMap = new Map(productosDB.map((producto) => [producto.id, producto]));

const productosMasSugeridos = Object.entries(sugeridosCount)
  .map(([id, total]) => {
    const producto = productosMap.get(Number(id));

    return {
      id: Number(id),
      nombre: producto?.nombre || `Producto #${id}`,
      categoria: producto?.categorias?.nombre || "Sin categoría",
      proveedor: producto?.proveedores?.nombre_negocio || "Sin proveedor",
      precio: Number(producto?.precio_venta || 0),
      imagen: producto?.imagen_url || null,
      total,
    };
  })
  .sort((a, b) => b.total - a.total)
  .slice(0, 6);

const productosMasElegidos = Object.entries(elegidosCount)
  .map(([id, total]) => {
    const producto = productosMap.get(Number(id));

    return {
      id: Number(id),
      nombre: producto?.nombre || `Producto #${id}`,
      categoria: producto?.categorias?.nombre || "Sin categoría",
      proveedor: producto?.proveedores?.nombre_negocio || "Sin proveedor",
      precio: Number(producto?.precio_venta || 0),
      imagen: producto?.imagen_url || null,
      total,
    };
  })
  .sort((a, b) => b.total - a.total)
  .slice(0, 6);
  const config = {
    filename: "reporte-recomendaciones",
    titulo: "Reporte de Recomendaciones IA — PREPE",
    formatos: ["pdf", "excel"] as ("pdf" | "excel")[],
    kpis: [
      { label: "Total recomendaciones", valor: String(total), color: "#2D7A47" },
      { label: "Convertidas en compra", valor: String(convertidas), color: "#8E1B3A" },
      { label: "Tasa de conversión", valor: `${tasaConversion}%`, color: "#BC9968" },
      { label: "Presupuesto promedio", valor: fmtBs(presupuestoPromedio), color: "#185FA5" },
      { label: "Tasa de elección IA", valor: `${tasaEleccion}%`, color: "#5C3A2E" },
    ],
    graficos: [
      {
        tipo: "barras-h" as const,
        titulo: "Recomendaciones por ocasión",
        datos: ocasiones.map((o) => ({ nombre: o.ocasion, valor: o.total })),
        color: "#2D7A47",
      },
      {
        tipo: "dona" as const,
        titulo: "Conversión IA",
        datos: [
          { nombre: "Convertidas", valor: convertidas, color: "#2D7A47" },
          { nombre: "Sin conversión", valor: noConvertidas, color: "#E5E7EB" },
        ],
      },
    ],
    tablas: [
  {
    nombre: "Ocasiones más buscadas",
    columnas: ["Ocasión", "Total búsquedas", "Convertidas", "Tasa"],
    filas: ocasiones.map((o) => [
      o.ocasion,
      o.total,
      o.convertidas,
      o.total > 0 ? Math.round((o.convertidas / o.total) * 100) + "%" : "0%",
    ]),
  },
  {
    nombre: "Personalidades más pedidas",
    columnas: ["Personalidad", "Veces solicitada"],
    filas: personalidades.map((p) => [p.nombre, p.total]),
  },
  {
    nombre: "Productos más sugeridos por IA",
    columnas: ["Producto", "Categoría", "Proveedor", "Veces sugerido"],
    filas: productosMasSugeridos.map((p) => [
      p.nombre,
      p.categoria,
      p.proveedor,
      p.total,
    ]),
  },
  {
    nombre: "Productos más elegidos desde IA",
    columnas: ["Producto", "Categoría", "Proveedor", "Veces elegido"],
    filas: productosMasElegidos.map((p) => [
      p.nombre,
      p.categoria,
      p.proveedor,
      p.total,
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
            <span className="text-xs text-[#5A0F24] font-medium">Recomendaciones IA</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Recomendaciones IA</h1>
          <p className="mt-1 text-sm text-[#7A5260] max-w-2xl leading-relaxed">
            Ocasiones, personalidades y tasa de conversión del motor de recomendaciones inteligentes.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <DescargarReporteBtn config={config} />
        </div>
      </div>

      <ReportSubNav />

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        {[
          { label: "Total recomendaciones", valor: String(total), color: "#2D7A47", sub: "Generadas por IA" },
          { label: "Convertidas en compra", valor: String(convertidas), color: "#8E1B3A", sub: "Pedidos realizados" },
          { label: "Tasa de conversión", valor: `${tasaConversion}%`, color: "#BC9968", sub: "IA → Compra" },
          { label: "Presupuesto promedio", valor: fmtBs(presupuestoPromedio), color: "#185FA5", sub: "Máximo solicitado" },
          { label: "Tasa de elección IA", valor: `${tasaEleccion}%`, color: "#5C3A2E", sub: "Elegidos / sugeridos" },
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
        <GraficoOcasiones data={ocasiones} />
        <GraficoConversionIA convertidas={convertidas} noConvertidas={noConvertidas} />
      </div>

      {/* Personalidades */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Personalidades más solicitadas</h3>
        {personalidades.length === 0 ? (
          <p className="text-sm text-[#7A5260] text-center py-4">Sin datos de personalidades.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {personalidades.map((p, i) => {
              const colors = ["#2D7A47", "#185FA5", "#8E1B3A", "#BC9968", "#AB3A50", "#5C3A2E"];
              return (
                <div key={p.nombre} className="p-4 rounded-xl border border-[#8E1B3A]/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: colors[i % colors.length] }}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2A0E18] capitalize">{p.nombre}</p>
                    <p className="text-xs text-[#7A5260]">{p.total} búsquedas</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
            {/* Productos IA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-1">
            Productos más sugeridos por IA
          </h3>
          <p className="text-xs text-[#7A5260] mb-4">
            Productos que aparecen con más frecuencia en las recomendaciones generadas.
          </p>

          {productosMasSugeridos.length === 0 ? (
            <p className="text-sm text-[#7A5260] text-center py-4">
              Todavía no hay productos sugeridos registrados.
            </p>
          ) : (
            <div className="space-y-3">
              {productosMasSugeridos.map((p, index) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#8E1B3A]/10 bg-[#FDFBF9]/60"
                >
                  <div className="w-8 h-8 rounded-full bg-[#BC9968] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#2A0E18] truncate">
                      {p.nombre}
                    </p>
                    <p className="text-xs text-[#7A5260] truncate">
                      {p.categoria} · {p.proveedor}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-[#8E1B3A] bg-[#8E1B3A]/10 px-2 py-1 rounded-lg">
                    {p.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-1">
            Productos más elegidos desde IA
          </h3>
          <p className="text-xs text-[#7A5260] mb-4">
            Productos que los usuarios abrieron o agregaron al carrito después de una recomendación.
          </p>

          {productosMasElegidos.length === 0 ? (
            <p className="text-sm text-[#7A5260] text-center py-4">
              Todavía no hay productos elegidos desde recomendaciones.
            </p>
          ) : (
            <div className="space-y-3">
              {productosMasElegidos.map((p, index) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#8E1B3A]/10 bg-[#FDFBF9]/60"
                >
                  <div className="w-8 h-8 rounded-full bg-[#2D7A47] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#2A0E18] truncate">
                      {p.nombre}
                    </p>
                    <p className="text-xs text-[#7A5260] truncate">
                      {p.categoria} · {p.proveedor}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-[#2D7A47] bg-[#2D7A47]/10 px-2 py-1 rounded-lg">
                    {p.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Tabla ocasiones */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 overflow-x-auto">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Detalle por ocasión</h3>
        {ocasiones.length === 0 ? (
          <p className="text-sm text-[#7A5260] text-center py-4">Sin datos de ocasiones.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Ocasión", "Total búsquedas", "Convertidas", "Tasa conversión"].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ocasiones.map((o) => (
                <tr key={o.ocasion} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50">
                  <td className="px-3 py-3 text-sm font-medium text-[#2A0E18] capitalize">{o.ocasion}</td>
                  <td className="px-3 py-3 text-sm text-[#7A5260]">{o.total}</td>
                  <td className="px-3 py-3 text-sm text-[#2D7A47] font-semibold">{o.convertidas}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#F3EBE8] rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-[#2D7A47]" style={{ width: `${o.total > 0 ? Math.round((o.convertidas / o.total) * 100) : 0}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-[#2D7A47]">
                        {o.total > 0 ? Math.round((o.convertidas / o.total) * 100) : 0}%
                      </span>
                    </div>
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
