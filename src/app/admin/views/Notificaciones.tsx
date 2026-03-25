"use client";
import React, { useState } from "react";
import { Bell, X, Check, User, Package, ShoppingCart, CheckCircle2 } from "lucide-react";

// --- DATOS SIMULADOS (Basados en tu diseño) ---
const notificacionesIniciales = [
  { id: 1, tipo: "usuario", titulo: "Nuevo usuario registrado", mensaje: "María García se ha registrado en la plataforma.", tiempo: "Hace 5 min", leido: false, color: "#3b82f6", bg: "#eff6ff", icon: User },
  { id: 2, tipo: "proveedor", titulo: "Nuevo proveedor registrado", mensaje: "Regalos Premium S.A. solicita aprobación.", tiempo: "Hace 15 min", leido: false, color: "#d97706", bg: "#fef3c7", icon: Package },
  { id: 3, tipo: "producto", titulo: "Producto pendiente", mensaje: "Caja de chocolates artesanales requiere aprobación.", tiempo: "Hace 30 min", leido: false, color: "#e11d48", bg: "#fee2e2", icon: Package },
  { id: 4, tipo: "pedido", titulo: "Nuevo pedido", mensaje: "Pedido #1024 recibido por $2,500.", tiempo: "Hace 1 hora", leido: false, color: "#16a34a", bg: "#dcfce7", icon: ShoppingCart },
  { id: 5, tipo: "pedido", titulo: "Pedido cancelado", mensaje: "Pedido #1010 ha sido cancelado por el cliente.", tiempo: "Hace 2 horas", leido: true, color: "#16a34a", bg: "#dcfce7", icon: ShoppingCart },
];

export default function Notificaciones() {
  const [abierto, setAbierto] = useState(false);
  const [notificaciones, setNotificaciones] = useState(notificacionesIniciales);
  
  const noLeidas = notificaciones.filter(n => !n.leido).length;

  const marcarTodasLeidas = () => {
    setNotificaciones(notificaciones.map(n => ({ ...n, leido: true })));
  };

  return (
    <div style={{ position: "relative" }}>
      
      {/* 1. BOTÓN DE CAMPANA (Diseño arreglado) */}
      <div 
        onClick={() => setAbierto(!abierto)} 
        style={{ 
          cursor: "pointer", position: "relative", display: "flex", alignItems: "center", 
          justifyContent: "center", width: "38px", height: "38px", borderRadius: "50%", 
          transition: "background 0.2s", background: abierto ? "rgba(255,255,255,0.15)" : "transparent"
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
        onMouseLeave={e => e.currentTarget.style.background = abierto ? "rgba(255,255,255,0.15)" : "transparent"}
      >
        <Bell size={22} color="white" />
        
        {/* Globo rojo pequeño y elegante */}
        {noLeidas > 0 && (
          <span style={{ 
            position: "absolute", top: "4px", right: "6px", background: "#ef4444", 
            color: "white", fontSize: "0.6rem", fontWeight: 700, 
            width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%", border: "2px solid #a3414d", lineHeight: 1 // El color del borde simula el degradado de fondo
          }}>
            {noLeidas}
          </span>
        )}
      </div>

      {/* 2. OVERLAY (Cierra al hacer clic fuera) */}
      {abierto && (
        <div onClick={() => setAbierto(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 95 }} />
      )}

      {/* 3. POPOVER (Basado en tu diseño de Figma) */}
      {abierto && (
        <div style={{ 
          position: "absolute", top: "50px", right: "0", width: "360px", 
          background: "white", borderRadius: "12px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", 
          border: "1px solid #e5e7eb", zIndex: 100, overflow: "hidden"
        }}>
          
          {/* Header Rojo */}
          <div style={{ background: "#8e183e", color: "white", padding: "1rem 1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>Notificaciones</h4>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {noLeidas > 0 && (
                <button onClick={marcarTodasLeidas} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "white"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}>
                  <Check size={14} /> Marcar todas
                </button>
              )}
              <button onClick={() => setAbierto(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", display: "flex" }}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Lista de Notificaciones */}
          <div style={{ maxHeight: "380px", overflowY: "auto", background: "#fcfcfc" }}>
            {notificaciones.length > 0 ? notificaciones.map((notif) => {
              const Icono = notif.icon;
              return (
                <div key={notif.id} style={{ 
                  display: "flex", gap: "1rem", padding: "1rem 1.2rem", borderBottom: "1px solid #f3f4f6", 
                  background: notif.leido ? "white" : "#fff", position: "relative", cursor: "pointer", transition: "background 0.2s"
                }} onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"} onMouseLeave={e => e.currentTarget.style.background = "white"}>
                  
                  {/* Icono Circular */}
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: notif.leido ? "#f3f4f6" : notif.bg, color: notif.leido ? "#9ca3af" : notif.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: notif.leido ? "1px solid #e5e7eb" : "none" }}>
                    <Icono size={18} />
                  </div>
                  
                  {/* Contenido */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                      <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: "6px" }}>
                        {notif.titulo}
                        {!notif.leido && <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#8e183e", flexShrink: 0 }}></span>}
                      </p>
                      {/* Simulando el checkcito tenue de la derecha */}
                      <Check size={14} color="#d1d5db" />
                    </div>
                    <p style={{ margin: "4px 0", fontSize: "0.85rem", color: "#4b5563", lineHeight: "1.4" }}>{notif.mensaje}</p>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af" }}>{notif.tiempo}</p>
                  </div>
                </div>
              );
            }) : (
              <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>
                <CheckCircle2 size={32} color="#d1d5db" style={{ margin: "0 auto 0.5rem" }} />
                <p style={{ margin: 0, fontSize: "0.95rem" }}>Todo al día.</p>
              </div>
            )}
          </div>

          {/* Footer del Popover */}
          <div style={{ padding: "1rem", background: "white", textAlign: "center", borderTop: "1px solid #f3f4f6" }}>
            <button style={{ background: "none", border: "none", color: "#8e183e", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}>
              Ver historial completo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}