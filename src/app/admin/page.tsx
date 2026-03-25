"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, Building2, ShoppingCart, Bot, LayoutDashboard, Layers, Package, 
  Trophy, BarChart3, ShieldCheck, ClipboardList, Settings, LogOut, ChevronLeft, ChevronRight, Bell, X,
  AlertTriangle, Info, CheckCircle
} from 'lucide-react';

// --- IMPORTACIÓN DE TUS VISTAS ---
import BienvenidaView from "./views/BienvenidaView";
import DashboardView from "./views/DashboardView";
import UsuariosView from "./views/UsuariosView";
import ProveedoresView from "./views/ProveedoresView";
import CategoriasView from "./views/CategoriasView";
import ProductosView from "./views/ProductosView";
import PedidosView from "./views/PedidosView";
import AsistenteIAView from "./views/AsistenteIAView";
import GamificacionView from "./views/GamificacionView";

// --- IMPORTACIÓN DEL COMPONENTE DE NOTIFICACIONES ---
import Notificaciones from "./views/Notificaciones";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  /* Animación suave para el Sidebar y Contenido */
  .transicion-suave {
    transition: all 0.3s ease;
  }
`;

const menuItems = [
  { icon: <LayoutDashboard size={18} />, label:"Dashboard", id:"dashboard" },
  { icon: <Users size={18} />, label:"Usuarios", id:"usuarios" },
  { icon: <Building2 size={18} />, label:"Proveedores", id:"proveedores" },
  { icon: <Layers size={18} />, label:"Categorías", id:"categorias" },
  { icon: <Package size={18} />, label:"Productos", id:"productos" },
  { icon: <ShoppingCart size={18} />, label:"Pedidos", id:"pedidos" },
  { icon: <Bot size={18} />, label:"Asistente IA", id:"asistente-ia" },
  { icon: <Trophy size={18} />, label:"Gamificación", id:"gamificacion" },
  { icon: <BarChart3 size={18} />, label:"Reportes", id:"reportes" },
  { icon: <ShieldCheck size={18} />, label:"Roles y Permisos", id:"roles" },
  { icon: <ClipboardList size={18} />, label:"Auditoría", id:"auditoria" },
  { icon: <Settings size={18} />, label:"Configuración", id:"configuracion" },
];

export default function AdminPage() {
  const router = useRouter();
  const [seccionActiva, setSeccionActiva] = useState("bienvenida");
  const [drawerOpen, setDrawerOpen] = useState(true); 

  const renderizarContenido = () => {
    switch (seccionActiva) {
      case "bienvenida": return <BienvenidaView setSeccionActiva={setSeccionActiva} />;
      case "dashboard": return <DashboardView />;
      case "usuarios": return <UsuariosView />;
      case "proveedores": return <ProveedoresView />;
      case "categorias": return <CategoriasView />;
      case "productos": return <ProductosView />;
      case "pedidos": return <PedidosView />;
      case "asistente-ia": return <AsistenteIAView />;
      case "gamificacion": return <GamificacionView />;
      default:
        return (
          <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
            <h2>Sección en construcción 🚧</h2>
          </div>
        );
    }
  };

  const obtenerTituloHeader = () => {
    if (seccionActiva === "bienvenida") return "Inicio";
    const item = menuItems.find(item => item.id === seccionActiva);
    return item ? item.label : "Dashboard";
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div style={{ minHeight:"100vh", background:"#f8f9fb", fontFamily:"'Inter',sans-serif", position: "relative", overflow: "hidden" }}>

        {/* SIDEBAR LATERAL (Animación Arreglada) */}
        <div 
          className="transicion-suave" // <-- Clase de animación agregada
          style={{ 
            position:"fixed", top:0, left:0, bottom:0, 
            width: drawerOpen ? "220px" : "0", // <-- Ancho dinámico para animación
            opacity: drawerOpen ? 1 : 0, // <-- Opacidad dinámica
            background:"#701030", 
            display: "flex", // <-- Eliminado display dinámico que rompe animaciones
            flexDirection:"column", zIndex:100,
            overflow: "hidden", // <-- Importante para que el contenido no se desborde al cerrar
          }}
        >
          
          {/* Cabecera del Logo */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 55px 16px",
            borderBottom: "1px solid rgba(112,16,48,0.2)", 
            backgroundColor: "#E5BDC2", 
            flexShrink: 0 // Evita que el logo se comprima
          }}>
            <img 
              src="/logo/logoextendido.png" 
              alt="Emotia" 
              onClick={() => setSeccionActiva("bienvenida")}
              style={{ height: "45px", width: "auto", objectFit: "contain", flexShrink: 0, cursor: "pointer" }} 
            />
          </div>

          {/* Navegación principal */}
          <nav style={{ flex:1, padding:"1rem 0", overflowY: "auto", overflowX: "hidden" }}>
            {menuItems.map((item) => (
              <button 
                key={item.id} 
                onClick={()=>setSeccionActiva(item.id)}
                style={{ 
                  width:"220px", // Ancho fijo interno para evitar que el texto se comprima
                  display:"flex", alignItems:"center", gap:".8rem", 
                  padding:".75rem 1.5rem", 
                  background: seccionActiva===item.id?"rgba(255,255,255,0.1)":"transparent", 
                  border:"none", cursor:"pointer", 
                  fontWeight: seccionActiva===item.id?500:400, 
                  fontSize:".95rem", 
                  color: seccionActiva===item.id?"#ffffff":"rgba(255,255,255,0.7)", 
                  textAlign:"left", transition:"all .2s", fontFamily:"'Inter',sans-serif",
                  whiteSpace: "nowrap" // Evita saltos de línea
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Cerrar sesión */}
          <div style={{ padding:"1.2rem 1.5rem", borderTop:"1px solid rgba(255,255,255,0.1)", flexShrink: 0, width: "220px" }}>
            <button 
              onClick={()=>router.push("/")} 
              style={{ 
                fontFamily:"'Inter',sans-serif", fontWeight:500, fontSize:".9rem", 
                color:"rgba(255,255,255,0.7)", background:"none", border:"none", 
                cursor:"pointer", padding:0, display:"flex", alignItems:"center", gap:"0.5rem",
                whiteSpace: "nowrap"
              }}
            >
              <LogOut size={18} /> Cerrar Sesión
            </button>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL (Animación Arreglada) */}
        <div 
          className="transicion-suave" // <-- Clase de animación agregada
          style={{ 
            marginLeft: drawerOpen ? "220px" : "0", // <-- Margen dinámico animado
          }}
        >
          
          {/* Barra superior degradada */}
          <div style={{ 
            background:"linear-gradient(90deg, #701030 0%, #f0b7a9 100%)", 
            padding:"1.25rem 2rem", display:"flex", justifyContent:"space-between", alignItems:"center",
            position: "relative", zIndex: 90
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:"1rem", color:"white", fontSize:"1.2rem", fontWeight:500 }}>
              
              {/* --- BOTÓN DE FLECHA (Lógica e Icono Arreglados) --- */}
              <button 
                onClick={() => setDrawerOpen(!drawerOpen)} // Alterna estado abierto/cerrado
                style={{ background:"none", border:"none", color:"white", cursor:"pointer", display:"flex", padding: "4px", borderRadius: "8px", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {/* Muestra ChevronLeft (<) si está abierto, ChevronRight (>) si está cerrado */}
                {drawerOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
              </button>

              {obtenerTituloHeader()}
            </div>
            
            <div style={{ display:"flex", alignItems:"center", gap:"1.5rem" }}>
              
              {/* Campana de Notificaciones (Componente Externo) */}
              <Notificaciones />

              {/* Usuario administrador (Avatar Anime) */}
              <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", color:"white" }}>
                <img 
                  src="https://api.dicebear.com/8.x/micah/svg?seed=Admin" 
                  alt="Admin Avatar" 
                  style={{ 
                    width:"38px", height:"38px", borderRadius:"50%", 
                    border:"2px solid rgba(255,255,255,0.4)", objectFit:"cover",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    backgroundColor: "#E5BDC2" 
                  }} 
                />
                <span style={{ fontSize:"0.95rem", fontWeight:600 }}>Administrador</span>
              </div>
            </div>
          </div>

          {/* CUERPO DINÁMICO */}
          <div style={{ padding:"1.5rem 2rem" }}>
            {renderizarContenido()}
          </div>

        </div>
      </div>
    </>
  );
}