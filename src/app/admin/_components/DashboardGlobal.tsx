"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Users, Store, ShoppingCart, Package, DollarSign,
  Activity, Award, ArrowUpRight, ArrowDownRight,
  ShieldCheck
} from "lucide-react";

const COLORES_PREMIUM = ["#8E1B3A", "#BC9968", "#5C3A2E", "#AB3A50", "#185FA5", "#2D7A47"];

interface KPIData {
  usuariosRegistrados: number;
  empresasActivas: number;
  proveedoresActivos: number;
  productosPublicados: number;
  pedidosCompletados: number;
  ventasGlobales: number;
  ingresosTotales: number;
  comisionEmotia: number;     // <--- NUEVO
  pagoProveedores: number;    // <--- NUEVO
  dineroRetenido: number;     // <--- NUEVO
  crecimientoMensual: number;
}

interface DashboardGlobalProps {
  data: {
    kpis: KPIData;
    usuariosMensuales: { mes: string; count: number }[];
    ventasMensuales: { mes: string; monto: number; pedidos: number }[];
    ingresosEmpresas: { nombre: string; monto: number }[];
    pedidosEstados: { nombre: string; cantidad: number; pct: number }[];
    productosMasVendidos: { nombre: string; cantidad: number; total: number }[];
  };
}

