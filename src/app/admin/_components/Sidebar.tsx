"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useStackApp } from "@stackframe/stack";

const navSections = [
  {
    label: "Principal",
    icon: IconDashboard,
    items: [
      { href: "/admin", label: "Dashboard" },
    ],
  },
  {
    label: "Usuarios & Accesos",
    icon: IconUser,
    items: [
      { href: "/admin/usuarios", label: "Gestión de usuarios" },
    ],
  },
  {
    label: "Proveedores",
    icon: IconCheck,
    items: [
      { href: "/admin/proveedores/actividad", label: "Supervisar actividad" },
      { href: "/admin/proveedores/rendimiento", label: "Rendimiento" },
    ],
  },
  {
    label: "Catálogo",
    icon: IconBag,
    items: [
      { href: "/admin/productos", label: "Todos los productos" },
    ],
  },
  {
    label: "Pedidos & Pagos",
    icon: IconBox,
    items: [
      { href: "/admin/pedidos", label: "Todos los pedidos" },
      { href: "/admin/pagos", label: "Métodos de pago" },
    ],
  },
  {
    label: "Reportes & Sistema",
    icon: IconReport,
    items: [
      { href: "/admin/reportes", label: "Reportes de ventas" },
      { href: "/admin/asistente", label: "Asistente IA" },
      { href: "/admin/auditoria", label: "Log de auditoría" },
      { href: "/admin/configuracion", label: "Configuración" },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const defaultOpen = navSections.reduce<Record<string, boolean>>((acc, section) => {
    acc[section.label] = section.items.some(
      (item) => pathname === item.href || pathname.startsWith(item.href + "/")
    );
    return acc;
  }, {});

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(defaultOpen);

  const toggle = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const app = useStackApp();

  const handleLogout = async () => {
    await app.signOut();
  };

  const sidebarContent = (
    <aside className="w-64 bg-[#5A0F24] flex flex-col flex-shrink-0 relative h-screen">
      {/* Línea decorativa derecha */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#BC9968]/40 to-transparent" />

      {/* Header */}
      <div className="px-5 py-6 border-b border-[#BC9968]/20 flex items-start justify-between">
        <div>
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
        {/* Botón cerrar en mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-[#F5E6D0]/60 hover:text-[#F5E6D0] p-1 -mr-1 -mt-1 transition-colors"
            aria-label="Cerrar menú"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navSections.map((section) => {
          const isOpen = !!openSections[section.label];
          const hasActive = section.items.some(
            (item) => pathname === item.href || pathname.startsWith(item.href + "/")
          );

          return (
            <div key={section.label}>
              <button
                onClick={() => toggle(section.label)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                  hasActive
                    ? "text-[#F5E6D0] bg-[#8E1B3A]/35"
                    : "text-[#F5E6D0]/65 hover:text-[#F5E6D0] hover:bg-[#BC9968]/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <section.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{section.label}</span>
                </div>
                <svg
                  className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 opacity-60 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-5 pl-4 border-l border-[#BC9968]/20 mb-1 space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                          isActive
                            ? "bg-gradient-to-r from-[#8E1B3A]/80 to-[#BC9968]/20 text-[#F5E6D0] font-medium"
                            : "text-[#F5E6D0]/55 hover:bg-[#BC9968]/15 hover:text-[#F5E6D0]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                            isActive ? "bg-[#BC9968]" : "bg-[#F5E6D0]/25"
                          }`}
                        />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#BC9968]/18 space-y-3">
        {/* Perfil */}
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

        {/* Botón cerrar sesión */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-[#F5E6D0]/60 hover:text-[#F5E6D0] hover:bg-[#8E1B3A]/40 transition-all duration-150 border border-[#BC9968]/15"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 12H3a1 1 0 01-1-1V3a1 1 0 011-1h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M9.5 10L12 7l-2.5-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 7H5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <div className="hidden lg:block sticky top-0 h-screen">
        {sidebarContent}
      </div>

      {/* Mobile sidebar — overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="relative h-full w-64 animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

/* ── Iconos ── */
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
function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none">
      <rect x="1.5" y="3" width="11" height="8" rx="1.3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 6.5h5M4.5 8.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
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
function IconBox({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none">
      <rect x="1.5" y="3.5" width="11" height="7.5" rx="1.3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 3.5V2.5a2 2 0 014 0v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
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