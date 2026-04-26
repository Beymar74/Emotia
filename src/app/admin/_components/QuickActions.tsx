import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function QuickActions() {
  const [provPendientes, prodInactivos, pedidosPendientes, carritosActivos] = await Promise.all([
    prisma.proveedores.count({ where: { estado: "pendiente" } }),
    prisma.productos.count({ where: { activo: false } }),
    prisma.pedidos.count({ where: { estado: "pendiente" } }),
    prisma.carrito.count(),
  ]);

  const actions = [
    {
      label: "Aprobar proveedores",
      sub: `${provPendientes} ${provPendientes === 1 ? "pendiente" : "pendientes"}`,
      href: "/admin/proveedores/actividad",
      bg: "bg-[#8E1B3A]/10",
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="5.5" r="2.5" stroke="#8E1B3A" strokeWidth="1.3" />
          <path d="M3 13c0-2.2 2.2-4 5-4s5 1.8 5 4" stroke="#8E1B3A" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "Revisar catálogo",
      sub: `${prodInactivos} productos inactivos`,
      href: "/admin/productos",
      bg: "bg-[#BC9968]/15",
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <path d="M3 3h10l-1.2 9H4.2L3 3z" stroke="#BC9968" strokeWidth="1.3" />
          <path d="M1.5 3h13" stroke="#BC9968" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "Gestionar pedidos",
      sub: `${pedidosPendientes} pendientes`,
      href: "/admin/pedidos",
      bg: "bg-[#5C3A2E]/10",
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="#5C3A2E" strokeWidth="1.3" />
          <path d="M5 4V3a3 3 0 016 0v1" stroke="#5C3A2E" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "Carritos activos",
      sub: `${carritosActivos} sin completar`,
      href: "/admin/carritos",
      bg: "bg-[#AB3A50]/8",
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <path d="M2 2h1.5l1.8 7h7l1.2-5H5" stroke="#AB3A50" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="7" cy="13" r="1" fill="#AB3A50" />
          <circle cx="11" cy="13" r="1" fill="#AB3A50" />
        </svg>
      ),
    },
    {
      label: "Notificaciones",
      sub: "Gestionar comunicación",
      href: "/admin/notificaciones",
      bg: "bg-[#5A0F24]/8",
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <path d="M8 2a4 4 0 014 4v2.5l1 1.5H3l1-1.5V6a4 4 0 014-4z" stroke="#5A0F24" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M6.5 12.5a1.5 1.5 0 003 0" stroke="#5A0F24" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "Ver reportes",
      sub: "Ventas y métricas",
      href: "/admin/reportes",
      bg: "bg-[#2D7A47]/10",
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <path d="M2 13l3-4 3 3 4-7" stroke="#2D7A47" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className="bg-white border border-[#8E1B3A]/10 rounded-xl p-4 text-center cursor-pointer hover:border-[#8E1B3A]/40 hover:shadow-sm transition-all block"
        >
          <div className={`w-11 h-11 rounded-xl mx-auto mb-3 flex items-center justify-center ${action.bg}`}>
            {action.icon}
          </div>
          <p className="text-xs text-[#2A0E18] font-semibold leading-tight">{action.label}</p>
          <p className="text-[10px] text-[#7A5260] mt-1 leading-tight">{action.sub}</p>
        </Link>
      ))}
    </div>
  );
}