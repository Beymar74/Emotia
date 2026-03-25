"use client";
import React from "react";
import { Download } from "lucide-react";
import { 
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// Datos para los gráficos
const datosVentas = [
  { mes: "Ene", valor: 4000 }, { mes: "Feb", valor: 6000 }, { mes: "Mar", valor: 7200 },
  { mes: "Abr", valor: 6000 }, { mes: "May", valor: 8500 }, { mes: "Jun", valor: 9000 },
  { mes: "Jul", valor: 7800 }, { mes: "Ago", valor: 10500 }, { mes: "Sep", valor: 11000 },
  { mes: "Oct", valor: 9500 }, { mes: "Nov", valor: 13000 }, { mes: "Dic", valor: 15500 },
];

const datosCategoria = [
  { name: 'Experiencias', value: 35, color: '#701030' },
  { name: 'Gourmet', value: 25, color: '#9B2335' },
  { name: 'Tecnología', value: 20, color: '#BC9968' },
  { name: 'Bienestar', value: 12, color: '#f8f4ef' }, 
  { name: 'Otros', value: 8, color: '#3f091b' }, 
];

const datosProveedores = [
  { nombre: "Regalos Premium", rendimiento: 95 },
  { nombre: "Experiencias MX", rendimiento: 80 },
  { nombre: "Gourmet Box", rendimiento: 75 },
  { nombre: "Tech Gifts", rendimiento: 65 },
  { nombre: "Wellness Co", rendimiento: 50 },
];

const datosUsoIA = [
  { dia: "Ene", uso: 120 }, { dia: "Feb", uso: 145 }, { dia: "Mar", uso: 190 },
  { dia: "Abr", uso: 160 }, { dia: "May", uso: 210 }, { dia: "Jun", uso: 250 },
  { dia: "Jul", uso: 220 }, { dia: "Ago", uso: 280 }, { dia: "Sep", uso: 310 },
  { dia: "Oct", uso: 270 }, { dia: "Nov", uso: 320 }, { dia: "Dic", uso: 380 },
];

// NUEVOS DATOS para los dos gráficos de abajo
const datosCrecimiento = [
  { mes: "Ene", usuarios: 120, ingresos: 15 }, { mes: "Feb", usuarios: 145, ingresos: 18 }, 
  { mes: "Mar", usuarios: 190, ingresos: 22 }, { mes: "Abr", usuarios: 210, ingresos: 25 }, 
  { mes: "May", usuarios: 250, ingresos: 28 }, { mes: "Jun", usuarios: 310, ingresos: 30 }, 
  { mes: "Jul", usuarios: 340, ingresos: 32 }, { mes: "Ago", usuarios: 380, ingresos: 35 }, 
  { mes: "Sep", usuarios: 420, ingresos: 38 }, { mes: "Oct", usuarios: 460, ingresos: 40 }, 
  { mes: "Nov", usuarios: 510, ingresos: 45 }, { mes: "Dic", usuarios: 580, ingresos: 50 },
];

const datosPedidos = [
  { mes: "Ene", pedidos: 24 }, { mes: "Feb", pedidos: 31 }, { mes: "Mar", pedidos: 42 }, 
  { mes: "Abr", pedidos: 35 }, { mes: "May", pedidos: 48 }, { mes: "Jun", pedidos: 52 }, 
  { mes: "Jul", pedidos: 44 }, { mes: "Ago", pedidos: 58 }, { mes: "Sep", pedidos: 63 }, 
  { mes: "Oct", pedidos: 55 }, { mes: "Nov", pedidos: 70 }, { mes: "Dic", pedidos: 86 },
];

export default function ReportesView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Botón de Exportar */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={{ 
          background: "#701030", color: "white", border: "none", borderRadius: "8px",
          padding: "0.6rem 1.2rem", display: "flex", alignItems: "center", gap: "0.5rem",
          fontWeight: 500, cursor: "pointer", fontSize: "0.9rem"
        }}>
          <Download size={16} /> Exportar Reporte
        </button>
      </div>

      {/* Grid de Gráficos (2 columnas) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        
        {/* Gráfico 1: Ventas Mensuales (Area) */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
          <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.05rem", fontWeight: 600, color: "#111827" }}>Ventas Mensuales</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={datosVentas} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVentasRep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9B2335" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#9B2335" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill:"#9ca3af", fontSize: 11}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill:"#9ca3af", fontSize: 11}} />
              <Tooltip />
              <Area type="monotone" dataKey="valor" stroke="#9B2335" strokeWidth={2} fill="url(#colorVentasRep)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 2: Ventas por Categoría (Pastel Donut) */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.05rem", fontWeight: 600, color: "#111827" }}>Ventas por Categoría</h3>
          <div style={{ flex: 1, position: "relative" }}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={datosCategoria}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }: any) => {
                    const RADIAN = Math.PI / 180;
                    const radius = 25 + innerRadius + (outerRadius - innerRadius);
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text x={x} y={y} fill={datosCategoria[index].color} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="0.85rem" fontWeight={500}>
                        {datosCategoria[index].name} {value}%
                      </text>
                    );
                  }}
                >
                  {datosCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 3: Rendimiento de Proveedores (Barras Horizontales) */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
          <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.05rem", fontWeight: 600, color: "#111827" }}>Rendimiento de Proveedores</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={datosProveedores} layout="vertical" margin={{ top: 0, right: 20, left: -20, bottom: 0 }} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
              <XAxis type="number" hide />
              <YAxis dataKey="nombre" type="category" axisLine={false} tickLine={false} tick={{fill:"#6b7280", fontSize: 11}} width={110} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="rendimiento" fill="#9B2335" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 4: Uso del Asistente IA (Línea con puntos dorados) */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
          <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.05rem", fontWeight: 600, color: "#111827" }}>Uso del Asistente IA</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={datosUsoIA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{fill:"#9ca3af", fontSize: 11}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill:"#9ca3af", fontSize: 11}} />
              <Tooltip />
              <Line type="monotone" dataKey="uso" stroke="#BC9968" strokeWidth={2} dot={{ r: 4, fill: "#BC9968", strokeWidth: 2, stroke: "white" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* NUEVO - Gráfico 5: Crecimiento Mensual (Dos líneas) */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
          <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.05rem", fontWeight: 600, color: "#111827" }}>Crecimiento Mensual</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={datosCrecimiento} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill:"#9ca3af", fontSize: 11}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill:"#9ca3af", fontSize: 11}} ticks={[0, 150, 300, 450, 600]} />
              <Tooltip />
              <Line type="monotone" dataKey="usuarios" stroke="#9B2335" strokeWidth={2} dot={{ r: 4, fill: "#9B2335", strokeWidth: 2, stroke: "white" }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="ingresos" stroke="#BC9968" strokeWidth={2} dot={{ r: 4, fill: "#BC9968", strokeWidth: 2, stroke: "white" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* NUEVO - Gráfico 6: Pedidos por Mes (Barras verticales) */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
          <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.05rem", fontWeight: 600, color: "#111827" }}>Pedidos por Mes</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={datosPedidos} barSize={28} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill:"#9ca3af", fontSize: 11}} dy={10} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill:"#9ca3af", fontSize: 11}} ticks={[0, 25, 50, 75, 100]} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="pedidos" fill="#9B2335" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}