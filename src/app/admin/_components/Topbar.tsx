"use client";

import Image from "next/image";
import { useUser } from "@stackframe/stack";
import { Shield, Calendar, Bell } from "lucide-react";

interface TopbarProps {
  onMenuToggle?: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const user = useUser();
  const role = (user?.clientMetadata as { role?: string } | null)?.role ?? "operador";
  const esAdmin = role === "admin";
  const labelRol = esAdmin ? "Admin. General PREPE" : "Admin. PREPE";
  const displayName = user?.displayName || user?.primaryEmail?.split("@")[0] || "Administrador";

  // Obtenemos la inicial para el avatar
  const initial = displayName.charAt(0).toUpperCase();

  // Fecha con formato un poco más completo (incluyendo el día de la semana)
  const formattedDate = new Intl.DateTimeFormat("es-BO", {
    weekday: "short",
    day: "numeric",
    month: "short", // Mes corto para mantenerlo limpio
    year: "numeric",
    timeZone: "America/La_Paz"
  }).format(new Date());

  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#8E1B3A]/10 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between flex-shrink-0 shadow-sm transition-all duration-200">
      
      {/* ================= LEFT: Logo + Branding + Saludo ================= */}
      <div className="flex items-center gap-3 lg:gap-4 min-w-0">
        
        {/* Hamburger — visible en mobile */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex-shrink-0 p-2 -ml-2 text-[#5A0F24] hover:bg-[#FAF3EC] rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#BC9968]/50"
          aria-label="Abrir menú de navegación"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Logo PREPE */}
        <div className="flex-shrink-0 flex items-center" title="Plataforma de Regalos Personalizados y Experiencias">
          <Image
            src="/logo/prepe.png"
            alt="Logo de PREPE"
            width={40} // Ligeramente más compacto
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
        </div>

        {/* Nombre del sistema + Saludo */}
        <div className="flex flex-col justify-center min-w-0 border-l border-gray-200 pl-3 md:pl-4 ml-1 md:ml-2">
          <p className="text-[10px] tracking-[0.15em] uppercase font-bold text-[#BC9968] leading-none mb-1">
            Plataforma de Regalos Personalizados y Experiencias (PREPE)
          </p>
          <h1 className="text-sm sm:text-base font-semibold text-[#5A0F24] leading-none truncate">
            Hola, <span className="font-normal">{displayName}</span>
          </h1>
        </div>
      </div>

      {/* ================= RIGHT: Rol + Fecha + Notificaciones + Avatar ================= */}
      <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 flex-shrink-0">
        
        {/* Badge de Rol Premium (Estilo Píldora) */}
        <div 
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF3EC] border border-[#BC9968]/30 rounded-full shadow-sm"
          title="Nivel de acceso actual"
        >
          <Shield size={14} className="text-[#BC9968] flex-shrink-0" />
          <span className="text-xs font-bold text-[#5A0F24] uppercase tracking-wider whitespace-nowrap">
            {labelRol}
          </span>
        </div>

        {/* Separador vertical sutil */}
        <div className="hidden md:block h-6 w-px bg-gray-200"></div>

        {/* Fecha con Calendario */}
        <div className="hidden lg:flex items-center gap-2 text-[13px] text-gray-600">
          <Calendar size={15} className="text-gray-400 flex-shrink-0" />
          <span className="font-medium whitespace-nowrap">{capitalizedDate}</span>
        </div>

        {/* Grupo de Acciones Finales (Campana + Avatar) */}
        <div className="flex items-center gap-2 sm:gap-3 ml-1 sm:ml-2">
          
          {/* Campana de Notificaciones */}
          <button 
            className="relative flex-shrink-0 p-2 text-gray-500 hover:text-[#5A0F24] hover:bg-[#FAF3EC] rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#BC9968]/50"
            aria-label="Ver notificaciones"
          >
            <Bell size={20} strokeWidth={1.75} />
            {/* Indicador de notificación activa */}
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#8E1B3A] border-2 border-white rounded-full"></span>
          </button>

          {/* Avatar del Usuario */}
          <button 
            className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-[#8E1B3A] to-[#5A0F24] text-white font-semibold text-sm sm:text-base shadow-sm hover:opacity-90 transition-opacity ring-2 ring-white"
            aria-label="Opciones de perfil"
          >
            {initial}
          </button>
        </div>
        
      </div>
    </header>
  );
}