
export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import Image from "next/image";
import DashboardGlobal from "./_components/DashboardGlobal";
import QuickActions from "./_components/QuickActions";
import SolicitudesPendientes from "./_components/SolicitudesPendientes";
import { Store, UserCheck, ShieldAlert } from "lucide-react";

export default async function AdminPage() {
  // 1. Fetch KPI Base Counts
  const [
    totalUsuarios,
    totalEmpresas,
    totalProveedores,
    totalProductos,
    pedidosCompletados,
    ventasGlobales,
    ingresosAgg,
    dineroRetenidoAgg, // <--- NUEVO
  ] = await Promise.all([
    prisma.usuarios.count(),
    prisma.proveedores.count({ where: { estado: "aprobado" } }),
    prisma.proveedores.count(),
    prisma.productos.count({ where: { activo: true } }),
    prisma.pedidos.count({ where: { estado: "entregado" } }),
    prisma.pedidos.count(),
    prisma.pedidos.aggregate({
      _sum: { total: true },
      where: { estado: "entregado" },
    }),
    prisma.pedidos.aggregate({
      _sum: { total: true },
      where: { estado: { in: ["en_preparacion", "listo"] } }, // <--- EL DINERO RETENIDO
    }),
  ]);

  const ingresosTotales = Number(ingresosAgg._sum.total || 0);
  const dineroRetenido = Number(dineroRetenidoAgg._sum.total || 0);

  // LA MAGIA DEL NEGOCIO
  const comisionEmotia = ingresosTotales * 0.10;
  const pagoProveedores = ingresosTotales * 0.90;

  // 2. Fetch growth metrics (Users in last 30 days vs total)
  const lastMonthDate = new Date();
  lastMonthDate.setDate(lastMonthDate.getDate() - 30);
  const usuariosNuevosMes = await prisma.usuarios.count({
    where: { created_at: { gte: lastMonthDate } },
  });
  const crecimientoMensual =
    totalUsuarios > 0
      ? (usuariosNuevosMes / Math.max(1, totalUsuarios - usuariosNuevosMes)) * 100
      : 0;

  // 3. Prepare monthly user registrations (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const usuariosHistorico = await prisma.usuarios.findMany({
    where: { created_at: { gte: sixMonthsAgo } },
    select: { created_at: true },
    orderBy: { created_at: "asc" },
  });

  const pedidosHistorico = await prisma.pedidos.findMany({
    where: {
      estado: "entregado",
      created_at: { gte: sixMonthsAgo },
    },
    select: { created_at: true, total: true },
    orderBy: { created_at: "asc" },
  });

  // JS grouping for months
  const nombresMeses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  const getMesLabel = (date: Date) => {
    return `${nombresMeses[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
  };

  // Generate continuous list of last 6 months
  const ultimos6Meses: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    ultimos6Meses.push(getMesLabel(d));
  }

  // Users group mapping
  const usersGroup: Record<string, number> = {};
  ultimos6Meses.forEach((m) => (usersGroup[m] = 0));
  usuariosHistorico.forEach((u) => {
    const label = getMesLabel(u.created_at);
    if (label in usersGroup) {
      usersGroup[label]++;
    }
  });

  const usuariosMensuales = ultimos6Meses.map((m) => ({
    mes: m,
    count: usersGroup[m],
  }));

  // Sales group mapping
  const salesGroup: Record<string, { monto: number; pedidos: number }> = {};
  ultimos6Meses.forEach((m) => (salesGroup[m] = { monto: 0, pedidos: 0 }));
  pedidosHistorico.forEach((p) => {
    const label = getMesLabel(p.created_at);
    if (label in salesGroup) {
      salesGroup[label].monto += Number(p.total || 0);
      salesGroup[label].pedidos++;
    }
  });

  const ventasMensuales = ultimos6Meses.map((m) => ({
    mes: m,
    monto: salesGroup[m].monto,
    pedidos: salesGroup[m].pedidos,
  }));

  // 4. Fetch Top 5 Companies by Sales
  const topEmpresasRaw = await prisma.proveedores.findMany({
    where: { estado: "aprobado" },
    orderBy: { total_vendido: "desc" },
    take: 5,
    select: { nombre_negocio: true, total_vendido: true },
  });

  const ingresosEmpresas = topEmpresasRaw.map((e) => ({
    nombre: e.nombre_negocio,
    monto: Number(e.total_vendido || 0),
  }));

  // 5. Fetch Orders by State
  const pedidosTotal = await prisma.pedidos.count();
  const pedidosPorEstadoRaw = await prisma.pedidos.groupBy({
    by: ["estado"],
    _count: { id: true },
  });

  const pedidosEstados = pedidosPorEstadoRaw.map((item) => {
    const totalCantidad = item._count.id;
    const pct = pedidosTotal > 0 ? Math.round((totalCantidad / pedidosTotal) * 100) : 0;
    return {
      nombre: item.estado,
      cantidad: totalCantidad,
      pct,
    };
  });

  // 6. Fetch Top 5 Products sold
  const topProductosVendidosRaw = await prisma.detalle_pedidos.findMany({
    where: { pedidos: { estado: "entregado" } },
    select: {
      cantidad: true,
      subtotal: true,
      productos: {
        select: { nombre: true },
      },
    },
  });

  const productSalesMap: Record<string, { nombre: string; cantidad: number; total: number }> = {};
  topProductosVendidosRaw.forEach((d) => {
    const name = d.productos?.nombre || "Producto Desconocido";
    if (!productSalesMap[name]) {
      productSalesMap[name] = { nombre: name, cantidad: 0, total: 0 };
    }
    productSalesMap[name].cantidad += d.cantidad;
    productSalesMap[name].total += Number(d.subtotal || 0);
  });

  const productosMasVendidos = Object.values(productSalesMap)
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  // 7. Get pending tasks metadata for bottom stats
  const [
    proveedoresPendientes,
    productosInactivos,
    pedidosCancelados,
    pagosFallidos,
  ] = await Promise.all([
    prisma.proveedores.count({ where: { estado: "pendiente" } }),
    prisma.productos.count({ where: { activo: false } }),
    prisma.pedidos.count({ where: { estado: "cancelado" } }),
    prisma.pedidos.count({ where: { estado: "cancelado", metodo_pago: { not: null } } }),
  ]);

  const dashboardData = {
    kpis: {
      usuariosRegistrados: totalUsuarios,
      empresasActivas: totalEmpresas,
      proveedoresActivos: totalProveedores,
      productosPublicados: totalProductos,
      pedidosCompletados: pedidosCompletados,
      ventasGlobales: ventasGlobales,
      ingresosTotales: ingresosTotales,
      comisionEmotia,     // <--- NUEVO
      pagoProveedores,    // <--- NUEVO
      dineroRetenido,     // <--- NUEVO
      crecimientoMensual,
    },
    usuariosMensuales,
    ventasMensuales,
    ingresosEmpresas,
    pedidosEstados,
    productosMasVendidos,
  };

  return (
    <div className="space-y-8 p-2 sm:p-0 animate-fade-in">

      {/* Cabecera / Banner PREPE Principal */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm border border-[#8E1B3A]/10 relative overflow-hidden">

        {/* Contenedor de Texto - max-w-[70%] asegura espacio para el logo */}
        <div className="space-y-2 relative z-10 w-full md:max-w-[70%] text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8E1B3A]/10 border border-[#8E1B3A]/20 text-xs font-semibold text-[#BC9968]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Ecosistema Unificado Central
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#5A0F24] leading-tight">
            Bienvenido a la Plataforma de Regalos Personalizados y Experiencias (PREPE)
          </h1>
          <p className="text-sm sm:text-base text-[#7A5260] font-light">
            Panel administrativo premium del ecosistema. Supervisa en tiempo real el catálogo, los ingresos consolidados, pedidos y el crecimiento integral de todas las cuentas y empresas comerciales de la plataforma.
          </p>
        </div>

        {/* Contenedor del Logo Agrandado */}
        <div className="flex items-center justify-center relative z-10 flex-shrink-0 w-full md:w-auto">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 flex-shrink-0">
            <Image
              src="/logo/prepelogo.png"
              alt="PREPE Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Glow de fondo */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#8E1B3A]/5 rounded-full blur-3xl"></div>
      </div>

      {/* 8. Componente de Visualización e Interacción del Dashboard */}
      <DashboardGlobal data={dashboardData} />

      {/* 9. Módulo de Acciones Rápidas */}
      <section className="bg-white/40 backdrop-blur-sm rounded-3xl p-6 border border-[#8E1B3A]/5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Store className="text-[#8E1B3A]" size={20} />
          <h3 className="font-serif text-xl font-bold text-[#5A0F24]">Acciones Administrativas</h3>
        </div>
        <QuickActions empresaId={0} />
      </section>

      {/* 10. Módulo de Alertas Críticas & Solicitudes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SolicitudesPendientes
            proveedoresPendientes={proveedoresPendientes}
            productosInactivos={productosInactivos}
            pedidosCancelados={pedidosCancelados}
            pagosFallidos={pagosFallidos}
          />
        </div>

        {/* Panel de soporte eliminado */}
      </div>

    </div>
  );
}