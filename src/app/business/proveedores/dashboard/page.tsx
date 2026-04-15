"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Package, TrendingUp, Clock, CheckCircle, ArrowUpRight, 
  Loader2, Calendar, Filter, Bell, AlertTriangle, Star, ShoppingCart, 
  ChevronRight
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// Importamos tu utilidad de Excel
import { exportarReporteDashboard } from "../../utils/exportExcel";

// Paleta Oficial de Emotia Business
const P = {
  bordoNegro: "#3D0A1A",
  bordoOscuro: "#5A0F24",
  granate: "#8E1B3A",
  dorado: "#BC9968",
  beige: "#F5E6D0",
  blanco: "#FFFFFF",
  gris: "#B0B0B0",
  negro: "#1A1A1A"
};

export default function DashboardPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [filtroActual, setFiltroActual] = useState("Este Mes");

  // --- DATOS PARA LA GRÁFICA ---
  const dataGrafica = [
    { name: 'Lun', ventas: 400 }, { name: 'Mar', ventas: 700 },
    { name: 'Mie', ventas: 450 }, { name: 'Jue', ventas: 900 },
    { name: 'Vie', ventas: 1300 }, { name: 'Sab', ventas: 1550 },
    { name: 'Dom', ventas: 1000 },
  ];

  const mockOrders = [
    { id: "PED-1042", cliente: "Evelyn Burgoa", producto: "Caja Sorpresa Premium", fecha: "13 Abr", estado: "Pendiente", total: "Bs. 150" },
    { id: "PED-1041", cliente: "Beymar Mamani", producto: "Arreglo Floral + Peluche", fecha: "13 Abr", estado: "En preparación", total: "Bs. 220" },
  ];

  // --- FUNCIONES RECUPERADAS ---
  const handleDownloadReport = async () => {
    setIsExporting(true);
    try {
      await exportarReporteDashboard(mockOrders);
    } catch (error) {
      console.error("Error al generar el reporte:", error);
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  const handleFiltroClick = () => {
    const opciones = ["Filtrar Fechas", "Últimos 7 días", "Este Mes", "Año Actual"];
    const indiceActual = opciones.indexOf(filtroActual);
    const siguienteIndice = (indiceActual + 1) % opciones.length;
    setFiltroActual(opciones[siguienteIndice]);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-12">
      
      {/* HEADER: Título y Acciones */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Panel de Control</h1>
          <p className="text-[#B0B0B0] mt-1 font-medium">Bienvenido de vuelta, Artesanías La Paz.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleFiltroClick}
            className="flex items-center gap-2 bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm active:scale-95"
          >
            <Filter size={16} /> {filtroActual}
          </button>
          
          <button 
            onClick={handleDownloadReport}
            disabled={isExporting}
            className="flex items-center gap-2 bg-[#8E1B3A] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#5A0F24] transition-all shadow-lg active:scale-95 disabled:opacity-70"
          >
            {isExporting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>Reporte <ArrowUpRight size={18} /></>
            )}
          </button>
        </div>
      </div>

      {/* METRICAS RAPIDAS */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  {[
    { label: "Pendientes", val: "12", icon: Clock, color: P.granate, bg: P.beige },
    { label: "En Proceso", val: "08", icon: Package, color: P.dorado, bg: "#FDF7ED" },
    { label: "Entregados", val: "45", icon: CheckCircle, color: P.negro, bg: "#F3F4F6" },
    { label: "Ingresos", val: "Bs. 3,450", icon: TrendingUp, color: "#059669", bg: "#ECFDF5" }
  ].map((m, i) => {
    // Definimos el componente del ícono dinámicamente
    const IconComponent = m.icon;
    return (
      <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-[10px] text-[#B0B0B0] font-black uppercase tracking-widest">{m.label}</p>
          <p className="text-2xl font-black mt-1" style={{ color: m.color }}>{m.val}</p>
        </div>
        <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: m.bg }}>
          {/* Renderizamos el componente directamente con sus props */}
          <IconComponent color={m.color} size={24} />
        </div>
      </div>
    );
  })}
</div>

      {/* CUERPO PRINCIPAL (2 COLUMNAS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMNA IZQUIERDA (Gráfica y Tabla) - 8 de 12 columnas */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* GRÁFICA */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#3D0A1A] flex items-center gap-2">
                <TrendingUp size={18} className="text-[#BC9968]" /> Rendimiento de Ventas (Bs.)
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+12.5% vs ayer</span>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataGrafica}>
                  <defs>
                    <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={P.granate} stopOpacity={0.15}/>
                      <stop offset="95%" stopColor={P.granate} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#B0B0B0'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#B0B0B0'}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="ventas" stroke={P.granate} strokeWidth={3} fillOpacity={1} fill="url(#colorV)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TABLA DE PEDIDOS */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-[#3D0A1A]">Pedidos Recientes</h3>
              <Link href="/business/proveedores/pedidos" className="text-xs font-bold text-[#BC9968] hover:underline">Ver todo</Link>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase text-[#B0B0B0] font-black border-b border-gray-50">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {mockOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                    <td className="px-6 py-4 font-bold text-[#8E1B3A]">{o.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-700">{o.cliente}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${o.estado === 'Pendiente' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                        {o.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black">{o.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* COLUMNA DERECHA (Actividad e Inventario) - 4 de 12 columnas */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* ACTIVIDAD RECIENTE */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#3D0A1A] mb-5 flex items-center gap-2">
              <Bell size={18} className="text-[#BC9968]" /> Actividad Reciente
            </h3>
            <div className="space-y-4">
              {[
                { icon: <ShoppingCart size={16} />, t: "Nuevo pedido", d: "Bs. 250 - Evelyn B.", time: "5M", c: "#3b82f6" },
                { icon: <AlertTriangle size={16} />, t: "Stock Bajo", d: "Vino Tarijeño (2 ud)", time: "15M", c: P.granate },
                { icon: <Star size={16} />, t: "Nueva Reseña", d: "5 estrellas - Carlos R.", time: "1H", c: "#10b981" },
              ].map((n, i) => (
                <div key={i} className="flex gap-3 items-center group cursor-pointer">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: `${n.c}10`, color: n.c }}>
                    {n.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">{n.t}</p>
                    <p className="text-[11px] text-gray-500 truncate">{n.d}</p>
                  </div>
                  <span className="text-[10px] font-bold text-gray-300">{n.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CONTROL DE INVENTARIO (Fondo Oscuro) */}
          <div className="bg-[#3D0A1A] p-6 rounded-3xl shadow-xl shadow-[#3D0A1A]/20 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 opacity-10 text-white rotate-12 group-hover:rotate-0 transition-transform duration-500">
              <Package size={120} />
            </div>
            
            <h3 className="font-bold text-white mb-5 relative z-10 flex items-center gap-2">
               Control de Inventario
            </h3>
            
            <div className="space-y-4 relative z-10">
              {[
                { n: "Caja Premium", s: 15, v: 45, p: 75, c: "#10b981" },
                { n: "Set de Vinos", s: 2, v: 28, p: 15, c: "#fb923c" },
                { n: "Arreglo Floral", s: 8, v: 12, p: 40, c: "#10b981" }
              ].map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-white">{item.n}</span>
                    <span className="text-white opacity-60">{item.v} ventas</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.p}%`, backgroundColor: item.c }}></div>
                  </div>
                  <p className="text-[9px] text-[#F5E6D0]/60 font-medium">Stock: {item.s} ud.</p>
                </div>
              ))}
            </div>

            {/* BOTÓN: Ahora redirige correctamente al catálogo */}
            <Link 
              href="/business/proveedores/productos"
              className="w-full mt-6 py-3 bg-[#BC9968] text-[#3D0A1A] rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-[#F5E6D0] transition-all active:scale-95"
            >
              Gestionar Inventario <ChevronRight size={14} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}