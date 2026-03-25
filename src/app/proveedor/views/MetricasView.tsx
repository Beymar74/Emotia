"use client";
import React from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { TrendingUp } from 'lucide-react';

// Datos para el gráfico principal
const datosGrafico = [
  { mes: "Ene", ventas: 2500, ingresos: 1800 }, { mes: "Feb", ventas: 3200, ingresos: 2100 },
  { mes: "Mar", ventas: 4100, ingresos: 3000 }, { mes: "Abr", ventas: 3800, ingresos: 2800 },
  { mes: "May", ventas: 4800, ingresos: 3500 }, { mes: "Jun", ventas: 5500, ingresos: 4100 },
  { mes: "Jul", ventas: 5100, ingresos: 3800 }, { mes: "Ago", ventas: 6200, ingresos: 4800 },
  { mes: "Sep", ventas: 6800, ingresos: 5100 }, { mes: "Oct", ventas: 5800, ingresos: 4500 },
  { mes: "Nov", ventas: 7500, ingresos: 5800 }, { mes: "Dic", ventas: 9200, ingresos: 7200 },
];

// Datos de KPIs superiores
const kpis = [
  { label: "Ingresos Totales", valor: "$478,000", crecimiento: "+22% vs mes anterior" },
  { label: "Ticket Promedio", valor: "$1,850", crecimiento: "+8% vs mes anterior" },
  { label: "Tasa de Conversión", valor: "68%", crecimiento: "+5% vs mes anterior" },
];

// Datos de productos más vendidos
const topProductos = [
  { id: 1, nombre: "Set de Vinos Premium", ventas: 85, total: "$187,000" },
  { id: 2, nombre: "Caja de Chocolates", ventas: 120, total: "$102,000" },
  { id: 3, nombre: "Cena para Dos Premium", ventas: 45, total: "$144,000" },
  { id: 4, nombre: "Canasta Navideña", ventas: 30, total: "$45,000" },
];

export default function MetricasView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Tarjetas de KPIs (Fila 1) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
        {kpis.map((kpi, index) => (
          <div key={index} style={{ 
            background: "white", borderRadius: "12px", padding: "1.5rem", 
            border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" 
          }}>
            <div style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "0.5rem", fontWeight: 500 }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
              {kpi.valor}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#16a34a", fontSize: "0.85rem", fontWeight: 500 }}>
              <TrendingUp size={16} />
              {kpi.crecimiento}
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico Ancho (Fila 2) */}
      <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
        <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.1rem", fontWeight: 600, color: "#111827" }}>
          Ventas e Ingresos Mensuales
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={datosGrafico} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIngresosFull" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#701030" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#701030" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill:"#9ca3af", fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill:"#9ca3af", fontSize: 12}} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Area type="monotone" dataKey="ventas" stroke="#BC9968" strokeWidth={2} fill="none" />
            <Area type="monotone" dataKey="ingresos" stroke="#701030" strokeWidth={2} fill="url(#colorIngresosFull)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Lista de Productos Más Vendidos (Fila 3) */}
      <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
        <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.1rem", fontWeight: 600, color: "#111827" }}>
          Productos Más Vendidos
        </h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {topProductos.map((prod) => (
            <div key={prod.id} style={{ 
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "#f9fafb", borderRadius: "8px", padding: "1rem 1.5rem",
              border: "1px solid #f3f4f6"
            }}>
              
              <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                {/* Medalla de posición */}
                <div style={{ 
                  width: "36px", height: "36px", borderRadius: "50%", 
                  background: prod.id === 1 ? "#BC9968" : "#e5e7eb", // Dorado para el 1ro, gris para el resto
                  color: prod.id === 1 ? "white" : "#4b5563",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: "0.95rem"
                }}>
                  {prod.id}
                </div>
                
                {/* Nombre y ventas */}
                <div>
                  <div style={{ fontWeight: 600, color: "#111827", fontSize: "0.95rem", marginBottom: "0.2rem" }}>
                    {prod.nombre}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>
                    {prod.ventas} ventas
                  </div>
                </div>
              </div>

              {/* Total recaudado */}
              <div style={{ fontWeight: 700, color: "#9B2335", fontSize: "1.05rem" }}>
                {prod.total}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}