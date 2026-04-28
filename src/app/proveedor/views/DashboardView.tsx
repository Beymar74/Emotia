"use client";
import React from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, ShoppingCart, Package, CheckCircle2 } from 'lucide-react';

// Datos para el gráfico basados en la imagen
const datosGrafico = [
  { mes: "Ene", ventas: 2500, ingresos: 1800 }, { mes: "Feb", ventas: 3200, ingresos: 2100 },
  { mes: "Mar", ventas: 4100, ingresos: 3000 }, { mes: "Abr", ventas: 3800, ingresos: 2800 },
  { mes: "May", ventas: 4800, ingresos: 3500 }, { mes: "Jun", ventas: 5500, ingresos: 4100 },
  { mes: "Jul", ventas: 5100, ingresos: 3800 }, { mes: "Ago", ventas: 6200, ingresos: 4800 },
  { mes: "Sep", ventas: 6800, ingresos: 5100 }, { mes: "Oct", ventas: 5800, ingresos: 4500 },
  { mes: "Nov", ventas: 7500, ingresos: 5800 }, { mes: "Dic", ventas: 9200, ingresos: 7200 },
];

const kpis = [
  { title: "Ventas Totales", value: "$49,200", change: "+18%", icon: <TrendingUp size={24} color="white" />, bg: "#9B2335", colorChange: "#16a34a" },
  { title: "Pedidos Activos", value: "12", change: "+5", icon: <ShoppingCart size={24} color="white" />, bg: "#BC9968", colorChange: "#16a34a" },
  { title: "Productos Publicados", value: "5", change: "+2", icon: <Package size={24} color="white" />, bg: "#701030", colorChange: "#16a34a" },
  { title: "Calificación", value: "4.8", change: "★★★★★", icon: <CheckCircle2 size={24} color="white" />, bg: "#a8324c", colorChange: "#16a34a" },
];

const notificaciones = [
  { id: 1, titulo: 'Producto "Canasta Navideña" pendiente de aprobación', tiempo: "Hace 2 horas" },
  { id: 2, titulo: 'Nuevo pedido #2048 recibido', tiempo: "Hace 3 horas" },
  { id: 3, titulo: 'Producto "Kit de Quesos" fue rechazado', tiempo: "Ayer" },
];

export default function DashboardView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      
      {/* KPIs Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
        {kpis.map((kpi, idx) => (
          <div key={idx} style={{ 
            background: "white", borderRadius: "12px", padding: "1.5rem", 
            boxShadow: "0 4px 15px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)",
            display: "flex", flexDirection: "column", gap: "1rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: kpi.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {kpi.icon}
              </div>
              <span style={{ color: kpi.colorChange, fontSize: "0.85rem", fontWeight: 600 }}>{kpi.change}</span>
            </div>
            <div>
              <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#111827", lineHeight: "1.2" }}>{kpi.value}</div>
              <div style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "4px" }}>{kpi.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos y Notificaciones */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem" }}>
        
        {/* Gráfico */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
          <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.1rem", fontWeight: 600, color: "#111827" }}>Ventas e Ingresos Mensuales</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={datosGrafico} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#701030" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#701030" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill:"#9ca3af", fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill:"#9ca3af", fontSize: 12}} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="ventas" stroke="#BC9968" strokeWidth={2} fill="none" />
              <Area type="monotone" dataKey="ingresos" stroke="#701030" strokeWidth={2} fill="url(#colorIngresos)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Notificaciones */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
          <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.1rem", fontWeight: 600, color: "#111827" }}>Notificaciones Recientes</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {notificaciones.map((notif) => (
              <div key={notif.id} style={{ 
                background: "#fcfaf9", borderRadius: "8px", padding: "1rem", 
                border: "1px solid rgba(112,16,48,0.08)", display: "flex", alignItems: "flex-start", gap: "10px"
              }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#9B2335", marginTop: "6px" }}></div>
                <div>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.9rem", color: "#374151", fontWeight: 500 }}>{notif.titulo}</p>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af" }}>{notif.tiempo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Tarjeta de Estado de Productos (Inferior) */}
      <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
        <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", fontWeight: 600, color: "#111827" }}>Estado de Productos</h3>
        <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280", background: "#f9fafb", borderRadius: "8px", border: "1px dashed #e5e7eb" }}>
          Aquí irán las tarjetas de estados (Activos, Pendientes, etc.)
        </div>
      </div>
      
    </div>
  );
}