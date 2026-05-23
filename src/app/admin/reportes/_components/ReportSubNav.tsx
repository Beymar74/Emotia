"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const REPORTES = [
  { href: "/admin/reportes/ventas", label: "Ventas" },
  { href: "/admin/reportes/clientes", label: "Clientes" },
  { href: "/admin/reportes/pedidos", label: "Pedidos" },
  { href: "/admin/reportes/carrito", label: "Carrito" },
  { href: "/admin/reportes/pagos", label: "Pagos" },
  { href: "/admin/reportes/productos", label: "Productos" },
  { href: "/admin/reportes/categorias", label: "Categorías" },
  { href: "/admin/reportes/empresas", label: "Empresas" },
  { href: "/admin/reportes/representantes", label: "Representantes" },
  { href: "/admin/reportes/calidad", label: "Calidad" },
  { href: "/admin/reportes/fidelizacion", label: "Fidelización" },
  { href: "/admin/reportes/usuarios", label: "Usuarios" },
  { href: "/admin/reportes/centro-cuentas", label: "Centro de Cuentas" },
  { href: "/admin/reportes/recomendaciones", label: "Recom. IA" },
  { href: "/admin/reportes/puntos", label: "Puntos" },
  { href: "/admin/reportes/personalizacion", label: "Personalización" },
  { href: "/admin/reportes/recordatorios", label: "Recordatorios" },
  { href: "/admin/reportes/notificaciones", label: "Notificaciones" },
  { href: "/admin/reportes/global", label: "Global" },
];

export default function ReportSubNav() {
  const pathname = usePathname();

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 overflow-x-auto">
      <div className="flex items-center gap-1 p-1.5 min-w-max">
        <Link
          href="/admin/reportes"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[#7A5260] hover:bg-[#FAF3EC] hover:text-[#8E1B3A] transition-all flex-shrink-0"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Volver al Hub
        </Link>
        <div className="w-px h-4 bg-[#8E1B3A]/10 flex-shrink-0 mx-0.5" />
        {REPORTES.map((r) => {
          const isActive = pathname === r.href;
          return (
            <Link
              key={r.href}
              href={r.href}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
                isActive
                  ? "bg-[#8E1B3A] text-white"
                  : "text-[#7A5260] hover:bg-[#FAF3EC] hover:text-[#8E1B3A]"
              }`}
            >
              {r.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
