"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowUpRight,
  Loader2,
  Filter,
  Bell,
  AlertTriangle,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  exportarReporteDashboardExcel,
  exportarReporteDashboardPDF,
} from "../../../utils/exportExcel_Pdf";
import { obtenerDashboardProveedor } from "./actions";

const P = {
  bordoNegro: "#3D0A1A",
  bordoOscuro: "#5A0F24",
  granate: "#8E1B3A",
  dorado: "#BC9968",
  beige: "#F5E6D0",
  blanco: "#FFFFFF",
  gris: "#B0B0B0",
  negro: "#1A1A1A",
};

type FiltroDashboard = "ultimos_7_dias" | "este_mes" | "anio_actual";

const labelFiltro: Record<FiltroDashboard, string> = {
  ultimos_7_dias: "Últimos 7 días",
  este_mes: "Este Mes",
  anio_actual: "Año Actual",
};
type EstadoPedidoUI = "Pendiente" | "En proceso" | "Entregado" | "Desconocido";

type DashboardData = {
  metricas: {
    ingresosMes: number;
    crecimientoIngresos: number;
    pedidosPendientes: number;
    pedidosPendientesMes: number;
    pedidosEnProceso: number;
    pedidosEntregados: number;
    crecimientoEntregados: number;
    estadoOperacion: string;
    textoOperacion: string;
    productosActivos: number;
    stockBajo: number;
  };
  productosRecientes: {
    id: number;
    nombre: string;
    stock: number;
    activo: boolean;
    precio: number;
    imagen: string | null;
  }[];
  inventario: {
    id: number;
    nombre: string;
    stock: number;
    imagen: string | null;
    porcentaje: number;
  }[];
  ultimosPedidos: {
    id: string;
    pedidoId: string;
    cliente: string;
    producto: string;
    estado: string;
    total: number;
    fecha: string;
    imagen: string | null;
  }[];
  actividadReciente: {
    tipo: "pedido" | "stock";
    titulo: string;
    descripcion: string;
    tiempo: string;
    fechaOrden: string;
  }[];
  graficaVentas: {
    name: string;
    ventas: number;
  }[];
};
export default function DashboardPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [mostrarMenuExportar, setMostrarMenuExportar] = useState(false);
  const [filtroActual, setFiltroActual] =
  useState<FiltroDashboard>("este_mes");
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
  setIsLoading(true);

  obtenerDashboardProveedor(filtroActual).then((data) => {
    setDashboardData(data);
    setIsLoading(false);
  });
}, [filtroActual]);

  const exportarDashboardExcel = async () => {
  if (!dashboardData) return;

  setIsExporting(true);

  try {
    await exportarReporteDashboardExcel(
      dashboardData.ultimosPedidos.map((pedido) => ({
        ...pedido,
        total: String(pedido.total),
      }))
    );
  } catch (error) {
    console.error(error);
  } finally {
    setIsExporting(false);
    setMostrarMenuExportar(false);
  }
};

const exportarDashboardPDF = async () => {
  if (!dashboardData) return;

  setIsExporting(true);

  try {
    await exportarReporteDashboardPDF(
      dashboardData.ultimosPedidos.map((pedido) => ({
        ...pedido,
        total: String(pedido.total),
      }))
    );
  } catch (error) {
    console.error(error);
  } finally {
    setIsExporting(false);
    setMostrarMenuExportar(false);
  }
};

  const handleFiltroClick = () => {
  const opciones: FiltroDashboard[] = [
    "ultimos_7_dias",
    "este_mes",
    "anio_actual",
  ];

  const indiceActual = opciones.indexOf(filtroActual);
  const siguienteIndice = (indiceActual + 1) % opciones.length;

  setFiltroActual(opciones[siguienteIndice]);
};

  const formatBs = (monto: number) =>
    `Bs ${monto.toLocaleString("es-BO", { minimumFractionDigits: 0 })}`;

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#8E1B3A]" size={40} />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center text-red-500 font-bold mt-10">
        No se pudo cargar el dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1600px] mx-auto pb-8">
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-[9px] tracking-[2.5px] uppercase text-[#7A5260] font-bold opacity-80">
            Resumen de Tienda —{" "}
            {new Intl.DateTimeFormat("es-BO", {
              month: "long",
              year: "numeric",
              timeZone: "America/La_Paz",
            }).format(new Date())}
          </h2>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleFiltroClick}
              className="flex items-center gap-2 bg-white text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all shadow-sm"
            >
              <Filter size={14} /> {labelFiltro[filtroActual]}
            </button>

            <div className="relative">
  <button
    onClick={() => setMostrarMenuExportar((v) => !v)}
    disabled={isExporting}
    className="flex items-center gap-2 bg-[#8E1B3A] text-[#F5E6D0] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#5A0F24] transition-all shadow-sm disabled:opacity-70"
  >
    {isExporting ? (
      <Loader2 size={14} className="animate-spin" />
    ) : (
      <>
        <ArrowUpRight size={14} />
        Exportar
      </>
    )}
  </button>

  {mostrarMenuExportar && !isExporting && (
    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50">
      <button
        onClick={exportarDashboardExcel}
        className="w-full text-left px-4 py-3 text-xs font-bold text-[#3D0A1A] hover:bg-[#F5E6D0]"
      >
        Exportar Excel
      </button>

      <button
        onClick={exportarDashboardPDF}
        className="w-full text-left px-4 py-3 text-xs font-bold text-[#3D0A1A] hover:bg-[#F5E6D0]"
      >
        Exportar PDF
      </button>
    </div>
  )}
