"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, PackageSearch, ClipboardList, Settings, 
  LogOut, ChevronLeft, ChevronRight, Bell, Store, Package
} from "lucide-react";

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // --- NUEVA LÓGICA DE FILTRADO DE RUTAS ---
  // Detectamos si la ruta actual es Login o Registro para ocultar el Layout del panel
  const esRutaAuth = pathname.includes("/login") || pathname.includes("/registro");

  if (esRutaAuth) {
    // Si es Login o Registro, devolvemos el contenido limpio con el fondo beige
    return (
      <div className="min-h-screen bg-[#FCFAF8]">
        {children}
      </div>
    );
  }
  // --- FIN DE LÓGICA DE FILTRADO ---

  const menuItems = [
    // Agregamos el "Inicio" (Home) que es la pantalla de bienvenida
    { icon: <Store size={20} />, label: "Inicio", href: "/business/proveedores/home" },
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/business/proveedores/dashboard" },
    { icon: <ClipboardList size={20} />, label: "Gestión de Pedidos", href: "/business/proveedores/pedidos" },
    { icon: <PackageSearch size={20} />, label: "Catálogo", href: "/business/proveedores/productos" },
    { icon: <Settings size={20} />, label: "Perfil de Negocio", href: "/business/proveedores/perfil" }
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fb] font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <div 
        className="transition-all duration-300 ease-in-out flex flex-col z-50 relative shadow-2xl"
        style={{ width: drawerOpen ? "260px" : "80px", backgroundColor: "#3D0A1A" }}
      >
        {/* LOGO */}
        <Link 
          href="/business/proveedores/home"
          className="h-20 flex items-center justify-center border-b-4 border-[#8E1B3A] bg-[#F5E6D0] shrink-0 overflow-hidden px-4 hover:bg-white transition-colors cursor-pointer"
          title="Ir a Inicio"
        >
          <img 
            src={drawerOpen ? "/logo/logo-business-expandido.png" : "/logo/logo-business.png"} 
            alt="Emotia Business" 
            className="h-15 w-auto object-contain transition-all duration-300"
          />
        </Link>

        {/* NAVEGACIÓN */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
                style={{
                  backgroundColor: isActive ? "#5A0F24" : "transparent",
                  borderLeft: isActive ? "4px solid #BC9968" : "4px solid transparent",
                  color: isActive ? "#FFFFFF" : "#B0B0B0"
                }}
              >
                <div style={{ color: isActive ? "#BC9968" : "inherit" }} className="group-hover:text-[#BC9968] transition-colors">
                  {item.icon}
                </div>
                {drawerOpen && <span className="font-medium whitespace-nowrap text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* CIERRE DE SESIÓN */}
        <div className="p-4 border-t border-[#5A0F24] shrink-0">
          <Link href="/business/proveedores/login" className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-[#B0B0B0] hover:bg-[#5A0F24] hover:text-white transition-colors">
            <LogOut size={20} />
            {drawerOpen && <span className="font-medium whitespace-nowrap text-sm">Cerrar Sesión</span>}
          </Link>
        </div>
      </div>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER SUPERIOR */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm shrink-0 z-40 relative">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="p-2 rounded-lg text-[#5A0F24] hover:bg-[#F5E6D0] transition-colors"
            >
              {drawerOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
            </button>
            <h2 className="text-xl font-bold text-[#1A1A1A]">Portal de Proveedores</h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Campanita y Perfil... (se mantiene igual) */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-[#5A0F24] hover:text-[#8E1B3A] transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <Bell size={24} />
                <span className="absolute top-1 right-1 bg-[#8E1B3A] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                  2
                </span>
              </button>
              {/* Contenido de notificaciones se mantiene... */}
            </div>

            <div className="flex items-center gap-3 border-l border-gray-200 pl-6 cursor-pointer">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-[#1A1A1A]">Artesanías La Paz</p>
                <p className="text-xs text-[#BC9968] font-semibold">Socio Premium</p>
              </div>
              <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold shadow-md text-white border-2 border-[#BC9968]" style={{ backgroundColor: '#5A0F24' }}>
                AL
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-[#f8f9fb]">
          {children}
        </main>
      </div>
    </div>
  );
}