"use client";

import React, { useState } from "react";
import Link from "next/link"; // Importamos Link para la navegación
import { 
  Package, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  ArrowUpRight, 
  Loader2, 
  Calendar,
  Filter
} from "lucide-react";
import { exportarReporteDashboard } from "../utils/exportExcel";

export default function DashboardPage() {
  const [isExporting, setIsExporting] = useState(false);
  
  // Estado para simular la funcionalidad del botón de Filtro
  const [filtroActual, setFiltroActual] = useState("Filtrar Fechas");

  const mockOrders = [
    { id: "PED-1042", cliente: "Evelyn Burgoa", producto: "Caja Sorpresa Premium", fecha: "13 Abr 2026", estado: "Pendiente", total: "Bs. 150" },
    { id: "PED-1041", cliente: "Beymar Mamani", producto: "Arreglo Floral + Peluche", fecha: "13 Abr 2026", estado: "En preparación", total: "Bs. 220" },
    { id: "PED-1040", cliente: "Mauricio Menacho", producto: "Taza Personalizada", fecha: "12 Abr 2026", estado: "Listo", total: "Bs. 45" },
    { id: "PED-1039", cliente: "Usuario Anónimo", producto: "Set de Chocolates Artesanales", fecha: "11 Abr 2026", estado: "Entregado", total: "Bs. 85" },
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

  // Función para rotar el texto del filtro y que se vea funcional
  const handleFiltroClick = () => {
    const opciones = ["Filtrar Fechas", "Últimos 7 días", "Este Mes", "Año Actual"];
    const indiceActual = opciones.indexOf(filtroActual);
    const siguienteIndice = (indiceActual + 1) % opciones.length;
    setFiltroActual(opciones[siguienteIndice]);
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "Pendiente": 
        return <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold shadow-sm">Pendiente</span>;
      case "En preparación": 
        return <span className="px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-xs font-bold shadow-sm">En preparación</span>;
      case "Listo": 
        return <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold shadow-sm">Listo para envío</span>;
      case "Entregado": 
        return <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold shadow-sm">Entregado</span>;
      default: 
        return <span className="px-3 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-xs font-bold shadow-sm">{estado}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-12">
      
      {/* SECCIÓN: Encabezado y Acciones Principales */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Dashboard General</h1>
          <p className="text-[#B0B0B0] mt-1 font-medium">Visualiza el rendimiento y métricas de tu negocio en tiempo real.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Botón de Filtro Actualizado (Funcional visualmente) */}
          <button 
            onClick={handleFiltroClick}
            className="flex items-center gap-2 bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm active:scale-95"
            style={{ width: "160px", justifyContent: "center" }} // Ancho fijo para que no salte al cambiar el texto
          >
            <Filter size={16} /> {filtroActual}
          </button>
          
          <button 
            onClick={handleDownloadReport}
            disabled={isExporting}
            className="flex items-center gap-2 bg-[#8E1B3A] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#5A0F24] transition-all shadow-lg shadow-[#8E1B3A]/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>Generando Excel... <Loader2 size={18} className="animate-spin" /></>
            ) : (
              <>Descargar Reporte <ArrowUpRight size={18} /></>
            )}
          </button>
        </div>
      </div>

      {/* SECCIÓN: Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Tarjeta: Pedidos Pendientes */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm text-[#B0B0B0] font-bold uppercase tracking-widest">Pendientes</p>
            <p className="text-4xl font-black text-[#8E1B3A] mt-2">12</p>
          </div>
          <div className="h-14 w-14 bg-[#F5E6D0] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clock className="text-[#8E1B3A]" size={28} />
          </div>
        </div>

        {/* Tarjeta: En Preparación */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm text-[#B0B0B0] font-bold uppercase tracking-widest">En Proceso</p>
            <p className="text-4xl font-black text-[#BC9968] mt-2">08</p>
          </div>
          <div className="h-14 w-14 bg-orange-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Package className="text-[#BC9968]" size={28} />
          </div>
        </div>

        {/* Tarjeta: Ventas Completadas (ACTUALIZADA A NEGRO #1A1A1A) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm text-[#B0B0B0] font-bold uppercase tracking-widest">Entregados</p>
            <p className="text-4xl font-black text-[#1A1A1A] mt-2">45</p>
          </div>
          <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <CheckCircle className="text-[#1A1A1A]" size={28} />
          </div>
        </div>

        {/* Tarjeta: Ingresos Totales */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm text-[#B0B0B0] font-bold uppercase tracking-widest">Ventas (Mes)</p>
            <p className="text-3xl font-black text-emerald-600 mt-2">Bs. 3,450</p>
          </div>
          <div className="h-14 w-14 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="text-emerald-600" size={28} />
          </div>
        </div>
      </div>

      {/* SECCIÓN: Tabla de Órdenes Recientes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1.5 bg-[#8E1B3A] rounded-full"></div>
            <h2 className="text-lg font-bold text-[#3D0A1A]">Últimos Pedidos Recibidos</h2>
          </div>
          {/* Botón de Historial Actualizado (Ahora es un Link real a /business/pedidos) */}
          <Link 
            href="/business/pedidos" 
            className="text-sm text-[#BC9968] font-bold hover:text-[#9A7A48] transition-colors flex items-center gap-1 group"
          >
            Ver historial completo <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[#B0B0B0] text-[11px] uppercase tracking-[0.15em] font-black bg-white">
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#F5E6D0]/10 transition-colors cursor-pointer group">
                  <td className="px-6 py-5 font-bold text-[#8E1B3A] group-hover:text-[#5A0F24]">{order.id}</td>
                  <td className="px-6 py-5">
                    <div className="font-semibold text-gray-800">{order.cliente}</div>
                  </td>
                  <td className="px-6 py-5 text-gray-600 italic">"{order.producto}"</td>
                  <td className="px-6 py-5 text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} /> {order.fecha}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">{getStatusBadge(order.estado)}</td>
                  <td className="px-6 py-5 font-black text-[#1A1A1A] text-right">{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}