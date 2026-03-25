"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { useUser } from "@stackframe/stack";

import { dashboardCSS } from "./styles";
import Sidebar, { SidebarOverlay } from "./components/Sidebar";
import Topbar from "./components/Topbar";

import DashboardContent from "./components/DashboardContent";
import AsesorIA from "./components/AsesorIA";
import Catalogo from "./components/Catalogo";
import Tracking from "./components/Tracking";
import Historial from "./components/Historial";
import Perfil from "./components/Perfil";
import Configuracion from "./components/Configuracion";
import Suscripcion from "./components/Suscripcion";

export default function DashboardCliente() {
  const user = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("inicio");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user === undefined) return; // todavía cargando
    if (user === null) {
      router.push('/login');
      return;
    }

    // ✅ Redirección por rol
    const role = (user.clientMetadata as { role?: string })?.role;
    if (role === 'admin') {
      router.push('/admin');
      return;
    }
    if (role === 'proveedor') {
      router.push('/proveedor');
      return;
    }
    // sin rol o rol 'cliente' → se queda aquí

  }, [user, router]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSidebarOpen(false); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const navigate = useCallback((tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLogout = async () => {
    await user?.signOut();
  };

  if (user === undefined) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#F5E6D0" }}>
        <p style={{ fontFamily: "serif", fontSize: "1.2rem", color: "#5A0F24" }}>Cargando...</p>
      </div>
    );
  }

  if (user === null) return null;

  // Evita renderizar el dashboard si es admin o proveedor (mientras redirige)
  const role = (user.clientMetadata as { role?: string })?.role;
  if (role === 'admin' || role === 'proveedor') return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: dashboardCSS }} />
      
      <div className="dashboard-layout">
        <SidebarOverlay 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          activeTab={activeTab} 
          navigate={navigate} 
          handleLogout={handleLogout} 
        />
        <main className="dashboard-main">
          <Topbar 
            activeTab={activeTab} 
            setSidebarOpen={setSidebarOpen} 
            navigate={navigate}
          />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {activeTab === "inicio" && <DashboardContent navigate={navigate} />}
            {activeTab === "asesor" && <AsesorIA navigate={navigate} />}
            {activeTab === "catalogo" && <Catalogo navigate={navigate} />}
            {activeTab === "pedidos" && <Tracking />}
            {activeTab === "historial" && <Historial />}
            {activeTab === "perfil" && <Perfil />}
            {activeTab === "configuracion" && <Configuracion />}
            {activeTab === "suscripcion" && <Suscripcion />}
          </div>
        </main>
      </div>
    </>
  );
}