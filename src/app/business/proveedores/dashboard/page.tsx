"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Package, TrendingUp, Clock, CheckCircle, ArrowUpRight, 
  Loader2, Filter, Bell, AlertTriangle, Star, ShoppingCart, 
  ChevronRight
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

import { exportarReporteDashboard } from "../../utils/exportExcel";

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

  const dataGrafica = [
    { name: 'Lun', ventas: 400 }, { name: 'Mar', ventas: 700 },
    { name: 'Mie', ventas: 450 }, { name: 'Jue', ventas: 900 },
    { name: 'Vie', ventas: 1300 }, { name: 'Sab', ventas: 1550 },
    { name: 'Dom', ventas: 1000 },
  ];

  const mockOrders = [
    { id: "PED-1042", cliente: "Evelyn Burgoa", producto: "Caja Sorpresa Premium", fecha: "13 Abr", estado: "Pendiente", total: "Bs. 150" },
    { id: "PED-1041", cliente: "Beymar Mamani", producto: "Arreglo Floral + Peluche", fecha: "13 Abr", estado: "En preparación", total: "Bs. 220" },
    { id: "PED-1040", cliente: "Carlos Rodríguez", producto: "Set de Vinos Tarijeños", fecha: "12 Abr", estado: "Entregado", total: "Bs. 350" },
  ];

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
    setFiltroActual(opciones[(opciones.indexOf(filtroActual) + 1) % opciones.length]);
  };

  // Formateador de moneda igual al Admin
  const formatBs = (monto: number) => `Bs ${monto.toLocaleString('es-BO', { minimumFractionDigits: 0 })}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1600px] mx-auto pb-8">
      
      {/* 1. SECCIÓN DE MÉTRICAS (Igualando la estructura del Admin) */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-[9px] tracking-[2.5px] uppercase text-[#7A5260] font-bold opacity-80">
            Resumen de Tienda — {new Intl.DateTimeFormat("es-BO", { month: "long", year: "numeric", timeZone: "America/La_Paz" }).format(new Date())}
          </h2>
          
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={handleFiltroClick}
              className="flex items-center gap-2 bg-white text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all shadow-sm"
            >
              <Filter size={14} /> {filtroActual}
            </button>
            <button 
              onClick={handleDownloadReport}
              disabled={isExporting}
              className="flex items-center gap-2 bg-[#8E1B3A] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#5A0F24] transition-all shadow-sm disabled:opacity-70"
            >
              {isExporting ? <Loader2 size={14} className="animate-spin" /> : <><ArrowUpRight size={14} /> Exportar</>}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Card 1: Ingresos (Estilo Admin MetricCard) */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Ingresos del Mes</p>
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">{formatBs(3450)}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+12.4%</span>
              <span className="text-[10px] text-gray-400">vs mes anterior</span>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#8E1B3A] to-[#BC9968]" />
          </div>

          {/* Card 2: Pendientes */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Pedidos Pendientes</p>
              <Clock size={16} className="text-[#8E1B3A]" />
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">12</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">+3</span>
              <span className="text-[10px] text-gray-400">requieren atención</span>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#5A0F24] to-[#8E1B3A]" />
          </div>

          {/* Card 3: En Proceso */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">En Proceso</p>
              <Package size={16} className="text-[#BC9968]" />
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">08</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">Normal</span>
              <span className="text-[10px] text-gray-400">en tiempo estimado</span>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-[#BC9968]" />
          </div>

          {/* Card 4: Entregados */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Entregados</p>
              <CheckCircle size={16} className="text-[#1A1A1A]" />
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">45</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+8.1%</span>
              <span className="text-[10px] text-gray-400">vs mes anterior</span>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#BC9968] to-[#F5E6D0]" />
          </div>
        </div>
      </section>

      {/* 2. GRID PRINCIPAL (Tabla y Actividad -> xl:grid-cols-[1.6fr_1fr]) */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4">
        
        {/* COLUMNA IZQUIERDA (1.6fr) - Tabla de Pedidos y Gráfica */}
        <div className="flex flex-col gap-4">
          
          {/* TABLA DE PEDIDOS (Estilo ProveedoresTable del Admin) */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-sm text-[#1A1A1A]">Últimos Pedidos</h3>
              <Link href="/business/proveedores/pedidos" className="text-xs font-medium text-[#8E1B3A] hover:underline">Ver todos</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-gray-100 bg-white">
                    <th className="px-5 py-3 font-medium">ID Pedido</th>
                    <th className="px-5 py-3 font-medium">Cliente</th>
                    <th className="px-5 py-3 font-medium">Producto</th>
                    <th className="px-5 py-3 font-medium text-center">Estado</th>
                    <th className="px-5 py-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mockOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-[#1A1A1A]">{o.id}</td>
                      <td className="px-5 py-3 text-gray-600">{o.cliente}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs truncate max-w-[150px]">{o.producto}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium border ${
                          o.estado === 'Pendiente' ? 'bg-red-50 text-red-700 border-red-200' : 
                          o.estado === 'Entregado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          'bg-orange-50 text-orange-700 border-orange-200'
                        }`}>
                          {o.estado}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-medium text-[#1A1A1A]">{o.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* GRÁFICA (Ajustada) */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-sm text-[#1A1A1A] mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#BC9968]" /> Rendimiento de Ventas
            </h3>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataGrafica} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={P.granate} stopOpacity={0.15}/>
                      <stop offset="95%" stopColor={P.granate} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="ventas" stroke={P.granate} strokeWidth={2} fillOpacity={1} fill="url(#colorV)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA (1fr) - Widgets en columna */}
        <div className="flex flex-col gap-4">
          
          {/* CONTROL DE INVENTARIO (Ahora como widget compacto) */}
          <div className="bg-[#3D0A1A] p-5 rounded-xl shadow-md relative overflow-hidden group flex-1">
            <div className="absolute -right-4 -top-4 opacity-10 text-white transition-transform duration-500 group-hover:scale-110">
              <Package size={80} />
            </div>
            
            <h3 className="font-semibold text-sm text-white mb-4 relative z-10 flex items-center gap-2">
               Control de Inventario
            </h3>
            
            <div className="space-y-4 relative z-10">
              {[
                { n: "Caja Premium", s: 15, v: 45, p: 75, c: "#10b981" },
                { n: "Set de Vinos", s: 2, v: 28, p: 15, c: "#ef4444" },
                { n: "Arreglo Floral", s: 8, v: 12, p: 40, c: "#f59e0b" }
              ].map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-white">{item.n}</span>
                    <span className="text-[10px] text-white/60">Stock: {item.s} ud.</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.p}%`, backgroundColor: item.c }}></div>
                  </div>
                </div>
              ))}
            </div>

            <Link 
              href="/business/proveedores/productos"
              className="w-full mt-6 py-2.5 bg-[#BC9968] text-[#3D0A1A] rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#F5E6D0] transition-colors"
            >
              Gestionar Catálogo <ChevronRight size={14} />
            </Link>
          </div>

          {/* ACTIVIDAD RECIENTE */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex-1">
            <h3 className="font-semibold text-sm text-[#1A1A1A] mb-4 flex items-center gap-2">
              <Bell size={16} className="text-[#BC9968]" /> Actividad Reciente
            </h3>
            <div className="space-y-4">
              {[
                { icon: <ShoppingCart size={14} />, t: "Nuevo pedido", d: "Bs. 250 - Evelyn B.", time: "Hace 5m", c: "#3b82f6" },
                { icon: <AlertTriangle size={14} />, t: "Stock Bajo", d: "Set de Vinos (2 ud)", time: "Hace 15m", c: P.granate },
                { icon: <Star size={14} />, t: "Nueva Reseña", d: "5 estrellas - Carlos R.", time: "Hace 1h", c: "#10b981" },
              ].map((n, i) => (
                <div key={i} className="flex gap-3 items-start group cursor-pointer">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${n.c}10`, color: n.c }}>
                    {n.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="text-xs font-medium text-gray-900 truncate">{n.t}</p>
                      <span className="text-[10px] text-gray-400 shrink-0 ml-2">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">{n.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}