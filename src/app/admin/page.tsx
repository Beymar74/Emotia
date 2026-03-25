"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Users, Building2, ShoppingCart, Bot, LayoutDashboard, Layers, Package,
  Trophy, BarChart3, ShieldCheck, ClipboardList, Settings, LogOut, ChevronLeft, Bell, X
} from 'lucide-react';

// IMPORTAMOS TUS VISTAS AQUÍ
import ReportesView from "./views/ReportesView";
import RolesView from "./views/RolesView";
import AuditoriaView from "./views/AuditoriaView";
import ConfiguracionView from "./views/ConfiguracionView";

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');`;

// Datos y KPIs de Tina
const datosVentasMensuales = [{ mes: "Ene", ventas: 4500 }, { mes: "Feb", ventas: 6000 }, { mes: "Mar", ventas: 7200 }, { mes: "Abr", ventas: 6200 }, { mes: "May", ventas: 8500 }, { mes: "Jun", ventas: 9500 }, { mes: "Jul", ventas: 8000 }, { mes: "Ago", ventas: 10500 }, { mes: "Sep", ventas: 11200 }, { mes: "Oct", ventas: 9800 }, { mes: "Nov", ventas: 12500 }, { mes: "Dic", ventas: 15200 },];
const datosPedidosMensuales = [{ mes: "Ene", pedidos: 24 }, { mes: "Feb", pedidos: 31 }, { mes: "Mar", pedidos: 42 }, { mes: "Abr", pedidos: 35 }, { mes: "May", pedidos: 48 }, { mes: "Jun", pedidos: 52 }, { mes: "Jul", pedidos: 44 }, { mes: "Ago", pedidos: 58 }, { mes: "Sep", pedidos: 63 }, { mes: "Oct", pedidos: 55 }, { mes: "Nov", pedidos: 70 }, { mes: "Dic", pedidos: 86 },];
const kpis = [{ icon: <Users size={22} color="white" />, label: "Total Usuarios", valor: "580", crecimiento: "+12%", iconBg: "#9B2335" }, { icon: <Building2 size={22} color="white" />, label: "Total Proveedores", valor: "52", crecimiento: "+8%", iconBg: "#BC9968" }, { icon: <ShoppingCart size={22} color="white" />, label: "Total Pedidos", valor: "1,024", crecimiento: "+23%", iconBg: "#701030" }, { icon: <Bot size={22} color="white" />, label: "Uso Asistente IA", valor: "3,420", crecimiento: "+45%", iconBg: "#a8324c" },];
const menuItems = [{ icon: <LayoutDashboard size={18} />, label: "Dashboard", id: "dashboard" }, { icon: <Users size={18} />, label: "Usuarios", id: "usuarios" }, { icon: <Building2 size={18} />, label: "Proveedores", id: "proveedores" }, { icon: <Layers size={18} />, label: "Categorías", id: "categorias" }, { icon: <Package size={18} />, label: "Productos", id: "productos" }, { icon: <ShoppingCart size={18} />, label: "Pedidos", id: "pedidos" }, { icon: <Bot size={18} />, label: "Asistente IA", id: "asistente-ia" }, { icon: <Trophy size={18} />, label: "Gamificación", id: "gamificacion" }, { icon: <BarChart3 size={18} />, label: "Reportes", id: "reportes" }, { icon: <ShieldCheck size={18} />, label: "Roles y Permisos", id: "roles" }, { icon: <ClipboardList size={18} />, label: "Auditoría", id: "auditoria" }, { icon: <Settings size={18} />, label: "Configuración", id: "configuracion" },];
const actividadesRecientes = [{ id: "#1024", tipo: "Nuevo pedido", usuario: "María López", fecha: "Hace 2 minutos" }];


