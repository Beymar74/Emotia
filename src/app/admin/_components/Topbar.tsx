"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
// Ajusta esta ruta a donde hayas puesto tu Server Action
import { obtenerProveedoresPendientes } from "../actions";
interface TopbarProps {
  onMenuToggle?: () => void;
}

type ProveedorPendiente = {
  id: number;
  nombre_negocio: string;
  created_at: Date;
};

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [proveedores, setProveedores] = useState<ProveedorPendiente[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cargar los proveedores pendientes cuando el componente se monta
  useEffect(() => {
    const fetchProveedores = async () => {
      const data = await obtenerProveedoresPendientes();
      setProveedores(data);
    };
    fetchProveedores();

    // Opcional: Refrescar cada minuto para no perderse registros nuevos
    const interval = setInterval(fetchProveedores, 60000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <header className="bg-[#fffdfa] border-b border-[#8E1B3A]/10 px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between flex-shrink-0 relative z-50">
      <div className="flex items-center gap-3">
        {/* Hamburger — solo visible en mobile */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 -ml-1 text-[#5A0F24] hover:bg-[#8E1B3A]/8 rounded-lg transition-colors"
          aria-label="Abrir menú"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 6h14M4 11h14M4 16h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <div>
          <p className="text-[10px] sm:text-xs tracking-widest uppercase text-[#BC9968] font-medium">
            Sistema PREPE — Administración
          </p>
          <h2 className="font-serif text-lg sm:text-2xl font-semibold text-[#5A0F24] leading-tight">
            Dashboard General
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 relative" ref={dropdownRef}>
        <span className="hidden sm:inline text-xs bg-[#8E1B3A]/10 text-[#8E1B3A] px-4 py-1.5 rounded-full font-medium tracking-wide">
          Acceso total
        </span>
        <span className="hidden md:inline text-sm text-[#7A5260] bg-[#F5E6D0] px-4 py-1.5 rounded-full">
          {new Intl.DateTimeFormat("es-BO", { month: "long", year: "numeric", timeZone: "America/La_Paz" }).format(new Date())}
        </span>

        {/* Campanita Dinámica */}
        <button
          className="relative p-1.5 hover:bg-[#8E1B3A]/5 rounded-full transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
            <path d="M9 2a5 5 0 00-5 5v2.5L2.5 12h13L14 9.5V7A5 5 0 009 2z" stroke="#5A0F24" strokeWidth="1.3" />
            <path d="M7.5 14.5a1.5 1.5 0 003 0" stroke="#5A0F24" strokeWidth="1.3" strokeLinecap="round" />
          </svg>

          {/* El punto rojo solo aparece si hay > 0 proveedores */}
          {proveedores.length > 0 && (
            <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#8E1B3A] rounded-full border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">
              {proveedores.length}
            </span>
          )}
        </button>

        {/* Menú Desplegable (Estilo Tailwind) */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-[#8E1B3A]/10 rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#8E1B3A]/10 bg-[#fffdfa] flex justify-between items-center">
              <div>
                <p className="text-[10px] text-[#BC9968] font-bold tracking-widest uppercase">Emotia Store</p>
                <h3 className="text-[#5A0F24] font-serif font-semibold">Notificaciones Admin</h3>
              </div>
              <span className="text-xs bg-[#F5E6D0] text-[#7A5260] px-2 py-1 rounded-full font-medium">
                {proveedores.length} pendientes
              </span>
            </div>

            <div className="max-h-[300px] overflow-y-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {proveedores.length === 0 ? (
                <div className="p-6 text-center text-sm text-[#8a6f62]">
                  <p>No hay solicitudes pendientes.</p>
                  <p className="mt-1 text-xs">Todo está al día.</p>
                </div>
              ) : (
                <div className="flex flex-col p-2 gap-2">
                  {proveedores.map((prov) => (
                    // Ajusta la ruta del Link a donde esté tu panel de gestión de empresas (ej. /admin/empresas)
                    <Link
                      href={`/admin/empresas/actividad`}
                      key={prov.id}
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
                        <p className="text-sm font-semibold text-[#4a3f39] leading-tight">
                          {prov.nombre_negocio} solicita acceso
                        </p>
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