"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import { useUser } from "@stackframe/stack";
import { Shield, Calendar, Bell, DollarSign } from "lucide-react";

import { obtenerProveedoresPendientes, obtenerNotificacionesAdmin } from "../actions";

interface TopbarProps {
  onMenuToggle?: () => void;
}

type ProveedorPendiente = {
  id: number;
  nombre_negocio: string;
  created_at: Date;
};

// Tipo genérico para evitar errores de tipado estrictos
type NotificacionAdmin = any;

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [proveedores, setProveedores] = useState<ProveedorPendiente[]>([]);
  const [notificacionesAdmin, setNotificacionesAdmin] = useState<NotificacionAdmin[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = useUser();

  // Cargar datos al montar
  useEffect(() => {
    const fetchDatos = async () => {
      const dataProvs = await obtenerProveedoresPendientes();
      setProveedores(dataProvs);

      if (user?.primaryEmail) {
        console.log("EMAIL STACK:", user?.primaryEmail);
        const dataNotifs = await obtenerNotificacionesAdmin();
        setNotificacionesAdmin(dataNotifs);
      }
    };
    fetchDatos();

    const interval = setInterval(fetchDatos, 5000);
    return () => clearInterval(interval);
  }, [user?.primaryEmail]);

  // Cerrar el menú si el usuario hace clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const role = (user?.clientMetadata as { role?: string } | null)?.role ?? "operador";
  const esAdmin = role === "admin";
  const labelRol = esAdmin ? "Admin. General PREPE" : "Admin. PREPE";
  const displayName = user?.displayName || user?.primaryEmail?.split("@")[0] || "Administrador";

  const initial = displayName.charAt(0).toUpperCase();

  const formattedDate = new Intl.DateTimeFormat("es-BO", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "America/La_Paz"
  }).format(new Date());

  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // Sumamos ambas alertas para el contador rojo de la campana
  const totalAlertas = proveedores.length + notificacionesAdmin.length;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#8E1B3A]/10 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between flex-shrink-0 shadow-sm transition-all duration-200">

      {/* ================= LEFT ================= */}
      <div className="flex items-center gap-3 lg:gap-4 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex-shrink-0 p-2 -ml-2 text-[#5A0F24] hover:bg-[#FAF3EC] rounded-md transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex-shrink-0 flex items-center">
          <Image src="/logo/prepe.png" alt="Logo de PREPE" width={40} height={40} className="h-10 w-auto object-contain" priority />
        </div>

        <div className="flex flex-col justify-center min-w-0 border-l border-gray-200 pl-3 md:pl-4 ml-1 md:ml-2">
          <p className="text-[10px] tracking-[0.15em] uppercase font-bold text-[#BC9968] leading-none mb-1">
            Plataforma de Regalos Personalizados
          </p>
          <h1 className="text-sm sm:text-base font-semibold text-[#5A0F24] leading-none truncate">
            Hola, <span className="font-normal">{displayName}</span>
          </h1>
        </div>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 flex-shrink-0 relative" ref={dropdownRef}>
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF3EC] border border-[#BC9968]/30 rounded-full shadow-sm">
          <Shield size={14} className="text-[#BC9968] flex-shrink-0" />
          <span className="text-xs font-bold text-[#5A0F24] uppercase tracking-wider whitespace-nowrap">{labelRol}</span>
        </div>

        <div className="hidden md:block h-6 w-px bg-gray-200"></div>

        <div className="hidden lg:flex items-center gap-2 text-[13px] text-gray-600">
          <Calendar size={15} className="text-gray-400 flex-shrink-0" />
          <span className="font-medium whitespace-nowrap">{capitalizedDate}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 ml-1 sm:ml-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative flex-shrink-0 p-2 text-gray-500 hover:text-[#5A0F24] hover:bg-[#FAF3EC] rounded-full transition-all"
          >
            <Bell size={20} strokeWidth={1.75} />
            {totalAlertas > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-[#8E1B3A] border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white font-bold leading-none">
                {totalAlertas}
              </span>
            )}
          </button>

          <button className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-[#8E1B3A] to-[#5A0F24] text-white font-semibold text-sm sm:text-base shadow-sm hover:opacity-90 ring-2 ring-white">
            {initial}
          </button>
        </div>

        {isOpen && (
          <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-[#8E1B3A]/10 rounded-2xl shadow-xl overflow-hidden flex flex-col z-50">
            <div className="p-4 border-b border-[#8E1B3A]/10 bg-[#fffdfa] flex justify-between items-center">
              <div>
                <p className="text-[10px] text-[#BC9968] font-bold tracking-widest uppercase">Emotia Store</p>
                <h3 className="text-[#5A0F24] font-serif font-semibold">Notificaciones Admin</h3>
              </div>
              <span className="text-xs bg-[#F5E6D0] text-[#7A5260] px-2 py-1 rounded-full font-medium">
                {totalAlertas} pendientes
              </span>
            </div>

            <div className="max-h-[300px] overflow-y-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {totalAlertas === 0 ? (
                <div className="p-6 text-center text-sm text-[#8a6f62]">
                  <p>No hay solicitudes pendientes.</p>
                  <p className="mt-1 text-xs">Todo está al día.</p>
                </div>
              ) : (
                <div className="flex flex-col p-2 gap-2">

                  {/* MAPEO 1: SOLICITUDES DE RETIRO (NUEVO) */}
                  {notificacionesAdmin.map((notif) => (
                    <Link
                      href="/admin/empresas/actividad"
                      key={`notif-${notif.id}`}
                      onClick={() => setIsOpen(false)}
                      className="group p-3 rounded-xl border border-green-100 bg-[#f4fbf6] hover:bg-green-50 transition-colors flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-green-200 flex-shrink-0 flex items-center justify-center text-green-700">
                        <DollarSign size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-green-700 tracking-wider uppercase mb-0.5">Solicitud de Pago</p>
                        <p className="text-sm font-semibold text-[#4a3f39] leading-tight">{notif.titulo}</p>
                        <p className="text-[11px] text-[#8a6f62] mt-1">{notif.mensaje}</p>
                      </div>
                    </Link>
                  ))}

                  {/* MAPEO 2: PROVEEDORES PENDIENTES (ORIGINAL) */}
                  {proveedores.map((prov) => (
                    <Link
                      href="/admin/empresas/actividad"
                      key={`prov-${prov.id}`}
                      onClick={() => setIsOpen(false)}
                      className="group p-3 rounded-xl border border-[#8E1B3A]/10 bg-[#fffdfa] hover:bg-[#F5E6D0]/30 transition-colors flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#8E1B3A]/10 flex-shrink-0 flex items-center justify-center text-[#8E1B3A]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <line x1="19" y1="8" x2="19" y2="14"></line>
                          <line x1="22" y1="11" x2="16" y2="11"></line>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#BC9968] tracking-wider uppercase mb-0.5">Nuevo Registro</p>
                        <p className="text-sm font-semibold text-[#4a3f39] leading-tight">{prov.nombre_negocio} solicita acceso</p>
                        <p className="text-[11px] text-[#8a6f62] mt-1">
                          {new Intl.DateTimeFormat("es-BO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(prov.created_at))}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}