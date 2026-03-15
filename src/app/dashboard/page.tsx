"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';

// Importaciones desde tus carpetas modulares
import { dashboardCSS } from "./styles";
import Sidebar, { SidebarOverlay } from "./components/Sidebar";
import Topbar from "./components/Topbar";

// Importaciones de las Vistas (Pestañas)
import DashboardContent from "./components/DashboardContent";
import AsesorIA from "./components/AsesorIA";
import Catalogo from "./components/Catalogo";
import Tracking from "./components/Tracking";
import Historial from "./components/Historial";
import Perfil from "./components/Perfil";
import Configuracion from "./components/Configuracion";
import Suscripcion from "./components/Suscripcion";

export default function DashboardCliente() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("inicio");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /** Cerrar sidebar en resize a desktop */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /** Bloquear scroll del body cuando sidebar móvil está abierto */
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  /** Cerrar sidebar con ESC */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSidebarOpen(false); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const navigate = useCallback((tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Subir al cambiar de pestaña
  }, []);

  const handleLogout = () => {
    // Aquí puedes limpiar tokens de sesión si los tienes
    router.push('/login');
  };

  return (
    <>
      {/* Estilos Globales del Dashboard */}
      <style dangerouslySetInnerHTML={{ __html: dashboardCSS }} />
      
      <div className="dashboard-layout">
        
        {/* Capa oscura para móviles cuando el menú está abierto */}
        <SidebarOverlay 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />
        
        {/* Menú Lateral */}
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          activeTab={activeTab} 
          navigate={navigate} 
          handleLogout={handleLogout} 
        />
        
        {/* Contenido Principal a la derecha */}
        <main className="dashboard-main">
          
          {/* Barra Superior */}
          <Topbar 
            activeTab={activeTab} 
            setSidebarOpen={setSidebarOpen} 
            navigate={navigate}
          />
          
          {/* Renderizado Condicional según la Pestaña Activa */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            
            {activeTab === "inicio" && (
               <DashboardContent navigate={navigate} />
            )}
            
            {activeTab === "asesor" && (
               <AsesorIA navigate={navigate} />
            )}

            {activeTab === "catalogo" && (
               <Catalogo navigate={navigate} />
            )}
            
            {activeTab === "pedidos" && (
               <Tracking />
            )}

            {activeTab === "historial" && (
               <Historial />
            )}

            {activeTab === "perfil" && (
               <Perfil />
            )}

            {activeTab === "configuracion" && (
               <Configuracion />
            )}

            {activeTab === "suscripcion" && (
               <Suscripcion />
            )}
            
          </div>
        </main>
      </div>
    </>
  );
}