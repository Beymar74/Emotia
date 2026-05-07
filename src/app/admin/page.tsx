export const dynamic = 'force-dynamic';

import prisma from "@/lib/prisma";
import MetricCard from "./_components/MetricCard";
import QuickActions from "./_components/QuickActions";
import ProveedoresTable from "./_components/ProveedoresTable";
import VentasCategorias from "./_components/VentasCategorias";
import SolicitudesPendientes from "./_components/SolicitudesPendientes";
import ResumenHoy from "./_components/ResumenHoy";
import TopProductos from "./_components/TopProductos";

function calcularDelta(actual: number, anterior: number): { texto: string; tipo: "up" | "down" | "neutral" } {
  if (anterior === 0) return { texto: "Sin datos previos", tipo: "neutral" };
  const diff = ((actual - anterior) / anterior) * 100;
  if (Math.abs(diff) < 0.5) return { texto: "Sin cambios", tipo: "neutral" };
  return {
    texto: `${diff > 0 ? "+" : ""}${diff.toFixed(1)}% vs mes ant.`,
    tipo: diff > 0 ? "up" : "down",
  };
}

export default async function AdminPage() {
  // Fechas base — Bolivia es UTC-4 (sin horario de verano)
  const ahoraUTC = new Date();
  const ahoraBO = new Date(ahoraUTC.getTime() - 4 * 60 * 60 * 1000);

  const inicioHoyBO = new Date(ahoraBO.getFullYear(), ahoraBO.getMonth(), ahoraBO.getDate());
  const inicioHoyUTC = new Date(inicioHoyBO.getTime() + 4 * 60 * 60 * 1000);

  const inicioMesActualBO = new Date(ahoraBO.getFullYear(), ahoraBO.getMonth(), 1);
  const inicioMesActualUTC = new Date(inicioMesActualBO.getTime() + 4 * 60 * 60 * 1000);

  const inicioMesAnteriorBO = new Date(ahoraBO.getFullYear(), ahoraBO.getMonth() - 1, 1);
  const inicioMesAnteriorUTC = new Date(inicioMesAnteriorBO.getTime() + 4 * 60 * 60 * 1000);
  const finMesAnteriorUTC = new Date(inicioMesActualUTC.getTime() - 1);

  // Todas las consultas en paralelo
  const [
    ingresosTotalesResult,
    ingresosMesActualResult,
    ingresosMesAnteriorResult,
    pedidosCompletados,
    pedidosMesActualCount,
    pedidosMesAnteriorCount,
    usuariosActivos,
    usuariosAntesDelMes,
    proveedoresAprobados,
    pedidosHoy,
    ingresosHoyResult,
    usuariosHoy,
    provPendientes,
    prodInactivos,
    pedidosPendientes,
    carritosActivos,
    ultimosProveedores,
    topProductosRaw,
    ventasCategoriasRaw,
  ] = await Promise.all([
    // Ingresos totales acumulados
    prisma.pedidos.aggregate({ _sum: { total: true }, where: { estado: 'entregado' } }),
    // Ingresos del mes actual
    prisma.pedidos.aggregate({
      _sum: { total: true },
      where: { estado: 'entregado', created_at: { gte: inicioMesActualUTC } },
    }),
    // Ingresos del mes anterior
    prisma.pedidos.aggregate({
      _sum: { total: true },
      where: { estado: 'entregado', created_at: { gte: inicioMesAnteriorUTC, lte: finMesAnteriorUTC } },
    }),
    // Pedidos completados (total acumulado)
    prisma.pedidos.count({ where: { estado: 'entregado' } }),
    // Pedidos completados este mes
    prisma.pedidos.count({ where: { estado: 'entregado', created_at: { gte: inicioMesActualUTC } } }),
    // Pedidos completados mes anterior
    prisma.pedidos.count({
      where: { estado: 'entregado', created_at: { gte: inicioMesAnteriorUTC, lte: finMesAnteriorUTC } },
    }),
    // Usuarios activos totales
    prisma.usuarios.count({ where: { activo: true, tipo: 'usuario' } }),
    // Usuarios activos antes de este mes (para calcular delta)
    prisma.usuarios.count({ where: { activo: true, tipo: 'usuario', created_at: { lt: inicioMesActualUTC } } }),
    // Proveedores aprobados
    prisma.proveedores.count({ where: { estado: 'aprobado' } }),
    // Pedidos de hoy (cualquier estado)
    prisma.pedidos.count({ where: { created_at: { gte: inicioHoyUTC } } }),
    // Ingresos de hoy (entregados)
    prisma.pedidos.aggregate({
      _sum: { total: true },
      where: { estado: 'entregado', created_at: { gte: inicioHoyUTC } },
    }),
    // Nuevos usuarios hoy
    prisma.usuarios.count({ where: { tipo: 'usuario', created_at: { gte: inicioHoyUTC } } }),
    // Empresas por aprobar
    prisma.proveedores.count({ where: { estado: 'pendiente' } }),
    // Productos inactivos
    prisma.productos.count({ where: { activo: false } }),
    // Pedidos pendientes de atención
    prisma.pedidos.count({ where: { estado: 'pendiente' } }),
    // Carritos activos
    prisma.carrito.count(),
    // Últimos 5 proveedores registrados
    prisma.proveedores.findMany({ take: 5, orderBy: { created_at: 'desc' } }),
    // Top 5 productos por cantidad vendida (detalle_pedidos)
    prisma.detalle_pedidos.groupBy({
      by: ['producto_id'],
      _sum: { cantidad: true },
      orderBy: { _sum: { cantidad: 'desc' } },
      take: 5,
    }),
    // Ventas por categoría (para calcular porcentajes reales)
    prisma.detalle_pedidos.findMany({
      where: { pedidos: { estado: 'entregado' } },
      select: {
        subtotal: true,
        productos: {
          select: { categorias: { select: { nombre: true } } },
        },
      },
    }),
  ]);

  // Procesar ventas por categoría
  const ventasPorCatMap = new Map<string, number>();
  for (const d of ventasCategoriasRaw) {
    const cat = d.productos.categorias?.nombre ?? 'Sin categoría';
    ventasPorCatMap.set(cat, (ventasPorCatMap.get(cat) ?? 0) + Number(d.subtotal));
  }
  const totalVentasCat = [...ventasPorCatMap.values()].reduce((a, b) => a + b, 0);
  const categoriasVentas = [...ventasPorCatMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nombre, total]) => ({
      nombre,
      total,
      porcentaje: totalVentasCat > 0 ? Math.round((total / totalVentasCat) * 100) : 0,
    }));

  // Procesar top productos (segunda consulta solo si hay resultados)
  type TopProducto = { id: number; nombre: string; vendidos: number; imagen_url: string | null; categoria: string };
  let topProductos: TopProducto[] = [];
  if (topProductosRaw.length > 0) {
    const ids = topProductosRaw.map(t => t.producto_id);
    const info = await prisma.productos.findMany({
      where: { id: { in: ids } },
      select: { id: true, nombre: true, imagen_url: true, categorias: { select: { nombre: true } } },
    });
    topProductos = topProductosRaw.map(t => {
      const p = info.find(x => x.id === t.producto_id);
      return {
        id: t.producto_id,
        nombre: p?.nombre ?? 'Producto eliminado',
        vendidos: t._sum.cantidad ?? 0,
        imagen_url: p?.imagen_url ?? null,
        categoria: p?.categorias?.nombre ?? 'Sin categoría',
      };
    });
  }

  // Calcular deltas reales (mes actual vs mes anterior)
  const ingresosMesActual = Number(ingresosMesActualResult._sum.total ?? 0);
  const ingresosMesAnterior = Number(ingresosMesAnteriorResult._sum.total ?? 0);
  const deltaIngresos = calcularDelta(ingresosMesActual, ingresosMesAnterior);
  const deltaPedidos = calcularDelta(pedidosMesActualCount, pedidosMesAnteriorCount);
  const deltaUsuarios = calcularDelta(usuariosActivos, usuariosAntesDelMes);

  const formatBs = (n: number) => `Bs ${n.toLocaleString('es-BO', { minimumFractionDigits: 0 })}`;
  const formatNum = (n: number) => n.toLocaleString('es-BO');

  const solicitudesData = [
    { label: "Empresas por aprobar",  valor: provPendientes,    urgente: provPendientes > 0,   href: "/admin/empresas/actividad" },
    { label: "Productos inactivos",   valor: prodInactivos,     urgente: prodInactivos > 5,    href: "/admin/productos" },
    { label: "Pedidos pendientes",    valor: pedidosPendientes, urgente: pedidosPendientes > 0, href: "/admin/pedidos" },
    { label: "Carritos activos",      valor: carritosActivos,   urgente: false,                href: "/admin/carritos" },
  ];

  return (
    <div className="space-y-6 p-4">

      {/* Métricas principales */}
      <section>
        <h2 className="text-[9px] tracking-[2.5px] uppercase text-[#7A5260] font-bold mb-4 opacity-80">
          Resumen —{" "}
          {new Intl.DateTimeFormat("es-BO", { month: "long", year: "numeric", timeZone: "America/La_Paz" }).format(new Date())}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            value={formatBs(Number(ingresosTotalesResult._sum.total ?? 0))}
            label="Ingresos Totales"
            delta={deltaIngresos.texto}
            deltaType={deltaIngresos.tipo}
            barFrom="#8E1B3A"
            barTo="#BC9968"
          />
          <MetricCard
            value={formatNum(pedidosCompletados)}
            label="Pedidos Completados"
            delta={deltaPedidos.texto}
            deltaType={deltaPedidos.tipo}
            barFrom="#AB3A50"
            barTo="#BC9968"
          />
          <MetricCard
            value={formatNum(usuariosActivos)}
            label="Usuarios Activos"
            delta={deltaUsuarios.texto}
            deltaType={deltaUsuarios.tipo}
            barFrom="#5C3A2E"
            barTo="#BC9968"
          />
          <MetricCard
            value={formatNum(proveedoresAprobados)}
            label="Empresas Activas"
            delta={`${proveedoresAprobados} aprobadas`}
            deltaType="neutral"
            barFrom="#BC9968"
            barTo="#F5E6D0"
          />
        </div>
      </section>

      {/* Resumen del día */}
      <ResumenHoy
        pedidosHoy={pedidosHoy}
        ingresosHoy={Number(ingresosHoyResult._sum.total ?? 0)}
        usuariosHoy={usuariosHoy}
        provPendientes={provPendientes}
      />

      {/* Acciones rápidas */}
      <section>
        <h2 className="text-[9px] tracking-[2.5px] uppercase text-[#7A5260] font-bold mb-4 opacity-80">
          Acciones rápidas de administración
        </h2>
        <QuickActions />
      </section>

      {/* Grid principal: Tabla proveedores + Actividad + Categorías */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4">
        <ProveedoresTable data={ultimosProveedores} />
        <div className="flex flex-col gap-4">
          <VentasCategorias categorias={categoriasVentas} />
        </div>
      </div>

      {/* Grid inferior: Pendientes + Top productos + Auditoría */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SolicitudesPendientes solicitudes={solicitudesData} />
        <TopProductos productos={topProductos} />
      </div>

    </div>
  );
}
