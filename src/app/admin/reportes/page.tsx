import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function fmtBs(n: number) {
  if (n >= 1_000_000) return `Bs ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `Bs ${(n / 1_000).toFixed(1)}k`;
  return `Bs ${Math.round(n)}`;
}

function getIcon(tipo: string) {
  if (tipo === "ventas")
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 17l4-6 4 4 5-8 4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (tipo === "clientes")
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="17" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" /><path d="M21 20c0-2.2-1.8-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
  if (tipo === "pedidos")
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M8 6V4a4 4 0 018 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
  if (tipo === "carrito")
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 3h3l2 9h10l2-6H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="20" r="1.5" fill="currentColor" /><circle cx="17" cy="20" r="1.5" fill="currentColor" /></svg>;
  if (tipo === "pagos")
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M2 10h20" stroke="currentColor" strokeWidth="2" /><path d="M6 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
  if (tipo === "productos")
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 7l-8-4-8 4m16 0v10l-8 4-8-4V7m8 4v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (tipo === "categorias")
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" /><rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" /><rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" /><rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" /></svg>;
  if (tipo === "empresas")
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="10" width="18" height="11" rx="1" stroke="currentColor" strokeWidth="2" /><path d="M7 10V7a5 5 0 0110 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
  if (tipo === "representantes" || tipo === "proveedores")
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (tipo === "geografico")
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /><path d="M12 3c0 0-4 4-4 9s4 9 4 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M12 3c0 0 4 4 4 9s-4 9-4 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
  if (tipo === "calidad")
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2l3 6.3 7 1-5 4.9 1.2 6.8L12 17.8l-6.2 3.2L7 14.2 2 9.3l7-1L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>;
  if (tipo === "fidelizacion")
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 21C12 21 3 15.5 3 9a5 5 0 0110-1 5 5 0 0110 1c0 6.5-9 12-9 12z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>;
  if (tipo === "usuarios")
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="2" /><path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="17" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.8" /><path d="M21 20c0-2.5-1.8-4.5-4-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
  if (tipo === "centro-cuentas")
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (tipo === "recomendaciones")
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9.5 2A2.5 2.5 0 017 4.5v0A2.5 2.5 0 019.5 7h5A2.5 2.5 0 0117 4.5v0A2.5 2.5 0 0114.5 2h-5z" stroke="currentColor" strokeWidth="2" /><path d="M12 7v10M8 11l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 22h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
  if (tipo === "puntos")
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L9.5 8.5H3L8.5 12.5L6.5 19L12 15L17.5 19L15.5 12.5L21 8.5H14.5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>;
  if (tipo === "personalizacion")
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (tipo === "recordatorios")
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (tipo === "notificaciones")
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="18" cy="5" r="3" fill="#A32D2D" /></svg>;
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /><path d="M12 3c0 0-4 4-4 9s4 9 4 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}

export default async function ReportesHubPage() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const en30dias = new Date(hoy);
  en30dias.setDate(en30dias.getDate() + 30);

  const [
    totalIngresos,
    totalPedidos,
    totalUsuarios,
    totalEmpresas,
    totalProductos,
    totalCalificaciones,
    totalProveedores,
    totalUsuariosRegistrados,
    pedidosPendientes,
    ingresosMes,
    // nuevos
    totalCarritoItems,
    metodosPago,
    categoriasActivas,
    ciudadesData,
    totalRecomendaciones,
    recConvertidas,
    puntosAgg,
    pedidosPersonalizados,
    recordatoriosActivos,
    notifNoLeidas,
  ] = await Promise.all([
    prisma.pedidos.aggregate({ _sum: { total: true }, where: { estado: "entregado" } }),
    prisma.pedidos.count({ where: { estado: "entregado" } }),
    prisma.usuarios.count({ where: { activo: true, tipo: "usuario" } }),
    prisma.proveedores.count({ where: { estado: "aprobado" } }),
    prisma.productos.count({ where: { activo: true } }),
    prisma.detalle_pedidos.count({ where: { calificacion: { not: null } } }),
    prisma.proveedores.count(),
    prisma.usuarios.count({ where: { tipo: "usuario" } }),
    prisma.pedidos.count({ where: { estado: { notIn: ["entregado", "cancelado"] } } }),
    prisma.pedidos.aggregate({ _sum: { total: true }, where: { estado: "entregado", created_at: { gte: inicioMes } } }),
    // nuevos
    prisma.carrito.count(),
    prisma.pedidos.findMany({ select: { metodo_pago: true }, distinct: ["metodo_pago"], where: { metodo_pago: { not: null } } }),
    prisma.categorias.count({ where: { activo: true } }),
    prisma.direcciones.findMany({ select: { ciudad: true }, distinct: ["ciudad"] }),
    prisma.recomendaciones.count(),
    prisma.recomendaciones.count({ where: { convertida_en_compra: true } }),
    prisma.usuarios.aggregate({ _sum: { puntos: true }, where: { tipo: "usuario" } }),
    prisma.detalle_pedidos.count({ where: { personalizacion: { isNot: null } } }),
    prisma.recordatorios.count({ where: { activo: true, fecha_evento: { gte: hoy, lte: en30dias } } }),
    prisma.notificaciones.count({ where: { leida: false } }),
  ]);

  const ingresos = Number(totalIngresos._sum.total || 0);
  const ingresosMesNum = Number(ingresosMes._sum.total || 0);
  const puntosActivos = Number(puntosAgg._sum.puntos || 0);
  const tasaConvIA = totalRecomendaciones > 0 ? Math.round((recConvertidas / totalRecomendaciones) * 100) : 0;
  const totalCiudades = ciudadesData.length;
  const totalMetodos = metodosPago.length;
  const mesActual = new Intl.DateTimeFormat("es-BO", { month: "long", year: "numeric" }).format(new Date());

  const grupos = [
    {
      id: "comercial",
      label: "Comercial",
      descripcion: "Ingresos, clientes, pedidos y ciclo de compra",
      color: "#8E1B3A",
      reportes: [
        {
          href: "/admin/reportes/ventas",
          titulo: "Ventas",
          descripcion: "Ingresos, ticket promedio y evolución mensual por empresa",
          stat: fmtBs(ingresos),
          statLabel: "ventas totales acumuladas",
          subStat: `${fmtBs(ingresosMesNum)} este mes`,
          icon: "ventas",
        },
        {
          href: "/admin/reportes/clientes",
          titulo: "Clientes",
          descripcion: "Base de usuarios, retención y top compradores",
          stat: String(totalUsuarios),
          statLabel: "clientes activos",
          subStat: `de ${totalUsuariosRegistrados} registrados`,
          icon: "clientes",
        },
        {
          href: "/admin/reportes/pedidos",
          titulo: "Pedidos",
          descripcion: "Estados, tiempos de entrega y volumen logístico",
          stat: String(totalPedidos),
          statLabel: "pedidos completados",
          subStat: `${pedidosPendientes} en proceso ahora`,
          icon: "pedidos",
        },
        {
          href: "/admin/reportes/carrito",
          titulo: "Carrito",
          descripcion: "Items en carritos activos y valor potencial de ventas pendientes",
          stat: String(totalCarritoItems),
          statLabel: "items en carritos activos",
          subStat: "sin finalizar compra",
          icon: "carrito",
        },
        {
          href: "/admin/reportes/pagos",
          titulo: "Métodos de Pago",
          descripcion: "Distribución de modalidades de pago e ingresos por método",
          stat: String(totalMetodos),
          statLabel: "modalidades distintas",
          subStat: `en ${totalPedidos + pedidosPendientes} pedidos totales`,
          icon: "pagos",
        },
      ],
    },
    {
      id: "operativo",
      label: "Operativo",
      descripcion: "Catálogo, categorías, empresas y cobertura geográfica",
      color: "#185FA5",
      reportes: [
        {
          href: "/admin/reportes/productos",
          titulo: "Productos",
          descripcion: "Catálogo activo, más vendidos e inventario por categoría",
          stat: String(totalProductos),
          statLabel: "productos activos",
          subStat: "en el catálogo",
          icon: "productos",
        },
        {
          href: "/admin/reportes/categorias",
          titulo: "Categorías",
          descripcion: "Rendimiento e ingresos del catálogo agrupado por categoría",
          stat: String(categoriasActivas),
          statLabel: "categorías activas",
          subStat: "visibles al cliente",
          icon: "categorias",
        },
        {
          href: "/admin/reportes/empresas",
          titulo: "Empresas",
          descripcion: "Desempeño, ingresos y métricas por empresa registrada",
          stat: String(totalEmpresas),
          statLabel: "empresas activas",
          subStat: `de ${totalProveedores} totales en sistema`,
          icon: "empresas",
        },
        {
          href: "/admin/reportes/representantes",
          titulo: "Representantes",
          descripcion: "Estado, incorporación y ranking de todos los representantes",
          stat: String(totalProveedores),
          statLabel: "representantes registrados",
          subStat: `${totalEmpresas} aprobados y operativos`,
          icon: "representantes",
        },
      ],
    },
    {
      id: "analitico",
      label: "Analítico",
      descripcion: "Satisfacción, fidelización, IA y comportamiento de usuarios",
      color: "#2D7A47",
      reportes: [
        {
          href: "/admin/reportes/calidad",
          titulo: "Calidad",
          descripcion: "Calificaciones, reseñas y nivel de satisfacción del cliente",
          stat: String(totalCalificaciones),
          statLabel: "reseñas registradas",
          subStat: "valoraciones de productos",
          icon: "calidad",
        },
        {
          href: "/admin/reportes/fidelizacion",
          titulo: "Fidelización",
          descripcion: "Lealtad, frecuencia de compra y retención de clientes",
          stat: `${totalPedidos > 0 ? Math.round((totalUsuarios / Math.max(totalPedidos, 1)) * 100) : 0}%`,
          statLabel: "tasa de retorno estimada",
          subStat: "clientes recurrentes",
          icon: "fidelizacion",
        },
        {
          href: "/admin/reportes/usuarios",
          titulo: "Usuarios",
          descripcion: "Registros, actividad y segmentación de la base de usuarios",
          stat: String(totalUsuariosRegistrados),
          statLabel: "usuarios totales",
          subStat: `${totalUsuarios} activos en plataforma`,
          icon: "usuarios",
        },
        {
          href: "/admin/reportes/centro-cuentas",
          titulo: "Centro de Cuentas",
          descripcion: "Consolidado de todas las cuentas del sistema (usuarios, empresas, representantes)",
          stat: String(totalUsuariosRegistrados + totalProveedores),
          statLabel: "cuentas totales",
          subStat: `${totalUsuarios + totalEmpresas} activas / aprobadas`,
          icon: "centro-cuentas",
        },
        {
          href: "/admin/reportes/recomendaciones",
          titulo: "Recomendaciones IA",
          descripcion: "Conversión del motor de recomendaciones inteligentes por ocasión",
          stat: String(totalRecomendaciones),
          statLabel: "recomendaciones generadas",
          subStat: `${tasaConvIA}% convertidas en compra`,
          icon: "recomendaciones",
        },
        {
          href: "/admin/reportes/puntos",
          titulo: "Puntos & Gamificación",
          descripcion: "Puntos en circulación, insignias otorgadas y descuentos canjeados",
          stat: puntosActivos.toLocaleString(),
          statLabel: "puntos activos en sistema",
          subStat: "en poder de usuarios",
          icon: "puntos",
        },
        {
          href: "/admin/reportes/personalizacion",
          titulo: "Personalización",
          descripcion: "Adopción de mensajes, empaques especiales y tarjetas en pedidos",
          stat: String(pedidosPersonalizados),
          statLabel: "pedidos con tarjeta personalizada",
          subStat: "experiencia diferenciada",
          icon: "personalizacion",
        },
        {
          href: "/admin/reportes/recordatorios",
          titulo: "Recordatorios",
          descripcion: "Eventos próximos y fechas importantes de los usuarios",
          stat: String(recordatoriosActivos),
          statLabel: "eventos en los próx. 30 días",
          subStat: "recordatorios activos",
          icon: "recordatorios",
        },
        {
          href: "/admin/reportes/notificaciones",
          titulo: "Notificaciones",
          descripcion: "Volumen de notificaciones, tasa de lectura y tipos frecuentes",
          stat: String(notifNoLeidas),
          statLabel: "notificaciones sin leer",
          subStat: "pendientes de lectura",
          icon: "notificaciones",
        },
        {
          href: "/admin/reportes/global",
          titulo: "Reporte Global",
          descripcion: "Visión consolidada de todas las métricas del sistema",
          stat: fmtBs(ingresos),
          statLabel: "ingresos consolidados",
          subStat: "vista unificada del sistema",
          icon: "global",
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#3D0A1A] via-[#5A0F24] to-[#8E1B3A] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative">
          <p className="text-xs tracking-widest uppercase text-white/50 font-medium">SISTEMA PREPE · REPORTES</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-1">Inteligencia de Negocio</h1>
          <p className="mt-1 text-white/55 text-sm capitalize">{mesActual} · métricas en tiempo real · {grupos.reduce((s, g) => s + g.reportes.length, 0)} reportes disponibles</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: "Ingresos totales", valor: fmtBs(ingresos), sub: `${fmtBs(ingresosMesNum)} este mes` },
              { label: "Pedidos completados", valor: String(totalPedidos), sub: `${pedidosPendientes} en proceso` },
              { label: "Clientes activos", valor: String(totalUsuarios), sub: `de ${totalUsuariosRegistrados} registrados` },
              { label: "Empresas activas", valor: String(totalEmpresas), sub: `de ${totalProveedores} en sistema` },
            ].map((m) => (
              <div key={m.label}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-serif text-2xl sm:text-3xl font-bold text-white">{m.valor}</p>
                <p className="text-xs text-white/70 mt-0.5 font-medium">{m.label}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grouped report sections */}
      {grupos.map((grupo) => (
        <div key={grupo.id} className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-5 w-1 rounded-full flex-shrink-0" style={{ background: grupo.color }} />
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: grupo.color }}>{grupo.label}</span>
              <span className="text-xs text-[#7A5260]">— {grupo.descripcion}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {grupo.reportes.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group bg-white rounded-2xl border border-[#8E1B3A]/10 overflow-hidden hover:border-[#8E1B3A]/25 hover:shadow-lg transition-all flex flex-col"
              >
                <div className="h-1 flex-shrink-0" style={{ background: grupo.color }} />
                <div className="p-5 flex flex-col gap-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: grupo.color + "12", color: grupo.color }}>
                      {getIcon(r.icon)}
                    </div>
                    <svg className="w-4 h-4 text-[#7A5260] opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 flex-shrink-0"
                      viewBox="0 0 16 16" fill="none">
                      <path d="M3 13L13 3M13 3H7M13 3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-bold text-[#2A0E18] group-hover:text-[#8E1B3A] transition-colors leading-tight">
                      {r.titulo}
                    </h3>
                    <p className="text-xs text-[#7A5260] mt-1.5 leading-relaxed">{r.descripcion}</p>
                  </div>

                  <div className="pt-3 border-t border-[#8E1B3A]/8">
                    <p className="font-serif text-xl font-bold truncate" style={{ color: grupo.color }}>{r.stat}</p>
                    <p className="text-[10px] text-[#7A5260] mt-0.5">{r.statLabel}</p>
                    <p className="text-[10px] font-medium mt-0.5" style={{ color: grupo.color + "AA" }}>{r.subStat}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
