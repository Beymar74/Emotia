"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Package, ShoppingCart, BarChart3, 
  User, LogOut, ChevronLeft, Bell, Gift, Check, Star, AlertTriangle, X
} from 'lucide-react';

import DashboardView from "./views/DashboardView";
import ProductosView from "./views/ProductosView";
import PedidosView from "./views/PedidosView";
import MetricasView from "./views/MetricasView";
import PerfilView from "./views/PerfilView";

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');`;

const menuItems = [
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", id: "dashboard" },
  { icon: <Package size={20} />, label: "Productos", id: "productos" },
  { icon: <ShoppingCart size={20} />, label: "Pedidos", id: "pedidos" },
  { icon: <BarChart3 size={20} />, label: "Métricas", id: "metricas" },
  { icon: <User size={20} />, label: "Perfil", id: "perfil" },
];

// Datos mockeados para las notificaciones (adaptados para el Proveedor)
const notificacionesMock = [
  { id: 1, icon: <ShoppingCart size={18} color="#3b82f6" />, titulo: "Nuevo pedido recibido", desc: "Pedido #2049 recibido por Bs. 250.", tiempo: "Hace 5 min", leida: false },
  { id: 2, icon: <Package size={18} color="#BC9968" />, titulo: "Producto aprobado", desc: "Caja de chocolates artesanales ha sido aprobada.", tiempo: "Hace 15 min", leida: false },
  { id: 3, icon: <AlertTriangle size={18} color="#9B2335" />, titulo: "Alerta de stock", desc: "El Set de Vinos Premium tiene solo 2 unidades.", tiempo: "Hace 30 min", leida: false },
  { id: 4, icon: <Star size={18} color="#10b981" />, titulo: "Nueva resena", desc: "María García te ha dejado 5 estrellas.", tiempo: "Hace 1 hora", leida: false },
  { id: 5, icon: <ShoppingCart size={18} color="#9ca3af" />, titulo: "Pedido cancelado", desc: "Pedido #2010 ha sido cancelado por el cliente.", tiempo: "Ayer", leida: true },
];

