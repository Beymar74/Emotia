"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Store, LayoutDashboard, ClipboardList, PackageSearch, Settings, LogOut, ChevronDown } from "lucide-react";

// Exportamos la interfaz para usarla también en el Topbar
export interface DatosNegocio {
  nombre: string;
  iniciales: string;
  estado: string;
}

const navSections = [
  {
    label: "Principal",
    icon: Store,
    items: [
      { href: "/business/proveedores/home", label: "Inicio" },
      { href: "/business/proveedores/dashboard", label: "Dashboard" },
    ],
  },
  {
    label: "Gestión Comercial",
    icon: ClipboardList,
    items: [
      { href: "/business/proveedores/pedidos", label: "Gestión de Pedidos" },
      { href: "/business/proveedores/productos", label: "Catálogo" },
    ],
  },
  {
    label: "Configuración",
    icon: Settings,
    items: [
      { href: "/business/proveedores/perfil", label: "Perfil de Negocio" },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
  datosNegocio?: DatosNegocio | null; // ¡Aquí está definido!
}

// ¡Fíjate que aquí recibimos 'datosNegocio'!
export default function Sidebar({ mobileOpen, onClose, datosNegocio }: SidebarProps) {
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

  const sidebarContent = (
    <aside className="w-64 bg-[#3D0A1A] flex flex-col flex-shrink-0 relative h-screen shadow-2xl">
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#BC9968]/40 to-transparent" />

      {/* Header / Logo */}
      <div className="h-20 flex items-center justify-center border-b-4 border-[#8E1B3A] bg-[#F5E6D0] shrink-0 overflow-hidden px-4 hover:bg-white transition-colors">
        <Link href="/business/proveedores/home" onClick={onClose} className="flex items-center justify-center w-full">
          <img 
            src="/logo/logo-business-expandido.png" 
            alt="Emotia Business" 
            className="h-14 w-auto object-contain transition-all duration-300"
          />
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-[#5A0F24] hover:bg-[#8E1B3A]/10 p-1.5 rounded-lg ml-auto transition-colors absolute right-4"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav Principal */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navSections.map((section) => {
          const isOpen = !!openSections[section.label];
          const hasActive = section.items.some(
            (item) => pathname === item.href || pathname.startsWith(item.href + "/")
          );

          return (
            <div key={section.label} className="mb-1">
              <button
                onClick={() => toggle(section.label)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  hasActive
                    ? "text-[#F5E6D0] bg-[#5A0F24]"
                    : "text-[#B0B0B0] hover:text-[#F5E6D0] hover:bg-[#BC9968]/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <section.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{section.label}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 opacity-60 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  isOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-5 pl-4 border-l border-[#BC9968]/20 space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                          isActive
                            ? "text-[#F5E6D0] font-medium"
                            : "text-[#B0B0B0] hover:text-[#F5E6D0]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                            isActive ? "bg-[#BC9968]" : "bg-[#B0B0B0]/30"
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

      {/* Footer del Sidebar (Perfil y Logout) */}
      <div className="px-4 py-4 border-t border-[#BC9968]/20 space-y-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#5A0F24] border border-[#BC9968] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {datosNegocio?.iniciales || "..."}
          </div>
          <div>
            <p className="text-sm text-white font-bold leading-tight">
              {datosNegocio?.nombre || "Cargando..."}
            </p>
            <p className="text-[11px] text-[#BC9968] font-semibold">
              {datosNegocio?.estado === "SUSPENDIDO" ? "Cuenta Pendiente" : "Socio Premium"}
            </p>
          </div>
        </div>

        <Link
          href="/business/proveedores/login"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-[#B0B0B0] hover:text-white hover:bg-[#5A0F24] transition-all duration-150 border border-transparent hover:border-[#BC9968]/30"
        >
          <LogOut size={16} />
          Cerrar sesión
        </Link>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block h-screen">
        {sidebarContent}
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
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