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
  
  // NUEVO ESTADO: Para controlar el menú de notificaciones
  const [showNotifications, setShowNotifications] = useState(false);

  // Menú optimizado
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/business/dashboard" },
    { icon: <ClipboardList size={20} />, label: "Gestión de Pedidos", href: "/business/pedidos" },
    { icon: <PackageSearch size={20} />, label: "Catálogo", href: "/business/productos" },
    { icon: <Settings size={20} />, label: "Perfil de Negocio", href: "/business/perfil" }
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fb] font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <div 
        className="transition-all duration-300 ease-in-out flex flex-col z-50 relative shadow-2xl"
        style={{ width: drawerOpen ? "260px" : "80px", backgroundColor: "#3D0A1A" }}
      >
        {/* ARREGLO 1: Logo clickeable que lleva a la Bienvenida */}
        <Link 
          href="/business"
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
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-[#B0B0B0] hover:bg-[#5A0F24] hover:text-white transition-colors">
            <LogOut size={20} />
            {drawerOpen && <span className="font-medium whitespace-nowrap text-sm">Cerrar Sesión</span>}
          </button>
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
            
            {/* ARREGLO 2: Campanita funcional con panel desplegable */}
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

              {/* Panel de Notificaciones (Se muestra si showNotifications es true) */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-4 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-[#3D0A1A]">Notificaciones</h3>
                    <button className="text-xs text-[#BC9968] font-bold hover:underline">Marcar leídas</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {/* Notificación 1 */}
                    <div className="p-4 border-b border-gray-50 hover:bg-[#F5E6D0]/20 transition-colors cursor-pointer flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Package size={18} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1A1A1A]">¡Nuevo pedido recibido!</p>
                        <p className="text-xs text-gray-500 mt-0.5">El cliente Beymar ha comprado "Arreglo Floral".</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-1">Hace 5 min</p>
                      </div>
                    </div>
                    {/* Notificación 2 */}
                    <div className="p-4 hover:bg-[#F5E6D0]/20 transition-colors cursor-pointer flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Store size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1A1A1A]">Catálogo Actualizado</p>
                        <p className="text-xs text-gray-500 mt-0.5">Se guardó tu producto "Caja Sorpresa".</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-1">Hace 1 hora</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
                    <button className="text-sm font-bold text-[#8E1B3A] hover:underline">Ver todas</button>
                  </div>
                </div>
              )}
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

        {/* CONTENIDO DE LA PÁGINA */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#f8f9fb]">
          {children}
        </main>
      </div>
    </div>
  );
}