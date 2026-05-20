"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DatosNegocio } from "../(panel)/layout";
import { Bell, CreditCard, Box, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface TopbarProps {
  onMenuToggle?: () => void;
  datosNegocio?: DatosNegocio | null;
}

interface ProvNotification {
  id: number;
  tipo: string;
  titulo: string;
  mensaje: string;
  leida: boolean;
  created_at: string;
}

export default function Topbar({ onMenuToggle, datosNegocio }: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<ProvNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Cerrar el dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cargar notificaciones al iniciar
  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const res = await fetch("/api/business/notificaciones");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notificaciones || []);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (error) {
        console.error("Error fetching notificaciones:", error);
      }
    };
    
    if (datosNegocio) {
      fetchNotificaciones();
      // Opcional: hacer polling cada 30 seg para que se actualice solo
      const interval = setInterval(fetchNotificaciones, 30000);
      return () => clearInterval(interval);
    }
  }, [datosNegocio]);

  const handleToggleNotifications = async () => {
    setShowNotifications(!showNotifications);
    
    // Si abrimos la campana y hay mensajes sin leer, mandamos a marcar como leído
    if (!showNotifications && unreadCount > 0) {
      try {
        await fetch("/api/business/notificaciones", { method: "PATCH" });
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, leida: true })));
      } catch (error) {
        console.error("Error actualizando lectura", error);
      }
    }
  };

  const formatearFecha = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("es-BO", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
    }).format(date);
  };

  const getNotificationIcon = (tipo: string) => {
    if (tipo === "nuevo_pedido") return <CreditCard size={18} className="text-[#8E1B3A]" />;
    if (tipo === "stock_bajo") return <Box size={18} className="text-[#E6885C]" />;
    return <AlertCircle size={18} className="text-[#3D0A1A]" />;
  };

  const handleNotificationClick = (tipo: string) => {
    setShowNotifications(false);
    if (tipo === "nuevo_pedido") {
      router.push("/business/proveedores/pedidos");
    }
  };

  return (
    <header className="bg-white border-b border-[#3D0A1A]/10 px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between flex-shrink-0 z-40 relative">
      
      {/* LADO IZQUIERDO: Menú Hamburguesa + Títulos */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 -ml-1 text-[#3D0A1A] hover:bg-[#3D0A1A]/5 rounded-lg transition-colors"
          aria-label="Abrir menú"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 6h14M4 11h14M4 16h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        
        <div>
          <p className="text-[10px] sm:text-xs tracking-widest uppercase text-[#BC9968] font-medium">
            Emotia Business — Socio
          </p>
          <h2 className="font-serif text-lg sm:text-2xl font-semibold text-[#3D0A1A] leading-tight">
            Portal de Proveedores
          </h2>
        </div>
      </div>

      {/* LADO DERECHO: Píldoras de estado y Campanita */}
      <div className="flex items-center gap-2 sm:gap-4 relative" ref={dropdownRef}>
        
        <span className="hidden sm:inline text-xs bg-[#5A0F24]/10 text-[#5A0F24] px-4 py-1.5 rounded-full font-bold tracking-wide">
          {datosNegocio?.estado === "pendiente" ? "Cuenta pendiente" : "Socio activo"}
        </span>
        
        <span className="hidden md:inline text-sm text-[#7A5260] bg-[#F5E6D0] px-4 py-1.5 rounded-full font-medium">
          {new Intl.DateTimeFormat("es-BO", { month: "long", year: "numeric", timeZone: "America/La_Paz" }).format(new Date()).replace(/^\w/, (c) => c.toUpperCase())}
        </span>
        
        {/* CAMPANITA DE NOTIFICACIONES */}
        <button 
          onClick={handleToggleNotifications}
          className="relative p-1.5 text-[#3D0A1A] hover:bg-[#F5E6D0]/50 transition-colors rounded-full"
        >
          <Bell size={20} strokeWidth={1.8} />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-1 w-2.5 h-2.5 bg-[#8E1B3A] rounded-full border-2 border-white" />
          )}
        </button>

        {/* DROPDOWN DE NOTIFICACIONES */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white border border-[#3D0A1A]/10 rounded-2xl shadow-xl overflow-hidden z-50 flex flex-col"
            >
              <div className="bg-[#FAF6F0] border-b border-[#3D0A1A]/10 px-4 py-3 flex justify-between items-center">
                <h3 className="font-bold text-[#3D0A1A]">Notificaciones</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E1B3A] bg-[#8E1B3A]/10 px-2 py-0.5 rounded-full">
                  {unreadCount} nuevas
                </span>
              </div>
              
              <div className="max-h-[350px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-[#7A5260] text-sm">
                    No tienes notificaciones por ahora.
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif.tipo)}
                        className={`px-4 py-3 border-b border-[#3D0A1A]/5 cursor-pointer transition-colors flex gap-3 hover:bg-[#FAF6F0] ${!notif.leida ? 'bg-[#F5E6D0]/20' : ''}`}
                      >
                        <div className="mt-1 shrink-0 bg-white p-2 rounded-full border border-[#3D0A1A]/5 shadow-sm">
                          {getNotificationIcon(notif.tipo)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm text-[#3D0A1A] truncate ${!notif.leida ? 'font-bold' : 'font-medium'}`}>
                            {notif.titulo}
                          </p>
                          <p className="text-xs text-[#7A5260] line-clamp-2 mt-0.5">
                            {notif.mensaje}
                          </p>
                          <p className="text-[10px] text-[#BC9968] font-semibold tracking-wider uppercase mt-1.5">
                            {formatearFecha(notif.created_at)}
                          </p>
                        </div>
                        {!notif.leida && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#8E1B3A] shrink-0 mt-2" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}