</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Ingresos del Mes
              </p>
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">
              {formatBs(dashboardData.metricas.ingresosMes)}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                {dashboardData.metricas.crecimientoIngresos.toFixed(1)}%
              </span>
              <span className="text-[10px] text-gray-400">vs mes anterior</span>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#8E1B3A] to-[#BC9968]" />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Pedidos Pendientes
              </p>
              <Clock size={16} className="text-[#8E1B3A]" />
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">
              {dashboardData.metricas.pedidosPendientes}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                {dashboardData.metricas.pedidosPendientesMes}
              </span>
              <span className="text-[10px] text-gray-400">nuevos este mes</span>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#5A0F24] to-[#8E1B3A]" />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                En Proceso
              </p>
              <Package size={16} className="text-[#BC9968]" />
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">
              {dashboardData.metricas.pedidosEnProceso}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                {dashboardData.metricas.estadoOperacion}
              </span>
              <span className="text-[10px] text-gray-400">
                {dashboardData.metricas.textoOperacion}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-[#BC9968]" />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Entregados
              </p>
              <CheckCircle size={16} className="text-[#1A1A1A]" />
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">
              {dashboardData.metricas.pedidosEntregados}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                {dashboardData.metricas.crecimientoEntregados.toFixed(1)}%
              </span>
              <span className="text-[10px] text-gray-400">vs mes anterior</span>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#BC9968] to-[#F5E6D0]" />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4">
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-sm text-[#1A1A1A]">
                Últimos Pedidos
              </h3>
              <Link
                href="/business/proveedores/pedidos"
                className="text-xs font-medium text-[#8E1B3A] hover:underline"
              >
                Ver todos
              </Link>
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
                  {dashboardData.ultimosPedidos.length === 0 ? (
  <tr>
    <td
      colSpan={5}
      className="px-5 py-8 text-center text-xs text-gray-400"
    >
      Todavía no tienes pedidos recientes.
    </td>
  </tr>
) : (
  dashboardData.ultimosPedidos.map((o) => (
    <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
      <td className="px-5 py-3 font-medium text-[#1A1A1A]">
        {o.pedidoId}
      </td>
      <td className="px-5 py-3 text-gray-600">{o.cliente}</td>
      <td className="px-5 py-3 text-gray-500 text-xs truncate max-w-[150px]">
        {o.producto}
      </td>
      <td className="px-5 py-3 text-center">
        <span
  className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium border ${
    o.estado === "Pendiente"
      ? "bg-red-50 text-red-700 border-red-200"
      : o.estado === "Entregado"
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-orange-50 text-orange-700 border-orange-200"
  }`}
>
  {o.estado}
</span>
      </td>
      <td className="px-5 py-3 text-right font-medium text-[#1A1A1A]">
        {formatBs(o.total)}
      </td>
    </tr>
  ))
)}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-sm text-[#1A1A1A] mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#BC9968]" /> Rendimiento de
              Ventas
            </h3>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dashboardData.graficaVentas}
                  margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={P.granate} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={P.granate} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="ventas"
                    stroke={P.granate}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorV)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-[#3D0A1A] p-5 rounded-xl shadow-md relative overflow-hidden group flex-1">
            <div className="absolute -right-4 -top-4 opacity-10 text-white transition-transform duration-500 group-hover:scale-110">
              <Package size={80} />
            </div>

            <h3 className="font-semibold text-sm text-white mb-4 relative z-10 flex items-center gap-2">
              Control de Inventario
            </h3>

            <div className="space-y-4 relative z-10">
              {dashboardData.inventario.length === 0 ? (
  <div className="rounded-lg bg-white/10 p-4 text-xs text-white/70">
    No hay productos con stock bajo.
  </div>
) : (
  dashboardData.inventario.map((item, i) => (
    <div key={i} className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium text-white">{item.nombre}</span>
        <span className="text-[10px] text-white/60">
          Stock: {item.stock} ud.
        </span>
      </div>

      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${item.porcentaje}%`,
            backgroundColor:
              item.stock <= 2
                ? "#ef4444"
                : item.stock <= 5
                  ? "#f59e0b"
                  : "#10b981",
          }}
        />
      </div>
    </div>
  ))
)}
            </div>

            <Link
              href="/business/proveedores/productos"
              className="w-full mt-6 py-2.5 bg-[#BC9968] text-[#3D0A1A] rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#F5E6D0] transition-colors"
            >
              Gestionar Catálogo <ChevronRight size={14} />
            </Link>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex-1">
            <h3 className="font-semibold text-sm text-[#1A1A1A] mb-4 flex items-center gap-2">
              <Bell size={16} className="text-[#BC9968]" /> Actividad Reciente
            </h3>

            <div className="space-y-4">
              {dashboardData.actividadReciente.length === 0 ? (
  <div className="rounded-lg bg-gray-50 p-4 text-xs text-gray-400">
    Sin actividad reciente por ahora.
  </div>
) : (
  dashboardData.actividadReciente.map((actividad, i) => {
    const esPedido = actividad.tipo === "pedido";

    return (
      <div
        key={`${actividad.tipo}-${actividad.fechaOrden}-${i}`}
        className="flex gap-3 items-start group cursor-pointer"
      >
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{
            background: esPedido ? "#3b82f610" : `${P.granate}10`,
            color: esPedido ? "#3b82f6" : P.granate,
          }}
        >
          {esPedido ? <ShoppingCart size={14} /> : <AlertTriangle size={14} />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <p className="text-xs font-medium text-gray-900 truncate">
              {actividad.titulo}
            </p>
            <span className="text-[10px] text-gray-400 shrink-0 ml-2">
              {actividad.tiempo}
            </span>
          </div>

          <p className="text-[11px] text-gray-500 truncate mt-0.5">
            {actividad.descripcion}
          </p>
        </div>
      </div>
    );
  })
)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}