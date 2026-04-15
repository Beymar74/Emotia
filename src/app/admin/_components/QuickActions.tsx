import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function QuickActions() {
  // --- 1. CONSULTAS A LA BASE DE DATOS ---
  // Obtenemos los conteos reales para que las alertas sean precisas
  
  const provPendientes = await prisma.proveedores.count({
    where: { estado: 'pendiente' }
  });

  const prodInactivos = await prisma.productos.count({
    where: { activo: false }
  });

  const pedidosCancelados = await prisma.pedidos.count({
    where: { estado: 'cancelado' }
  });

  // --- 2. CONFIGURACIÓN DE LAS ACCIONES ---
  // Integramos los conteos reales y añadimos la ruta 'href' a cada uno
  const actions = [
    {
      label: "Aprobar proveedor",
      sub: `${provPendientes} ${provPendientes === 1 ? 'pendiente' : 'pendientes'}`,
      href: "/admin/proveedores", // Ajusta esta ruta según la estructura de tus carpetas
      bg: "bg-[#8E1B3A]/10",
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="5.5" r="2.5" stroke="#8E1B3A" strokeWidth="1.3" />
          <path d="M3 13c0-2.2 2.2-4 5-4s5 1.8 5 4" stroke="#8E1B3A" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "Desactivar producto",
      sub: `${prodInactivos} a revisar`,
      href: "/admin/productos", // Ruta a tu catálogo de productos
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
      sub: `${pedidosCancelados} cancelaciones`,
      href: "/admin/pedidos", // Ruta a tus pedidos
      bg: "bg-[#5C3A2E]/10",
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="#5C3A2E" strokeWidth="1.3" />
          <path d="M5 4V3a3 3 0 016 0v1" stroke="#5C3A2E" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "Exportar reporte PDF",
      sub: "Ventas del mes",
      href: "/admin/reportes", // Te lleva a reportes donde estará el botón de PDF
      bg: "bg-[#AB3A50]/8",
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <path d="M2 13l3-4 3 3 4-7" stroke="#AB3A50" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className="bg-white border border-[#8E1B3A]/10 rounded-xl p-5 text-center cursor-pointer hover:border-[#8E1B3A]/40 hover:shadow-sm transition-all block"
        >
          <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${action.bg}`}>
            {action.icon}
          </div>
          <p className="text-sm text-[#2A0E18] font-medium">{action.label}</p>
          <p className="text-xs text-[#7A5260] mt-1">{action.sub}</p>
        </Link>
      ))}
    </div>
  );
}