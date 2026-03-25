"use client";
import React from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Building2, ShoppingCart, Bot } from 'lucide-react';

const datosVentasMensuales = [
  { mes: "Ene", ventas: 4500 }, { mes: "Feb", ventas: 6000 }, { mes: "Mar", ventas: 7200 },
  { mes: "Abr", ventas: 6200 }, { mes: "May", ventas: 8500 }, { mes: "Jun", ventas: 9500 },
  { mes: "Jul", ventas: 8000 }, { mes: "Ago", ventas: 10500 }, { mes: "Sep", ventas: 11200 },
  { mes: "Oct", ventas: 9800 }, { mes: "Nov", ventas: 12500 }, { mes: "Dic", ventas: 15200 },
];

const datosPedidosMensuales = [
  { mes: "Ene", pedidos: 24 }, { mes: "Feb", pedidos: 31 }, { mes: "Mar", pedidos: 42 },
  { mes: "Abr", pedidos: 35 }, { mes: "May", pedidos: 48 }, { mes: "Jun", pedidos: 52 },
  { mes: "Jul", pedidos: 44 }, { mes: "Ago", pedidos: 58 }, { mes: "Sep", pedidos: 63 },
  { mes: "Oct", pedidos: 55 }, { mes: "Nov", pedidos: 70 }, { mes: "Dic", pedidos: 86 },
];

const kpis = [
  { icon: <Users size={22} color="white" />, label:"Total Usuarios", valor:"580", crecimiento:"+12%", iconBg: "#9B2335" },
  { icon: <Building2 size={22} color="white" />, label:"Total Proveedores", valor:"52", crecimiento:"+8%", iconBg: "#BC9968" },
  { icon: <ShoppingCart size={22} color="white" />, label:"Total Pedidos", valor:"1,024", crecimiento:"+23%", iconBg: "#701030" },
  { icon: <Bot size={22} color="white" />, label:"Uso Asistente IA", valor:"3,420", crecimiento:"+45%", iconBg: "#a8324c" },
];

const actividadesRecientes = [
  { id:"#1024", tipo:"Nuevo pedido", usuario:"María López", fecha:"Hace 2 minutos" }
];

export default function DashboardView() {
  return (
    <>
      {/* Tarjetas de KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"1.25rem", marginBottom:"1.5rem" }}>
        {kpis.map((kpi) => (
          <div key={kpi.label} style={{ background:"#ffffff", borderRadius:"12px", padding:"1.5rem", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.75rem" }}>
              <div style={{ 
                width:"44px", height:"44px", borderRadius:"10px", background:kpi.iconBg,
                display:"flex", alignItems:"center", justifyContent:"center"
              }}>
                {kpi.icon}
              </div>
              <span style={{ color:"#16a34a", fontSize:"0.85rem", fontWeight:600 }}>↗︎ {kpi.crecimiento}</span>
            </div>
            <div style={{ fontSize:"1.8rem", fontWeight:700, color:"#111827", marginBottom:"0.25rem" }}>{kpi.valor}</div>
            <div style={{ fontSize:"0.85rem", color:"#6b7280" }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Fila de gráficos */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem", marginBottom:"1.5rem" }}>
        {/* Gráfico de Ventas Mensuales */}
        <div style={{ background:"white", borderRadius:"12px", padding:"1.5rem", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
          <h3 style={{ marginTop:0, marginBottom:"1.5rem", fontSize:"1.05rem", fontWeight:600, color:"#111827" }}>Ventas Mensuales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={datosVentasMensuales}>
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9B2335" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#9B2335" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="mes" tick={{fill:"#9ca3af", fontSize: 12}} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 16000]} tick={{fill:"#9ca3af", fontSize: 12}} axisLine={false} tickLine={false} ticks={[0,4000,8000,12000,16000]} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Area 
                type="monotone" dataKey="ventas" stroke="#9B2335" strokeWidth={2}
                fillOpacity={1} fill="url(#colorVentas)" activeDot={{ r: 6, fill: "#9B2335" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Pedidos por Mes */}
        <div style={{ background:"white", borderRadius:"12px", padding:"1.5rem", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
          <h3 style={{ marginTop:0, marginBottom:"1.5rem", fontSize:"1.05rem", fontWeight:600, color:"#111827" }}>Pedidos por Mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosPedidosMensuales} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="mes" tick={{fill:"#9ca3af", fontSize: 12}} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{fill:"#9ca3af", fontSize: 12}} axisLine={false} tickLine={false} ticks={[0,25,50,75,100]} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="pedidos" fill="#9B2335" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sección de Actividad Reciente */}
      <div style={{ background:"white", borderRadius:"12px", padding:"1.5rem", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
        <h3 style={{ margin:0, marginBottom:"1rem", fontSize:"1.05rem", fontWeight:600, color:"#111827" }}>Actividad Reciente</h3>
        {actividadesRecientes.map((actividad) => (
          <div key={actividad.id} style={{ padding:"1rem 0", borderTop:"1px solid #f3f4f6", fontSize:"0.95rem" }}>
            <span style={{ fontWeight:500, color:"#701030" }}>{actividad.tipo} {actividad.id}</span>
            <span style={{ marginLeft:"0.5rem", color:"#6b7280" }}>por {actividad.usuario} - {actividad.fecha}</span>
          </div>
        ))}
      </div>
    </>
  );
}