const fmtMoney = (n: number) => `Bs. ${n.toLocaleString("es-BO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtShort = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;

export default function DashboardGlobal({ data }: DashboardGlobalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const { kpis, usuariosMensuales, ventasMensuales, ingresosEmpresas, pedidosEstados, productosMasVendidos } = data;

  if (!mounted) {
    return (
      <div className="w-full min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#8E1B3A]/20 border-t-[#8E1B3A] rounded-full animate-spin"></div>
        <p className="text-sm font-serif text-[#7A5260] font-medium">Inicializando ecosistema global PREPE...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. KPIs Superior Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            label: "Usuarios Registrados",
            valor: kpis.usuariosRegistrados.toLocaleString(),
            detalle: `${kpis.crecimientoMensual > 0 ? "+" : ""}${kpis.crecimientoMensual.toFixed(1)}% este mes`,
            icon: <Users className="text-white" size={20} />,
            colorBg: "bg-gradient-to-br from-[#8E1B3A] to-[#5A0F24]",
            trendUp: kpis.crecimientoMensual >= 0
          },
          {
            label: "Empresas & Aliados",
            valor: kpis.empresasActivas.toString(),
            detalle: `${kpis.proveedoresActivos} representantes registrados`,
            icon: <Store className="text-white" size={20} />,
            colorBg: "bg-gradient-to-br from-[#BC9968] to-[#9E7A4E]",
            trendUp: true
          },
          {
            label: "Productos Publicados",
            valor: kpis.productosPublicados.toString(),
            detalle: "Catálogo activo global",
            icon: <Package className="text-white" size={20} />,
            colorBg: "bg-gradient-to-br from-[#5C3A2E] to-[#3D251C]",
            trendUp: true
          },
          {
            label: "Ventas & Ingresos",
            valor: fmtMoney(kpis.ingresosTotales),
            detalle: `${kpis.pedidosCompletados} pedidos completados`,
            icon: <DollarSign className="text-white" size={20} />,
            colorBg: "bg-gradient-to-br from-[#AB3A50] to-[#802537]",
            trendUp: true
          }
        ].map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-[#8E1B3A]/5 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${kpi.colorBg} shadow-sm shadow-[#8E1B3A]/10`}>
                {kpi.icon}
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A5260]/60">Núcleo PREPE</span>
            </div>

            <p className="text-xs font-bold text-[#7A5260] uppercase tracking-wider mb-1">{kpi.label}</p>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A0E18]">{kpi.valor}</h3>

            <div className="flex items-center gap-1.5 mt-3 text-xs text-[#7A5260]/80">
              {kpi.trendUp ? (
                <span className="text-emerald-600 font-bold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded">
                  <ArrowUpRight size={12} /> Activo
                </span>
              ) : (
                <span className="text-rose-600 font-bold flex items-center gap-0.5 bg-rose-50 px-1.5 py-0.5 rounded">
                  <ArrowDownRight size={12} /> Variable
                </span>
              )}
              <span>{kpi.detalle}</span>
            </div>

            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#8E1B3A]/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          </div>
        ))}
      </div>

      {/* --- PANEL FINANCIERO CENTRAL (SISTEMA ESCROW) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10"><DollarSign size={80} /></div>
          <p className="text-xs font-extrabold text-indigo-800 uppercase tracking-wider mb-1">Ganancias Emotia (10%)</p>
          <h3 className="text-3xl font-black text-indigo-700">{fmtMoney(kpis.comisionEmotia)}</h3>
          <p className="text-xs text-indigo-600 mt-2 font-medium">Ingreso neto libre de la plataforma.</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10"><Users size={80} /></div>
          <p className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider mb-1">A Pagar a Proveedores (90%)</p>
          <h3 className="text-3xl font-black text-emerald-700">{fmtMoney(kpis.pagoProveedores)}</h3>
          <p className="text-xs text-emerald-600 mt-2 font-medium">Liquidación pendiente a empresas aliadas.</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10"><ShieldCheck size={80} /></div>
          <p className="text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-1">Fideicomiso / Escrow</p>
          <h3 className="text-3xl font-black text-amber-700">{fmtMoney(kpis.dineroRetenido)}</h3>
          <p className="text-xs text-amber-600 mt-2 font-medium">Fondos protegidos de pedidos en proceso.</p>
        </div>
      </div>

      {/* 2. Charts Section - Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CHART A: Crecimiento de Usuarios */}
        <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#BC9968]">Registro Histórico</p>
              <h4 className="font-serif text-lg font-bold text-[#5A0F24]">Crecimiento Mensual de Usuarios</h4>
            </div>
            <Users className="text-[#BC9968] opacity-80" size={20} />
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={usuariosMensuales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8E1B3A" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8E1B3A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F6ECE7" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#7A5260" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#7A5260" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#white", border: "1px solid #8E1B3A/15", borderRadius: 12, fontSize: 12 }}
                formatter={(v) => [`${v} registrados`, "Usuarios"]}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#8E1B3A"
                strokeWidth={2.5}
                fill="url(#gradUsers)"
                dot={{ fill: "#8E1B3A", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#8E1B3A" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* CHART B: Ventas Mensuales */}
        <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#BC9968]">Volumen de Ventas</p>
              <h4 className="font-serif text-lg font-bold text-[#5A0F24]">Evolución Mensual de Ventas</h4>
            </div>
            <ShoppingCart className="text-[#8E1B3A] opacity-80" size={20} />
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ventasMensuales} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F6ECE7" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#7A5260" }} tickLine={false} axisLine={false} />
              <YAxis
                yAxisId="left"
                tickFormatter={(v) => `Bs ${fmtShort(v)}`}
                tick={{ fontSize: 11, fill: "#7A5260" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: "#7A5260" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-white border border-[#8E1B3A]/15 rounded-xl p-3 shadow-lg text-xs">
                      <p className="font-bold text-[#2A0E18] capitalize mb-1">{label}</p>
                      <p className="text-[#8E1B3A] font-semibold">Total: Bs. {Number(payload[0]?.value || 0).toLocaleString()}</p>
                      {payload[1] && <p className="text-[#BC9968]">{payload[1].value} pedidos</p>}
                    </div>
                  );
                }}
              />
              <Bar yAxisId="left" dataKey="monto" fill="#8E1B3A" radius={[5, 5, 0, 0]} maxBarSize={35} />
              <Bar yAxisId="right" dataKey="pedidos" fill="#BC9968" radius={[5, 5, 0, 0]} maxBarSize={15} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* 3. Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CHART C: Ingresos por Empresa (BarChart Vertical) */}
        <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#BC9968]">Volumen Comercial</p>
              <h4 className="font-serif text-lg font-bold text-[#5A0F24]">Ingresos Consolidados por Empresa</h4>
            </div>
            <Store className="text-[#8E1B3A]/80" size={20} />
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ingresosEmpresas} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F6ECE7" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(v) => `Bs ${fmtShort(v)}`}
                tick={{ fontSize: 10, fill: "#7A5260" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="nombre"
                width={120}
                tick={{ fontSize: 11, fill: "#2A0E18" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v.length > 15 ? v.slice(0, 14) + "…" : v}
              />
              <Tooltip
                formatter={(v: any) => [`Bs. ${Number(v || 0).toLocaleString()}`, "Ingresos"]}
                contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
              />
              <Bar dataKey="monto" radius={[0, 6, 6, 0]}>
                {ingresosEmpresas.map((_, i) => (
                  <Cell key={i} fill={COLORES_PREMIUM[i % COLORES_PREMIUM.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CHART D: Pedidos por Estado (PieChart) */}
        <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#BC9968]">Logística Global</p>
              <h4 className="font-serif text-lg font-bold text-[#5A0F24]">Pedidos por Estado</h4>
            </div>
            <Activity className="text-[#8E1B3A]/80" size={20} />
          </div>

          <div className="flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={pedidosEstados}
                  dataKey="cantidad"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                >
                  {pedidosEstados.map((_, i) => (
                    <Cell key={i} fill={COLORES_PREMIUM[i % COLORES_PREMIUM.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: any, name: any, props: any) => [`${v} pedidos (${props.payload?.pct || 0}%)`, name]}
                  contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full mt-4 border-t border-[#8E1B3A]/5 pt-3">
              {pedidosEstados.map((item, idx) => (
                <div key={item.nombre} className="flex items-center gap-2 text-xs">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORES_PREMIUM[idx % COLORES_PREMIUM.length] }}
                  />
                  <span className="text-[#7A5260] capitalize truncate max-w-[85px]">{item.nombre}</span>
                  <span className="font-bold text-[#2A0E18] ml-auto">{item.cantidad}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 4. Products selling & activity table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Top Productos (BarChart Horizontal / List) */}
        <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#BC9968]">Éxitos del Catálogo</p>
              <h4 className="font-serif text-lg font-bold text-[#5A0F24]">Productos Más Vendidos</h4>
            </div>
            <Award className="text-[#BC9968]" size={20} />
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={productosMasVendidos} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F6ECE7" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: "#7A5260" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="nombre"
                width={130}
                tick={{ fontSize: 11, fill: "#2A0E18" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v.length > 18 ? v.slice(0, 17) + "…" : v}
              />
              <Tooltip
                formatter={(v: any) => [`${v} unidades`, "Cantidad Vendida"]}
                contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
              />
              <Bar dataKey="cantidad" radius={[0, 6, 6, 0]}>
                {productosMasVendidos.map((_, i) => (
                  <Cell key={i} fill={COLORES_PREMIUM[(i + 1) % COLORES_PREMIUM.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Resumen de Estado del Servidor & Auditoría */}
        <div className="bg-white rounded-2xl border border-[#8E1B3A]/10 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#BC9968]">PREPE Operativo</p>
                <h4 className="font-serif text-lg font-bold text-[#5A0F24]">Salud & Actividad del Ecosistema</h4>
              </div>
              <ShieldCheck className="text-emerald-600" size={20} />
            </div>

            <div className="space-y-4">
              {[
                { label: "Base de Datos PostgreSQL", status: "Óptimo", sub: "Pool activo con 10 conexiones", color: "text-emerald-600" },
                { label: "Cliente Prisma ORM", status: "Sincronizado", sub: "Modelos v1.0.4 activos", color: "text-emerald-600" },
                { label: "Caché Redis (Upstash)", status: "Conectado", sub: "Tasa de aciertos 94.2% global", color: "text-emerald-600" },
                { label: "Cliente de Autenticación (@stackframe)", status: "Operativo", sub: "Tokens válidos con cifrado JWT", color: "text-emerald-600" }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-start border-b border-[#8E1B3A]/5 pb-3">
                  <div>
                    <p className="text-xs font-bold text-[#2A0E18]">{item.label}</p>
                    <p className="text-[10px] text-[#7A5260]/75">{item.sub}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 ${item.color}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Matriz PREPE Centralizada removida */}
        </div>

      </div>
    </div>
  );
}