export default function AdminPage() {
  const router = useRouter();
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(true);

  // --- AQUÍ ESTÁ LA MAGIA QUE CONECTA TUS VISTAS ---
  const renderizarVista = () => {
    switch (seccionActiva) {
      case "reportes":
        return <div style={{ padding: "1.5rem 2rem" }}><ReportesView /></div>;
      case "roles":
        return <div style={{ padding: "1.5rem 2rem" }}><RolesView /></div>;
      case "auditoria":
        return <div style={{ padding: "1.5rem 2rem" }}><AuditoriaView /></div>;
      case "configuracion":
        return <div style={{ padding: "1.5rem 2rem" }}><ConfiguracionView /></div>;

      // El dashboard original de Tina lo dejamos por defecto
      case "dashboard":
      default:
        return (
          <div style={{ padding: "1.5rem 2rem" }}>
            {/* Tarjetas de KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem", marginBottom: "1.5rem" }}>
              {kpis.map((kpi) => (
                <div key={kpi.label} style={{ background: "#ffffff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "10px", background: kpi.iconBg,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      {kpi.icon}
                    </div>
                    <span style={{ color: "#16a34a", fontSize: "0.85rem", fontWeight: 600 }}>↗︎ {kpi.crecimiento}</span>
                  </div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#111827", marginBottom: "0.25rem" }}>{kpi.valor}</div>
                  <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Fila de gráficos */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              {/* Gráfico de Ventas Mensuales */}
              <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <h3 style={{ marginTop: 0, marginBottom: "1.5rem", fontSize: "1.05rem", fontWeight: 600, color: "#111827" }}>Ventas Mensuales</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={datosVentasMensuales}>
                    <defs>
                      <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9B2335" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#9B2335" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 16000]} tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} ticks={[0, 4000, 8000, 12000, 16000]} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="ventas" stroke="#9B2335" strokeWidth={2} fillOpacity={1} fill="url(#colorVentas)" activeDot={{ r: 6, fill: "#9B2335" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfico de Pedidos por Mes */}
              <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <h3 style={{ marginTop: 0, marginBottom: "1.5rem", fontSize: "1.05rem", fontWeight: 600, color: "#111827" }}>Pedidos por Mes</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={datosPedidosMensuales} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} ticks={[0, 25, 50, 75, 100]} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="pedidos" fill="#9B2335" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sección de Actividad Reciente */}
            <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <h3 style={{ margin: 0, marginBottom: "1rem", fontSize: "1.05rem", fontWeight: 600, color: "#111827" }}>Actividad Reciente</h3>
              {actividadesRecientes.map((actividad) => (
                <div key={actividad.id} style={{ padding: "1rem 0", borderTop: "1px solid #f3f4f6", fontSize: "0.95rem" }}>
                  <span style={{ fontWeight: 500, color: "#701030" }}>{actividad.tipo} {actividad.id}</span>
                  <span style={{ marginLeft: "0.5rem", color: "#6b7280" }}>por {actividad.usuario} - {actividad.fecha}</span>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div style={{ minHeight: "100vh", background: "#f8f9fb", fontFamily: "'Inter',sans-serif" }}>

        {/* SIDEBAR LATERAL */}
        <div style={{
          position: "fixed", top: 0, left: 0, bottom: 0, width: "220px",
          background: "#701030", display: drawerOpen ? "flex" : "none",
          flexDirection: "column", zIndex: 100
        }}>

          {/* CABECERA */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 55px 16px", borderBottom: "1px solid rgba(112,16,48,0.2)",
            backgroundColor: "#E5BDC2",
          }}>
            <img src="/logo/logoextendido.png" alt="Emotia" style={{ height: "45px", width: "auto", objectFit: "contain", flexShrink: 0 }} />
            <button
              onClick={() => setDrawerOpen(false)}
              style={{
                background: "none", border: "none", cursor: "pointer", color: "#701030",
                padding: "4px", borderRadius: "8px", display: "flex", transition: "background 0.15s",
                marginRight: "-45px", marginTop: "7px"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(112,16,48,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Navegación principal */}
          <nav style={{ flex: 1, padding: "1rem 0", overflowY: "auto" }}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSeccionActiva(item.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: ".8rem", padding: ".75rem 1.5rem",
                  background: seccionActiva === item.id ? "rgba(255,255,255,0.1)" : "transparent",
                  border: "none", cursor: "pointer", fontWeight: seccionActiva === item.id ? 500 : 400,
                  fontSize: ".95rem", color: seccionActiva === item.id ? "#ffffff" : "rgba(255,255,255,0.7)",
                  textAlign: "left", transition: "all .2s", fontFamily: "'Inter',sans-serif"
                }}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>

          <div style={{ padding: "1.2rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <button
              onClick={() => router.push("/")}
              style={{
                fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: ".9rem", color: "rgba(255,255,255,0.7)",
                background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: "0.5rem",
              }}
            >
              <LogOut size={18} /> Cerrar Sesión
            </button>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div style={{ marginLeft: drawerOpen ? "220px" : "0", transition: "margin-left 0.3s" }}>

          {/* Barra superior degradada */}
          <div style={{
            background: "linear-gradient(90deg, #701030 0%, #f0b7a9 100%)",
            padding: "1.25rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "white", fontSize: "1.2rem", fontWeight: 500 }}>
              {!drawerOpen && (
                <button onClick={() => setDrawerOpen(true)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", display: "flex" }}>
                  <ChevronLeft size={24} />
                </button>
              )}
              {drawerOpen && <ChevronLeft size={24} style={{ cursor: "pointer" }} />}
              {menuItems.find(i => i.id === seccionActiva)?.label || "Dashboard"}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ position: "relative" }}>
                <Bell size={20} color="white" style={{ cursor: "pointer" }} />
                <span style={{
                  position: "absolute", top: "-5px", right: "-5px", background: "#ef4444",
                  color: "white", fontSize: "0.65rem", fontWeight: 600, padding: "0.1rem 0.3rem", borderRadius: "10px"
                }}>4</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "white" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#d6b3a9", display: "flex", alignItems: "center", justifyContent: "center" }}>👨‍💼</div>
                <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>Administrador</span>
              </div>
            </div>
          </div>

          {/* CUERPO DINÁMICO */}
          {renderizarVista()}

        </div>
      </div>
    </>
  );
}