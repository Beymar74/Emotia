"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navSections = [
  {
    label: "Principal",
    items: [
      { href: "/admin", label: "Dashboard", icon: IconDashboard },
    ],
  },
  {
    label: "Usuarios & Accesos",
    items: [
      { href: "/admin/usuarios", label: "Gestión de usuarios", icon: IconUser },
      { href: "/admin/perfiles", label: "Cuentas y perfiles", icon: IconProfile },
    ],
  },
  {
    label: "Proveedores",
    items: [
      { href: "/admin/proveedores", label: "Aprobar / rechazar", icon: IconCheck },
      { href: "/admin/proveedores/actividad", label: "Supervisar actividad", icon: IconClock },
      { href: "/admin/proveedores/rendimiento", label: "Rendimiento", icon: IconChart },
    ],
  },
  {
    label: "Catálogo",
    items: [
      { href: "/admin/productos", label: "Todos los productos", icon: IconBag },
      { href: "/admin/productos/destacados", label: "Destacados", icon: IconStar },
    ],
  },
  {
    label: "Pedidos & Pagos",
    items: [
      { href: "/admin/pedidos", label: "Todos los pedidos", icon: IconBox },
      { href: "/admin/pagos", label: "Métodos de pago", icon: IconCard },
    ],
  },
  {
    label: "Reportes & Sistema",
    items: [
      { href: "/admin/reportes", label: "Reportes de ventas", icon: IconReport },
      { href: "/admin/asistente", label: "Asistente IA", icon: IconIA },
      { href: "/admin/auditoria", label: "Log de auditoría", icon: IconLog },
      { href: "/admin/configuracion", label: "Configuración", icon: IconConfig },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#5A0F24] flex flex-col flex-shrink-0 relative">
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#BC9968]/40 to-transparent" />

      {/* Header */}
      <div className="px-5 py-6 border-b border-[#BC9968]/20">
        <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium mb-1">
          Sistema PREPE
        </p>
        <h1 className="font-serif text-3xl font-bold text-[#F5E6D0] leading-none">
          Emotia
        </h1>
        <p className="text-xs text-[#F5E6D0]/50 mt-1.5">
          Panel de Administración Total
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-4 pt-5 pb-1.5 text-xs tracking-widest uppercase text-[#BC9968]/50 font-medium">
              {section.label}
            </p>
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                    isActive
                      ? "bg-gradient-to-r from-[#8E1B3A]/85 to-[#BC9968]/20 text-[#F5E6D0] font-medium"
                      : "text-[#F5E6D0]/65 hover:bg-[#BC9968]/15 hover:text-[#F5E6D0]"
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#BC9968]/18">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8E1B3A] to-[#BC9968] flex items-center justify-center text-xs font-bold text-[#F5E6D0] flex-shrink-0">
            SA
          </div>
          <div>
            <p className="text-sm text-[#F5E6D0] font-medium">Super Admin</p>
            <p className="text-xs text-[#BC9968]">PREPE · Emotia</p>
            <span className="inline-block text-xs bg-[#BC9968]/25 text-[#BC9968] px-2 py-0.5 rounded-full tracking-wide uppercase mt-1">
              Acceso total
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function IconDashboard({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="8" y="1" width="5" height="5" rx="1" fill="currentColor" opacity=".4" />
      <rect x="1" y="8" width="5" height="5" rx="1" fill="currentColor" opacity=".4" />
      <rect x="8" y="8" width="5" height="5" rx="1" fill="currentColor" opacity=".4" />
    </svg>
  );
}
function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="4.5" r="2.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 11.5c0-2 2.2-3.5 5-3.5s5 1.5 5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function IconProfile({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none">
      <rect x="2" y="2" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 7h4M7 5v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none">
      <rect x="1.5" y="3" width="11" height="8" rx="1.3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 6.5h5M4.5 8.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function IconClock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 4.5V7l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconChart({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none">
      <path d="M2 11l2.5-4 2.5 2.5L10 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconBag({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none">
      <path d="M2.5 2.5h9l-1 8.5H3.5l-1-8.5z" stroke="currentColor" strokeWidth="1.1" />
      <path d="M1 2.5h12" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}
function IconStar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none">
      <path d="M7 1.5l1.5 3 3.5.5-2.5 2.5.6 3.5L7 9.5l-3.1 1.5.6-3.5L2 5l3.5-.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}
function IconBox({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none">
      <rect x="1.5" y="3.5" width="11" height="7.5" rx="1.3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 3.5V2.5a2 2 0 014 0v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function IconCard({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none">
      <rect x="2" y="3" width="10" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 6h10" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="5" cy="8.5" r="0.8" fill="currentColor" />
    </svg>
  );
}
function IconReport({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none">
      <path d="M2 11l2.5-4 2.5 2.5L10 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconIA({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none">
      <path d="M7 9.5a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3.5 13c0-1.1.5-2 1.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function IconLog({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none">
      <path d="M2 3h10v8H2z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M5 6.5h4M5 8.5h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}
function IconConfig({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M3 3l1 1M10 10l1 1M3 11l1-1M10 4l1-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
