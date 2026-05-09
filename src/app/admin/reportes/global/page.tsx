import Link from "next/link";
import prisma from "@/lib/prisma";
import DescargarReporteBtn from "../_components/DescargarReporteBtn";
import { GraficoSemanalGlobal, GraficoEmpresasGlobal, GraficoCategoriasGlobal } from "./GlobalCharts";

export default async function ReporteGlobalPage() {
  const [pedidosDB, empresasDB, usuariosDB, productosDB, calificacionesDB, detallesDB] = await Promise.all([
    prisma.pedidos.findMany({ select: { id: true, total: true, estado: true, created_at: true } }),
    prisma.proveedores.findMany({ select: { id: true, nombre_negocio: true, total_vendido: true, estado: true } }),
    prisma.usuarios.findMany({ where: { tipo: "usuario" }, select: { id: true, activo: true } }),
    prisma.productos.findMany({ select: { id: true, activo: true } }),
    prisma.detalle_pedidos.findMany({
      where: { calificacion: { not: null } },
      select: { id: true, calificacion: true },
    }),
    prisma.detalle_pedidos.findMany({
      where: { pedidos: { estado: "entregado" } },
      include: { productos: { include: { categorias: true } } },
    }),
  ]);

  const formatBs = (n: number) =>
    `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const pedidosEntregados = pedidosDB.filter((p) => p.estado === "entregado");
  const totalIngresos = pedidosEntregados.reduce((s, p) => s + Number(p.total), 0);
  const totalPedidos = pedidosEntregados.length;
  const ticketPromedio = totalPedidos > 0 ? totalIngresos / totalPedidos : 0;
  const usuariosActivos = usuariosDB.filter((u) => u.activo).length;
  const empresasActivas = empresasDB.filter((e) => e.estado === "aprobado").length;
  const productosActivos = productosDB.filter((p) => p.activo).length;
  const totalReseñas = calificacionesDB.length;
  const promedioCalif =
    totalReseñas > 0
      ? calificacionesDB.reduce((s, c) => s + Number(c.calificacion), 0) / totalReseñas
      : 0;

  // Top 4 empresas
  const topEmpresas = [...empresasDB]
    .filter((e) => e.estado === "aprobado")
    .sort((a, b) => Number(b.total_vendido || 0) - Number(a.total_vendido || 0))
    .slice(0, 4)
    .map((e) => ({
      ...e,
      total_vendido: Number(e.total_vendido || 0),
    }));

  // Ventas semanales (últimas 4 semanas)
  const ahora = new Date();
  const semanas: { periodo: string; pedidos: number; monto: number }[] = [];
  for (let i = 3; i >= 0; i--) {
    const inicio = new Date(ahora);
    inicio.setDate(ahora.getDate() - (i + 1) * 7);
    const fin = new Date(ahora);
    fin.setDate(ahora.getDate() - i * 7);
    const label = `Sem ${4 - i} (${inicio.getDate()}/${inicio.getMonth() + 1})`;
    const peds = pedidosEntregados.filter((p) => {
      const d = new Date(p.created_at);
      return d >= inicio && d < fin;
    });
    semanas.push({
      periodo: label,
      pedidos: peds.length,
      monto: peds.reduce((s, p) => s + Number(p.total), 0),
    });
  }

  // Top 5 categorías
  type CatData = { monto: number; items: number };
  const catMap: Record<string, CatData> = {};
  detallesDB.forEach((d: any) => {
    const cat = d.productos?.categorias?.nombre || "Otros";
    const sub = Number(d.subtotal || 0);
    if (!catMap[cat]) catMap[cat] = { monto: 0, items: 0 };
    catMap[cat].monto += sub;
    catMap[cat].items += Number(d.cantidad || 0);
  });
  const topCategorias = Object.entries(catMap)
    .map(([nombre, data]) => ({
      nombre,
      ...data,
      pct: totalIngresos > 0 ? Math.round((data.monto / totalIngresos) * 100) : 0,
    }))
    .sort((a, b) => b.monto - a.monto)
    .slice(0, 5);

  const kpisGenerales = [
    { label: "Ingresos totales", valor: formatBs(totalIngresos), color: "#8E1B3A" },
    { label: "Pedidos completados", valor: String(totalPedidos), color: "#BC9968" },
    { label: "Ticket promedio", valor: formatBs(ticketPromedio), color: "#5C3A2E" },
    { label: "Empresas activas", valor: String(empresasActivas), color: "#AB3A50" },
    { label: "Clientes activos", valor: String(usuariosActivos), color: "#185FA5" },
    { label: "Productos activos", valor: String(productosActivos), color: "#2D7A47" },
    { label: "Calificación media", valor: promedioCalif.toFixed(2) + " ★", color: "#8C5E08" },
    { label: "Reseñas totales", valor: String(totalReseñas), color: "#5A0F24" },
  ];

  // Datos para descarga
  const config = {
    filename: "reporte-global",
    titulo: "Reporte Global del Sistema — Emotia",
    formatos: ["pdf"] as ("pdf" | "excel")[],
    kpis: kpisGenerales,
    graficos: [
      { tipo: "area" as const, titulo: "Evolución semanal de ingresos", datos: semanas.map((s) => ({ x: s.periodo, y: s.monto })), color: "#8E1B3A" },
      { tipo: "barras" as const, titulo: "Ventas por empresa (Bs)", datos: topEmpresas.map((e) => ({ nombre: e.nombre_negocio, valor: Number(e.total_vendido || 0) })), color: "#BC9968" },
      { tipo: "dona" as const, titulo: "Distribución por categoría", datos: topCategorias.map((c, i) => ({ nombre: c.nombre, valor: c.monto, color: ["#8E1B3A","#BC9968","#5C3A2E","#AB3A50","#185FA5"][i] })) },
    ],
    tablas: [
      {
        nombre: "KPIs generales",
        columnas: ["Métrica", "Valor"],
        filas: kpisGenerales.map((k) => [k.label, k.valor]),
      },
      {
        nombre: "Evolución semanal",
        columnas: ["Período", "Pedidos", "Monto (Bs)"],
        filas: semanas.map((s) => [s.periodo, s.pedidos, s.monto]),
      },
      {
        nombre: "Top categorías",
        columnas: ["Categoría", "Monto (Bs)", "Ítems", "% del total"],
        filas: topCategorias.map((c) => [c.nombre, c.monto, c.items, c.pct + "%"]),
      },
      {
        nombre: "Top empresas",
        columnas: ["Empresa", "Ventas (Bs)"],
        filas: topEmpresas.map((e) => [e.nombre_negocio, Number(e.total_vendido || 0)]),
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
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">Reporte Global del Sistema</h1>
        <p className="mt-2 text-sm text-[#7A5260] max-w-3xl leading-relaxed">
          En esta sección puedes obtener una perspectiva holística de la salud de Emotia, uniendo las métricas de todas las áreas clave en un solo lugar.
        </p>
          </div>
        </div>
        <DescargarReporteBtn config={config} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpisGenerales.map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: k.color }} />
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#5A0F24]">{k.valor}</p>
            <p className="text-xs sm:text-sm text-[#7A5260] mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GraficoSemanalGlobal data={semanas} totalIngresos={totalIngresos} />
        <GraficoEmpresasGlobal data={topEmpresas} totalIngresos={totalIngresos} />
      </div>

      <GraficoCategoriasGlobal data={topCategorias} />

      {/* Links a reportes detallados */}
      <div className="bg-gradient-to-br from-[#5A0F24] to-[#8E1B3A] rounded-2xl p-6 text-white">
        <h3 className="font-serif text-xl font-bold mb-2">Ver reportes detallados</h3>
        <p className="text-sm text-white/70 mb-4">Accede a análisis específicos por área del sistema.</p>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/admin/reportes/ventas", label: "Ventas" },
            { href: "/admin/reportes/clientes", label: "Clientes" },
            { href: "/admin/reportes/pedidos", label: "Pedidos" },
            { href: "/admin/reportes/productos", label: "Productos" },
            { href: "/admin/reportes/empresas", label: "Empresas" },
            { href: "/admin/reportes/fidelizacion", label: "Fidelización" },
            { href: "/admin/reportes/calidad", label: "Calidad" },
          ].map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-sm font-medium transition-all"
            >
              {r.label} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
