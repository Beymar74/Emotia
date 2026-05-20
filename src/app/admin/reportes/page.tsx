import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function ReportesHubPage() {
  const [
    totalIngresos,
    totalPedidos,
    totalUsuarios,
    totalEmpresas,
    totalProductos,
    totalCalificaciones,
    totalProveedores,
    totalUsuariosRegistrados,
  ] = await Promise.all([
    prisma.pedidos.aggregate({ _sum: { total: true }, where: { estado: 'entregado' } }),
    prisma.pedidos.count({ where: { estado: 'entregado' } }),
    prisma.usuarios.count({ where: { activo: true, tipo: 'usuario' } }),
    prisma.proveedores.count({ where: { estado: 'aprobado' } }),
    prisma.productos.count({ where: { activo: true } }),
    prisma.detalle_pedidos.count({ where: { calificacion: { not: null } } }),
    prisma.proveedores.count(),
    prisma.usuarios.count({ where: { tipo: 'usuario' } }),
  ]);

  const ingresos = Number(totalIngresos._sum.total || 0);
  const formatBs = (n: number) => `Bs ${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const reportes = [
    {
      href: "/admin/reportes/ventas",
      titulo: "Ventas",
      descripcion: "Ingresos, ticket promedio, evolución semanal y ventas por empresa.",
      icono: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M3 17l4-6 4 4 5-8 4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      stat: formatBs(ingresos),
      statLabel: "en ventas totales",
      color: "#8E1B3A",
      bg: "bg-[#8E1B3A]/8",
    },
    {
      href: "/admin/reportes/clientes",
      titulo: "Clientes",
      descripcion: "Usuarios registrados, retención, actividad y compradores top.",
      icono: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="2" />
          <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="17" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M21 20c0-2.2-1.8-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      stat: String(totalUsuarios),
      statLabel: "clientes activos",
      color: "#BC9968",
      bg: "bg-[#BC9968]/10",
    },
    {
      href: "/admin/reportes/pedidos",
      titulo: "Pedidos",
      descripcion: "Estado de pedidos, tiempos, cancelaciones y distribución.",
      icono: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M8 6V4a4 4 0 018 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      stat: String(totalPedidos),
      statLabel: "pedidos completados",
      color: "#5C3A2E",
      bg: "bg-[#5C3A2E]/8",
    },
    {
      href: "/admin/reportes/productos",
      titulo: "Productos",
      descripcion: "Catálogo, más vendidos, inventario por categoría.",
      icono: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M3 3h3l2 9h10l2-6H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="20" r="1.5" fill="currentColor" />
          <circle cx="17" cy="20" r="1.5" fill="currentColor" />
        </svg>
      ),
      stat: String(totalProductos),
      statLabel: "productos activos",
      color: "#185FA5",
      bg: "bg-[#185FA5]/8",
    },
    {
      href: "/admin/reportes/empresas",
      titulo: "Empresas",
      descripcion: "Desempeño, ventas y métricas de cada empresa registrada.",
      icono: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="10" width="18" height="11" rx="1" stroke="currentColor" strokeWidth="2" />
          <path d="M7 10V7a5 5 0 0110 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M9 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      stat: String(totalEmpresas),
      statLabel: "empresas activas",
      color: "#AB3A50",
      bg: "bg-[#AB3A50]/8",
    },
    {
      href: "/admin/reportes/fidelizacion",
      titulo: "Fidelización",
      descripcion: "Lealtad de clientes, frecuencia de compra y retención.",
      icono: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 21C12 21 3 15.5 3 9a5 5 0 0110-1 5 5 0 0110 1c0 6.5-9 12-9 12z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      ),
      stat: String(totalPedidos > 0 ? Math.round((totalUsuarios / Math.max(totalPedidos, 1)) * 100) : 0) + "%",
      statLabel: "tasa de retorno",
      color: "#8C5E08",
      bg: "bg-[#8C5E08]/8",
    },
    {
      href: "/admin/reportes/calidad",
      titulo: "Calidad",
      descripcion: "Calificaciones, reseñas, satisfacción y métricas de servicio.",
      icono: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3 6.3 7 1-5 4.9 1.2 6.8L12 17.8l-6.2 3.2L7 14.2 2 9.3l7-1L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      ),
      stat: String(totalCalificaciones),
      statLabel: "reseñas registradas",
      color: "#2D7A47",
      bg: "bg-[#2D7A47]/8",
    },
    {
      href: "/admin/reportes/usuarios",
      titulo: "Usuarios",
      descripcion: "Usuarios registrados, actividad, roles y estadísticas de la plataforma.",
      icono: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="2" />
          <path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="17" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M21 20c0-2.5-1.8-4.5-4-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
      stat: String(totalUsuariosRegistrados),
      statLabel: "usuarios registrados",
      color: "#5C3A2E",
      bg: "bg-[#5C3A2E]/8",
    },
    {
      href: "/admin/reportes/proveedores",
      titulo: "Proveedores",
      descripcion: "Estado, actividad y rendimiento de los proveedores registrados en PREPE.",
      icono: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      stat: String(totalProveedores),
      statLabel: "proveedores en sistema",
      color: "#185FA5",
      bg: "bg-[#185FA5]/8",
    },
    {
      href: "/admin/reportes/global",
      titulo: "Reporte Global",
      descripcion: "Visión consolidada de todas las métricas del Sistema PREPE.",
      icono: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M12 3c0 0-4 4-4 9s4 9 4 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M4.5 7.5h15M4.5 16.5h15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      ),
      stat: formatBs(ingresos),
      statLabel: "ingresos consolidados",
      color: "#5A0F24",
      bg: "bg-[#5A0F24]/8",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Reportes</p>
        <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Centro de Reportes</h1>
        <p className="mt-2 text-sm text-[#7A5260] max-w-3xl leading-relaxed">
          Accede a todos los reportes detallados del Sistema PREPE. Cada módulo tiene su propio reporte independiente con métricas, gráficas y datos exportables.
        </p>
        <p className="text-sm text-[#7A5260] mt-1">Selecciona un tipo de reporte para ver el análisis detallado.</p>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Ingresos totales", valor: formatBs(ingresos), color: "#8E1B3A" },
          { label: "Pedidos entregados", valor: String(totalPedidos), color: "#2D7A47" },
          { label: "Usuarios registrados", valor: String(totalUsuariosRegistrados), color: "#5C3A2E" },
          { label: "Usuarios activos", valor: String(totalUsuarios), color: "#BC9968" },
          { label: "Proveedores totales", valor: String(totalProveedores), color: "#185FA5" },
          { label: "Proveedores activos", valor: String(totalEmpresas), color: "#AB3A50" },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-4 relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-[#8E1B3A]/30">
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: m.color }} />
            <p className="font-serif text-2xl font-bold text-[#5A0F24]">{m.valor}</p>
            <p className="text-xs text-[#7A5260] mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Grid de reportes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {reportes.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="group bg-white rounded-2xl border border-[#8E1B3A]/10 p-5 hover:border-[#8E1B3A]/30 hover:shadow-md transition-all flex flex-col gap-4"
          >
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${r.bg}`} style={{ color: r.color }}>
                {r.icono}
              </div>
              <svg
                className="w-4 h-4 text-[#7A5260] opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                viewBox="0 0 16 16" fill="none"
              >
                <path d="M3 13L13 3M13 3H7M13 3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="flex-1">
              <h3 className="font-serif text-lg font-bold text-[#2A0E18] group-hover:text-[#8E1B3A] transition-colors">
                {r.titulo}
              </h3>
              <p className="text-xs text-[#7A5260] mt-1 leading-relaxed">{r.descripcion}</p>
            </div>

            <div className="pt-3 border-t border-[#8E1B3A]/8">
              <p className="font-serif text-xl font-bold" style={{ color: r.color }}>{r.stat}</p>
              <p className="text-xs text-[#7A5260] mt-0.5">{r.statLabel}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