export default function ProveedorPage() {
  const router = useRouter();
  const [vistaActiva, setVistaActiva] = useState("dashboard");
  
  // NUEVO ESTADO: Controla si la campanita está abierta o cerrada
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

  const renderizarVista = () => {
    switch (vistaActiva) {
      case "dashboard": return <DashboardView />;
      case "productos": return <ProductosView />;
      case "pedidos": return <PedidosView />;
      case "metricas": return <MetricasView />;
      case "perfil": return <PerfilView />;
      default: return <DashboardView />;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div style={{ height: "100vh", background: "#f8f9fb", fontFamily: "'Inter', sans-serif", display: "flex", overflow: "hidden" }}>

        {/* SIDEBAR LATERAL */}
        <div style={{ width: "240px", background: "#701030", display: "flex", flexDirection: "column", color: "white", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 15px 16px", borderBottom: "1px solid rgba(112,16,48,0.2)", backgroundColor: "#E5BDC2", height: "71px", boxSizing: "border-box" }}>
            <img src="/logo/logoextendido.png" alt="Emotia" style={{ height: "45px", width: "auto", objectFit: "contain", flexShrink: 0 }} />
          </div>

          <nav style={{ flex: 1, padding: "1.5rem 0", display: "flex", flexDirection: "column", gap: "5px", overflowY: "auto" }}>
            {menuItems.map((item) => (
              <button 
                key={item.id} onClick={() => setVistaActiva(item.id)}
                style={{ 
                  width: "100%", display: "flex", alignItems: "center", gap: "1rem", padding: "0.85rem 24px", 
                  background: vistaActiva === item.id ? "rgba(255,255,255,0.15)" : "transparent", 
                  border: "none", cursor: "pointer", fontWeight: vistaActiva === item.id ? 600 : 400, 
                  fontSize: "0.95rem", color: vistaActiva === item.id ? "#ffffff" : "rgba(255,255,255,0.7)", 
                  textAlign: "left", transition: "all 0.2s", borderLeft: vistaActiva === item.id ? "4px solid #fff" : "4px solid transparent"
                }}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>

          <div style={{ padding: "1.5rem 24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <button 
              onClick={() => router.push("/")} 
              style={{ display: "flex", alignItems: "center", gap: "1rem", fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.95rem", color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
            >
              <LogOut size={20} /> Cerrar Sesión
            </button>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
          
          {/* Topbar / Header */}
          <div style={{ background: "linear-gradient(90deg, #701030 0%, #E5BDC2 100%)", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", zIndex: 10, height: "71px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "white", fontSize: "1.1rem", fontWeight: 600 }}>
              <ChevronLeft size={20} />
              <span style={{ textTransform: "capitalize" }}>{menuItems.find(i => i.id === vistaActiva)?.label}</span>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              
              {/* === CONTENEDOR DE LA CAMPANITA Y EL MENÚ === */}
              <div style={{ position: "relative" }}>
                
                {/* Ícono de la Campanita */}
                <div onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <Bell size={22} color="white" />
                  <span style={{ position: "absolute", top: "-5px", right: "-5px", background: "#ef4444", color: "white", fontSize: "0.65rem", fontWeight: "bold", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                    4
                  </span>
                </div>

                {/* Menú Desplegable de Notificaciones */}
                {mostrarNotificaciones && (
                  <div style={{
                    position: "absolute", top: "45px", right: "-10px", width: "380px",
                    background: "white", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    border: "1px solid rgba(0,0,0,0.05)", overflow: "hidden", zIndex: 1000
                  }}>
                    {/* Cabecera del menú */}
                    <div style={{ background: "#9B2335", padding: "1.2rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", color: "white" }}>
                      <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 600 }}>Notificaciones</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", fontSize: "0.8rem" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", opacity: 0.9 }}>
                          <Check size={14} /> Marcar todas
                        </span>
                        <X size={16} style={{ cursor: "pointer" }} onClick={() => setMostrarNotificaciones(false)} />
                      </div>
                    </div>

                    {/* Lista de Notificaciones */}
                    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                      {notificacionesMock.map((notif) => (
                        <div key={notif.id} style={{
                          display: "flex", gap: "1rem", padding: "1.2rem 1.5rem",
                          borderBottom: "1px solid #f3f4f6", background: notif.leida ? "#f9fafb" : "white",
                          cursor: "pointer", transition: "background 0.2s"
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
                        onMouseLeave={e => e.currentTarget.style.background = notif.leida ? "#f9fafb" : "white"}
                        >
                          {/* Ícono */}
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(0,0,0,0.03)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {notif.icon}
                          </div>
                          
                          {/* Contenido */}
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.2rem" }}>
                              <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: "6px" }}>
                                {notif.titulo}
                                {!notif.leida && <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#9B2335" }}></span>}
                              </h4>
                              {notif.leida && <Check size={14} color="#9ca3af" />}
                            </div>
                            <p style={{ margin: "0 0 0.4rem 0", fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.4 }}>{notif.desc}</p>
                            <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{notif.tiempo}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pie del menú */}
                    <div style={{ padding: "1rem", textAlign: "center", borderTop: "1px solid #f3f4f6", background: "white" }}>
                      <button style={{ background: "none", border: "none", color: "#9B2335", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}>
                        Ver historial completo
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* === FIN CONTENEDOR CAMPANITA === */}

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "white" }}>
                <div style={{ width: "35px", height: "35px", borderRadius: "50%", background: "#f8f4ef", overflow: "hidden", border: "2px solid white" }}>
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Proveedor" alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>Flores Illimani</span>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 2rem", boxSizing: "border-box" }}>
            {renderizarVista()}
          </div>
        </div>

      </div>
    </>
  );
}